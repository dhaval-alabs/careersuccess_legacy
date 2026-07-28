# Implementation: Two-Tier Conversion Strategy + Lead Email Automation
**Repo:** `dhaval-alabs/careersuccess_legacy`
**Files to edit/create:** Multiple — see Files Summary at end
**Priority:** High — completes the quality lead pipeline + activates Smart Bidding signal
**Status of dependencies:** ✅ `mx_Email_Status` LSQ field exists · ✅ Column R "Email Verified" exists in NextJS sheet · ✅ `RESEND_API_KEY` env var exists · ✅ `NEXT_PUBLIC_BROCHURE_URL` env var exists · ⏳ NEW env var needed: `NEXT_PUBLIC_MASTERCLASS_URL` · ⏳ Manual: Create 3 "Verified Lead" conversion actions in Google Ads dashboard

---

## 1. Background & Strategy

### Two-Tier Conversion Architecture

**Current state:** All thank-you page loads fire a single conversion type per CTA, regardless of OTP verification status. Smart Bidding optimizes for volume, including unverified leads.

**Target state:** Per-CTA dual conversion signals — preserving the existing per-CTA breakdown PPC team relies on.

| Conversion Action | New Status | Fires when |
|---|---|---|
| `Form Submission \| CTA \| Eligibility` (existing) | Secondary | Any thank-you-eligibility page load |
| `Form Submission \| CTA \| Download Brochure` (existing) | Secondary | Any thank-you-brochure page load |
| `Form Submission \| CTA \| SignUp Demo` (existing) | Secondary | Any thank-you-demo page load |
| **`Verified Lead \| Eligibility`** (NEW) | **Primary** | Eligibility thank-you page WITH `?verified=true` |
| **`Verified Lead \| Brochure`** (NEW) | **Primary** | Brochure thank-you page WITH `?verified=true` |
| **`Verified Lead \| SignUp Demo`** (NEW) | **Primary** | Demo thank-you page WITH `?verified=true` |

**Why per-CTA Verified Lead actions:**
- PPC team retains full per-CTA breakdown in Google Ads dashboard
- Quality vs volume comparison visible per CTA at a glance (e.g., "Brochure: 14 submissions / 11 verified")
- Smart Bidding signal is identical whether 1 or 3 Primary actions — it optimizes on the sum
- Easy to identify which CTA has highest verification rate (= highest quality traffic)

### ⚠️ Dashboard Stability Guarantee

**Nothing about the existing conversion firing changes.** This is critical:
- Existing 3 conversion actions keep firing on every thank-you page load exactly as they do now
- Their numbers, history, and reporting stay identical
- The only organizational change: mark them Secondary instead of Primary in Google Ads UI
- "Account-default goals" total will shift to reflect new Primary actions, but individual action rows are untouched
- If anything looks wrong post-deploy, simply revert Primary/Secondary labels in Google Ads — no code rollback needed

### Email Automation

Adds the missing piece: every successful lead now gets a contextual email.

| CTA Type | Email Sent |
|---|---|
| `PPC_DownloadBrochure` (any brochure CTA) | Brochure email with PDF link + masterclass + WhatsApp CTAs |
| `PPC_CheckEligibility` | Confirmation email with masterclass + WhatsApp CTAs (no brochure link) |
| `signUpForDemo` | Confirmation email with masterclass + WhatsApp CTAs (no brochure link) |

### Quality lead definition (going forward)

| Lead State | OTP Status | Email Status | Treated As |
|---|---|---|---|
| Junk/dropout | Unverified | Empty (no email sent) | Filter out |
| Verified — Eligibility/Demo | Verified | Sent | Quality lead ✅ |
| Verified — Brochure (email sent) | Verified | Sent | Quality lead ✅ |
| Verified — email failed | Verified | Failed | Quality lead, but flag for ops review |
| Fallback (Meta API down) | Fallback | Sent | Treat as quality (system failed, not user) |

### Why Resend status code is the right signal
Resend API returns HTTP `200/201/202` when the email is accepted by Resend's infrastructure for delivery — the industry-standard "successfully sent" signal. We treat this as **"Sent"**. Any 4xx/5xx response or network error = **"Failed"**.

