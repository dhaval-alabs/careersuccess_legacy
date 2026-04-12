import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const LSQ_ACCESS = 'u$rfdb83f05f0b66fc1db816ac810a2e0d3';
const LSQ_SECRET = '5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4';
const CRM_WEBHOOK_URL = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}`;

function formatLeadNotesFriendly(source: string): string {
  if (!source) return 'N/A';
  let clean = source.replace(/^(PPC_BLR2_|PPC_NOI_|PPC_DEL_|PPC_GRG_|PPC_BLR_)/i, '');
  clean = clean.replace(/^(dsai_blr_|dsai_noi_|dsai_del_|dsai_grg_|lp_)/i, '');
  const parts = clean.split('_');
  if (parts.length > 1) {
    const sectionRaw = parts[0];
    const section = sectionRaw.charAt(0).toUpperCase() + sectionRaw.slice(1);
    const ctaName = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    return `${section} | CTA: ${ctaName}`;
  }
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// ── Google Sheets Helpers ──
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
  if (!res.ok) {
    console.error('[Sheets Auth] Token error:', data);
    throw new Error('Failed Google Sheets Auth');
  }
  sheetsTokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 };
  return sheetsTokenCache.token;
}

async function pushToGoogleSheetsOtp(body: any, cleanPhone: string, formattedSource: string, otpStatus: string) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    console.log('[Sheets] Attempting update for sheetId:', sheetId?.substring(0, 5) + '...');
    
    if (!sheetId || !email || !key) {
      console.warn('[Sheets] Missing credentials in .env.local');
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
      otpStatus // Column Q
    ];
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!A:Q:append?valueInputOption=USER_ENTERED`;
    console.log('[Sheets] Pushing data to tab "NextJS"...');
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] })
    });
    
    const resData = await res.json();
    if (res.ok) {
      console.log('[Sheets] Successfully appended row!');
    } else {
      console.error('[Sheets] Failed to append:', resData);
    }
  } catch (error) {
    console.error('[Sheets] Exception:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, city, countryCode, mobile } = body;
    const cleanPhone = countryCode === '+91' ? mobile : `${countryCode}${mobile}`;

    // 1. Generate OTP & HMAC
    const otp = String(crypto.randomInt(1000, 9999));
    const expiry = Date.now() + 10 * 60 * 1000;
    const payloadSignature = `${mobile}:${otp}:${expiry}`;
    
    if (!process.env.OTP_HMAC_SECRET) {
      console.error('[OTP] Error: OTP_HMAC_SECRET is missing!');
      return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 });
    }

    const hmac = crypto.createHmac('sha256', process.env.OTP_HMAC_SECRET).update(payloadSignature).digest('hex');
    const token = Buffer.from(JSON.stringify({ expiry, hmac })).toString('base64');

    // 2. Call Xbot
    const xbotUrl = 'https://chat-xbot.webspecia.in/api/iwh/08c86dc50ec3914c2fdf14a39ab3acb8';
    const xbotPayload = {
      Name: name || '',
      mobile: mobile,
      email: email || '',
      city: city || '',
      countryCode: countryCode,
      mobilecc: `${countryCode}${mobile}`,
      otp: otp,
      status: 'not varified'
    };

    let xbotSuccess = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const xbotRes = await fetch(xbotUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(xbotPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      xbotSuccess = xbotRes.ok;
    } catch (err) {
      console.error('[OTP] Xbot delivery failed:', err);
      xbotSuccess = false;
    }

    const otpStatus = xbotSuccess ? 'Unverified' : 'Fallback';

    // 3. Create Lead in LSQ
    const nameParts = (name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName  = nameParts.slice(1).join(' ') || '';

    const extraNotes = [
      `Source CTA: ${body.form_source || 'N/A'}`,
      `Device: ${body.device_type || 'N/A'}`,
      `Viewport: ${body.viewport_width || 'N/A'}px`,
      `Time on Page: ${body.time_on_page_seconds || 0}s`,
      `Scroll Depth: ${body.max_scroll_pct || 0}%`,
      `Form Completion: ${body.form_completion_seconds || 0}s`,
      `First Field: ${body.first_field_touched || 'N/A'}`,
      `Referrer: ${body.referrer_url || 'Direct'}`,
      `Submission URL: ${body.landing_page_url || 'N/A'}`,
      `Timestamp: ${body.submission_timestamp || 'N/A'}`,
    ].join('\n');

    const lsqPayload = [
      { Attribute: 'FirstName',                Value: firstName },
      { Attribute: 'LastName',                 Value: lastName },
      { Attribute: 'EmailAddress',             Value: email },
      { Attribute: 'Phone',                    Value: cleanPhone },
      { Attribute: 'mx_City_name',             Value: city },
      { Attribute: 'mx_Lead_Source_CTA',       Value: body.form_source },
      { Attribute: 'Source',                   Value: body.typeFilter || 'PPC_CheckEligibility' },
      { Attribute: 'mx_TypeFilter',            Value: body.typeFilter || 'PPC_CheckEligibility' },
      { Attribute: 'mx_UTM_Source',            Value: body.utm_source || '' },
      { Attribute: 'mx_UTM_Medium',            Value: body.utm_medium || '' },
      { Attribute: 'mx_UTM_Campaign',          Value: body.utm_campaign || '' },
      { Attribute: 'mx_UTM_Term',              Value: body.utm_term || '' },
      { Attribute: 'mx_UTM_Content',           Value: body.utm_content || '' },
      { Attribute: 'mx_GCLID',                 Value: body.gclid || '' },
      { Attribute: 'mx_Time_on_Page_Sec',      Value: String(body.time_on_page_seconds ?? '') },
      { Attribute: 'mx_Max_Scroll_Pct',        Value: String(body.max_scroll_pct ?? '') },
      { Attribute: 'mx_Form_Completion_Sec',   Value: String(body.form_completion_seconds ?? '') },
      { Attribute: 'mx_First_Field_Touched',   Value: body.first_field_touched || '' },
      { Attribute: 'mx_Device_Type',           Value: body.device_type || '' },
      { Attribute: 'mx_Viewport_Width',        Value: String(body.viewport_width ?? '') },
      { Attribute: 'mx_Referrer_URL',          Value: body.referrer_url || '' },
      { Attribute: 'mx_Landing_Page_URL',      Value: body.landing_page_url || '' },
      { Attribute: 'mx_Submission_Timestamp',  Value: body.submission_timestamp || '' },
      { Attribute: 'mx_Country_Code',          Value: countryCode || '' },
      { Attribute: 'mx_Extra_Notes',           Value: extraNotes },
      { Attribute: 'Notes',                    Value: `Alabs landing page submission: ${formatLeadNotesFriendly(body.form_source)}` },
      { Attribute: 'mx_OTP_Status',            Value: otpStatus }
    ];

    const lsqRes = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lsqPayload)
    });

    const lsqResult = await lsqRes.json();

    if (!lsqRes.ok) {
        if (lsqResult.ExceptionType === 'MXDuplicateEntryException') {
            // Lead already exists, safe to proceed
        } else {
            console.error('[OTP] LSQ failed:', JSON.stringify(lsqResult));
            return NextResponse.json({ success: false, error: 'CRM submission failed.' }, { status: 500 });
        }
    }

    const friendlyNotes = formatLeadNotesFriendly(body.form_source);
    pushToGoogleSheetsOtp(body, cleanPhone, friendlyNotes, otpStatus).catch(console.error);

    // 5. Build response
    if (xbotSuccess) {
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ success: true, fallback: true });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
