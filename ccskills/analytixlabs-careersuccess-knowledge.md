# AnalytixLabs — CareerSuccess Landing Page
## Project Knowledge File
**Site:** careersuccess-legacy.vercel.app  
**Stack:** Next.js (TypeScript) · Tailwind CSS · Vercel · Direct gtag.js · LeadSquared CRM  
**Last Updated:** March 2026

---

## 1. Project Context

The AnalytixLabs CareerSuccess landing page is a Next.js landing page promoting their Data Science course with a Placement + Fee-Back Guarantee. It is hosted on Vercel at `careersuccess-legacy.vercel.app`. Development and Git/Vercel deployments are handled by an external agency called **Antigravity**. Digital marketing, web strategy, and design direction is managed internally by AnalytixLabs.

### Brand Colours
| Token | Hex |
|---|---|
| Teal (Primary) | `#00A99D` |
| Deep Navy | `#1A2E44` |
| Light Grey (BG) | `#F5F7FA` |

### Key Page CTAs
The landing page has four distinct lead-capture CTAs:
1. **Check Your Eligibility** — hero section inline form
2. **Download Brochure** — inline form / modal
3. **Masterclass** — modal popup
4. **Sign Up for Demo** — bottom section modal

All four CTAs use a shared lead form component. The form collects: Full Name, Email Address, Mobile Number, Current City (dropdown — 15 cities), Country Code (phone prefix: +91/+1/+44/+61).

---

## 2. Google Ads Account

| Detail | Value |
|---|---|
| Account ID | `AW-783236209` |
| Tracking method | Direct `gtag.js` (not GTM) |
| Base tag location | Global `<head>` in `_app.tsx` or `layout.tsx` |

### Conversion IDs per CTA

| CTA | Thank You Page Route | `send_to` value |
|---|---|---|
| Check Your Eligibility | `/thankyou-check-your-eligibility/` | `AW-783236209/wuuECKD9hv4aEPH4vPUC` |
| Download Brochure | `/thankyou-download-brochure/` | `AW-783236209/389QCJfKlv4aEPH4vPUC` |
| Masterclass | `/thankyou-for-registration/` | `AW-783236209/8w9vCIrelv4aEPH4vPUC` |
| Sign Up for Demo | `/thankyou-signup/` | `AW-783236209/VXQtCOvzhf4aEPH4vPUC` |

---

## 3. CRM — LeadSquared

All form submissions are routed **server-side** via a Next.js API route (`/pages/api/submit-lead.ts`) to the LeadSquared Lead Capture API. Credentials are stored as Vercel environment variables — never in client-side code.

### Environment Variables (Vercel Dashboard)
| Variable | Notes |
|---|---|
| `LSQ_HOST` | e.g. `api.leadsquared.com` |
| `LSQ_ACCESS_KEY` | Provided by AnalytixLabs CRM admin |
| `LSQ_SECRET_KEY` | Provided by AnalytixLabs CRM admin |
| `NEXT_PUBLIC_ZOOM_WEBINAR_URL` | Managing the "Upcoming Webinar" registration link via Vercel |

### Standard LeadSquared Fields
| Field | Source |
|---|---|
| `FirstName` | Parsed from Full Name (split on first space) |
| `LastName` | Remainder of Full Name |
| `EmailAddress` | Form input |
| `Phone` | Form input (with country code) |
| `mx_City` | City dropdown |

### Custom LeadSquared Fields (all created by CRM admin)
| Field Name | Data Type | What it stores |
|---|---|---|
| `mx_Lead_Source_CTA` | Text | Which CTA triggered the form |
| `mx_UTM_Source` | Text | `utm_source` |
| `mx_UTM_Medium` | Text | `utm_medium` |
| `mx_UTM_Campaign` | Text | `utm_campaign` |
| `mx_UTM_Term` | Text | `utm_term` (keyword) |
| `mx_UTM_Content` | Text | `utm_content` |
| `mx_GCLID` | Text | Google Click ID |
| `mx_Time_on_Page_Sec` | Number | Seconds on page before submit |
| `mx_Max_Scroll_Pct` | Number | Max scroll % reached |
| `mx_Form_Completion_Sec` | Number | Seconds from first field touch to submit |
| `mx_First_Field_Touched` | Text | First form field interacted with |
| `mx_Device_Type` | Text | Mobile / Tablet / Desktop |
| `mx_Viewport_Width` | Number | Browser viewport width in px |
| `mx_Referrer_URL` | Text | URL of referring page |
| `mx_Landing_Page_URL` | Text | Full landing page URL incl. query string |
| `mx_Submission_Timestamp` | DateTime | ISO 8601 datetime of submission |
| `mx_Country_Code` | Text | Phone prefix (+91, +1, etc.) |

