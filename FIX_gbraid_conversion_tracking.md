# Fix: Capture and Send `gbraid` for iOS Conversion Attribution
**Repo:** `dhaval-alabs/careersuccess_legacy`
**Files to edit:** All landing page components + `app/api/track-conversion/route.ts`
**Priority:** High — iOS traffic (approx 40% of leads) is not being attributed in Google Ads

---

## Background

Google uses two click identifiers:
- `gclid` — for non-iOS traffic (Android, Desktop)
- `gbraid` — for iOS traffic (Apple's privacy restrictions)

When a user clicks a Google Ad on iOS, the landing page URL contains **both** `gbraid` and
`gclid`. Currently the code only captures and sends `gclid`. Google Ads matches conversions
using whichever identifier was used for the click — so for iOS users, the conversion sent
with only `gclid` cannot be matched and is silently discarded.

**Evidence:** Analysis of April 14 CRM leads showed 4 out of 10 leads had both `gbraid`
and `gclid` in the URL. None of those 4 showed as conversions in Google Ads. The 3 that
did convert were non-iOS clicks with `gclid` only.

---

## Changes Required

### Change 1 — Capture `gbraid` from URL in all landing page components

**Files:**
- `app/data-science-specialization-course-lg/page.tsx`
- `app/data-science-ai-course-delhi/page.tsx`
- `app/data-science-ai-course-noida/page.tsx`
- `app/data-science-ai-course-gurgaon/page.tsx`
- `app/data-science-ai-course-bangalore/page.tsx`

**Find the existing `useEffect` that captures `gclid`** — it will look like this:

```tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const gclid = params.get('gclid')
  if (gclid) {
    sessionStorage.setItem('gclid', gclid)
  }
}, [])
```

**Update it to also capture `gbraid`:**

```tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const gclid = params.get('gclid')
  if (gclid) {
    sessionStorage.setItem('gclid', gclid)
  }
  const gbraid = params.get('gbraid')
  if (gbraid) {
    sessionStorage.setItem('gbraid', gbraid)
  }
}, [])
```

---

### Change 2 — Pass `gbraid` in the `fireConversion` function

**In the same page.tsx files**, find the `fireConversion` function:

```tsx
const fireConversion = async (ctaName: string, email: string) => {
  if (!ctaName) return
  const gclid = sessionStorage.getItem('gclid') || ''
  await fetch('/api/track-conversion', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ctaName, gclid, email }),
  })
}
```

**Update it to also read and send `gbraid`:**

```tsx
const fireConversion = async (ctaName: string, email: string) => {
  if (!ctaName) return
  const gclid = sessionStorage.getItem('gclid') || ''
  const gbraid = sessionStorage.getItem('gbraid') || ''
  await fetch('/api/track-conversion', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ctaName, gclid, gbraid, email }),
  })
}
```

---

### Change 3 — Accept and send `gbraid` in `route.ts`

**File:** `app/api/track-conversion/route.ts`

**Step 3a — Add `gbraid` to the request body parsing:**

Find where the request body is destructured:

```ts
const { ctaName, gclid, email } = await req.json()
```

Update to:

```ts
const { ctaName, gclid, gbraid, email } = await req.json()
```

**Step 3b — Add `gbraid` to the conversion payload sent to Google Ads API:**

Find the conversion object being constructed. It will contain a `gclid` field:

```ts
const conversion = {
  gclid: gclid,
  conversionAction: `customers/${CUSTOMER_ID}/conversionActions/${conversionActionId}`,
  conversionDateTime: ...,
  // ...
}
```

Update it to include `gbraid` when present:

```ts
const conversion = {
  ...(gclid && { gclid }),
  ...(gbraid && { gbraid }),
  conversionAction: `customers/${CUSTOMER_ID}/conversionActions/${conversionActionId}`,
  conversionDateTime: ...,
  // ...
}
```

> **Important:** Do NOT send both `gclid` and `gbraid` in the same conversion object —
> Google Ads API only accepts one click identifier per conversion. Use this logic:

```ts
const conversion = {
  // gbraid takes priority when present (iOS traffic)
  // fall back to gclid for non-iOS traffic
  ...(gbraid ? { gbraid } : gclid ? { gclid } : {}),
  conversionAction: `customers/${CUSTOMER_ID}/conversionActions/${conversionActionId}`,
  conversionDateTime: ...,
  // ...
}
```

**Step 3c — Update validation to allow gbraid-only conversions:**

Currently the validation may require `gclid`. Update it so conversions are valid when
either `gclid` OR `gbraid` is present (or when email is present for enhanced conversions):

```ts
// Valid if any of these are present
if (!gclid && !gbraid && !email) {
  return NextResponse.json({ error: 'Missing click identifier or email' }, { status: 400 })
}
```

---

## Summary of the priority logic

```
iOS user clicks ad → URL has gbraid + gclid
  → sessionStorage stores both
  → fireConversion reads both
  → route.ts receives both
  → gbraid is used in the conversion payload (iOS attribution)
  → Google Ads matches the conversion ✅

Non-iOS user clicks ad → URL has gclid only
  → sessionStorage stores gclid
  → fireConversion reads gclid (gbraid is empty string)
  → route.ts receives gclid only
  → gclid is used in the conversion payload
  → Google Ads matches the conversion ✅
```

---

## Verification after deploy

1. On an iOS device, click a Google Ad for the Gurgaon DSAI page
2. Check the URL — confirm `gbraid=` is present
3. Submit the form
4. Check Vercel function logs for `/api/track-conversion` — confirm the request body
   contains `gbraid` and the response is `{ "success": true }`
5. Check Google Ads conversions after 24–48 hours — iOS leads should now show as
   attributed conversions

Alternatively, test with curl using a real gbraid value from a recent CRM lead:

```bash
curl -X POST https://lp-vercel.analytixlabs.co.in/api/track-conversion \
  -H "Content-Type: application/json" \
  -d '{
    "ctaName": "dsai_grg_hero_check_eligibility",
    "gbraid": "0AAAAAC6vPHE0gI6Fkp_qcvgwYjsnEgR78",
    "email": "test@example.com"
  }'
```

Expected: `{ "success": true }` with no errors.

---

## No other files need changes

- Cloudflare Worker — no changes needed
- GTM — no changes needed
- CONVERSION_MAP — no changes needed
- All 48 DSAI + 12 BLR conversion actions are already compatible with gbraid attribution
