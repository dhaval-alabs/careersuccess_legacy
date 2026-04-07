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

  // Per-CTA BLR actions
  lp_hero_check_eligibility:            '7555633108',
  lp_hero_download_brochure:            '7555633843',
  lp_placement_check_eligibility:       '7555790829',
  lp_curriculum_download_brochure:      '7555494863',
  lp_certificate_check_eligibility:     '7555494866',
  lp_pricing_signup_demo:               '7555791054',
  lp_enrol_check_eligibility:           '7555495331',
  lp_bottom_check_eligibility:          '7555633822',
  lp_sticky_check_eligibility:          '7555495346',

  // ── DSAI city pages — run scripts/create-dsai-conversion-actions.js and replace PENDING values ──

  // Delhi
  dsai_del_hero_check_eligibility:          'PENDING',
  dsai_del_hero_download_brochure:          'PENDING',
  dsai_del_placement_check_eligibility:     'PENDING',
  dsai_del_pricing_signup_demo:             'PENDING',
  dsai_del_curriculum_download_brochure:    'PENDING',
  dsai_del_certificate_check_eligibility:   'PENDING',
  dsai_del_enrol_check_eligibility:         'PENDING',
  dsai_del_bottom_check_eligibility:        'PENDING',
  dsai_del_sticky_check_eligibility:        'PENDING',
  dsai_del_submit_lead_primary:             'PENDING',
  dsai_del_book_demo:                       'PENDING',
  dsai_del_download_brochure:               'PENDING',

  // Noida
  dsai_noi_hero_check_eligibility:          'PENDING',
  dsai_noi_hero_download_brochure:          'PENDING',
  dsai_noi_placement_check_eligibility:     'PENDING',
  dsai_noi_pricing_signup_demo:             'PENDING',
  dsai_noi_curriculum_download_brochure:    'PENDING',
  dsai_noi_certificate_check_eligibility:   'PENDING',
  dsai_noi_enrol_check_eligibility:         'PENDING',
  dsai_noi_bottom_check_eligibility:        'PENDING',
  dsai_noi_sticky_check_eligibility:        'PENDING',
  dsai_noi_submit_lead_primary:             'PENDING',
  dsai_noi_book_demo:                       'PENDING',
  dsai_noi_download_brochure:               'PENDING',

  // Gurgaon
  dsai_grg_hero_check_eligibility:          'PENDING',
  dsai_grg_hero_download_brochure:          'PENDING',
  dsai_grg_placement_check_eligibility:     'PENDING',
  dsai_grg_pricing_signup_demo:             'PENDING',
  dsai_grg_curriculum_download_brochure:    'PENDING',
  dsai_grg_certificate_check_eligibility:   'PENDING',
  dsai_grg_enrol_check_eligibility:         'PENDING',
  dsai_grg_bottom_check_eligibility:        'PENDING',
  dsai_grg_sticky_check_eligibility:        'PENDING',
  dsai_grg_submit_lead_primary:             'PENDING',
  dsai_grg_book_demo:                       'PENDING',
  dsai_grg_download_brochure:               'PENDING',

  // Bangalore
  dsai_blr_hero_check_eligibility:          'PENDING',
  dsai_blr_hero_download_brochure:          'PENDING',
  dsai_blr_placement_check_eligibility:     'PENDING',
  dsai_blr_pricing_signup_demo:             'PENDING',
  dsai_blr_curriculum_download_brochure:    'PENDING',
  dsai_blr_certificate_check_eligibility:   'PENDING',
  dsai_blr_enrol_check_eligibility:         'PENDING',
  dsai_blr_bottom_check_eligibility:        'PENDING',
  dsai_blr_sticky_check_eligibility:        'PENDING',
  dsai_blr_submit_lead_primary:             'PENDING',
  dsai_blr_book_demo:                       'PENDING',
  dsai_blr_download_brochure:               'PENDING',
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
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`)
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + 55 * 60 * 1000, // 55 minutes
  }

  return tokenCache.token
}