# Hybrid Conversion Tracking Migration

**Owner:** Antigravity  
**Requester:** Dhaval (dhaval@analytixlabs.co.in)  
**Date:** April 2026  
**Priority:** High — Peak season approaching, must be stable before campaign ramp-up  

---

## Context & Why

We currently have two conversion tracking systems:

1. **Server-side (Conversions API)** — fires on form submit via `POST /api/track-conversion`, uploads to Google Ads using `UPLOAD_CLICKS` type actions (60 total). CTA-level granularity.
2. **Client-side (gtag)** — was active on thank-you pages but **currently disabled** (commented out in `ThankYouPage.tsx`) to prevent duplicate counting.

We are switching to a **hybrid model**:

- **gtag becomes the PRIMARY signal** for Google Ads dashboard + Smart Bidding (4 conversion actions, one per thank-you page / intent type)
- **Server-side stays running** for CRM attribution data only (per-CTA granularity stays in CRM via `form_source`)
- **Google Ads API upload is disabled** — the `POST /api/track-conversion` endpoint stops calling the Google Ads Conversions API

**Why:** The Google Ads dashboard currently shows incomplete data. Google support does not provide extended support for server-side tracking. gtag is battle-tested, instantly visible in Google Ads reports, and debuggable by anyone on the team.

---

## Summary of Changes

| # | File | Change |
|---|------|--------|
| 1 | `components/ThankYouPage.tsx` | Re-enable gtag conversion event with enhanced conversions |
| 2 | `app/api/track-conversion/route.ts` | Add env var check to skip Google Ads upload |
| 3 | Vercel Environment Variables | Add `DISABLE_GADS_UPLOAD=true` |

**No changes needed to:**
- Landing pages (`page.tsx` files) — `fireConversion` calls stay as-is for CRM flow
- MCP route (`app/api/[transport]/route.ts`) — reads data from Google Ads, doesn't write
- Thank-you page routes — `conversionId` props already correct

---

## Change 1 — Re-enable gtag in ThankYouPage.tsx

**File:** `components/ThankYouPage.tsx`

### 1a. Add `useEffect` back to imports

Find:
```typescript
// useEffect removed — gtag conversion disabled in favour of server-side API
import { useSearchParams } from 'next/navigation';
```

Replace with:
```typescript
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
```

### 1b. Add `conversionId` back to destructured props

Find:
```typescript
export default function ThankYouPage({ heading, subCopy, isBrochureDownload }: ThankYouProps) {
```

Replace with:
```typescript
export default function ThankYouPage({ heading, subCopy, conversionId, isBrochureDownload }: ThankYouProps) {
```

### 1c. Replace the commented-out useEffect with a clean version

Find the entire commented block (starts with `// gtag client-side conversion disabled` and ends with the closing `// });`):

```typescript
  // gtag client-side conversion disabled — server-side Google Ads Conversions API
  // (POST /api/track-conversion) fires on form submit, making this redundant and
  // causing duplicate conversion records in Google Ads.
  // useEffect(() => {
  //   if (typeof window === 'undefined' || !window.gtag) return;
  //   const firstName = name.split(' ')[0] || '';
  //   const e164Phone = phone ? `+91${phone.replace(/\D/g, '')}` : '';
  //   window.gtag('event', 'conversion', {
  //     send_to: conversionId,
  //     user_data: {
  //       email,
  //       phone_number: e164Phone,
  //       address: { first_name: firstName },
  //     },
  //   });
  // }, [conversionId, email, name, phone]);
```

Replace with:

```typescript
  // gtag client-side conversion — PRIMARY signal for Google Ads dashboard + Smart Bidding.
  // Server-side API (POST /api/track-conversion) now handles CRM attribution only.
  useEffect(() => {
    if (typeof window === 'undefined' || !conversionId) return;
    if (typeof window.gtag !== 'function') return;

    const firstName = name ? name.split(' ')[0] : '';

    window.gtag('event', 'conversion', {
      send_to: conversionId,
      ...(email && {
        user_data: {
          email,
          ...(firstName && { address: { first_name: firstName } }),
        },
      }),
    });
  }, [conversionId, email, name]);
```

### 1d. Ensure `window.gtag` TypeScript declaration exists

If not already present in the project, add to a global type file (e.g. `types/global.d.ts` or at the top of `ThankYouPage.tsx`):

```typescript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
```

If the project already has this declaration (check existing `.d.ts` files), skip this step.

---

## Change 2 — Disable Google Ads Upload in track-conversion

**File:** `app/api/track-conversion/route.ts`

