// lib/sendLeadEmail.ts

import { brochureEmailHtml, confirmationEmailHtml } from './emailTemplates'

interface SendLeadEmailParams {
  recipientEmail: string
  recipientName: string
  typeFilter: string
}

interface SendLeadEmailResult {
  success: boolean
  status: 'Sent' | 'Failed' | 'Skipped'
  emailType: 'brochure' | 'confirmation' | 'none'
  httpStatus?: number
  messageId?: string
  error?: string
}

export async function sendLeadEmail({
  recipientEmail,
  recipientName,
  typeFilter,
}: SendLeadEmailParams): Promise<SendLeadEmailResult> {
  const resendKey = process.env.RESEND_API_KEY
  const masterclassUrl = process.env.NEXT_PUBLIC_MASTERCLASS_URL || process.env.NEXT_PUBLIC_ZOOM_WEBINAR_URL || 'https://www.analytixlabs.co.in/'

  if (!resendKey) {
    return { success: false, status: 'Failed', emailType: 'none', error: 'RESEND_API_KEY not configured' }
  }
  if (!recipientEmail || !recipientEmail.includes('@')) {
    return { success: false, status: 'Failed', emailType: 'none', error: 'Invalid recipient email' }
  }

  let subject: string
  let html: string
  let emailType: 'brochure' | 'confirmation'

  if (typeFilter === 'PPC_DownloadBrochure' || typeFilter === 'PPC_downloadBrochure') {
    const brochureUrl = process.env.NEXT_PUBLIC_BROCHURE_URL
    if (!brochureUrl) {
      return { success: false, status: 'Failed', emailType: 'brochure', error: 'NEXT_PUBLIC_BROCHURE_URL not configured' }
    }
    subject = 'Your Data Science & AI Program Brochure — AnalytixLabs'
    html = brochureEmailHtml({ recipientName, brochureUrl, masterclassUrl })
    emailType = 'brochure'
  } else if (typeFilter === 'PPC_CheckEligibility' || typeFilter === 'signUpForDemo' || typeFilter === 'PPC_HeroForm') {
    const ctaType = typeFilter === 'signUpForDemo' ? 'demo' : 'eligibility'
    subject = 'Thanks for Your Interest in Data Science & AI — AnalytixLabs'
    html = confirmationEmailHtml({ recipientName, masterclassUrl, ctaType })
    emailType = 'confirmation'
  } else {
    // Default to confirmation email for other types if they are lead captures
    subject = 'Thanks for Your Interest in Data Science & AI — AnalytixLabs'
    html = confirmationEmailHtml({ recipientName, masterclassUrl, ctaType: 'eligibility' })
    emailType = 'confirmation'
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AnalytixLabs <admissions@analytixlabs.co.in>',
        to: recipientEmail,
        subject,
        html,
      }),
    })

    const responseBody = await response.json().catch(() => ({}))

    if (response.status >= 200 && response.status < 300) {
      console.log(`[sendLeadEmail] ${emailType} sent to ${recipientEmail} | status=${response.status} | messageId=${responseBody.id}`)
      return { success: true, status: 'Sent', emailType, httpStatus: response.status, messageId: responseBody.id }
    } else {
      console.error(`[sendLeadEmail] ${emailType} FAILED for ${recipientEmail} | status=${response.status} | body=${JSON.stringify(responseBody).slice(0, 300)}`)
      return { success: false, status: 'Failed', emailType, httpStatus: response.status, error: JSON.stringify(responseBody).slice(0, 300) }
    }
  } catch (error: any) {
    console.error(`[sendLeadEmail] Network error for ${recipientEmail}: ${error.message}`)
    return { success: false, status: 'Failed', emailType: 'none', error: error.message }
  }
}
