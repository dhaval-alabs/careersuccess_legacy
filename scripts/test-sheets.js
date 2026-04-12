require('dotenv').config({ path: './.env.local' });
const crypto = require('crypto');

let sheetsTokenCache = null;

async function getGoogleSheetsToken(clientEmail, privateKey) {
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
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
    formattedKey = formattedKey.slice(1, -1);
  }
  const signature = sign.sign(formattedKey, 'base64url');

  const jwt = `${signatureInput}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
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

async function run() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    
    if (!sheetId || !email || !key) {
      console.log('Missing env variables');
      return;
    }

    console.log('Testing auth...');
    const token = await getGoogleSheetsToken(email, key);
    console.log('Got token:', token.substring(0, 10) + '...');
    
    const row = [
      new Date().toISOString(),
      'Test User',
      'test@example.com',
      '9999999999',
      'TestCity',
      'Hero | CTA: Check Eligibility',
      'PPC_CheckEligibility',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'gclid123',
      '10', // time on page
      '50', // scroll %
      '20', // form completion
      'https://example.com' // referrer
    ];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!A:P:append?valueInputOption=USER_ENTERED`;
    console.log('Posting to URL:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: [row] })
    });

    if (!res.ok) {
      console.error('Google Sheets append error:', await res.text());
    } else {
      console.log('Successfully pushed lead to Google Sheets');
    }
  } catch (err) {
    console.error('Error in run():', err);
  }
}

run();
