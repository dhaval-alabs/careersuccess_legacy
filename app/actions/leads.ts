'use server'

import { revalidatePath } from 'next/cache'

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
        // This keeps the logic centralized in the API route which can be used by other parts if needed
        // and ensures we follow the new implementation instructions.
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/submit-lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'CRM submission failed' };
        }

        return { success: true }
    } catch (error) {
        console.error("Lead Action Error:", error)
        return { success: false, error: 'Internal server error' }
    }
}