---

## 2. Implementation Architecture

```
User completes OTP verification at /api/otp/verify
        ↓
  Server validates HMAC ✅
        ↓
  Update LSQ: mx_OTP_Status = "Verified"
  Update Sheets Col Q: "Verified"
        ↓
  Return success response with verified=true flag
        ↓
  Client receives response → redirects to thank-you page WITH ?verified=true
        ↓
  Thank-you page loads:
    - Always fires existing "Form Submission | CTA | X" conversion (Secondary)
    - IF ?verified=true → also fires matching "Verified Lead | X" conversion (Primary)
        ↓
  ─── Async background task on the server (after response sent) ───
        ↓
  Determine email type based on typeFilter
        ↓
  PPC_DownloadBrochure → send brochure email
  PPC_CheckEligibility / signUpForDemo → send confirmation email
        ↓
  Capture Resend response status
        ↓
  If 200/201/202 → mark "Sent"
  Else → mark "Failed"
        ↓
  Update LSQ: mx_Email_Status
  Update Sheets Col R: Email Verified
        ↓
  Done
```

---

## 3. Implementation Steps

### Step 1 — Create `lib/emailTemplates.ts`

Centralized HTML templates for both email types. Both templates include WhatsApp + Masterclass CTAs side-by-side as the original Antigravity designs intended.

```typescript
// lib/emailTemplates.ts

const ANALYTIXLABS_PHONE = '+91 96677 72573'
const ANALYTIXLABS_WHATSAPP_LINK = 'https://wa.me/919667772573'
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
      <p>Alternatively, you can call us at <a href="tel:9667772573" style="color: #239bf5; font-weight: bold; text-decoration: none;">${ANALYTIXLABS_PHONE}</a>.</p>
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
      <p>Have an urgent question? Call us at <a href="tel:9667772573" style="color: #239bf5; font-weight: bold; text-decoration: none;">${ANALYTIXLABS_PHONE}</a>.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 35px 0;">
      <p style="font-size: 14px; color: #666;">Regards,<br>Team AnalytixLabs</p>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      &copy; 2026 AnalytixLabs. All rights reserved.
    </div>
  </div>
</body></html>`
}
```

> **Important:** The confirmation email does NOT include the brochure link anywhere. Brochure delivery is reserved for users who explicitly requested it via Download Brochure CTAs.

---

### Step 2 — Create `lib/sendLeadEmail.ts`

Single utility that determines email type and sends via Resend.

```typescript
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
  const masterclassUrl = process.env.NEXT_PUBLIC_MASTERCLASS_URL || 'https://www.analytixlabs.co.in/'

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
  } else if (typeFilter === 'PPC_CheckEligibility' || typeFilter === 'signUpForDemo') {
    const ctaType = typeFilter === 'signUpForDemo' ? 'demo' : 'eligibility'
    subject = 'Thanks for Your Interest in Data Science & AI — AnalytixLabs'
    html = confirmationEmailHtml({ recipientName, masterclassUrl, ctaType })
    emailType = 'confirmation'
  } else {
    return { success: false, status: 'Skipped', emailType: 'none', error: `Unknown typeFilter: ${typeFilter}` }
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
    return { success: false, status: 'Failed', emailType, error: error.message }
  }
}
```

---

### Step 3 — Create `lib/updateEmailStatus.ts`

Updates both LSQ CRM (`mx_Email_Status`) and Google Sheets Column R atomically.

```typescript
// lib/updateEmailStatus.ts

import { google } from 'googleapis'

interface UpdateEmailStatusParams {
  leadId?: string
  phone: string
  emailStatus: 'Sent' | 'Failed'
}

export async function updateEmailStatus({ leadId, phone, emailStatus }: UpdateEmailStatusParams) {
  const results = await Promise.allSettled([
    updateLSQEmailStatus(leadId, phone, emailStatus),
    updateSheetEmailStatus(phone, emailStatus),
  ])

  if (results[0].status === 'rejected') {
    console.error(`[updateEmailStatus] LSQ update failed for ${phone}: ${results[0].reason}`)
  }
  if (results[1].status === 'rejected') {
    console.error(`[updateEmailStatus] Sheets update failed for ${phone}: ${results[1].reason}`)
  }

  return {
    lsqUpdated: results[0].status === 'fulfilled',
    sheetUpdated: results[1].status === 'fulfilled',
  }
}

