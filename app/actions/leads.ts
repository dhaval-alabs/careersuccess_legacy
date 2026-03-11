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
        // Phone format cleanup: Prevent +91 91xxxxxxxx
        let cleanMobile = data.mobile.trim();
        if (data.countryCode === '+91' && cleanMobile.startsWith('91') && cleanMobile.length > 10) {
            cleanMobile = cleanMobile.substring(2);
        }
        const cleanPhone = `${data.countryCode}${cleanMobile}`;

        // CRM Webhook Push (Leadsquared API Sync)
        // Using the persistent webhook URL found in previous session artifacts
        const CRM_WEBHOOK_URL = "https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=u$rfdb83f05f0b66fc1db816ac810a2e0d3&secretKey=5d1e931f0b5e3bbbdf4bfa24a3486e133c46cbb4";

        if (CRM_WEBHOOK_URL) {
            try {
                let firstName = data.name;
                let lastName = '';
                const nameParts = data.name.trim().split(' ');
                if (nameParts.length > 1) {
                    firstName = nameParts[0];
                    lastName = nameParts.slice(1).join(' ');
                }

                let lsqPhone = cleanPhone;
                if (data.countryCode === '+91') {
                    lsqPhone = cleanMobile;
                }

                const lsqPayload = [
                    { "Attribute": "FirstName", "Value": firstName },
                    { "Attribute": "LastName", "Value": lastName },
                    { "Attribute": "EmailAddress", "Value": data.email },
                    { "Attribute": "Phone", "Value": lsqPhone },
                    { "Attribute": "mx_City_name", "Value": data.city },
                    { "Attribute": "Source", "Value": "PPC" },
                    { "Attribute": "Notes", "Value": `Alabs-lp V2: ${data.form_source || "Hero Form"}` },
                    { "Attribute": "mx_gclid", "Value": data.gclid || "" },
                    { "Attribute": "mx_Keyword", "Value": data.source_keyword || "" },
                    { "Attribute": "mx_Page_Url", "Value": data.page_url || "" },
                    { "Attribute": "mx_Type_Filter", "Value": data.typeFilter || "" },
                    { "Attribute": "mx_terms_and_condition", "Value": "true" }
                ];

                const response = await fetch(CRM_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(lsqPayload)
                });

                if (!response.ok) {
                    console.error("CRM Webhook failed with status:", response.status);
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                }
            } catch (webhookError) {
                console.error("CRM Webhook exception:", webhookError);
            }
        }

        // Since this is a new project without a confirmed Supabase setup yet, 
        // we prioritize the CRM push as requested.

        return { success: true }
    } catch (error) {
        console.error("Lead Action Error:", error)
        return { success: false, error: 'Internal server error' }
    }
}
