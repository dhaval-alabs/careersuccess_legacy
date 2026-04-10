# Fix: `fireConversion` — Allow Email-Only Conversions (No GCLID Required)

**Project:** AnalytixLabs LP Vercel MCP  
**File:** `app/data-science-specialization-course-lg/page.tsx`  
**Repo:** `dhaval-alabs/careersuccess_legacy`  
**Priority:** High — Google Ads is flagging "Importing limited user-provided data"  
**Depends on:** `route.ts` update already deployed (gclid now optional in backend)

---

## Problem

The `fireConversion()` function currently exits silently when no gclid is present:

```typescript
if (!gclid) return
```

This means any user who reaches the landing page **without** a gclid (organic, direct, referral, or if gclid was lost due to redirect/session issues) will never have their conversion sent to Google — even though Google supports email-only attribution via Enhanced Conversions.

Google Ads is actively flagging this in the diagnostics panel as **"Importing limited user-provided data"**.

---

## Fix

In `page.tsx`, find the `fireConversion` function (around line 132) and replace it entirely.

**Current code:**
```typescript
  async function fireConversion(ctaName: string, email?: string) {
    const gclid = gclidRef.current || sessionStorage.getItem('gclid')
    if (!gclid) return
    try {
      await fetch('https://lp-vercel.analytixlabs.co.in/api/track-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctaName, gclid, email }),
      })
    } catch (e) {
      console.error('Conversion tracking failed:', e)
    }
  }
```

**Replace with:**
```typescript
  async function fireConversion(ctaName: string, email?: string) {
    const gclid = gclidRef.current || sessionStorage.getItem('gclid')
    // Need at least gclid or email to record a conversion
    if (!gclid && !email) return
    try {
      await fetch('https://lp-vercel.analytixlabs.co.in/api/track-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ctaName,
          gclid: gclid || undefined,
          email,
        }),
      })
    } catch (e) {
      console.error('Conversion tracking failed:', e)
    }
  }
```

---

## What Changed (3 lines)

| # | Change | Why |
|---|--------|-----|
| 1 | Guard: `if (!gclid) return` → `if (!gclid && !email) return` | Allows email-only conversions to proceed |
| 2 | Payload: `gclid` → `gclid: gclid \|\| undefined` | Sends `undefined` (omitted from JSON) instead of empty string when no gclid — prevents `UNPARSEABLE_GCLID` errors on Google's side |
| 3 | Comment updated | Documents the new logic |

---

## No Other Changes Required

- All `onSuccess` callbacks already pass `email` to `fireConversion` — no wiring changes needed
- The backend `route.ts` has already been updated to accept email-only conversions
- No new dependencies or env changes

---

## Testing

1. Open the landing page **without** a gclid in the URL (e.g. direct visit)
2. Submit a form with a valid email
3. Check Vercel function logs for `/api/track-conversion` — should see a request with `email` but no `gclid`
4. Check Google Ads conversion diagnostics after 24–48 hours — the "Importing limited user-provided data" warning should resolve

---

## File Changed

| File | Change |
|------|--------|
| `app/data-science-specialization-course-lg/page.tsx` | Replace `fireConversion` function (~line 132) with updated version above |
