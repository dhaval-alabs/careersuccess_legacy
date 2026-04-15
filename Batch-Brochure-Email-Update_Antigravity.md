# Batch Dates, Brochure & Email Update — Implementation Brief
## AnalytixLabs CareerSuccess LP
**Prepared for:** Antigravity  
**Date:** April 2026  
**Commit message (when done):** `feat: batch date env vars, brochure update, resend email on brochure download`

---

## 1. Overview

Four changes in this brief:

1. **Upcoming Batches section** — update dates, page-specific display logic, new single-location square card design
2. **Brochure PDF link** — update to new URL across all pages
3. **Resend email** — send brochure PDF link to lead's email on Download Brochure CTA
4. **Env vars** — move batch dates and brochure URL to Vercel env vars so future updates need zero code changes

---

## 2. New Environment Variables

Add all four to Vercel dashboard — all environments (Production, Preview, Development):

```
NEXT_PUBLIC_BATCH_NOIDA=26 April 2026
NEXT_PUBLIC_BATCH_GURGAON=3 May 2026
NEXT_PUBLIC_BATCH_BANGALORE=14 May 2026
NEXT_PUBLIC_BROCHURE_URL=https://f2.leadsquaredcdn.com/t/analytixlabs/content/common/documents/Nasscom_(ACDS)%20Advanced%20Certification%20in%20Data%20Science_AnalytixLabs_11042026.pdf
```

> For future batch date or brochure changes: update values in Vercel dashboard → trigger redeploy. Zero code changes needed.

---

## 3. Upcoming Batches Section

### 3.1 Batch dates

| Location | Date |
|---|---|
| Noida | 26 April 2026 |
| Gurgaon | 3 May 2026 |
| Bangalore | 14 May 2026 |

### 3.2 Which batches show on which page

| Page | Batches shown |
|---|---|
| `/data-science-specialization-course-lg` (BLR legacy) | Noida + Gurgaon |
| `/data-science-ai-course-delhi` | Noida + Gurgaon |
| `/data-science-ai-course-noida` | Noida only |
| `/data-science-ai-course-gurgaon` | Gurgaon only |
| `/data-science-ai-course-bangalore` | Bangalore only |

### 3.3 Card layout rules

**Two locations shown (Delhi, BLR legacy):** Keep existing side-by-side card layout. Update dates only.

**One location shown (Noida, Gurgaon, Bangalore pages):** Switch to a single **square card layout**:

```
┌─────────────────────┐
│                     │
│   📍  Gurgaon       │
│                     │
│   3 May 2026        │
│                     │
└─────────────────────┘
```

- Square aspect ratio (roughly 1:1)
- Map pin icon (📍 or SVG equivalent matching existing icon style) top-left or centred
- City name as title below the icon
- Date below the city name
- Same card background colours as existing design (yellow for one city, teal for another — for single cards use the yellow background from the existing design)
- Card should be narrower than full-width — max-width ~280px, centred on mobile, left-aligned on desktop within the section

### 3.4 Implementation pattern

Read batch dates from env vars. Do not hardcode dates in JSX.

```tsx
// Example usage in page component
const batchNoida = process.env.NEXT_PUBLIC_BATCH_NOIDA;
const batchGurgaon = process.env.NEXT_PUBLIC_BATCH_GURGAON;
const batchBangalore = process.env.NEXT_PUBLIC_BATCH_BANGALORE;
```

Create a shared `UpcomingBatches` component (or update the existing one) that accepts a `locations` prop:

```tsx
// Two locations
<UpcomingBatches locations={['noida', 'gurgaon']} />

// Single location
<UpcomingBatches locations={['bangalore']} />
```

The component renders the dual-card layout when `locations.length > 1` and the square single-card layout when `locations.length === 1`.

---

## 4. Brochure PDF Link Update

### 4.1 New URL
```
https://f2.leadsquaredcdn.com/t/analytixlabs/content/common/documents/Nasscom_(ACDS)%20Advanced%20Certification%20in%20Data%20Science_AnalytixLabs_11042026.pdf
```

This is stored in `NEXT_PUBLIC_BROCHURE_URL` (see Section 2).

### 4.2 Where to update

Everywhere the brochure PDF URL is currently hardcoded — replace with `process.env.NEXT_PUBLIC_BROCHURE_URL`. This includes:

- Any `<a href="...">Download Brochure</a>` links
- Any brochure URL passed as a prop to modal or form components
- The Resend email template (Section 5)

Do a codebase-wide search for the old brochure URL and replace all instances.

---

## 5. Resend Email on Download Brochure

### 5.1 What it does

When a lead submits the Download Brochure form (any page, modal or hero), after the lead is created in LSQ, send an automated email to the lead's email address containing the brochure PDF link.

### 5.2 Email content

