import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { recordSubmissionIdentifiers } from '@/lib/identifier-log';
import { fetchWithRetry } from '@/lib/fetch-retry';

const LSQ_ACCESS = "u$rfdb83f05f0b66fc1db816ac810a2e0d3";
const LSQ_SECRET = "5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4";
const CRM_BASE_URL = "https://api-in21.leadsquared.com/v2/LeadManagement.svc";
const CRM_WEBHOOK_URL = `${CRM_BASE_URL}/Lead.Capture?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}`;

// ── CORS Configuration ──
const ALLOWED_ORIGIN = 'https://careersuccess.analytixlabs.co.in';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/** Path only — the query string can carry PII on some entry points. */
function pagePathOf(url?: string): string | undefined {
  if (!url) return undefined;
  try { return new URL(url).pathname; } catch { return undefined; }
}

/**
 * Read a single query parameter from the captured landing URL.
 * hsa_cam / hsa_grp resolve to the exact Google Ads campaign and ad group, and
 * are correct on all six enabled campaigns — unlike utm_campaign, which is
 * EMPTY on Brand and Bangalore because both reference an undefined
 * {_utmcampaign} custom parameter. Keying on hsa_* rather than utm_campaign is
 * load-bearing, not a preference.
 */
function urlParam(url: string | undefined, key: string): string | undefined {
  if (!url) return undefined;
  try { return new URL(url).searchParams.get(key) ?? undefined; } catch { return undefined; }
}

/**
 * Parses technical form_source strings into a human-readable format for CRM Notes.
 * Examples: 
 * "PPC_BLR2_Hero_DownloadBrochure" -> "Hero | CTA: DownloadBrochure"
 * "PPC_BLR_lp_enrol_check_eligibility" -> "Enrol | CTA: Check Eligibility"
 */
function formatLeadNotesFriendly(source: string): string {
  if (!source) return 'N/A';

  // 1. Strip top-level CRM prefixes (e.g., PPC_BLR2_, PPC_NOI_)
  let clean = source.replace(/^(PPC_BLR2_|PPC_NOI_|PPC_DEL_|PPC_GRG_|PPC_BLR_)/i, '');

  // 2. Strip standard landing page prefixes (e.g., dsai_blr_, lp_)
  clean = clean.replace(/^(dsai_blr_|dsai_noi_|dsai_del_|dsai_grg_|lp_)/i, '');

  // 3. Handle Section and CTA separation
  const parts = clean.split('_');
  if (parts.length > 1) {
    const sectionRaw = parts[0];
    const section = sectionRaw.charAt(0).toUpperCase() + sectionRaw.slice(1);
    
    // Join the rest as the CTA name, capitalizing each part
    const ctaName = parts.slice(1)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

    return `${section} | CTA: ${ctaName}`;
  }

  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// ── Google Sheets Integration Helpers ──
let sheetsTokenCache: { token: string; expiresAt: number } | null = null;

async function getGoogleSheetsToken(clientEmail: string, privateKey: string): Promise<string> {
  if (sheetsTokenCache && Date.now() < sheetsTokenCache.expiresAt) {
    return sheetsTokenCache.token;
  }

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signatureInput = `${b64Header}.${b64Payload}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  sign.end();
  
  let formattedKey = privateKey.replace(/\\n/g, '\n');
  // Strip accidental double quotes from copy-pasting
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
    formattedKey = formattedKey.slice(1, -1);
  }
  
  const signature = sign.sign(formattedKey, 'base64url');

  const jwt = `${signatureInput}.${signature}`;

  const response = await fetchWithRetry('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    label: 'GoogleSheets OAuth Token',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get Google Token: ${JSON.stringify(data)}`);
  }

  sheetsTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000 
  };

  return sheetsTokenCache.token;
}

