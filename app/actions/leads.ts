'use server'

import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadEntry {
    name: string
    email: string
    countryCode: string
    mobile: string
    city: string
    form_source?: string
    session_id?: string
    gclid?: string
    source_keyword?: string
    page_url?: string
    typeFilter?: string
}

export async function createLeadAction(data: LeadEntry) {
    try {
        // Call the internal API route for LeadSquared submission
        let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        
        if (!baseUrl) {
            const { headers } = await import('next/headers');
            const headersList = await headers();
            const host = headersList.get('host');
            const protocol = host?.includes('localhost') ? 'http' : 'https';
            baseUrl = `${protocol}://${host}`;
        }
        
        const response = await fetch(`${baseUrl}/api/submit-lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'CRM submission failed' };
        }

        // --- Post-submission Automation: Send Brochure Email ---
        // Trigger only for brochure download forms
        if (data.typeFilter === 'PPC_DownloadBrochure' && data.email) {
            try {
                const brochureUrl = process.env.NEXT_PUBLIC_BROCHURE_URL;
                
                await resend.emails.send({
                    from: 'AnalytixLabs <careersuccess@analytixlabs.co.in>',
                    to: data.email,
                    subject: 'Your Data Science & AI Course Brochure - AnalytixLabs',
                    html: `
                        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background-color: #09263F; padding: 20px; text-align: center;">
                                <img src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp" alt="AnalytixLabs" style="height: 40px;">
                            </div>
                            <div style="padding: 30px;">
                                <h1 style="color: #09263F; font-size: 24px; margin-top: 0;">Hello ${data.name || 'Student'},</h1>
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
                                &copy; ${new Date().getFullYear()} AnalytixLabs. All rights reserved.
                            </div>
                        </div>
                    `
                });
            } catch (emailError) {
                // Log and continue - we don't want to fail the lead submission if email fails
                console.error("Failed to send brochure email:", emailError);
            }
        }

        return { success: true }
    } catch (error) {
        console.error("Lead Action Error:", error)
        return { success: false, error: 'Internal server error' }
    }
}