async function updateLSQEmailStatus(leadId: string | undefined, phone: string, emailStatus: string) {
  const host = process.env.LSQ_HOST
  const accessKey = process.env.LSQ_ACCESS_KEY
  const secretKey = process.env.LSQ_SECRET_KEY
  if (!host || !accessKey || !secretKey) throw new Error('LSQ credentials not configured')

  let resolvedLeadId = leadId
  if (!resolvedLeadId) {
    const lookupRes = await fetch(
      `https://${host}/v2/LeadManagement.svc/Leads.GetByPhone?accessKey=${accessKey}&secretKey=${secretKey}&phone=${encodeURIComponent(phone)}`
    )
    const lookupData = await lookupRes.json()
    resolvedLeadId = lookupData?.[0]?.ProspectID
    if (!resolvedLeadId) throw new Error(`No LSQ lead found for phone ${phone}`)
  }

  const updateRes = await fetch(
    `https://${host}/v2/LeadManagement.svc/Lead.Update?accessKey=${accessKey}&secretKey=${secretKey}&leadId=${resolvedLeadId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ Attribute: 'mx_Email_Status', Value: emailStatus }]),
    }
  )
  if (!updateRes.ok) {
    const errBody = await updateRes.text().catch(() => '')
    throw new Error(`LSQ update failed: ${updateRes.status} ${errBody.slice(0, 200)}`)
  }
}

async function updateSheetEmailStatus(phone: string, emailStatus: string) {
  const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!sheetId || !clientEmail || !privateKey) throw new Error('Google Sheets credentials not configured')

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  const phoneColumn = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'NextJS!D:D',
  })

  const rows = phoneColumn.data.values || []
  let targetRow = -1
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i]?.[0] && String(rows[i][0]).trim() === String(phone).trim()) {
      targetRow = i + 1
      break
    }
  }
  if (targetRow === -1) throw new Error(`No sheet row found for phone ${phone}`)

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `NextJS!R${targetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[emailStatus]] },
  })

  console.log(`[updateEmailStatus] Sheet row ${targetRow} | Col R = ${emailStatus}`)
}
```

---

### Step 4 — Modify `app/api/otp/verify/route.ts`

Add the email trigger as a fire-and-forget async task AND add `verified: true` to the response.

```typescript
// app/api/otp/verify/route.ts

import { sendLeadEmail } from '@/lib/sendLeadEmail'
import { updateEmailStatus } from '@/lib/updateEmailStatus'

// ... existing OTP verification logic ...

// After verification succeeds and LSQ is updated to "Verified":

;(async () => {
  try {
    const sendResult = await sendLeadEmail({
      recipientEmail: email,
      recipientName: fullName || '',
      typeFilter,
    })

    if (sendResult.status !== 'Skipped') {
      await updateEmailStatus({
        leadId,
        phone,
        emailStatus: sendResult.status as 'Sent' | 'Failed',
      })
    }

    console.log(`[verify] Email flow complete | phone=${phone} | type=${sendResult.emailType} | status=${sendResult.status}`)
  } catch (err: any) {
    console.error(`[verify] Email flow exception | phone=${phone} | error=${err.message}`)
  }
})()