---

## 4. First-Party Data Inventory

### 4.1 Explicit Form Data (User-Submitted)
| Field | Notes |
|---|---|
| Full Name | Personalise follow-up |
| Email Address | Primary contact & deduplication key |
| Mobile Number | With country code |
| Current City | 15 cities in dropdown |
| Country Code | +91 / +1 / +44 / +61 |

### 4.2 Implicit Behavioural Data (Captured via JS, no user input needed)
| Data Point | How captured |
|---|---|
| CTA Source / Lead Source | Prop passed into form component per CTA |
| UTM Parameters (all 5) | Read from URL on page load, stored in `sessionStorage` |
| Google Click ID (`gclid`) | Read from URL on page load, stored in `sessionStorage` |
| Referrer URL | `document.referrer` at time of submission |
| Landing Page URL | `window.location.href` at time of submission |
| Time on Page | `Date.now()` delta from page load to submit |
| Max Scroll Depth | `window.scrollY` scroll listener, tracks highest % reached |
| Form Completion Time | Delta from first field `onFocus` to submit |
| First Field Interacted | Field name on first `onFocus` event |
| Device Type | Derived from `window.innerWidth` — Mobile / Tablet / Desktop |
| Viewport Width | `window.innerWidth` at submit |
| Browser / OS | `navigator.userAgent` (truncated to 200 chars) |
| Submission Timestamp | `new Date().toISOString()` |

### 4.3 UTM Storage Pattern
All UTM params and `gclid` are prefixed with `alabs_` and stored in `sessionStorage` on first page load:

```ts
// Keys stored: alabs_utm_source, alabs_utm_medium, alabs_utm_campaign,
//              alabs_utm_term, alabs_utm_content, alabs_gclid
```

Use `sessionStorage` (not `localStorage`) so data clears at session end.

---

## 5. Thank You Pages

### 5.1 URL Pattern
```
/thankyou-{slug}/?email=user@example.com&name=John+Doe&phone=9999999999
```

Email, name, and phone are appended as URL params on redirect after successful form submission. The Thank You page reads these params to display a personalised confirmation.

### 5.2 Page Layout
All four Thank You pages share one `ThankYouPage` component with variant props:
1. **Header** — AnalytixLabs logo on teal (`#00A99D`) background
2. **Confirmation block** — ✅ icon, variant heading, variant sub-copy, lead data pill (name + email)
3. **Three-box row** — responsive CSS grid (`auto-fit, minmax(200px, 1fr)`)
4. **Footer** — copyright line

### 5.3 Three Boxes (same on all 4 pages)

| Box | Content | Link |
|---|---|---|
| 🎥 Upcoming Webinar | "Join Our Upcoming Webinar" — CTA: **Save My Spot** | Managed via `NEXT_PUBLIC_ZOOM_WEBINAR_URL` (Vercel) — `_blank` |
| 📞 Call Us | "Need Help? Talk to Us." Mon–Sat 9AM–7PM — CTA: **Call +91 96677 72573** | `tel:919667772573` |
| 💬 WhatsApp | "Chat on WhatsApp" — CTA: **Chat Now** | `https://api.whatsapp.com/send?phone=919667772573&text=Hello%2C%20I%20just%20submitted%20my%20details%20on%20the%20AnalytixLabs%20website.%20Can%20you%20help%20me%3F` — `_blank` |

### 5.4 Per-Variant Headings & Sub-copy

| CTA | Heading | Sub-copy |
|---|---|---|
| Check Your Eligibility | "We've Received Your Request!" | "Our learning advisor will call you shortly to walk you through your eligibility and next steps." |
| Download Brochure | "Your Brochure is On Its Way!" | "We've sent the programme brochure to your email. Check your inbox (and spam folder, just in case)." |
| Masterclass | "You're Registered!" | "Your spot for the upcoming masterclass is confirmed. Check your email for joining details." |
| Sign Up for Demo | "Demo Seat Confirmed!" | "You've successfully registered for the demo session. Our team will send you the session details shortly." |

---

## 6. Google Ads — Enhanced Conversions

