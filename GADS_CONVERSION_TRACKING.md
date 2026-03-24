# Google Ads Conversion Tracking — Implementation Instructions

**Project:** AnalytixLabs LP (careersuccess-legacy.vercel.app)  
**Prepared for:** Antigravity  
**Date:** March 2026  
**Status:** API route already deployed. Frontend wiring pending.

---

## Overview

The Vercel API route `/api/track-conversion` is live at:
```
https://lp-vercel.analytixlabs.co.in/api/track-conversion
```

Two files need to be updated to complete the frontend wiring:

1. `app/lp/data-science-specialization-course-lg/page.tsx`
2. `app/components/forms/LeadCaptureForm.tsx`

> **Note:** Do not create a new Vercel project. All changes go into the existing repo connected to `careersuccess-legacy.vercel.app`.

---

## File 1 — `page.tsx`

### 1.1 Add `useRef` to the React import

**Find (line ~4):**
```typescript
import { useState, useEffect } from "react";
```

**Replace with:**
```typescript
import { useState, useEffect, useRef } from "react";
```

---

### 1.2 Add GCLID capture + `fireConversion` helper

**Find this comment block (line ~112):**
```typescript
useEffect(() => {
  const handleScroll = () => {
```

**Insert the following block ABOVE that useEffect:**
```typescript
// ─── Conversion Tracking ─────────────────────────────────────────────────────

const gclidRef = useRef<string | null>(null)

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const gclid = params.get('gclid')
  if (gclid) {
    sessionStorage.setItem('gclid', gclid)
    gclidRef.current = gclid
  } else {
    gclidRef.current = sessionStorage.getItem('gclid')
  }
}, [])

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

// ─────────────────────────────────────────────────────────────────────────────
```

---

### 1.3 Update the 4 `LeadCaptureForm` instances — add `onSuccess` prop

Add `onSuccess` to each form as shown below. All other props remain unchanged.

---

**Hero inline form** — find by `sourceName="PPC_downloadBrochure"` inside `id="enroll"` div:

```tsx
<LeadCaptureForm 
  title="Get Free Career Counselling" 
  sourceName="PPC_downloadBrochure" 
  typeFilter="PPC_downloadBrochure" 
  buttonText="Download Brochure"
  thankYouPath="/thankyou-download-brochure"
  onSuccess={() => fireConversion('lp_download_brochure')}
/>
```

---

**Eligibility modal** — find by `sourceName="PPC_CheckEligibility"`:

```tsx
<Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
  <LeadCaptureForm 
    title="Check Your Eligibility" 
    sourceName="PPC_CheckEligibility" 
    typeFilter="PPC_CheckEligibility" 
    buttonText="Check Eligibility →"
    thankYouPath="/thankyou-check-your-eligibility"
    onSuccess={() => fireConversion('lp_submit_lead_primary')}
  />
</Modal>
```

---

**Brochure modal** — find by `sourceName="PPC_downloadBrochure"` inside `isBrochureOpen` modal:

```tsx
<Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
  <LeadCaptureForm 
    title="Download Brochure" 
    sourceName="PPC_downloadBrochure" 
    typeFilter="PPC_downloadBrochure" 
    buttonText="Download Now →"
    thankYouPath="/thankyou-download-brochure"
    onSuccess={() => fireConversion('lp_download_brochure')}
  />
</Modal>
```

---

**Demo modal** — find by `sourceName="PPC_signUpForDemo"`:

```tsx
<Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)}>
  <LeadCaptureForm 
    title="Signup for a Demo" 
    sourceName="PPC_signUpForDemo" 
    typeFilter="signUpForDemo" 
    buttonText="Signup for a Demo"
    thankYouPath="/thankyou-signup"
    onSuccess={() => fireConversion('lp_book_demo')}
  />
</Modal>
```

---

## File 2 — `LeadCaptureForm.tsx`

### 2.1 Add `onSuccess` to the props interface

**Find:**
```typescript
interface LeadCaptureFormProps {
  sourceName?:   string;
  buttonText?:   string;
  title?:        string;
  typeFilter?:   string;
  thankYouPath?: string;
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
  onSuccess?:    () => void;
}
```

---

### 2.2 Add `onSuccess` to destructured props

**Find:**
```typescript
export default function LeadCaptureForm({
  sourceName  = 'Hero Section',
  buttonText  = 'Request Free Counselling →',
  title       = 'Get Free Career Counselling',
  typeFilter,
  thankYouPath = '/thankyou-check-your-eligibility',
}: LeadCaptureFormProps) {
```

**Replace with:**
```typescript
export default function LeadCaptureForm({
  sourceName  = 'Hero Section',
  buttonText  = 'Request Free Counselling →',
  title       = 'Get Free Career Counselling',
  typeFilter,
  thankYouPath = '/thankyou-check-your-eligibility',
  onSuccess,
}: LeadCaptureFormProps) {
```

---

### 2.3 Call `onSuccess` on successful form submission

**Find:**
```typescript
if (result.success) {
  if (thankYouPath) {
    const params = new URLSearchParams({
      email: data.email,
      name:  data.name,
      phone: data.mobile,
    });
    router.push(`${thankYouPath}?${params.toString()}`);
  } else {
    setFormState({ success: true, error: '' });
  }
}
```

**Replace with:**
```typescript
if (result.success) {
  onSuccess?.()
  if (thankYouPath) {
    const params = new URLSearchParams({
      email: data.email,
      name:  data.name,
      phone: data.mobile,
    });
    router.push(`${thankYouPath}?${params.toString()}`);
  } else {
    setFormState({ success: true, error: '' });
  }
}
```

---

## Conversion Action Reference

| `ctaName` passed to `fireConversion()` | Google Ads Conversion Action | Trigger |
|---|---|---|
| `lp_submit_lead_primary` | ID: 7546926404 | Eligibility form submit |
| `lp_book_demo` | ID: 7547101432 | Demo signup form submit |
| `lp_download_brochure` | ID: 7547103562 | Brochure form submit (modal + hero inline) |

---

## Important Notes

- `fireConversion` only fires if a `gclid` is present in the URL or sessionStorage. Organic/direct visits are silently skipped — no errors thrown.
- The API call is fire-and-forget (`await` is used but no UI is blocked on it). The thank-you redirect happens regardless of whether the conversion ping succeeds.
- The API route currently returns a 404 from Google Ads because the developer token is on **Explorer Access**. Basic Access approval is pending. Once approved, conversions will flow. **No code changes are needed when approval comes through** — only the `CONVERSION_ID` env variable in Vercel may need to be confirmed as `4064995850`.
- When the Cloudflare Worker is eventually removed and the domain points fully to Vercel, update the fetch URL in `fireConversion` from:
  ```
  https://lp-vercel.analytixlabs.co.in/api/track-conversion
  ```
  to:
  ```
  /api/track-conversion
  ```

---

## Checklist

- [ ] `useRef` added to React import in `page.tsx`
- [ ] GCLID capture `useEffect` added in `page.tsx`
- [ ] `fireConversion` helper added in `page.tsx`
- [ ] `onSuccess` added to all 4 `LeadCaptureForm` instances in `page.tsx`
- [ ] `onSuccess` added to `LeadCaptureFormProps` interface
- [ ] `onSuccess` added to destructured props
- [ ] `onSuccess?.()` called inside `result.success` block
- [ ] Changes pushed to GitHub and Vercel deployment confirmed
