import { NextRequest, NextResponse } from 'next/server'

const CONVERSION_ID = '783236209'

const CONVERSION_MAP: Record<string, string> = {
  lp_submit_lead_primary: 'N79JCMTq044cEPH4vPUC',
  lp_book_demo: 'cruTCPjB3o4cEPH4vPUC',
  lp_download_brochure: 'tnf-CMrS3o4cEPH4vPUC',
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

    const response = await fetch(
      `https://googleads.googleapis.com/v16/customers/${CONVERSION_ID}:uploadClickConversions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    let data
    try {
      data = await response.json()
    } catch (e) {
      const text = await response.text()
      console.error('Google Ads API non-JSON response:', text)
      return NextResponse.json(
        { error: 'Google Ads API returned non-JSON', detail: text.substring(0, 500) },
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
      { 
        error: 'Internal server error', 
        message: err.message,
        stack: err.stack 
      },
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

  let data
  try {
    data = await res.json()
  } catch (e) {
    const text = await res.text()
    console.error('OAuth token non-JSON response:', text)
    throw new Error(`OAuth API returned non-JSON: ${text.substring(0, 200)}`)
  }

  if (!res.ok || !data.access_token) {
    console.error('OAuth token error:', JSON.stringify(data))
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`)
  }

  return data.access_token
}