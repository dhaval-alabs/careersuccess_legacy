import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const LSQ_ACCESS = 'u$rfdb83f05f0b66fc1db816ac810a2e0d3';
const LSQ_SECRET = '5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4';

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

async function updateLeadSquaredToVerified(cleanPhone: string, email?: string, preferredCallbackTime?: string) {
  try {
    let searchPhone = cleanPhone.trim();
    if (searchPhone.startsWith('+91')) {
      searchPhone = searchPhone.substring(3);
    } else if (searchPhone.startsWith('91') && searchPhone.length > 10) {
      searchPhone = searchPhone.substring(2);
    }

    // 1. Retrieve Prospect ID - Using the normalized phone search pattern
    const searchUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&phone=${encodeURIComponent(searchPhone)}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    let prospectId = null;
    if (searchRes.ok && searchData && searchData.length > 0) {
      prospectId = searchData[0].ProspectID;
    } else if (email) {
      // Fallback search by email
      const searchEmailUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetByEmailaddress?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&emailaddress=${encodeURIComponent(email)}`;
      const searchEmailRes = await fetch(searchEmailUrl);
      const searchEmailData = await searchEmailRes.json();
      if (searchEmailRes.ok && searchEmailData) {
        if (Array.isArray(searchEmailData) && searchEmailData.length > 0) {
          prospectId = searchEmailData[0].ProspectID;
        } else if (searchEmailData.ProspectID) {
          prospectId = searchEmailData.ProspectID;
        }
      }
    }

    if (!prospectId) {
      console.warn('[Verify] LSQ Search: No lead found for phone/email', cleanPhone, email);
      return;
    }

    // 2. Update Lead status to Verified
    const updateUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&leadId=${prospectId}`;
    const payload = [{ Attribute: 'mx_OTP_Status', Value: 'Verified' }];
    if (preferredCallbackTime) {
      payload.push({ Attribute: 'mx_Preferred_Callback_Time', Value: preferredCallbackTime });
    }

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
      return { success: false, error: 'Missing Sheets credentials' };
    }

    const token = await getGoogleSheetsToken(email, key);
    
    // 1. Fetch values to find row index - Phone is in Column D
    const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!D:D`;
    const getRes = await fetch(getUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!getRes.ok) {
      return { success: false, error: `Get Failed: ${getRes.status}` };
    }
    
    const getData = await getRes.json();
    const rows: string[][] = getData.values || [];
    
    // Find matching row (reverse search to get the latest submission)
    let rowIndex = -1;
    const targetClean = cleanPhone.replace(/\D/g, ''); // Normalize target (remove + signs, spaces)
    
    for (let i = rows.length - 1; i >= 0; i--) {
      const cellValue = rows[i] && rows[i][0] ? String(rows[i][0]).replace(/\D/g, '') : '';
      if (cellValue && (cellValue === targetClean || cellValue.endsWith(targetClean) || targetClean.endsWith(cellValue))) {
        rowIndex = i + 1; // 1-indexed for sheets
        break;
      }
    }

    if (rowIndex === -1) {
      const sample = rows.length > 0 ? rows.slice(-3).map(r => r[0]).join(', ') : 'empty';
      return { success: false, error: `Row not found for ${targetClean}. Last few: [${sample}]` };
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
      return { success: false, error: `Update Failed: ${updateRes.status}` };
    }

    return { success: true, rowIndex };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, otp_entered, mobile, countryCode, preferredCallbackTime } = body;

    if (!token || !otp_entered || !mobile) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400, headers: corsHeaders });
    }

    if (!process.env.OTP_HMAC_SECRET) {
      console.error('[Verify] OTP_HMAC_SECRET is missing!');
      return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500, headers: corsHeaders });
    }

    let parsedToken;
    try {
      parsedToken = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid token format' }, { status: 400, headers: corsHeaders });
    }

    const { expiry, hmac } = parsedToken;

    if (!expiry || !hmac) {
      return NextResponse.json({ success: false, error: 'Malformed token' }, { status: 400, headers: corsHeaders });
    }

    // 1. Check expiry
    if (Date.now() > expiry) {
      return NextResponse.json({ success: false, error: 'OTP expired. Please request a new one.' }, { status: 400, headers: corsHeaders });
    }

    // 2. Recompute HMAC and validate
    const payloadSignature = `${mobile}:${otp_entered}:${expiry}`;
    const expectedHmac = crypto.createHmac('sha256', process.env.OTP_HMAC_SECRET).update(payloadSignature).digest('hex');

    const expectedBuf = Buffer.from(expectedHmac, 'hex');
    const actualBuf = Buffer.from(hmac, 'hex');

    // timingSafeEqual protects against timing attacks
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      return NextResponse.json({ success: false, error: 'Incorrect OTP. Please try again.' }, { status: 400, headers: corsHeaders });
    }

    // 3. Successful verification - Update CRM and Sheets
    const lsqPhone = countryCode === '+91' ? mobile : `${countryCode}${mobile}`;
    const sheetsPhone = `${countryCode}${mobile}`; 
    const debug = body.debug === true;
    let debugInfo = null;
    
    const { name: fullName, email, typeFilter, course } = parsedToken; // Extract from token

    // Await updates to ensure they complete on Vercel
    await updateLeadSquaredToVerified(lsqPhone, email || body.email, preferredCallbackTime).catch(console.error);
    const sheetRes = await updateGoogleSheetRowToVerified(sheetsPhone);

    // ── TRIGGER EMAIL FLOW (Async) ──
    const { sendLeadEmail } = await import('@/lib/sendLeadEmail');
    const { updateEmailStatus } = await import('@/lib/updateEmailStatus');

    (async () => {
      try {
        const sendResult = await sendLeadEmail({
          recipientEmail: email || body.email,
          recipientName: fullName || body.name || '',
          typeFilter: typeFilter || body.typeFilter || 'PPC_CheckEligibility',
          courseSlug: course || body.course,
        });

        if (sendResult.status !== 'Skipped') {
          await updateEmailStatus({
            phone: lsqPhone,
            emailStatus: sendResult.status as 'Sent' | 'Failed',
          });
        }
        console.log(`[Verify] Email flow complete | phone=${mobile} | type=${sendResult.emailType} | status=${sendResult.status}`);
      } catch (err: any) {
        console.error(`[Verify] Email flow exception | phone=${mobile} | error=${err.message}`);
      }
    })();

    if (debug) {
      debugInfo = sheetRes.success 
        ? `Sheets flip OK (Row ${sheetRes.rowIndex})` 
        : `Sheets flip Failed: ${sheetRes.error}`;
    }

    console.log(`[Verify] Verification successful for phone: ${mobile}`);
    return NextResponse.json({ success: true, verified: true, debugInfo }, { headers: corsHeaders });

  } catch (error) {
    console.error('[Verify] System error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
