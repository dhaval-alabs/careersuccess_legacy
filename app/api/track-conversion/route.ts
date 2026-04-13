import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const GOOGLE_ADS_CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '4064995850'
const GOOGLE_ADS_MCC_ID = process.env.GOOGLE_ADS_MCC_ID || '8910137241'

// ── CORS: Allow the production domain to call this endpoint ──
const ALLOWED_ORIGIN = 'https://careersuccess.analytixlabs.co.in'

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const CONVERSION_MAP: Record<string, string> = {
  // Core actions
  lp_blr_submit_lead_primary:           '7555495103',
  lp_blr_book_demo:                     '7555633345',
  lp_blr_download_brochure:             '7555493246',

  // Per-CTA BLR actions (LG Page)
  lp_Hero_CheckEligibility:             '7555633108',
  lp_Hero_DownloadBrochure:             '7555633843',
  lp_Placement_CheckEligibility:        '7555790829',
  lp_Curriculum_DownloadBrochure:       '7555494863',
  lp_Certificate_CheckEligibility:      '7555494866',
  lp_Pricing_SignupDemo:                '7555791054',
  lp_Enrol_CheckEligibility:            '7555495331',
  lp_Bottom_CheckEligibility:           '7555633822',
  lp_Sticky_CheckEligibility:           '7555495346',

  // ── DSAI city pages — run scripts/create-dsai-conversion-actions.js and replace PENDING values ──

  // Delhi
  dsai_del_Hero_CheckEligibility:           '7565921932',
  dsai_del_Hero_DownloadBrochure:           '7566029502',
  dsai_del_Placement_CheckEligibility:      '7566029202',
  dsai_del_Pricing_SignupDemo:              '7565650307',
  dsai_del_Curriculum_DownloadBrochure:     '7565921164',
  dsai_del_Certificate_CheckEligibility:    '7565922127',
  dsai_del_Enrol_CheckEligibility:          '7565922166',
  dsai_del_Bottom_CheckEligibility:         '7565922130',
  dsai_del_Sticky_CheckEligibility:         '7566029208',
  dsai_del_submit_lead_primary:             '7566030177',
  dsai_del_book_demo:                       '7566030180',
  dsai_del_download_brochure:               '7566029211',

  // Noida
  dsai_noi_Hero_CheckEligibility:           '7566030192',
  dsai_noi_Hero_DownloadBrochure:           '7566030213',
  dsai_noi_Placement_CheckEligibility:      '7565922439',
  dsai_noi_Pricing_SignupDemo:              '7565922178',
  dsai_noi_Curriculum_DownloadBrochure:     '7565922661',
  dsai_noi_Certificate_CheckEligibility:    '7565650514',
  dsai_noi_Enrol_CheckEligibility:          '7565922667',
  dsai_noi_Bottom_CheckEligibility:         '7566030216',
  dsai_noi_Sticky_CheckEligibility:         '7565650553',
  dsai_noi_submit_lead_primary:             '7566030432',
  dsai_noi_book_demo:                       '7566030219',
  dsai_noi_download_brochure:               '7565921464',

  // Gurgaon
  dsai_grg_Hero_CheckEligibility:           '7565650466',
  dsai_grg_Hero_DownloadBrochure:           '7565648312',
  dsai_grg_Placement_CheckEligibility:      '7565650688',
  dsai_grg_Pricing_SignupDemo:              '7566029916',
  dsai_grg_Curriculum_DownloadBrochure:     '7566030144',
  dsai_grg_Certificate_CheckEligibility:    '7565919988',
  dsai_grg_Enrol_CheckEligibility:          '7565921170',
  dsai_grg_Bottom_CheckEligibility:         '7565650757',
  dsai_grg_Sticky_CheckEligibility:         '7565919814',
  dsai_grg_submit_lead_primary:             '7565650748',
  dsai_grg_book_demo:                       '7566030897',
  dsai_grg_download_brochure:               '7565922958',

  // Bangalore
  dsai_blr_Hero_CheckEligibility:           '7565650763',
  dsai_blr_Hero_DownloadBrochure:           '7565923183',
  dsai_blr_Placement_CheckEligibility:      '7565923192',
  dsai_blr_Pricing_SignupDemo:              '7565923393',
  dsai_blr_Curriculum_DownloadBrochure:     '7566030465',
  dsai_blr_Certificate_CheckEligibility:    '7565923327',
  dsai_blr_Enrol_CheckEligibility:          '7565922874',
  dsai_blr_Bottom_CheckEligibility:         '7565923087',
  dsai_blr_Sticky_CheckEligibility:         '7565647145',
  dsai_blr_submit_lead_primary:             '7566031116',
  dsai_blr_book_demo:                       '7566031119',
  dsai_blr_download_brochure:               '7565923432',
}

