import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const LSQ_ACCESS = 'u$rfdb83f05f0b66fc1db816ac810a2e0d3';
const LSQ_SECRET = '5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4';

let sheetsTokenCache: { token: string; expiresAt: number } | null = null;
async function getGoogleSheetsToken(clientEmail: string, privateKey: string): Promise<string> {
  if (sheetsTokenCache && Date.now() < sheetsTokenCache.expiresAt) return sheetsTokenCache.token;
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
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) formattedKey = formattedKey.slice(1, -1);
  const signature = sign.sign(formattedKey, 'base64url');
  const jwt = `${signatureInput}.${signature}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Failed Google Sheets Auth');
  sheetsTokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 };
  return sheetsTokenCache.token;
}

async function updateLeadSquaredToVerified(cleanPhone: string) {
  try {
    // 1. Retrieve Prospect ID - Using the same phone search pattern
    const searchUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&phone=${encodeURIComponent(cleanPhone)}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok || !searchData || searchData.length === 0) {
      console.warn('[Verify] LSQ Search: No lead found for phone', cleanPhone);
      return;
    }

    const prospectId = searchData[0].ProspectID;
    if (!prospectId) return;

    // 2. Update Lead status to Verified
    const updateUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&leadId=${prospectId}`;
    const payload = [{ Attribute: 'mx_OTP_Status', Value: 'Verified' }];

    const updateRes = await fetch(updateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!updateRes.ok) {
      console.error('[Verify] LSQ Update Failed:', await updateRes.text());
    } else {
      console.log('[Verify] LeadSquared status updated to Verified for Prospect:', prospectId);
    }
  } catch (error) {
    console.error('[Verify] Exception updating LSQ:', error);
  }
}

async function updateGoogleSheetRowToVerified(cleanPhone: string) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    if (!sheetId || !email || !key) {
      console.warn('[Verify Sheets] Missing credentials in .env.local');
      return;
    }

    const token = await getGoogleSheetsToken(email, key);
    
    // 1. Fetch values to find row index - Phone is in Column D
    const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!D:D`;
    const getRes = await fetch(getUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!getRes.ok) {
      console.error('[Verify Sheets] Get Failed:', await getRes.text());
      return;
    }
    
    const getData = await getRes.json();
    const rows: string[][] = getData.values || [];
    
    // Find matching row (reverse search to get the latest submission)
    let rowIndex = -1;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i] && rows[i][0] === cleanPhone) {
        rowIndex = i + 1; // 1-indexed for sheets
        break;
      }
    }

    if (rowIndex === -1) {
      console.warn('[Verify Sheets] No row found for phone:', cleanPhone);
      return;
    }

    // 2. Update Column Q for identified row
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!Q${rowIndex}?valueInputOption=USER_ENTERED`;
    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ values: [['Verified']] })
    });

    if (!updateRes.ok) {
      console.error('[Verify Sheets] Update Failed:', await updateRes.text());
    } else {
      console.log(`[Verify Sheets] Status updated to Verified in row ${rowIndex}`);
    }
  } catch (error) {
    console.error('[Verify Sheets] Exception:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, otp_entered, mobile, countryCode } = body;

    if (!token || !otp_entered || !mobile) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    if (!process.env.OTP_HMAC_SECRET) {
      console.error('[Verify] OTP_HMAC_SECRET is missing!');
      return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 });
    }

    let parsedToken;
    try {
      parsedToken = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid token format' }, { status: 400 });
    }

    const { expiry, hmac } = parsedToken;

    if (!expiry || !hmac) {
      return NextResponse.json({ success: false, error: 'Malformed token' }, { status: 400 });
    }

    // 1. Check expiry
    if (Date.now() > expiry) {
      return NextResponse.json({ success: false, error: 'OTP expired. Please request a new one.' }, { status: 400 });
    }

    // 2. Recompute HMAC and validate
    const payloadSignature = `${mobile}:${otp_entered}:${expiry}`;
    const expectedHmac = crypto.createHmac('sha256', process.env.OTP_HMAC_SECRET).update(payloadSignature).digest('hex');

    const expectedBuf = Buffer.from(expectedHmac, 'hex');
    const actualBuf = Buffer.from(hmac, 'hex');

    // timingSafeEqual protects against timing attacks
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      return NextResponse.json({ success: false, error: 'Incorrect OTP. Please try again.' }, { status: 400 });
    }

    // 3. Successful verification - Update CRM and Sheets
    // LeadSquared needs the mobile without +91 usually, or specific format
    const lsqPhone = countryCode === '+91' ? mobile : `${countryCode}${mobile}`;
    const sheetsPhone = `${countryCode}${mobile}`; // Format used in Column D of Sheets
    
    // Await updates to ensure they complete on Vercel
    await updateLeadSquaredToVerified(lsqPhone).catch(console.error);
    await updateGoogleSheetRowToVerified(sheetsPhone).catch(console.error);

    console.log(`[Verify] Verification successful for phone: ${mobile}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Verify] System error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