// Return verify success response immediately — does NOT wait for email
return NextResponse.json({
  success: true,
  verified: true,  // ← NEW: explicit flag for the client to use in redirect
  // ... existing fields ...
})
```

For the **Fallback case** (Meta API down), make sure that code path does NOT return `verified: true` — it should return `verified: false` or omit the flag. This ensures the Verified Lead conversion only fires for true OTP successes.

---

### Step 5 — Update form components to append `?verified=true` to redirect

**Files:**
- `components/HeroLeadCaptureForm.tsx`
- `components/LeadCaptureForm.tsx` (exception to "do not touch" — minimal change required)

**Find** the redirect logic after OTP verification succeeds:

```typescript
if (verifyResponse.success) {
  onSuccess(email)
  // Existing:
  // window.location.href = THANKYOU_URL
  
  // Updated — append ?verified=true if confirmed:
  const redirectUrl = verifyResponse.verified
    ? `${THANKYOU_URL}?verified=true`
    : THANKYOU_URL
  window.location.href = redirectUrl
}
```

For Fallback paths (Meta API failed during OTP send → user redirected without OTP completion):
```typescript
// Do NOT append ?verified=true
window.location.href = THANKYOU_URL
```

---

### Step 6 — Conditional gtag firing on each thank-you page

**Files:**
- `app/thankyou-check-your-eligibility/page.tsx`
- `app/thankyou-download-brochure/page.tsx`
- `app/thankyou-signup-demo/page.tsx`

Each thank-you page fires its own EXISTING conversion (Secondary) AND its own NEW Verified Lead conversion (Primary, conditional on `?verified=true`).

**Example for `thankyou-check-your-eligibility/page.tsx`:**
```typescript
useEffect(() => {
  // 1. Always fire existing conversion (Secondary — volume signal, unchanged)
  window.gtag('event', 'conversion', {
    send_to: 'AW-783236209/[EXISTING_ELIGIBILITY_LABEL]',
  })

  // 2. Conditionally fire NEW Verified Lead conversion (Primary — quality signal)
  const params = new URLSearchParams(window.location.search)
  const isVerified = params.get('verified') === 'true'

  if (isVerified) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-783236209/[VERIFIED_LEAD_ELIGIBILITY_LABEL]',
    })
  }
}, [])
```

**Apply the same pattern to all 3 thank-you pages**, with their respective conversion labels:

| Thank-you Page | Existing Label (keep firing) | New Verified Lead Label (conditional) |
|---|---|---|
| `/lp/thankyou-check-your-eligibility/` | `[EXISTING_ELIGIBILITY_LABEL]` | `[VERIFIED_LEAD_ELIGIBILITY_LABEL]` |
| `/lp/thankyou-download-brochure/` | `[EXISTING_BROCHURE_LABEL]` | `[VERIFIED_LEAD_BROCHURE_LABEL]` |
| `/lp/thankyou-signup-demo/` | `[EXISTING_DEMO_LABEL]` | `[VERIFIED_LEAD_DEMO_LABEL]` |

**Existing labels** are already in the codebase — keep them exactly as is.
**New labels** will be provided by Dhaval after creating the 3 new conversion actions in Google Ads (Step 7).

---

### Step 7 — Manual: Create 3 "Verified Lead" Conversion Actions in Google Ads

**This step is NOT part of the code deploy — Dhaval handles this directly in Google Ads dashboard.**

**Repeat these steps 3 times — once for each CTA type:**

1. Google Ads → **Goals → Conversions → Summary**
2. Click **+ New conversion action**
3. Select **Website**
4. Conversion action category: **Submit lead form**
5. Name (one of):
   - `Verified Lead | Eligibility`
   - `Verified Lead | Brochure`
   - `Verified Lead | SignUp Demo`
6. Value: Choose "Same value" with a meaningful number (e.g., ₹500 — placeholder for quality leads, can be tuned later)
7. Count: **One**
8. Click-through conversion window: **30 days**
9. Attribution model: **Data-driven** (or Last click — Dhaval's preference)
10. Click **Create and continue**
11. Choose **"Install the tag yourself"**
12. Copy the **Conversion label** string (looks like `XXXXXXXXXXXXXXX`)
13. Provide all 3 labels to Antigravity to populate the placeholders in Step 6

**After all 3 are created and code is deployed:**

14. Mark all 3 new "Verified Lead | X" actions as **Primary** (Include in Account-default goals: Yes)
15. Mark all 3 existing "Form Submission | CTA | X" actions as **Secondary** (Include in Account-default goals: No)
16. Smart Bidding strategies will then optimize on the 3 Verified Lead actions combined

**⚠️ Recommended timing:** Wait 7 days after deploy before flipping Primary/Secondary status. This lets the new actions accumulate enough data to verify they're firing correctly. During this 7-day window:
- All 6 actions will fire normally
- Existing actions remain Primary (no Smart Bidding disruption)
- You can monitor new actions in dashboard to confirm they're tracking
- After 7 days of clean data, flip the labels

---

## 4. Verification Plan

### Pre-deploy checks (Antigravity)

- ✅ All 7 code files build without errors
- ✅ Resend domain `analytixlabs.co.in` shows verified in Resend dashboard
- ✅ Sender `admissions@analytixlabs.co.in` is permitted
- ✅ `NEXT_PUBLIC_MASTERCLASS_URL` env var added to Vercel

### Live test 1 — Brochure flow (verified path)

1. Submit Download Brochure form on `https://careersuccess.analytixlabs.co.in/lp/data-science-ai-course-delhi/` with real email + WhatsApp number
2. Complete OTP verification
3. Expected:
   - ✅ Redirected to `/lp/thankyou-download-brochure/?verified=true`
   - ✅ Brochure email arrives within ~30 seconds with: brochure download button, "Save My Spot" + "Chat on WhatsApp" CTAs in Next Steps box
   - ✅ LSQ: `mx_OTP_Status = "Verified"`, `mx_Email_Status = "Sent"`
   - ✅ Sheets: Col Q = "Verified", Col R = "Sent"
   - ✅ Vercel logs: `[sendLeadEmail] brochure sent to ...`
   - ✅ Network tab on thank-you page shows 2 conversion hits to `google.com/pagead/...`

