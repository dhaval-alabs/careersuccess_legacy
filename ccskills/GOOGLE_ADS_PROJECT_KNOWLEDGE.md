# AnalytixLabs — Google Ads Conversion Tracking & MCP Knowledge Base

## Overview

This document covers the complete server-side Google Ads conversion tracking setup and MCP integration for AnalytixLabs. Use this as the reference for any Google Ads discrepancy investigation, debugging, or future changes.

---

## Infrastructure Stack

| Component | Details |
|---|---|
| Landing page framework | Next.js 16 |
| Hosting | Vercel (careersuccess-legacy.vercel.app) |
| Custom domain | lp-vercel.analytixlabs.co.in |
| Production URL | careersuccess.analytixlabs.co.in/lp/* |
| Routing layer | Cloudflare Worker (analytixlabs-lp-router) |
| WordPress domain | careersuccess.analytixlabs.co.in (non /lp/* paths) |
| GitHub repo | dhaval-alabs/careersuccess_legacy |

---

## Google Ads Account Details

| Field | Value |
|---|---|
| Account Customer ID | 4064995850 (406-499-5850) |
| MCC Account ID | 8910137241 (891-013-7241) |
| MCC Name | AnalytixLabs MCC |
| Google Ads Developer Token | OKYrRJ48L3KNIfuseAFQTw |
| Access Level | Basic Access (approved) |
| API Version | v23 |

---

## How Conversion Tracking Works

### End-to-End Flow

```
User clicks Google Ad
        ↓
GCLID appended to URL automatically by Google
        ↓
Next.js landing page loads
        ↓
useEffect captures GCLID from URL → stores in sessionStorage
        ↓
User scrolls and clicks a CTA button
        ↓
ctaSource state is set (identifies which section)
        ↓
Modal opens → user fills form → submits
        ↓
LeadCaptureForm calls onSuccess(email)
        ↓
Two things fire simultaneously:
  1. Lead → CRM (with form_source, UTMs, GCLID, behaviour data)
  2. POST /api/track-conversion → Google Ads Conversions API
        ↓
route.ts hashes email (SHA-256) + sends GCLID + conversion action ID
        ↓
Google Ads records conversion against keyword/ad/campaign
```

### Key Files

| File | Purpose |
|---|---|
| `app/data-science-specialization-course-lg/page.tsx` | Main landing page — GCLID capture, ctaSource state, fireConversion() |
| `app/components/forms/LeadCaptureForm.tsx` | Form component — calls onSuccess(email) after successful submit |
| `app/api/track-conversion/route.ts` | Vercel API route — hashes email, calls Google Ads Conversions API |
| `app/api/[transport]/route.ts` | MCP server — 5 tools for conversational campaign management |
| `utils/trackBehaviour.ts` | Tracks scroll depth, time on page, first field touched |

### Conversion API Endpoint

```
POST https://lp-vercel.analytixlabs.co.in/api/track-conversion

Body: {
  ctaName: string,   // must match key in CONVERSION_MAP
  gclid: string,     // from sessionStorage
  email: string      // raw email — hashed server-side before sending to Google
}
```

### Test Command

```bash
curl -X POST https://lp-vercel.analytixlabs.co.in/api/track-conversion \
  -H "Content-Type: application/json" \
  -d '{
    "ctaName": "lp_blr_submit_lead_primary",
    "gclid": "REAL_GCLID_FROM_CRM",
    "email": "test@example.com"
  }'
```

**Success response (no errors):**
```json
{
  "success": true,
  "result": {
    "results": [{
      "gclid": "...",
      "conversionAction": "customers/4064995850/conversionActions/XXXXXXXXX",
      "conversionDateTime": "...",
      "userIdentifiers": [{"hashedEmail": "..."}]
    }]
  }
}
```

---

## 12 Conversion Actions

All created as **Website (Import from clicks)** type — required for server-side Conversions API.

| # | Google Ads Conversion Name | Code Key in CONVERSION_MAP | Section on Page |
|---|---|---|---|
| 1 | Form Submission \| CTA - BLR \| Submit_Lead_Primary | `lp_blr_submit_lead_primary` | Hero inline form (fallback/generic) |
| 2 | Form Submission \| CTA - BLR \| Book_Demo | `lp_blr_book_demo` | Any demo signup modal |
| 3 | Form Submission \| CTA - BLR \| Download_Brochure | `lp_blr_download_brochure` | Any brochure download modal |
| 4 | Form Submission \| CTA - BLR \| Hero_CheckEligibility | `lp_hero_check_eligibility` | Hero section — "Check Your Eligibility →" button |
| 5 | Form Submission \| CTA - BLR \| Hero_DownloadBrochure | `lp_hero_download_brochure` | Hero section — inline "Download Brochure" form |
| 6 | Form Submission \| CTA - BLR \| Placement_CheckEligibility | `lp_placement_check_eligibility` | Career Assurance — "Get Placed or 50% Back" card |
| 7 | Form Submission \| CTA - BLR \| Curriculum_DownloadBrochure | `lp_curriculum_download_brochure` | Curriculum / 700+ Hours section |
| 8 | Form Submission \| CTA - BLR \| Certificate_CheckEligibility | `lp_certificate_check_eligibility` | Certifications & Success Stories section |
| 9 | Form Submission \| CTA - BLR \| Pricing_SignupDemo | `lp_pricing_signup_demo` | Three Ways to Learn / Pricing section |
| 10 | Form Submission \| CTA - BLR \| Enrol_CheckEligibility | `lp_enrol_check_eligibility` | Getting Started / How to Enrol section |
| 11 | Form Submission \| CTA - BLR \| Bottom_CheckEligibility | `lp_bottom_check_eligibility` | Bottom CTA — dark navy full-width banner |
| 12 | Form Submission \| CTA - BLR \| Sticky_CheckEligibility | `lp_sticky_check_eligibility` | Sticky footer — always visible after scroll |

---

## CRM Lead Source Mapping

Each CTA fires with a unique `form_source` value in the CRM:

| Conversion Action | CRM form_source | CRM typeFilter |
|---|---|---|
| Submit_Lead_Primary | PPC_BLR_lp_blr_submit_lead_primary | PPC_CheckEligibility |
| Hero_CheckEligibility | PPC_BLR_lp_hero_check_eligibility | PPC_CheckEligibility |
| Hero_DownloadBrochure | PPC_BLR_Hero_DownloadBrochure | PPC_downloadBrochure |
| Placement_CheckEligibility | PPC_BLR_lp_placement_check_eligibility | PPC_CheckEligibility |
| Curriculum_DownloadBrochure | PPC_BLR_lp_curriculum_download_brochure | PPC_downloadBrochure |
| Certificate_CheckEligibility | PPC_BLR_lp_certificate_check_eligibility | PPC_CheckEligibility |
| Pricing_SignupDemo | PPC_BLR_Pricing_SignupDemo | signUpForDemo |
| Enrol_CheckEligibility | PPC_BLR_lp_enrol_check_eligibility | PPC_CheckEligibility |
| Bottom_CheckEligibility | PPC_BLR_lp_bottom_check_eligibility | PPC_CheckEligibility |
| Sticky_CheckEligibility | PPC_BLR_lp_sticky_check_eligibility | PPC_CheckEligibility |
| Book_Demo | PPC_BLR_Pricing_SignupDemo | signUpForDemo |
| Download_Brochure | PPC_BLR_lp_blr_download_brochure | PPC_downloadBrochure |

**typeFilter groups:**
- `PPC_CheckEligibility` — eligibility intent (high intent)
- `PPC_downloadBrochure` — research/brochure intent (mid intent)
- `signUpForDemo` — demo intent (high intent)

---

## Enhanced Conversions

Hashed email (SHA-256) is sent alongside every conversion for cross-device attribution. The hashing happens server-side in `route.ts` — raw email is never sent to Google.

To verify hashed email is working:
```bash
echo -n "email@example.com" | shasum -a 256
# Compare hash with what appears in the API response userIdentifiers field
```

---

## Cloudflare Worker Routing Logic

The worker at `analytixlabs-lp-router` routes traffic as follows:

| URL Pattern | Referer | Goes to |
|---|---|---|
| `/lp/*` (except /lp/thankyou-*) | any | Vercel |
| `/lp/thankyou-*` | came from /lp/ page | Vercel |
| `/lp/thankyou-*` | came from WordPress page | WordPress |
| `/thankyou-*` | came from /lp/ page | Redirect to /lp/thankyou-* → Vercel |
| `/thankyou-*` | came from WordPress page | WordPress |
| `/_next/*` | any | Vercel |
| Everything else | any | WordPress |

**Key insight:** Thank-you page routing uses the `referer` header to distinguish Next.js vs WordPress form submissions. `window.location.href` (not `router.push`) is used in Next.js to ensure the referer header is sent.

---

## Google Ads MCP Server

### Connection Details

| Field | Value |
|---|---|
| MCP Server URL | https://careersuccess-legacy.vercel.app/api/mcp |
| Route file | app/api/[transport]/route.ts |
| Registered in | Claude.ai → Settings → Integrations → Alabs LP Vercel MCP |

### 5 Available Tools

| Tool | What it does | Example query |
|---|---|---|
| `get_campaign_stats` | All campaign performance — clicks, conversions, spend, CPA | "Show me all campaigns last 30 days" |
| `get_keyword_stats` | Keyword performance, filter by CPA threshold | "Which keywords have CPA above ₹800?" |
| `get_search_terms` | Actual search queries that triggered ads | "What did people search before clicking our BLR ads?" |
| `get_conversion_stats` | Conversions by action name — shows which CTA converted | "Which CTA section converted the most?" |
| `get_budget_pacing` | Daily budget vs actual spend, over/under flags | "Are any campaigns over budget this week?" |

**Note:** MCP tools are read-only. No mutations (pausing, bidding changes) are possible with current setup.

**Usage:** Start a fresh Claude conversation and ask naturally — no special syntax needed.

---

## Common Error Reference

| Error | Cause | Fix |
|---|---|---|
| `UNPARSEABLE_GCLID` | Fake or malformed GCLID used in test | Use a real GCLID from CRM |
| `TOO_RECENT_CONVERSION_ACTION` | Conversion action created less than 6 hours ago | Wait 6 hours and retry |
| `NO_CONVERSION_ACTION_FOUND` | API propagation delay after creating new action | Wait 30–60 mins |
| `INVALID_CONVERSION_ACTION_TYPE` | Conversion action created as Website/tag type not Import type | Recreate as Import → Other data sources → Track conversions from clicks |
| `partialFailureError` with no results | General API rejection | Check Vercel logs for specific error message |
| MCP 404 on `/api/mcp` | Wrong route path (needs `[transport]` dynamic segment) | File must be at `app/api/[transport]/route.ts` |
| "Couldn't reach MCP server" in Claude | Missing `basePath` in createMcpHandler config | Add `basePath: '/api'` as third argument |

---

## Behaviour Tracking Data Sent to CRM

Every lead includes:

| Field | Description |
|---|---|
| `form_source` | Which CTA section triggered the lead |
| `time_on_page_seconds` | How long user spent on page before submitting |
| `max_scroll_pct` | How far down the page user scrolled |
| `form_completion_seconds` | Time between first field touch and submit |
| `first_field_touched` | Which form field user started with |
| `device_type` | Mobile / Tablet / Desktop |
| `viewport_width` | Browser width in pixels |
| `referrer_url` | Where user came from (e.g. google.com) |
| `landing_page_url` | Full URL including all UTM params and GCLID |
| `submission_timestamp` | ISO timestamp of form submission |

**Note:** Scroll depth is initialised on page load (not modal open) — this ensures accurate depth is recorded before the modal opens.

---

## Adding New Conversion Actions (Future Landing Pages)

When adding a new city/page:

1. Create new conversion actions in Google Ads via script (`create-conversion-actions.js`) using `UPLOAD_CLICKS` type
2. Add new keys to `CONVERSION_MAP` in `app/api/track-conversion/route.ts`
3. Add `ctaSource` state and `fireConversion` calls to the new page component
4. Add `onSuccess` callbacks to each `LeadCaptureForm` instance
5. Update `LeadCaptureForm` `onSuccess` prop if needed

Use the naming convention: `Form Submission | CTA - {CITY} | {Section}_{ActionType}`

---

## Key Contacts

| Role | Contact |
|---|---|
| Digital Marketing / Infrastructure | Dhaval (dhaval@analytixlabs.co.in) |
| Development Agency | Antigravity |
| Google Ads Account | dhavalvadgama@gmail.com |
