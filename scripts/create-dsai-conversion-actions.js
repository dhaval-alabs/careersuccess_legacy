/**
 * create-dsai-conversion-actions.js
 *
 * Creates 48 Google Ads conversion actions for the DSAI city landing pages
 * (12 actions × 4 cities: Delhi, Noida, Gurgaon, Bangalore).
 *
 * Usage:
 *   node scripts/create-dsai-conversion-actions.js
 *
 * Requires these env vars (or .env file):
 *   GOOGLE_ADS_CLIENT_ID
 *   GOOGLE_ADS_CLIENT_SECRET
 *   GOOGLE_ADS_REFRESH_TOKEN
 *
 * After running, copy the printed CONVERSION_MAP block into:
 *   app/api/track-conversion/route.ts  (replace PENDING values)
 */

const https = require('https');

const CUSTOMER_ID       = '4064995850';
const MCC_ID            = '8910137241';
const DEVELOPER_TOKEN   = 'OKYrRJ48L3KNIfuseAFQTw';
const API_VERSION       = 'v23';

// ── Load env vars ─────────────────────────────────────────────────────────────
// Support optional .env file via dotenv if available
try { require('dotenv').config(); } catch (_) {}

const CLIENT_ID      = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET  = process.env.GOOGLE_ADS_CLIENT_SECRET;
const REFRESH_TOKEN  = process.env.GOOGLE_ADS_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('Missing required env vars: GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN');
  process.exit(1);
}

// ── Conversion action definitions ─────────────────────────────────────────────

const CITIES = [
  { label: 'Delhi',     prefix: 'dsai_del' },
  { label: 'Noida',     prefix: 'dsai_noi' },
  { label: 'Gurgaon',   prefix: 'dsai_grg' },
  { label: 'Bangalore', prefix: 'dsai_blr' },
];

const ACTIONS = [
  { suffix: 'hero_check_eligibility',        label: 'Hero_CheckEligibility' },
  { suffix: 'hero_download_brochure',        label: 'Hero_DownloadBrochure' },
  { suffix: 'placement_check_eligibility',   label: 'Placement_CheckEligibility' },
  { suffix: 'pricing_signup_demo',           label: 'Pricing_SignupDemo' },
  { suffix: 'curriculum_download_brochure',  label: 'Curriculum_DownloadBrochure' },
  { suffix: 'certificate_check_eligibility', label: 'Certificate_CheckEligibility' },
  { suffix: 'enrol_check_eligibility',       label: 'Enrol_CheckEligibility' },
  { suffix: 'bottom_check_eligibility',      label: 'Bottom_CheckEligibility' },
  { suffix: 'sticky_check_eligibility',      label: 'Sticky_CheckEligibility' },
  { suffix: 'submit_lead_primary',           label: 'Submit_Lead_Primary' },
  { suffix: 'book_demo',                     label: 'Book_Demo' },
  { suffix: 'download_brochure',             label: 'Download_Brochure' },
];

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function post(url, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...headers },
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch (_) { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── OAuth ─────────────────────────────────────────────────────────────────────

async function getAccessToken() {
  const res = await post(
    'https://oauth2.googleapis.com/token',
    {},
    { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH_TOKEN, grant_type: 'refresh_token' }
  );
  if (res.status !== 200 || !res.body.access_token) {
    throw new Error('OAuth failed: ' + JSON.stringify(res.body));
  }
  return res.body.access_token;
}

// ── Create a single conversion action ────────────────────────────────────────

async function createConversionAction(accessToken, name) {
  const url = `https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}/conversionActions:mutate`;
  const res = await post(
    url,
    {
      Authorization: `Bearer ${accessToken}`,
      'developer-token': DEVELOPER_TOKEN,
      'login-customer-id': MCC_ID,
    },
    {
      operations: [{
        create: {
          name,
          type: 'UPLOAD_CLICKS',
          category: 'DEFAULT',
          status: 'ENABLED',
          counting_type: 'ONE_PER_CLICK',
          click_through_lookback_window_days: 30,
        }
      }]
    }
  );

  if (res.status !== 200) {
    throw new Error(`Failed to create "${name}": ${JSON.stringify(res.body)}`);
  }

  const resourceName = res.body.results?.[0]?.resourceName || '';
  // Resource name format: customers/CUSTOMER_ID/conversionActions/ACTION_ID
  const actionId = resourceName.split('/').pop() || 'UNKNOWN';
  return { resourceName, actionId };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching OAuth token...');
  const accessToken = await getAccessToken();
  console.log('Token obtained.\n');

  const conversionMap = {};
  const errors = [];

  for (const city of CITIES) {
    console.log(`\n── ${city.label} ──`);
    for (const action of ACTIONS) {
      const name = `Form Submission | DSAI - ${city.label} | ${action.label}`;
      const key  = `${city.prefix}_${action.suffix}`;
      try {
        const { resourceName, actionId } = await createConversionAction(accessToken, name);
        conversionMap[key] = actionId;
        console.log(`  ✓ ${key}: ${actionId}  (${resourceName})`);
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        console.error(`  ✗ ${key}: ${err.message}`);
        errors.push({ key, error: err.message });
        conversionMap[key] = 'ERROR';
      }
    }
  }

  // ── Print ready-to-paste CONVERSION_MAP block ──────────────────────────────
  console.log('\n\n══════════════════════════════════════════════════════════');
  console.log('Copy the block below into app/api/track-conversion/route.ts');
  console.log('(replace the PENDING values in the DSAI section)');
  console.log('══════════════════════════════════════════════════════════\n');

  const cityGroups = { Delhi: 'del', Noida: 'noi', Gurgaon: 'grg', Bangalore: 'blr' };
  for (const [cityLabel, cityCode] of Object.entries(cityGroups)) {
    console.log(`  // ${cityLabel}`);
    for (const action of ACTIONS) {
      const key = `dsai_${cityCode}_${action.suffix}`;
      const id  = conversionMap[key] || 'ERROR';
      console.log(`  ${key.padEnd(45)}: '${id}',`);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} action(s) failed. Re-run to retry or create manually in Google Ads.`);
    errors.forEach(e => console.log(`   - ${e.key}: ${e.error}`));
  } else {
    console.log('✅ All 48 conversion actions created successfully.');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