### Live test 2 — Eligibility flow (verified path)

1. Submit Check Eligibility form
2. Complete OTP verification
3. Expected:
   - ✅ Redirected to `/lp/thankyou-check-your-eligibility/?verified=true`
   - ✅ **Confirmation** email arrives (NOT brochure email — different content, no PDF link)
   - ✅ Email has: "What happens next" bullets, "Save My Spot" + "Chat on WhatsApp" CTAs
   - ✅ LSQ + Sheets updated identically to brochure test
   - ✅ Network tab shows 2 conversion hits

### Live test 3 — Demo flow (verified path)

1. Submit Signup Demo form
2. Complete OTP verification
3. Expected:
   - ✅ Same confirmation email content as Eligibility flow
   - ✅ Network tab shows: existing `[EXISTING_DEMO_LABEL]` + new `[VERIFIED_LEAD_DEMO_LABEL]`

### Live test 4 — Email failure path

1. Submit any form with an invalid email like `notanemail@`
2. Complete OTP verification
3. Expected:
   - ✅ Redirected with `?verified=true`
   - ✅ LSQ: `mx_Email_Status = "Failed"`, Sheets Col R = "Failed"
   - ✅ Vercel logs: `[sendLeadEmail] confirmation FAILED for notanemail@ | status=4xx`
   - ✅ User experience unaffected

### Live test 5 — Fallback path (if reproducible)

1. Simulate Meta WhatsApp API failure
2. Submit form
3. Expected:
   - ✅ User redirected to thank-you WITHOUT `?verified=true`
   - ✅ Existing Secondary conversion fires
   - ✅ NEW Verified Lead Primary conversion does NOT fire
   - ✅ Email still sent (lead in CRM as `Fallback`)

### Verification 24 hours later in Google Ads dashboard

- ✅ "Verified Lead | Eligibility" shows ~ count of leads with OTP Verified for eligibility CTAs
- ✅ "Verified Lead | Brochure" shows ~ count for brochure CTAs
- ✅ "Verified Lead | SignUp Demo" shows ~ count for demo CTAs
- ✅ Existing "Form Submission | CTA | X" actions show same numbers as before deploy
- ✅ Per-CTA verification rate visible: e.g., "Brochure: 14 form submissions / 11 verified leads = 79% verification rate"

---

## 5. Files Summary