```
Subject: Your AnalytixLabs Brochure is Here

Hi {First Name},

Thank you for your interest in AnalytixLabs.

Here is your programme brochure:
[Download Brochure] → links to NEXT_PUBLIC_BROCHURE_URL

Our learning advisor will be in touch with you shortly.

Warm regards,
Team AnalytixLabs
```

Keep the email simple — plain text or minimal HTML. No heavy design needed.

### 5.3 Implementation

**File to create or update:** `app/actions/leads.ts` (or wherever `createLeadAction` lives)

Resend is already in the tech stack. Use the existing Resend setup.

In the `createLeadAction` server action, after successful LSQ submission, check if the `typeFilter` is `PPC_downloadBrochure`. If yes, fire a Resend email:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Inside createLeadAction, after LSQ success:
if (typeFilter === 'PPC_downloadBrochure') {
  const brochureUrl = process.env.NEXT_PUBLIC_BROCHURE_URL;
  
  await resend.emails.send({
    from: 'AnalytixLabs <admissions@analytixlabs.co.in>',
    to: email,
    subject: 'Your AnalytixLabs Brochure is Here',
    html: `
      <p>Hi ${firstName},</p>
      <p>Thank you for your interest in AnalytixLabs.</p>
      <p>Here is your programme brochure:<br/>
        <a href="${brochureUrl}">Download Brochure</a>
      </p>
      <p>Our learning advisor will be in touch with you shortly.</p>
      <p>Warm regards,<br/>Team AnalytixLabs</p>
    `,
  });
}
```

> Send this email async — do not await it in the critical path. Wrap in a try/catch so email failure never blocks lead submission.

### 5.4 typeFilter values for brochure CTAs

The `typeFilter` for brochure CTAs is `PPC_downloadBrochure`. This is already set correctly in all existing LeadCaptureForm instances for brochure modals. No changes needed to the form components — the logic lives entirely in `createLeadAction`.

### 5.5 Resend sender address

Confirm with AnalytixLabs which sender domain/address to use. Options:
- If `analytixlabs.co.in` is already verified in Resend → use `admissions@analytixlabs.co.in`
- If not → use Resend's default `onboarding@resend.dev` for now and verify the domain separately

Check the Resend dashboard for verified domains before deploying.

---

## 6. Files to Modify

| File | Change |
|---|---|
| `app/data-science-specialization-course-lg/page.tsx` | Batch: Noida + Gurgaon. Use env vars. |
| `app/data-science-ai-course-delhi/page.tsx` | Batch: Noida + Gurgaon. Use env vars. |
| `app/data-science-ai-course-noida/page.tsx` | Batch: Noida only. Square card. Use env vars. |
| `app/data-science-ai-course-gurgaon/page.tsx` | Batch: Gurgaon only. Square card. Use env vars. |
| `app/data-science-ai-course-bangalore/page.tsx` | Batch: Bangalore only. Square card. Use env vars. |
| `app/actions/leads.ts` | Add Resend brochure email after LSQ success |
| `components/UpcomingBatches.tsx` (or equivalent) | Add single-location square card layout |

---

## 7. Files NOT to Touch

```
components/LeadCaptureForm.tsx
components/HeroLeadCaptureForm.tsx
components/Modal.tsx
app/api/otp/send/route.ts
app/api/otp/verify/route.ts
app/api/track-conversion/route.ts
app/globals.css
tailwind.config.ts
```

---

## 8. QA Checklist

| # | Test | Expected result |
|---|---|---|
| 1 | Delhi page — Upcoming Batches | Shows Noida (26 April) + Gurgaon (3 May), dual card layout |
| 2 | BLR legacy page — Upcoming Batches | Shows Noida (26 April) + Gurgaon (3 May), dual card layout |
| 3 | Noida page — Upcoming Batches | Shows Noida (26 April) only, square card |
| 4 | Gurgaon page — Upcoming Batches | Shows Gurgaon (3 May) only, square card |
| 5 | Bangalore page — Upcoming Batches | Shows Bangalore (14 May) only, square card |
| 6 | Change `NEXT_PUBLIC_BATCH_NOIDA` in Vercel → redeploy | Date updates on Noida, Delhi, BLR legacy pages with no code change |
| 7 | Download Brochure form submission | Lead created in LSQ with PPC_downloadBrochure typeFilter |
| 8 | Brochure email received | Email arrives at lead's address with correct brochure PDF link |
| 9 | Brochure URL in email | Matches `NEXT_PUBLIC_BROCHURE_URL` env var |
| 10 | Change `NEXT_PUBLIC_BROCHURE_URL` in Vercel → redeploy | New URL used in email and any download links |
| 11 | Check eligibility form submission | No brochure email sent (typeFilter is PPC_CheckEligibility) |
| 12 | Brochure email failure | Lead still submitted successfully, error logged silently |

---

*AnalytixLabs · CareerSuccess LP · Batch + Brochure + Email Brief · April 2026*
