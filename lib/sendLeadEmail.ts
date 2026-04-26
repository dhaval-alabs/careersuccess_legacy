// lib/sendLeadEmail.ts

import { brochureEmailHtml, confirmationEmailHtml } from './emailTemplates'

interface SendLeadEmailParams {
  recipientEmail: string
  recipientName: string
  typeFilter: string
  courseSlug?: string
}

const COURSE_MAP: Record<string, string> = {
  'agentic-ai': 'Agentic AI Course',
  'data-analytics': 'Data Analytics Course',
  'data-science': 'Data Science Course',
  'business-analytics': 'Business Analytics Course',
  'full-stack-ai': 'Full Stack Applied AI Course',
  'data-visualization': 'Data Visualization & Analytics',
  'data-science-python': 'Data Science With Python',
};

export async function sendLeadEmail({
  recipientEmail,
  recipientName,
  typeFilter,
  courseSlug,
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

  const courseName = courseSlug ? COURSE_MAP[courseSlug] || 'Data Science & AI' : 'Data Science & AI';

  if (typeFilter === 'PPC_DownloadBrochure' || typeFilter === 'PPC_downloadBrochure') {
    // Resolve course-specific brochure URL from env if possible
    const envKey = `NEXT_PUBLIC_BROCHURE_${courseSlug?.toUpperCase().replace(/-/g, '_')}`;
    const brochureUrl = (courseSlug && process.env[envKey]) || process.env.NEXT_PUBLIC_BROCHURE_URL;

    if (!brochureUrl) {
      return { success: false, status: 'Failed', emailType: 'brochure', error: 'Brochure URL not configured' }
    }
    subject = `Your ${courseName} Brochure — AnalytixLabs`
    html = brochureEmailHtml({ recipientName, brochureUrl, masterclassUrl, courseName })
    emailType = 'brochure'
  } else if (typeFilter === 'PPC_CheckEligibility' || typeFilter === 'signUpForDemo' || typeFilter === 'PPC_HeroForm') {
    const ctaType = typeFilter === 'signUpForDemo' ? 'demo' : 'eligibility'
    subject = `Thanks for Your Interest in ${courseName} — AnalytixLabs`
    html = confirmationEmailHtml({ recipientName, masterclassUrl, ctaType, courseName })
    emailType = 'confirmation'
  } else {
    subject = `Thanks for Your Interest in ${courseName} — AnalytixLabs`
    html = confirmationEmailHtml({ recipientName, masterclassUrl, ctaType: 'eligibility', courseName })
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