| File | Action | Purpose |
|---|---|---|
| `lib/emailTemplates.ts` | **CREATE** | HTML templates for brochure + confirmation emails (both with masterclass + WhatsApp CTAs) |
| `lib/sendLeadEmail.ts` | **CREATE** | Resend API wrapper, picks template based on typeFilter |
| `lib/updateEmailStatus.ts` | **CREATE** | Updates LSQ `mx_Email_Status` + Sheets Col R |
| `app/api/otp/verify/route.ts` | **MODIFY** | Trigger async email send + status update; return `verified: true` flag |
| `components/HeroLeadCaptureForm.tsx` | **MODIFY** | Append `?verified=true` to redirect URL on successful OTP |
| `components/LeadCaptureForm.tsx` | **MODIFY (exception to "do not touch")** | Same — minimal change to redirect URL line only |
| `app/thankyou-check-your-eligibility/page.tsx` | **MODIFY** | Conditional gtag firing for `[VERIFIED_LEAD_ELIGIBILITY_LABEL]` |
| `app/thankyou-download-brochure/page.tsx` | **MODIFY** | Conditional gtag firing for `[VERIFIED_LEAD_BROCHURE_LABEL]` |
| `app/thankyou-signup-demo/page.tsx` | **MODIFY** | Conditional gtag firing for `[VERIFIED_LEAD_DEMO_LABEL]` |

**No changes to:**
- `app/layout.tsx` (gtag base setup stays as is)
- `app/api/track-conversion/route.ts`
- Any landing page components
- Cloudflare Worker
- `app/api/otp/send/route.ts`

---

## 6. Environment Variables

```
RESEND_API_KEY                    ✅ already set
NEXT_PUBLIC_BROCHURE_URL          ✅ already set
NEXT_PUBLIC_MASTERCLASS_URL       ⏳ NEEDS TO BE ADDED (provide masterclass registration URL)
LSQ_ACCESS_KEY                    ✅ already set
LSQ_SECRET_KEY                    ✅ already set
LSQ_HOST                          ✅ already set
GOOGLE_SHEETS_PRIVATE_KEY         ✅ already set
GOOGLE_SHEETS_CLIENT_EMAIL        ✅ already set
GOOGLE_SHEETS_SPREADSHEET_ID      ✅ already set
```

**Action required:** Dhaval to add `NEXT_PUBLIC_MASTERCLASS_URL` to Vercel environment variables before deploy. This is the URL the "Save My Spot" buttons in both emails will link to. Same URL is currently used on thank-you pages — copy that value.

---

## 7. Future Enhancements (NOT part of this task)

- **Resend webhooks** for actual delivery confirmation (`email.delivered`, `email.bounced`, `email.opened`)
- **Per-city brochure URLs** if marketing wants city-specific PDFs
- **Click tracking** on email CTAs (UTM params)
- **Drip campaign** for unconverted leads (day 3, day 7 follow-ups)
- **Retry logic** for transient Resend failures
- **Admissions team CC** for high-value leads (e.g., demo requests)

---

## 8. Rollout Sequence Recommended

1. **Day 0** — Dhaval adds `NEXT_PUBLIC_MASTERCLASS_URL` env var in Vercel
2. **Day 0** — Antigravity deploys all code changes (Steps 1-6) with `[VERIFIED_LEAD_*_LABEL]` placeholders
3. **Day 0** — Dhaval creates 3 new "Verified Lead" conversion actions in Google Ads (Step 7), provides labels
4. **Day 0** — Antigravity replaces placeholders with actual labels, redeploys
5. **Day 0** — Live tests (Tests 1-5)
6. **Day 1** — Verify dashboard data flow (24 hour propagation)
7. **Day 7** — If clean data confirmed, flip Primary/Secondary status in Google Ads:
   - 3 new "Verified Lead | X" → Primary
   - 3 existing "Form Submission | CTA | X" → Secondary
8. **Day 7+** — Switch any active Smart Bidding strategy to optimize on Verified Lead actions

**Reversibility:** At any point, the Primary/Secondary status can be flipped back in Google Ads with zero code change. The new conversion actions can also be paused without affecting existing tracking.

---

*End of instructions. Antigravity: please share the diff for all 9 modified/created files before deploying. Dhaval: please confirm `NEXT_PUBLIC_MASTERCLASS_URL` value before deploy starts.*
