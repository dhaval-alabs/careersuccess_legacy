import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CRM_WEBHOOK_URL = "https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=u$rfdb83f05f0b66fc1db816ac810a2e0d3&secretKey=5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4";

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
  
  const formattedKey = privateKey.replace(/\\n/g, '\n');
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
      body.referrer_url || ''
    ];

    // Using the tab name provided by user
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NextJS!A:P:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: [row] })
    });

    if (!res.ok) {
      console.error('[GoogleSheets] Append error:', await res.text());
    } else {
      console.log('[GoogleSheets] Successfully pushed lead');
    }
  } catch (error) {
    console.error('[GoogleSheets] Exception:', error);
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
    const cleanPhone = body.countryCode === '+91' ? cleanMobile : `${body.countryCode}${cleanMobile}`;

    // Extra Notes for LeadSquared (Requested specifically)
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

    const payload = [
      // Standard LSQ fields
      { Attribute: 'FirstName',                Value: firstName },
      { Attribute: 'LastName',                 Value: lastName },
      { Attribute: 'EmailAddress',             Value: body.email },
      { Attribute: 'Phone',                    Value: cleanPhone },
      { Attribute: 'mx_City_name',             Value: body.city },

      // Attribution fields
      { Attribute: 'mx_Lead_Source_CTA',       Value: body.form_source },
      { Attribute: 'Source',                  Value: body.typeFilter || 'PPC_CheckEligibility' },
      { Attribute: 'mx_TypeFilter',           Value: body.typeFilter || 'PPC_CheckEligibility' },

      // UTM Parameters
      { Attribute: 'mx_UTM_Source',            Value: body.utm_source || '' },
      { Attribute: 'mx_UTM_Medium',            Value: body.utm_medium || '' },
      { Attribute: 'mx_UTM_Campaign',          Value: body.utm_campaign || '' },
      { Attribute: 'mx_UTM_Term',              Value: body.utm_term || '' },
      { Attribute: 'mx_UTM_Content',           Value: body.utm_content || '' },
      { Attribute: 'mx_GCLID',                 Value: body.gclid || '' },

      // Behavioural signals mapped to custom fields if they exist
      { Attribute: 'mx_Time_on_Page_Sec',      Value: String(body.time_on_page_seconds ?? '') },
      { Attribute: 'mx_Max_Scroll_Pct',        Value: String(body.max_scroll_pct ?? '') },
      { Attribute: 'mx_Form_Completion_Sec',   Value: String(body.form_completion_seconds ?? '') },
      { Attribute: 'mx_First_Field_Touched',   Value: body.first_field_touched || '' },

      // Context
      { Attribute: 'mx_Device_Type',           Value: body.device_type || '' },
      { Attribute: 'mx_Viewport_Width',        Value: String(body.viewport_width ?? '') },
      { Attribute: 'mx_Referrer_URL',          Value: body.referrer_url || '' },
      { Attribute: 'mx_Landing_Page_URL',      Value: body.landing_page_url || '' },
      { Attribute: 'mx_Submission_Timestamp',  Value: body.submission_timestamp || '' },
      { Attribute: 'mx_Country_Code',          Value: body.countryCode || '' },

      // Extra Data into mx_Extra_Notes as requested
      { Attribute: 'mx_Extra_Notes',           Value: extraNotes },
      { Attribute: 'Notes',                    Value: `Alabs landing page submission: ${formatLeadNotesFriendly(body.form_source)}` }
    ];

    console.log('LeadSquared Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Fire & Forget: Push to Google Sheets asynchronously without blocking the response
    const friendlyNotes = formatLeadNotesFriendly(body.form_source);
    pushToGoogleSheets(body, cleanPhone, friendlyNotes).catch(console.error);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LeadSquared error status:', response.status);
      console.error('LeadSquared error data:', errorText);
      return NextResponse.json({ 
        success: false, 
        error: 'LeadSquared submission failed',
        details: errorText.substring(0, 200) 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
