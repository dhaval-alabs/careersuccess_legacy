import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a professionally formatted brochure email to a lead.
 * This should be triggered as soon as a lead registers for a brochure download.
 */
export async function sendBrochureEmail(email: string, name: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Resend] Skipping: Missing RESEND_API_KEY');
        return;
    }

    try {
        const brochureUrl = process.env.NEXT_PUBLIC_BROCHURE_URL || 'https://www.analytixlabs.co.in/pdf/Nasscom_(ACDS)_Advanced_Certification_in_Data_Science_Alabs280126.pdf';
        const currentYear = new Date().getFullYear();

        await resend.emails.send({
            from: 'AnalytixLabs <careersuccess@analytixlabs.co.in>',
            to: email,
            subject: 'Your Data Science & AI Course Brochure - AnalytixLabs',
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                        <img src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp" alt="AnalytixLabs" style="height: 45px;">
                    </div>
                    <div style="padding: 30px;">
                        <h1 style="color: #09263F; font-size: 24px; margin-top: 0;">Hello ${name || 'Student'},</h1>
                        <p>Thank you for your interest in the <strong>Advanced Certification in Data Science & AI</strong>.</p>
                        <p>As requested, here is the course brochure containing details about the curriculum, placement assistance, and upcoming batches.</p>
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${brochureUrl}" style="background-color: #1DE5B5; color: #09263F; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Download Brochure</a>
                        </div>
                        <p>Our Learning Advisor will get in touch with you shortly to discuss your career goals and help you with any questions.</p>
                        <p>Alternatively, you can call us at <a href="tel:9555525908" style="color: #239bf5;">+91 95555 25908</a>.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 14px; color: #666;">Regards,<br>Team AnalytixLabs</p>
                    </div>
                    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                        &copy; ${currentYear} AnalytixLabs. All rights reserved.
                    </div>
                </div>
            `
        });
        console.log(`[Resend] Brochure email sent successfully to: ${email}`);
    } catch (error) {
        console.error('[Resend] Failed to send brochure email:', error);
    }
}
