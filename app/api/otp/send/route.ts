import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const LSQ_ACCESS = 'u$rfdb83f05f0b66fc1db816ac810a2e0d3';
const LSQ_SECRET = '5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4';
const CRM_WEBHOOK_URL = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}`;

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

async function pushToGoogleSheetsOtp(body: any, cleanPhone: string, formattedSource: string, otpStatus: string, debug: boolean = false) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    
    if (!sheetId || !email || !key) {
      const msg = `Missing environment variables: ${!sheetId ? 'GOOGLE_SHEET_ID' : ''} ${!email ? 'GOOGLE_SERVICE_ACCOUNT_EMAIL' : ''} ${!key ? 'GOOGLE_PRIVATE_KEY' : ''}`;
      console.warn('[Sheets]', msg);
      return { success: false, error: msg };
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
      otpStatus, // Column Q
      '', // R: score
      '', // S: preferredCallbackTime
      '', // T: reason
      body.status || '' // U: Profile/Status
    ];
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!A:A:append?valueInputOption=USER_ENTERED`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] })
    });
    
    if (res.ok) {
      console.log('[Sheets] Successfully appended row!');
      return { success: true, sheetIdMasked: `${sheetId.substring(0, 3)}...${sheetId.substring(sheetId.length - 4)}` };
    } else {
      const errorText = await res.text();
      console.error('[Sheets] Failed to append:', errorText);
      return { success: false, error: `Google API Error: ${res.status} ${errorText}` };
    }
  } catch (error: any) {
    console.error('[Sheets] Exception:', error);
    return { success: false, error: `Exception: ${error.message || String(error)}` };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, city, countryCode, mobile } = body;
    
    // Normalize phone for LeadSquared
    const lsqPhone = countryCode === '+91' ? mobile : `${countryCode}${mobile}`;
    const cleanPhoneForSheets = `${countryCode}${mobile}`;

    // 1. Generate OTP & HMAC
    const otp = String(crypto.randomInt(1000, 9999));
    const expiry = Date.now() + 10 * 60 * 1000;
    const payloadSignature = `${mobile}:${otp}:${expiry}`;
    
    if (!process.env.OTP_HMAC_SECRET) {
      console.error('[OTP] Error: OTP_HMAC_SECRET is missing!');
      return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500, headers: corsHeaders });
    }

    const hmac = crypto.createHmac('sha256', process.env.OTP_HMAC_SECRET).update(payloadSignature).digest('hex');
    const token = Buffer.from(JSON.stringify({ 
      expiry, 
      hmac,
      name: body.name,
      email: body.email,
      typeFilter: body.typeFilter,
      course: body.course
    })).toString('base64');

    // 2. Call xBot Webhook API
    const debug = body.debug === true;

    let waSuccess = false;
    let debugInfo = null;

    try {
      const params = new URLSearchParams();
      params.append('Name', name || 'Lead');
      params.append('mobile', mobile);
      params.append('email', email || '');
      params.append('city', city || '');
      params.append('countryCode', countryCode || '+91');
      params.append('mobilecc', `${countryCode}${mobile}`);
      params.append('otp', otp);
      params.append('status', 'not varified');

      const xbotRes = await fetch(
        'https://chat-xbot.webspecia.in/api/iwh/08c86dc50ec3914c2fdf14a39ab3acb8',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
          signal: AbortSignal.timeout(8000),
        }
      );
      waSuccess = xbotRes.ok;
      if (!xbotRes.ok) {
        const xbotErr = await xbotRes.text();
        console.error('[OTP] xBot API error:', xbotErr);
        if (debug) {
          debugInfo = `xBot Error: ${xbotRes.status} ${xbotErr}`;
        }
      }
    } catch (err: any) {
      console.error('[OTP] xBot API delivery failed:', err);
      waSuccess = false;
      if (debug) {
        debugInfo = `Fetch Error: ${err.message || String(err)}`;
      }
    }

    const otpStatus = waSuccess ? 'Unverified' : 'Fallback';

    // 3. LeadSquared Integration (Search-First Upsert)
    let prospectId: string | null = null;
    let matchedLead: any = null;
    try {
      const searchPhoneUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&phone=${encodeURIComponent(lsqPhone)}`;
      const searchPhoneRes = await fetch(searchPhoneUrl);
      const searchPhoneData = await searchPhoneRes.json();
      
      if (searchPhoneRes.ok && searchPhoneData && searchPhoneData.length > 0) {
        matchedLead = searchPhoneData[0];
        prospectId = matchedLead.ProspectID;
      } else {
        const searchEmailUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetByEmailaddress?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&emailaddress=${encodeURIComponent(email)}`;
        const searchEmailRes = await fetch(searchEmailUrl);
        const searchEmailData = await searchEmailRes.json();
        
        if (searchEmailRes.ok && searchEmailData) {
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
      console.error('[OTP] LSQ search failed:', e);
    }

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
      `Country Code: ${countryCode || 'N/A'}`
    ].join('\n');

    const corePayload = [
      { Attribute: 'FirstName',                Value: firstName },
      { Attribute: 'LastName',                 Value: lastName },
      { Attribute: 'EmailAddress',             Value: email },
      { Attribute: 'Phone',                    Value: lsqPhone },
      { Attribute: 'mx_City_name',             Value: city },
      { Attribute: 'Source',                   Value: body.typeFilter || 'PPC_CheckEligibility' },
      { Attribute: 'mx_GCLID',                 Value: body.gclid || '' },
      { Attribute: 'mx_Extra_Notes',           Value: extraNotes },
      { Attribute: 'mx_OTP_Status',            Value: otpStatus }
    ];

    if (prospectId) {
      const updateUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update?accessKey=${LSQ_ACCESS}&secretKey=${LSQ_SECRET}&leadId=${prospectId}`;
      const updatePayload = corePayload.filter(attr => {
        if (attr.Attribute === 'EmailAddress') return false;
        if (attr.Attribute === 'Phone') return false;
        return true;
      });
      await fetch(updateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
    } else {
      await fetch(CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corePayload)
      });
    }

    // 4. Google Sheets (Column Q)
    if (!body.skipSheets) {
      const friendlyNotes = formatLeadNotesFriendly(body.form_source);
      const sheetResult = await pushToGoogleSheetsOtp(body, cleanPhoneForSheets, friendlyNotes, otpStatus, debug);

      if (debug && !sheetResult.success) {
        debugInfo = `${debugInfo || ''} | Sheets Error: ${sheetResult.error}`.trim();
      } else if (debug && sheetResult.success) {
        debugInfo = `${debugInfo || ''} | Sheets OK (${sheetResult.sheetIdMasked})`.trim();
      }
    } else {
      console.log('[OTP] Skipping Google Sheets push since lead was already submitted');
    }

    // 5. Automated Brochure Email (Resend)
    // Send immediately on registration for all brochure requests
    if (body.typeFilter === 'PPC_DownloadBrochure' && email) {
      const { sendBrochureEmail } = await import('@/utils/email');
      // Fire and forget, or await to ensure it completes before response
      await sendBrochureEmail(email, name, body.course);
    }

    // 6. Successful submission - return token for client-side storage
    if (waSuccess) {
      return NextResponse.json({ success: true, token, debugInfo }, { headers: corsHeaders });
    } else {
      // Fallback mode — proceed but tell client so they can redirect immediately
      return NextResponse.json({ success: true, fallback: true, debugInfo }, { headers: corsHeaders });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