Add an env var check at the top of the POST handler, **before** the Google Ads API upload call. The exact location depends on the current structure, but the logic is:

Find the section where `uploadClickConversions` (or the equivalent Google Ads API fetch call) is made. Wrap it with:

```typescript
// Skip Google Ads upload if disabled — gtag handles conversion tracking.
// Server-side endpoint still runs for logging/debugging purposes.
if (process.env.DISABLE_GADS_UPLOAD === 'true') {
  console.log('[track-conversion] Google Ads upload disabled (DISABLE_GADS_UPLOAD=true). Skipping API call.', {
    ctaName: body.ctaName,
    gclid: body.gclid ? 'present' : 'missing',
  });
  return NextResponse.json({
    success: true,
    skipped: true,
    reason: 'DISABLE_GADS_UPLOAD is set — gtag is primary conversion signal',
  });
}
```

This should be placed **after** request body parsing but **before** the Google Ads API call. The endpoint still receives the POST from `fireConversion` on the landing pages, logs it, and returns early without calling the Conversions API.

**Important:** Do NOT remove the existing Google Ads upload code. Just wrap it with the env var check so we can re-enable it by removing the env var if needed.

---

## Change 3 — Vercel Environment Variable

**Owner:** Dhaval (not Antigravity)

In Vercel Dashboard → careersuccess-legacy → Settings → Environment Variables:

| Key | Value | Environments |
|-----|-------|--------------|
| `DISABLE_GADS_UPLOAD` | `true` | Production, Preview, Development |

This must be set **before** deploying the code changes. If the code deploys first without the env var, server-side uploads will continue alongside the re-enabled gtag — causing temporary duplicate counting until the env var is added.

**Recommended deploy sequence:**
1. Dhaval adds env var to Vercel
2. Antigravity pushes code changes
3. Vercel auto-deploys with both changes active

---

## Verification

### After deploy, verify gtag is firing:

1. Open any landing page from a Google Ad click (or add `?gclid=test` manually)
2. Fill and submit a form
3. On the thank-you page, open browser DevTools → Console
4. Type: `dataLayer` and look for a `conversion` event with the correct `send_to` value
5. Or check Network tab for a request to `googleads.g.doubleclick.net` with the conversion ID

### Verify server-side upload is disabled:

1. After submitting a form, go to Vercel → Logs
2. Filter by `/api/track-conversion`
3. You should see: `[track-conversion] Google Ads upload disabled (DISABLE_GADS_UPLOAD=true). Skipping API call.`

### Verify in Google Ads (allow 3-4 hours):

1. Go to Goals → Conversions
2. All 4 Website-type actions should show recent conversions:
   - `Form Submission | CTA | Eligibility` — should already be Active ✅
   - `Form Submission | CTA | Download Brochure` — should already be Active ✅
   - `Form Submission | CTA | SignUp For Demo` — should flip to Active
   - `Form Submission | CTA | Masterclass` — should flip to Active

---

## What This Does NOT Change

- **Landing page CTA code** — `fireConversion('lp_sticky_check_eligibility')` etc. still fires on every form submit. It just returns early from the API without uploading to Google Ads.
- **CRM data** — All form submissions still go to CRM with full `form_source`, UTM params, GCLID, scroll depth, and behaviour data. Per-CTA attribution in CRM is unaffected.
- **MCP server** — All 6 tools (`get_campaign_stats`, `get_keyword_stats`, `get_search_terms`, `get_conversion_stats`, `get_budget_pacing`, `lookup_gclid`) continue working. They read from Google Ads reports which will now show gtag-based conversions.
- **gtag base snippet** — Already loads globally via `layout.tsx` (`AW-783236209`). No changes needed.

---

## Rollback Plan

If gtag tracking has issues and we need to revert to server-side:

1. Remove `DISABLE_GADS_UPLOAD` env var from Vercel (or set to `false`)
2. Re-deploy (or trigger manual redeploy)
3. Server-side uploads resume immediately
4. Optionally: re-comment the gtag useEffect in ThankYouPage.tsx to prevent duplicates

No data is lost — the 60 UPLOAD_CLICKS conversion actions are paused but not deleted.

---

## Commit Message

```
fix: hybrid conversion tracking — re-enable gtag as primary, disable server-side upload

- Uncomment gtag conversion event in ThankYouPage.tsx with enhanced
  conversions (email + first name for user_data)
- Add DISABLE_GADS_UPLOAD env var check in track-conversion route to
  skip Google Ads API upload when set (endpoint still logs for debugging)
- gtag fires on thank-you pages as primary signal for Google Ads
  dashboard and Smart Bidding; server-side CRM attribution unchanged
```