On each Thank You page, a conversion event fires via `useEffect` on mount:

```ts
window.gtag('event', 'conversion', {
  send_to: conversionId, // page-specific value
  user_data: {
    email,        // from ?email= URL param
    phone_number, // from ?phone= URL param, formatted as +91XXXXXXXXXX
    address: { first_name: firstName },
  },
});
```

`gtag` automatically SHA-256 hashes `email` and `phone_number` — no manual hashing needed. This enables Enhanced Conversions for improved cross-device attribution.

The `gclid` captured in LeadSquared (`mx_GCLID`) can also be used separately for **Offline Conversion Import** in Google Ads → Tools → Conversions — this is a marketing-team task, not a dev task.

---

## 7. Key Contacts & Accounts

| Role | Detail |
|---|---|
| Development agency | Antigravity (handles Git commits + Vercel deployments) |
| Phone (sales/support) | +91 96677 72573 |
| WhatsApp number | 919667772573 |
| Google Ads account | AW-783236209 |
| Webinar registration | Managed via `NEXT_PUBLIC_ZOOM_WEBINAR_URL` environment variable |

---

## 8. Automated Email Communications

Automated emails are handled via **Resend** (API key in Vercel).

### 8.1 Email Triggers
- **Brochure Download (`PPC_DownloadBrochure`)**: Sends brochure link + Zoom/WhatsApp CTAs.
- **Registration / Eligibility (`PPC_CheckEligibility`, `PPC_SignupDemo`)**: Sends a webinar confirmation email with Zoom registration as primary CTA and WhatsApp help.

### 8.2 Dynamic Assets
- **Logo**: Updated to transparent version: `https://www.analytixlabs.co.in/wp-content/uploads/2024/04/logo.png`.
- **Zoom Link**: Pulsed dynamically from `NEXT_PUBLIC_ZOOM_WEBINAR_URL`.

---

## 9. Files Delivered in This Project

| File | Format | Purpose |
|---|---|---|
| `analytixlabs-thankyou-spec.docx` | DOCX | Full technical spec (approved reference doc) |
| `antigravity-implementation-instructions.docx` | DOCX | Build instructions for Antigravity (first version) |
| `antigravity-implementation-instructions.md` | Markdown | Build instructions for Antigravity (final, Markdown) |
| `analytixlabs-careersuccess-knowledge.md` | Markdown | This file — project knowledge base |

---

## 9. Implementation File Summary (for Antigravity)

All tasks are covered in `antigravity-implementation-instructions.md`. Summary below:

| Task | What | Files |
|---|---|---|
| 1 | UTM + gclid capture on page load | `utils/captureUtm.ts` |
| 2 | Behavioural signals (scroll, time, device) | `utils/trackBehaviour.ts` |
| 3 | Server-side LSQ API route + updated form handler | `pages/api/submit-lead.ts`, `components/[LeadForm].tsx` |
| 4 | Shared ThankYouPage component + 4 page files | `components/ThankYouPage.tsx`, 4 × `pages/thankyou-*/index.tsx` |
| 5 | gtag TypeScript declaration + base tag verification | `types/gtag.d.ts`, `_app.tsx` / `layout.tsx` |
| 6 | Vercel env vars + LSQ custom field creation | Vercel dashboard + CRM admin action |
| 7 | File manifest | — |
| 8 | QA checklist (24 items) | — |

---

## 10. Decisions & Rationale Log

| Decision | Rationale |
|---|---|
| Direct `gtag.js`, not GTM | Already implemented this way on the site; no GTM container in use |
| Server-side LeadSquared API call | Protects access key/secret key from being exposed in browser |
| `sessionStorage` for UTMs | Survives in-page navigation; clears on session end — appropriate for a single LP |
| `alabs_` prefix on sessionStorage keys | Prevents collisions with third-party scripts |
| Single `ThankYouPage` component with props | DRY — layout changes in one place; 4 thin page files only change heading, sub-copy, conversionId |
| Email + phone + name in Thank You URL params | Required for personalised confirmation display AND for passing to Google Ads `user_data` enhanced conversions |
| All optional data confirmed for implementation | AnalytixLabs approved full data layer including behavioural signals and all UTM fields |
| No inline `fontFamily` in new components | Fonts inherited from `globals.css` — consistent with existing codebase convention |

---

*AnalytixLabs · CareerSuccess LP · Project Knowledge File · March 2026*
