import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = 'https://www.analytixlabs.co.in/wp-content/uploads/2024/04/logo.png';
const WEBINAR_URL = process.env.NEXT_PUBLIC_ZOOM_WEBINAR_URL || 'https://us06web.zoom.us/webinar/register/7517736425815/WN_MwlIZpQCRcmKz_LG4Y3OwQ';
const WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=919555525908&text=Hello%2C%20I%20just%20submitted%20my%20details%20on%20the%20AnalytixLabs%20website.%20Can%20you%20help%20me%3F';

const COURSE_MAP: Record<string, string> = {
    'agentic-ai': 'Agentic AI Course',
    'data-analytics': 'Data Analytics Course',
    'data-science': 'Data Science Course',
    'business-analytics': 'Business Analytics Course',
    'full-stack-ai': 'Full Stack Applied AI Course',
    'data-visualization': 'Data Visualization & Analytics',
    'data-science-python': 'Data Science With Python',
};

/**
 * Sends a professionally formatted brochure email to a lead.
 */
export async function sendBrochureEmail(email: string, name: string, courseSlug?: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Resend] Skipping: Missing RESEND_API_KEY');
        return;
    }

    try {
        const courseName = courseSlug ? COURSE_MAP[courseSlug] || 'Data Science & AI' : 'Data Science & AI';
        const envKey = `NEXT_PUBLIC_BROCHURE_${courseSlug?.toUpperCase().replace(/-/g, '_')}`;
        const brochureUrl = (courseSlug && process.env[envKey]) || process.env.NEXT_PUBLIC_BROCHURE_URL || 'https://www.analytixlabs.co.in/pdf/Nasscom_(ACDS)_Advanced_Certification_in_Data_Science_Alabs280126.pdf';
        
        const currentYear = new Date().getFullYear();

        await resend.emails.send({
            from: 'AnalytixLabs <careersuccess@analytixlabs.co.in>',
            to: email,
            subject: `Your ${courseName} Brochure - AnalytixLabs`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                        <img src="${LOGO_URL}" alt="AnalytixLabs" style="height: 40px;">
                    </div>
                    <div style="padding: 30px;">
                        <h1 style="color: #09263F; font-size: 24px; margin-top: 0;">Hello ${name || 'Student'},</h1>
                        <p>Thank you for your interest in the <strong>${courseName}</strong>.</p>
                        <p>As requested, here is the course brochure containing details about the curriculum, placement assistance, and upcoming batches.</p>
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${brochureUrl}" style="background-color: #1DE5B5; color: #09263F; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Download Brochure</a>
                        </div>
                        <p>Our Learning Advisor will get in touch with you shortly to discuss your career goals and help you with any questions.</p>

                        <div style="background-color: #f4fbf9; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e0eeeb; text-align: center;">
                            <h3 style="margin-top: 0; color: #09263F; font-size: 18px; margin-bottom: 10px;">Next Steps</h3>
                            <p style="font-size: 14px; color: #4A6275; margin-bottom: 20px;">Join our upcoming expert-led webinar for guidance on building a career in Data Science.</p>
                            <div style="text-align: center;">
                                <a href="${WEBINAR_URL}" style="display: inline-block; background-color: #239bf5; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin: 5px;">Save My Spot</a>
                                <a href="${WHATSAPP_URL}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin: 5px;">Chat on WhatsApp</a>
                            </div>
                        </div>

                        <p>Alternatively, you can call us at <a href="tel:9555525908" style="color: #239bf5; font-weight: bold; text-decoration: none;">+91 95555 25908</a>.</p>
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

/**
 * Sends a registration confirmation email for Masterclass/Eligibility leads.
 */
export async function sendRegistrationEmail(email: string, name: string) {
    if (!process.env.RESEND_API_KEY) return;

    try {
        const currentYear = new Date().getFullYear();

        await resend.emails.send({
            from: 'AnalytixLabs <careersuccess@analytixlabs.co.in>',
            to: email,
            subject: 'Registration Confirmed: Join our Data Science & AI Webinar - AnalytixLabs',
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                        <img src="${LOGO_URL}" alt="AnalytixLabs" style="height: 40px;">
                    </div>
                    <div style="padding: 30px;">
                        <h1 style="color: #09263F; font-size: 24px; margin-top: 0;">You're Registered, ${name || 'Student'}!</h1>
                        <p>Thank you for expressing interest in building a career in Data Science & AI with AnalytixLabs.</p>
                        
                        <div style="background-color: #f0faf8; border: 1.5px solid #1DE5B5; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0;">
                            <p style="font-size: 16px; font-weight: bold; color: #09263F; margin-top: 0; margin-bottom: 10px;">Upcoming Masterclass / Webinar</p>
                            <p style="font-size: 14px; color: #4A6275; margin-bottom: 25px;">Get expert guidance on transitioning into AI roles and the current market trends.</p>
                            <div style="text-align: center;">
                                <a href="${WEBINAR_URL}" style="display: inline-block; background-color: #1DE5B5; color: #09263F; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 5px;">Secure My Webinar Spot</a>
                                <a href="${WHATSAPP_URL}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 5px;">Chat Now on WhatsApp</a>
                            </div>
                        </div>

                        <hr style="border: 0; border-top: 1px solid #eee; margin: 35px 0;">
                        <p style="font-size: 14px; color: #666;">Regards,<br>Team AnalytixLabs</p>
                    </div>
                    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                        &copy; ${currentYear} AnalytixLabs. All rights reserved.
                    </div>
                </div>
            `
        });
        console.log(`[Resend] Registration email sent successfully to: ${email}`);
    } catch (error) {
        console.error('[Resend] Failed to send registration email:', error);
    }
}
