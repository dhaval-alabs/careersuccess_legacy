const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });
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

    const token = await getGoogleSheetsToken(email, key);
    
    // Fetch row 1 (headers) and some recent rows
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!1:1`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('HEADERS:', data.values ? data.values[0] : 'No values');

    // Fetch the last few rows to see what values are currently being written where
    const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!A2060:Z2090`;
    const res2 = await fetch(url2, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data2 = await res2.json();
    console.log('ROWS A2060 to Z2090:');
    if (data2.values) {
      data2.values.forEach((row, i) => {
        console.log(`Row ${2060 + i}:`, JSON.stringify(row));
      });
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
