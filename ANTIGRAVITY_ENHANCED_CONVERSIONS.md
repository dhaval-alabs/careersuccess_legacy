# Enhanced Conversions — Hashed Email Implementation

**Owner:** Antigravity
**Date:** March 2026
**Purpose:** Send hashed user email alongside conversion events to enable Enhanced Conversions in Google Ads. Improves Smart Bidding accuracy and cross-device attribution.

---

## Overview

Two files need updating:

1. `app/data-science-specialization-course-lg/page.tsx` — pass `email` to `fireConversion()`
2. `app/api/track-conversion/route.ts` — hash the email and include it in the Google Ads API payload

---

## File 1 — `app/data-science-specialization-course-lg/page.tsx`

### Change 1 — Update `fireConversion` function signature

**Find:**
```typescript
async function fireConversion(ctaName: string) {
  const gclid = gclidRef.current || sessionStorage.getItem('gclid')
  if (!gclid) return
  try {
    await fetch('https://lp-vercel.analytixlabs.co.in/api/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ctaName, gclid }),
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

---

### Change 2 — Pass email from all modals

The email is available inside `LeadCaptureForm` after a successful submission. We need to pass it up via the `onSuccess` callback.

**Eligibility Modal — find:**
```tsx
onSuccess={() => fireConversion(ctaSource)}
```
This appears in the eligibility modal's `LeadCaptureForm`. The `onSuccess` callback needs to receive the email.

**Replace with:**
```tsx
onSuccess={(email) => fireConversion(ctaSource, email)}
```

---

**Brochure Modal — find:**
```tsx
onSuccess={() => fireConversion(ctaSource)}
```

**Replace with:**
```tsx
onSuccess={(email) => fireConversion(ctaSource, email)}
```

---

**Demo Modal — find:**
```tsx
onSuccess={() => fireConversion('lp_pricing_signup_demo')}
```

**Replace with:**
```tsx
onSuccess={(email) => fireConversion('lp_pricing_signup_demo', email)}
```

---

**Hero inline form — find:**
```tsx
onSuccess={() => fireConversion('lp_blr_download_brochure')}
```

**Replace with:**
```tsx
onSuccess={(email) => fireConversion('lp_blr_download_brochure', email)}
```

---

## File 2 — `app/components/forms/LeadCaptureForm.tsx`

### Change 1 — Update `onSuccess` prop type

**Find:**
```typescript
interface LeadCaptureFormProps {
  sourceName?:   string;
  buttonText?:   string;
  title?:        string;
  typeFilter?:   string;
  thankYouPath?: string;
  onSuccess?:    () => void;
}
```

**Replace with:**
```typescript
interface LeadCaptureFormProps {
  sourceName?:   string;
  buttonText?:   string;
  title?:        string;
  typeFilter?:   string;
  thankYouPath?: string;
  onSuccess?:    (email: string) => void;
}
```

---

### Change 2 — Pass email to `onSuccess` callback

**Find:**
```typescript
if (result.success) {
  onSuccess?.()
  if (thankYouPath) {
```

**Replace with:**
```typescript
if (result.success) {
  onSuccess?.(data.email)
  if (thankYouPath) {
```

---

## File 3 — `app/api/track-conversion/route.ts`

### Change 1 — Accept email in request body

**Find:**
```typescript
const { ctaName, gclid } = await req.json()

if (!ctaName || !gclid) {
  return NextResponse.json(
    { error: 'Missing ctaName or gclid' },
    { status: 400 }
  )
}
```

**Replace with:**
```typescript
const { ctaName, gclid, email } = await req.json()

if (!ctaName || !gclid) {
  return NextResponse.json(
    { error: 'Missing ctaName or gclid' },
    { status: 400 }
  )
}
```

---

### Change 2 — Add crypto import at the top of the file

**Find:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
```

**Replace with:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
```

---

### Change 3 — Add hashed email to conversion payload

**Find:**
```typescript
const payload = {
  conversions: [
    {
      gclid,
      conversion_action: `customers/${CONVERSION_ID}/conversionActions/${conversionActionId}`,
      conversion_date_time: new Date()
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '+00:00'),
      conversion_value: 1.0,
      currency_code: 'INR',
    },
  ],
  partial_failure: true,
}
```

**Replace with:**
```typescript
const hashedEmail = email
  ? crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex')
  : undefined

const conversion: Record<string, any> = {
  gclid,
  conversion_action: `customers/${CONVERSION_ID}/conversionActions/${conversionActionId}`,
  conversion_date_time: new Date()
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '+00:00'),
  conversion_value: 1.0,
  currency_code: 'INR',
}

if (hashedEmail) {
  conversion.user_identifiers = [{
    hashed_email: hashedEmail
  }]
}

const payload = {
  conversions: [conversion],
  partial_failure: true,
}
```

---

## Commit and Push

```bash
git add app/data-science-specialization-course-lg/page.tsx
git add app/components/forms/LeadCaptureForm.tsx
git add app/api/track-conversion/route.ts
git commit -m "feat: add enhanced conversions with hashed email for improved Smart Bidding"
git push
```

---

## How It Works After This Change

```
User submits form
        ↓
LeadCaptureForm calls onSuccess(email)
        ↓
fireConversion(ctaName, email) fires
        ↓
POST /api/track-conversion with { ctaName, gclid, email }
        ↓
route.ts hashes email with SHA-256
        ↓
Google Ads API receives conversion + hashed_email
        ↓
Google matches to signed-in Google account
        ↓
Enhanced Conversions diagnostic goes green ✅
Smart Bidding gets cross-device signal ✅
```

---

## What Changes in Google Ads

- "Enhanced conversions has no recent data" warning disappears
- "Needs attention" status resolves for each conversion action
- Smart Bidding improves cross-device and view-through attribution
- No change to conversion count or CPA reporting

---

## Checklist

- [ ] `fireConversion` updated to accept optional `email` parameter in `page.tsx`
- [ ] All 4 `onSuccess` callbacks updated to pass `email` in `page.tsx`
- [ ] `onSuccess` prop type updated to `(email: string) => void` in `LeadCaptureForm.tsx`
- [ ] `onSuccess?.(data.email)` called in success handler in `LeadCaptureForm.tsx`
- [ ] `email` added to destructured request body in `route.ts`
- [ ] `crypto` imported in `route.ts`
- [ ] Hashed email added to conversion payload in `route.ts`
- [ ] All 3 files committed to correct paths
- [ ] Pushed to GitHub and Vercel deployment confirmed
- [ ] Test: submit a form from the landing page and check Google Ads diagnostics — "Enhanced conversions" warning should clear within 24 hours
