// lib/emailTemplates.ts

const ANALYTIXLABS_PHONE = '+91 95555 25908'
const ANALYTIXLABS_WHATSAPP_LINK = 'https://wa.me/919555525908'
const LOGO_URL = 'https://www.analytixlabs.co.in/wp-content/uploads/2024/04/logo.png'

interface BrochureEmailParams {
  recipientName: string
  brochureUrl: string
  masterclassUrl: string
}

interface ConfirmationEmailParams {
  recipientName: string
  masterclassUrl: string
  ctaType: 'eligibility' | 'demo'
}

export function brochureEmailHtml({ recipientName, brochureUrl, masterclassUrl }: BrochureEmailParams): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 20px; background-color: #f9f9f9;">
  <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #f0f0f0;">
      <img src="${LOGO_URL}" alt="AnalytixLabs" style="height: 40px;">
    </div>
    <div style="padding: 30px;">
      <h1 style="color: #09263F; font-size: 24px; margin-top: 0;">Hello ${recipientName || 'there'},</h1>
      <p>Thank you for your interest in the <strong>Advanced Certification in Data Science &amp; AI</strong>.</p>
      <p>As requested, here is the course brochure containing details about the curriculum, placement assistance, and upcoming batches.</p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${brochureUrl}" style="background-color: #1DE5B5; color: #09263F; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Download Brochure</a>
      </div>
      <p>Our Learning Advisor will get in touch with you shortly to discuss your career goals and answer any questions about cohorts, eligibility, and outcomes.</p>
      <div style="background-color: #f4fbf9; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e0eeeb; text-align: center;">
        <h3 style="margin-top: 0; color: #09263F; font-size: 18px; margin-bottom: 10px;">Next Steps</h3>
        <p style="font-size: 14px; color: #4A6275; margin-bottom: 20px;">Join our upcoming expert-led webinar for guidance on building a career in Data Science.</p>
        <div style="text-align: center;">
          <a href="${masterclassUrl}" style="display: inline-block; background-color: #239bf5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin: 5px;">Save My Spot</a>
          <a href="${ANALYTIXLABS_WHATSAPP_LINK}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin: 5px;">Chat on WhatsApp</a>
        </div>
      </div>
      <p>Alternatively, you can call us at <a href="tel:9555525908" style="color: #239bf5; font-weight: bold; text-decoration: none;">${ANALYTIXLABS_PHONE}</a>.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 14px; color: #666;">Regards,<br>Team AnalytixLabs</p>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      &copy; 2026 AnalytixLabs. All rights reserved.
    </div>
  </div>
</body></html>`
}

export function confirmationEmailHtml({ recipientName, masterclassUrl, ctaType }: ConfirmationEmailParams): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 20px; background-color: #f9f9f9;">
  <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #f0f0f0;">
      <img src="${LOGO_URL}" alt="AnalytixLabs" style="height: 40px;">
    </div>
    <div style="padding: 30px;">
      <h1 style="color: #09263F; font-size: 24px; margin-top: 0;">Thanks for Reaching Out, ${recipientName || 'there'}!</h1>
      <p>Thank you for expressing interest in our <strong>Advanced Certification in Data Science &amp; AI</strong>.</p>
      <div style="background-color: #f0faf8; border: 1.5px solid #1DE5B5; border-radius: 16px; padding: 30px; margin: 30px 0;">
        <p style="font-size: 16px; font-weight: bold; color: #09263F; margin-top: 0; margin-bottom: 16px;">What happens next</p>
        <ul style="color: #4A6275; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0 0 25px 0;">
          <li>Our Learning Advisor will call you within 24 hours</li>
          <li>We'll discuss your eligibility, upcoming batches, and career goals</li>
          <li>You'll receive course details, fee structure, and EMI options</li>
        </ul>
        <p style="font-size: 14px; color: #4A6275; margin-bottom: 20px; text-align: center;">Meanwhile, secure your spot in our upcoming Masterclass or chat with us on WhatsApp:</p>
        <div style="text-align: center;">
          <a href="${masterclassUrl}" style="display: inline-block; background-color: #239bf5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin: 5px;">Save My Spot</a>
          <a href="${ANALYTIXLABS_WHATSAPP_LINK}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin: 5px;">Chat on WhatsApp</a>
        </div>
      </div>
      <p>Have an urgent question? Call us at <a href="tel:9555525908" style="color: #239bf5; font-weight: bold; text-decoration: none;">${ANALYTIXLABS_PHONE}</a>.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 35px 0;">
      <p style="font-size: 14px; color: #666;">Regards,<br>Team AnalytixLabs</p>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      &copy; 2026 AnalytixLabs. All rights reserved.
    </div>
  </div>
</body></html>`
}
