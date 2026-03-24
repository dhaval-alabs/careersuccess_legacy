import { NextRequest, NextResponse } from 'next/server'

const CONVERSION_ID = '4064995850'

const CONVERSION_MAP: Record<string, string> = {
  lp_submit_lead_primary: '7546926404',
  lp_book_demo: '7547101432',
  lp_download_brochure: '7547103562',
}

export async function POST(req: NextRequest) {
  try {
    const { ctaName, gclid } = await req.json()

    if (!ctaName || !gclid) {
      return NextResponse.json(
        { error: 'Missing ctaName or gclid' },
        { status: 400 }
      )
    }

    const conversionLabel = CONVERSION_MAP[ctaName]
    if (!conversionLabel) {
      return NextResponse.json(
        { error: `Unknown ctaName: ${ctaName}` },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const payload = {
      conversions: [
        {
          gclid,
          conversion_action: `customers/${CONVERSION_ID}/conversionActions/${conversionLabel}`,
          conversion_date_time: new Date()
            .toISOString()
            .replace('T', ' ')
            .replace('Z', '+00:00'),
          conversion_value: 1.0,
          currency_code: 'INR',
        },
      ],
      partial_failure: true,
    }

    const checkUrl = `https://googleads.googleapis.com/v18/customers/${CONVERSION_ID}`
    console.log('Checking customer resource:', checkUrl)
    const response = await fetch(
      `https://googleads.googleapis.com/v17/customers/${CONVERSION_ID}:uploadClickConversions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          'login-customer-id': CONVERSION_ID,
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
        { status: 500 }
      )
    }

    if (!response.ok) {
      console.error('Google Ads API error:', JSON.stringify(data))
      return NextResponse.json(
        { error: 'Google Ads API failed', detail: data },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, result: data })
  } catch (err: any) {
    console.error('track-conversion error:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    )
  }
}

async function getAccessToken(): Promise<string> {
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

  return data.access_token
}