async function pushToGoogleSheets(body: any, cleanPhone: string, formattedSource: string) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    
    if (!sheetId || !email || !key) {
      console.log('[GoogleSheets] Skipping: Missing environment variables');
      return;
    }

    const token = await getGoogleSheetsToken(email, key);
    const row = [
      body.submission_timestamp || new Date().toISOString(),
      body.name || '',
      body.email || '',
      cleanPhone,
      body.city || '',
      formattedSource,
      body.typeFilter || 'PPC_CheckEligibility',
      body.utm_source || '',
      body.utm_medium || '',
      body.utm_campaign || '',
      body.utm_term || '',
      body.gclid || '',
      body.time_on_page_seconds || '',
      body.max_scroll_pct || '',
      body.form_completion_seconds || '',
      body.referrer_url || '',
      'Unverified', // Q: otpStatus
      '', // R: score
      '', // S: preferredCallbackTime
      '', // T: reason
      body.status || '', // U: Profile/Status
      body.landing_page_url || '', // V: Landing Page URL
      body.utm_content || '', // W: UTM Content
      body.form_source || '', // X: Raw Source CTA (unformatted)
      body.sclx_id || '', // Y: ScaleX ID
      body.click_timestamp // Z: Click Timestamp (ISO)
        ? new Date(body.click_timestamp * 1000).toISOString()
        : '',
      body.click_id_source || '' // AA: Click ID Source
    ];

    // Using the tab name provided by user
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!A:A:append?valueInputOption=USER_ENTERED`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: [row] })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        '[GoogleSheets] APPEND FAILED — row not written. ' +
        `status=${res.status} sclx_id=${body.sclx_id || 'none'} ` +
        `email=${body.email || 'none'} ts=${body.submission_timestamp || ''} ` +
        `body=${errorText.slice(0, 500)}`
      );
    } else {
      console.log('[GoogleSheets] Successfully pushed lead');
    }
  } catch (error) {
    console.error(
      '[GoogleSheets] EXCEPTION — row not written. ' +
      `sclx_id=${body.sclx_id || 'none'} email=${body.email || 'none'}`,
      error
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Parse first / last name
    const nameParts = (body.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName  = nameParts.slice(1).join(' ') || '';

    // Phone format cleanup: Prevent +91 91xxxxxxxx
    let cleanMobile = (body.mobile || '').trim();
    if (body.countryCode === '+91' && cleanMobile.startsWith('91') && cleanMobile.length > 10) {
      cleanMobile = cleanMobile.substring(2);
    }
    
    // LeadSquared Normalization: 
    // User says "Leadsquared automatically assigns 91". 
    // If we pass +91 it becomes 9191.
    // Solution: For +91, send ONLY the 10-digit mobile. For others, send prefix + mobile.
    const cleanPhone = body.countryCode === '+91' ? cleanMobile : `${body.countryCode}${cleanMobile}`;
    const lsqPhone = body.countryCode === '+91' ? cleanMobile : cleanPhone;

    // Extra Notes for LeadSquared (Requested specifically)
    // Consolidating all fields that failed the 412 schema check into this field
    const extraNotes = [
      `Status: ${body.status || 'N/A'}`,
      `Source CTA: ${body.form_source || 'N/A'}`,
      `Type Filter: ${body.typeFilter || 'N/A'}`,
      `UTM Source: ${body.utm_source || 'N/A'}`,
      `UTM Medium: ${body.utm_medium || 'N/A'}`,
      `UTM Campaign: ${body.utm_campaign || 'N/A'}`,
      `UTM Term: ${body.utm_term || 'N/A'}`,
      `UTM Content: ${body.utm_content || 'N/A'}`,
      `GCLID: ${body.gclid || 'N/A'}`,
      `Device: ${body.device_type || 'N/A'}`,
      `Viewport: ${body.viewport_width || 'N/A'}px`,
      `Time on Page: ${body.time_on_page_seconds || 0}s`,
      `Scroll Depth: ${body.max_scroll_pct || 0}%`,
      `Form Completion: ${body.form_completion_seconds || 0}s`,
      `First Field: ${body.first_field_touched || 'N/A'}`,
      `Referrer: ${body.referrer_url || 'Direct'}`,
      `Submission URL: ${body.landing_page_url || 'N/A'}`,
      `Timestamp: ${body.submission_timestamp || 'N/A'}`,
      `Country Code: ${body.countryCode || 'N/A'}`,
    ].join('\n');

    const payload = [
      // Standard LSQ fields (Confirmed to exist)
      { Attribute: 'FirstName',                Value: firstName },
      { Attribute: 'LastName',                 Value: lastName },
      { Attribute: 'EmailAddress',             Value: body.email },
      { Attribute: 'Phone',                    Value: lsqPhone },
      { Attribute: 'mx_City_name',             Value: body.city },
      { Attribute: 'mx_GCLID',                 Value: body.gclid || '' }, // GCLID didn't error, so keeping as field
      { Attribute: 'mx_Page_Url',              Value: body.landing_page_url || '' },
      { Attribute: 'Source',                  Value: body.typeFilter || 'PPC_CheckEligibility' },

      // All other technical/attribution data consolidated here
      { Attribute: 'mx_sclx_id',               Value: body.sclx_id ?? '' },
      { Attribute: 'mx_Extra_Notes',           Value: extraNotes },
      { Attribute: 'Notes',                    Value: `Alabs landing page submission: ${formatLeadNotesFriendly(body.form_source)}` }
    ];

    console.log('LeadSquared Payload:', JSON.stringify(payload, null, 2));

    // --- Search logic for Upsert ---
    let prospectId: string | null = null;
    let matchedLead: any = null;
    try {
      // 1. Search by Phone (using normalized lsqPhone)
      const searchPhoneUrl = `${CRM_BASE_URL}/RetrieveLeadByPhoneNumber?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&phone=${encodeURIComponent(lsqPhone)}`;
      const searchPhoneRes = await fetchWithRetry(searchPhoneUrl, {
        label: 'LSQ RetrieveLeadByPhoneNumber (submit-lead)',
        context: { phone: lsqPhone, email: body.email, sclx_id: body.sclx_id },
      });
      const searchPhoneData = await searchPhoneRes.json();
      
      if (searchPhoneRes.ok && searchPhoneData && searchPhoneData.length > 0) {
        matchedLead = searchPhoneData[0];
        prospectId = matchedLead.ProspectID;
      } else {
        // 2. Fallback search by Email
        const searchEmailUrl = `${CRM_BASE_URL}/Leads.GetByEmailaddress?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&emailaddress=${encodeURIComponent(body.email)}`;
        const searchEmailRes = await fetchWithRetry(searchEmailUrl, {
          label: 'LSQ Leads.GetByEmailaddress (submit-lead)',
          context: { phone: lsqPhone, email: body.email, sclx_id: body.sclx_id },
        });
        const searchEmailData = await searchEmailRes.json();
        
        if (searchEmailRes.ok && searchEmailData) {
          // Leads.GetByEmailaddress typically returns an array
          if (Array.isArray(searchEmailData) && searchEmailData.length > 0) {
            matchedLead = searchEmailData[0];
            prospectId = matchedLead.ProspectID;
          } else if (searchEmailData.ProspectID) {
            matchedLead = searchEmailData;
            prospectId = matchedLead.ProspectID;
          }
        }
      }
    } catch (e) {
      console.error('LeadSquared search failed, falling back to Capture:', e);
    }

    let response;
    if (prospectId) {
      // Update existing lead
      console.log(`Matching lead found (ID: ${prospectId}). Updating...`);
      const updateUrl = `${CRM_BASE_URL}/Lead.Update?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&leadId=${prospectId}`;
      
      // Attempt 1: Targeted update (already filtered identical IDs to avoid self-conflict)
      const updatePayload = payload.filter(attr => {
        const submitted = String(attr.Value || '').trim().toLowerCase();
        if (attr.Attribute === 'EmailAddress') {
          const existing = String(matchedLead?.EmailAddress || matchedLead?.Email || '').trim().toLowerCase();
          return submitted !== existing;
        }
        if (attr.Attribute === 'Phone') {
          const existing = String(matchedLead?.Phone || matchedLead?.Mobile || '').trim().toLowerCase();
          return submitted !== existing;
        }
        return true;
      });

      response = await fetch(updateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      // Attempt 2 Fallback: If still getting duplicate error, strip Email/Phone entirely and retry
      // This handles cases where LSQ validation is extremely aggressive or where search info was incomplete
      if (!response.ok) {
        const clonedRes = response.clone();
        const errorText = await clonedRes.text();
        if (errorText.includes('MXDuplicateEntryException')) {
          console.warn('Update failed with duplicate error. Retrying without Email/Phone fields...');
          const strippedPayload = payload.filter(attr => 
            attr.Attribute !== 'EmailAddress' && attr.Attribute !== 'Phone'
          );
          response = await fetch(updateUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(strippedPayload)
          });
        }
      }
    } else {
      // Capture new lead
      console.log('No matching lead found. Creating new...');
      response = await fetch(CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Lead.Capture returns { "Status": "Success", "Message": { "Id": "<prospect-id>" } }
      const captureJson = await response.clone().json().catch(() => null);
      const capturedId = captureJson?.Message?.Id;
      if (!prospectId && typeof capturedId === 'string' && capturedId.length > 0) {
        prospectId = capturedId;
        console.log(`[LeadSquared] Captured new lead with ProspectID: ${prospectId}`);
      }
    }

    // Await to ensure it completes on Vercel
    const friendlyNotes = formatLeadNotesFriendly(body.form_source);
    await pushToGoogleSheets(body, cleanPhone, friendlyNotes).catch(console.error);

    // ── NEW: append-only identifier log ──────────────────────────────────
    // Awaited to ensure completion on Vercel serverless functions.
    // The internal implementation and catch guarantee this cannot throw or fail lead capture.
    await recordSubmissionIdentifiers({
      sclxId:         body.sclx_id,
      gclid:          body.gclid,
      clickTimestamp: body.click_timestamp,
      clickIdSource:  body.click_id_source,
      prospectId:     prospectId ?? undefined,
      pagePath:       pagePathOf(body.landing_page_url),
      hsaCam:         urlParam(body.landing_page_url, 'hsa_cam'),
      hsaGrp:         urlParam(body.landing_page_url, 'hsa_grp'),
    }).catch(() => { /* already logged internally */ });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LeadSquared error status:', response.status);
      console.error('LeadSquared error data:', errorText);
      return NextResponse.json({ 
        success: false, 
        error: 'LeadSquared submission failed',
        details: errorText.substring(0, 200) 
      }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('API submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
