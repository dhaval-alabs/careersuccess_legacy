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
    course?: string
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

        // --- Post-submission Automation: Send Emails ---
        if (data.email) {
            const { sendBrochureEmail, sendRegistrationEmail } = await import('@/utils/email');
            
            if (data.typeFilter === 'PPC_DownloadBrochure') {
                await sendBrochureEmail(data.email, data.name, data.course);
            } else if (data.typeFilter === 'PPC_CheckEligibility' || data.typeFilter === 'PPC_SignupDemo') {
                await sendRegistrationEmail(data.email, data.name);
            }
        }

        return { success: true }
    } catch (error) {
        console.error("Lead Action Error:", error)
        return { success: false, error: 'Internal server error' }
    }
}