// ── Handle CORS preflight ──
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { ctaName, gclid, email } = await req.json()

    // ── Validation: need ctaName + at least one identifier (gclid or email) ──
    if (!ctaName) {
      return NextResponse.json(
        { error: 'Missing ctaName' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!gclid && !email) {
      return NextResponse.json(
        { error: 'Need at least gclid or email to record a conversion' },
        { status: 400, headers: corsHeaders }
      )
    }

    const conversionActionId = CONVERSION_MAP[ctaName]
    if (!conversionActionId) {
      return NextResponse.json(
        { error: `Unknown ctaName: ${ctaName}` },
        { status: 400, headers: corsHeaders }
      )
    }

    const accessToken = await getAccessToken()

    // ── Normalize + hash email (trim, lowercase, then SHA-256) ──
    const hashedEmail = email
      ? crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex')
      : undefined

    // ── Build conversion object ──
    const conversion: Record<string, any> = {
      conversion_action: `customers/${GOOGLE_ADS_CUSTOMER_ID}/conversionActions/${conversionActionId}`,
      conversion_date_time: new Date()
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '+00:00'),
      conversion_value: 1.0,
      currency_code: 'INR',
    }

    // Only include gclid when present (email-only conversions are valid)
    if (gclid) {
      conversion.gclid = gclid
    }

    if (hashedEmail) {
      conversion.user_identifiers = [{
        hashed_email: hashedEmail
      }]
    }

    // Skip Google Ads upload if disabled — gtag handles conversion tracking.
    // Server-side endpoint still runs for logging/debugging purposes.
    if (process.env.DISABLE_GADS_UPLOAD === 'true') {
      console.log('[track-conversion] Google Ads upload disabled (DISABLE_GADS_UPLOAD=true). Skipping API call.', {
        ctaName,
        email: email ? 'present' : 'missing',
        gclid: gclid ? 'present' : 'missing',
      });
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'DISABLE_GADS_UPLOAD is set — gtag is primary conversion signal',
      }, { headers: corsHeaders });
    }

    const payload = {
      conversions: [conversion],
      partial_failure: true,
    }

    const response = await fetch(
      `https://googleads.googleapis.com/v23/customers/${GOOGLE_ADS_CUSTOMER_ID}:uploadClickConversions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          'login-customer-id': GOOGLE_ADS_MCC_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Google Ads API non-JSON response:', responseText)
      return NextResponse.json(
        {
          error: 'Google Ads API returned non-JSON',
          detail: responseText.substring(0, 500),
          status: response.status
        },
        { status: 500, headers: corsHeaders }
      )
    }

    if (!response.ok) {
      console.error('Google Ads API error:', JSON.stringify(data))
      return NextResponse.json(
        { error: 'Google Ads API failed', detail: data },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({ success: true, result: data }, { headers: corsHeaders })
  } catch (err: any) {
    console.error('track-conversion error:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Module-level cache: persists across requests within the same function instance.
// Tokens are valid for 60 min; we refresh 5 min early to avoid edge-of-expiry failures.
let tokenCache: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })

  const resText = await res.text()
  let data
  try {
    data = JSON.parse(resText)
  } catch (e) {
    throw new Error(`OAuth API returned non-JSON: ${resText.substring(0, 100)}`)
  }

  if (!res.ok || !data.access_token) {
    if (data.error === 'invalid_grant') {
      throw new Error('Google Ads Refresh Token has expired or been revoked (invalid_grant). ACTION REQUIRED: Generate a new refresh token and ensure the GCP OAuth Consent Screen is set to "In Production".');
    }
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`)
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + 55 * 60 * 1000, // 55 minutes
  }

  return tokenCache.token
}