# Conversion Tracking — Full Code Update

**Owner:** Antigravity
**Date:** March 2026
**Dependency:** Wait for Dhaval to share the 12 ctId values before starting Step 1

---

## Context

All conversion actions have been recreated in Google Ads as **Import → Other data sources → Track conversions from clicks** type (required for server-side Conversions API). The code needs to be updated to reflect all 12 actions.

---

## Step 1 — Update `app/api/track-conversion/route.ts`

**Wait for Dhaval to provide all 12 ctId values before doing this step.**

Replace the entire `CONVERSION_MAP` with all 12 entries:

```typescript
const CONVERSION_MAP: Record<string, string> = {
  // Core actions
  lp_blr_submit_lead_primary:        'CTID_1',
  lp_blr_book_demo:                  'CTID_2',
  lp_blr_download_brochure:          'CTID_3',

  // Per-CTA BLR actions
  lp_hero_check_eligibility:         'CTID_4',
  lp_hero_download_brochure:         'CTID_5',
  lp_placement_check_eligibility:    'CTID_6',
  lp_curriculum_download_brochure:   'CTID_7',
  lp_certificate_check_eligibility:  'CTID_8',
  lp_pricing_signup_demo:            'CTID_9',
  lp_enrol_check_eligibility:        'CTID_10',
  lp_bottom_check_eligibility:       'CTID_11',
  lp_sticky_check_eligibility:       'CTID_12',
}
```

Replace `CTID_1` through `CTID_12` with the actual ctId values from Dhaval's table.

---

## Step 2 — Update `app/data-science-specialization-course-lg/page.tsx`

### 2.1 Add `ctaSource` state

Find the existing state declarations:
```typescript
const [mobileOpen, setMobileOpen] = useState(false);
```

Add directly below:
```typescript
const [ctaSource, setCtaSource] = useState<string>('')
```

---

### 2.2 Update Hero "Check Your Eligibility" button

Find (first button in hero section):
```tsx
onClick={() => setIsEligibilityOpen(true)}
```
*(Button text: "Check Your Eligibility →")*

Replace with:
```tsx
onClick={() => { setCtaSource('lp_hero_check_eligibility'); setIsEligibilityOpen(true) }}
```

---

### 2.3 Update Hero inline LeadCaptureForm

Find inside `id="enroll"` div:
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

Replace with:
```tsx
<LeadCaptureForm 
  title="Get Free Career Counselling" 
  sourceName="PPC_BLR_Hero_DownloadBrochure"
  typeFilter="PPC_downloadBrochure" 
  buttonText="Download Brochure"
  thankYouPath="/thankyou-download-brochure"
  onSuccess={() => fireConversion('lp_blr_download_brochure')}
/>
```

> Note: Hero inline form fires `lp_blr_download_brochure` (the core download brochure action) since it is the primary hero form, not a section-specific CTA.

---

### 2.4 Update Career Assurance "Check Eligibility" button

Find (button inside the green placement card with arrow icon):
```tsx
onClick={() => setIsEligibilityOpen(true)}
```
*(Button text: "Check Eligibility")*

Replace with:
```tsx
onClick={() => { setCtaSource('lp_placement_check_eligibility'); setIsEligibilityOpen(true) }}
```

---

### 2.5 Update Curriculum "Download Brochure" button

Find (button next to curriculum heading):
```tsx
onClick={() => setIsBrochureOpen(true)}
```
*(Button text: "Download Brochure →")*

Replace with:
```tsx
onClick={() => { setCtaSource('lp_curriculum_download_brochure'); setIsBrochureOpen(true) }}
```

---

### 2.6 Update Certifications "Check Your Eligibility" button

Find (button in certifications/credential section):
```tsx
onClick={() => setIsEligibilityOpen(true)}
```
*(Button text: "Check Your Eligibility →")*

Replace with:
```tsx
onClick={() => { setCtaSource('lp_certificate_check_eligibility'); setIsEligibilityOpen(true) }}
```

---

### 2.7 Update LearningModes callback

Find:
```tsx
<LearningModes onOpenDemo={() => setIsDemoOpen(true)} />
```

Replace with:
```tsx
<LearningModes onOpenDemo={() => { setCtaSource('lp_pricing_signup_demo'); setIsDemoOpen(true) }} />
```

---

### 2.8 Update HowToEnrol callback

Find:
```tsx
<HowToEnrol onOpenEligibility={() => setIsEligibilityOpen(true)} />
```

Replace with:
```tsx
<HowToEnrol onOpenEligibility={(source) => { setCtaSource(source); setIsEligibilityOpen(true) }} />
```

---

### 2.9 Update BottomCTA callback

Find:
```tsx
<BottomCTA onOpenEligibility={() => setIsEligibilityOpen(true)} />
```

Replace with:
```tsx
<BottomCTA onOpenEligibility={(source) => { setCtaSource(source); setIsEligibilityOpen(true) }} />
```

---

### 2.10 Update Sticky Footer "Check Eligibility" button

Find (animated sticky footer button):
```tsx
onClick={() => setIsEligibilityOpen(true)}
```
*(Inside the fixed bottom bar)*

Replace with:
```tsx
onClick={() => { setCtaSource('lp_sticky_check_eligibility'); setIsEligibilityOpen(true) }}
```

---

### 2.11 Update all 3 Modals

**Eligibility Modal — find:**
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

**Replace with:**
```tsx
<Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
  <LeadCaptureForm 
    title="Check Your Eligibility" 
    sourceName={`PPC_BLR_${ctaSource}`}
    typeFilter="PPC_CheckEligibility" 
    buttonText="Check Eligibility →"
    thankYouPath="/thankyou-check-your-eligibility"
    onSuccess={() => fireConversion(ctaSource)}
  />
</Modal>
```

---

**Brochure Modal — find:**
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

**Replace with:**
```tsx
<Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
  <LeadCaptureForm 
    title="Download Brochure" 
    sourceName={`PPC_BLR_${ctaSource}`}
    typeFilter="PPC_downloadBrochure" 
    buttonText="Download Now →"
    thankYouPath="/thankyou-download-brochure"
    onSuccess={() => fireConversion(ctaSource)}
  />
</Modal>
```

---

**Demo Modal — find:**
```tsx
<Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)}>
  <LeadCaptureForm 
    title="Signup for a Demo" 
    sourceName="PPC_signUpForDemo"
    typeFilter="signUpForDemo" 
    buttonText="Signup for a Demo"
    thankYouPath="/thankyou-signup"
    onSuccess={() => fireConversion('lp_blr_book_demo')}
  />
</Modal>
```

**Replace with:**
```tsx
<Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)}>
  <LeadCaptureForm 
    title="Signup for a Demo" 
    sourceName="PPC_BLR_Pricing_SignupDemo"
    typeFilter="signUpForDemo" 
    buttonText="Signup for a Demo"
    thankYouPath="/thankyou-signup"
    onSuccess={() => fireConversion('lp_pricing_signup_demo')}
  />
</Modal>
```

---

## Step 3 — Update `app/components/HowToEnrol.tsx`

**Find prop type:**
```typescript
export default function HowToEnrol({ onOpenEligibility }: { onOpenEligibility?: () => void }) {
```

**Replace with:**
```typescript
export default function HowToEnrol({ onOpenEligibility }: { onOpenEligibility?: (source: string) => void }) {
```

**Find the button inside the dark card at the bottom:**
```tsx
onClick={onOpenEligibility}
```

**Replace with:**
```tsx
onClick={() => onOpenEligibility?.('lp_enrol_check_eligibility')}
```

---

## Step 4 — Update `app/components/BottomCTA.tsx`

**Find prop type:**
```typescript
export default function BottomCTA({ onOpenEligibility }: { onOpenEligibility?: () => void }) {
```

**Replace with:**
```typescript
export default function BottomCTA({ onOpenEligibility }: { onOpenEligibility?: (source: string) => void }) {
```

**Find the button:**
```tsx
onClick={onOpenEligibility}
```

**Replace with:**
```tsx
onClick={() => onOpenEligibility?.('lp_bottom_check_eligibility')}
```

---

## Step 5 — Commit and Push

```bash
git add app/data-science-specialization-course-lg/page.tsx
git add app/components/HowToEnrol.tsx
git add app/components/BottomCTA.tsx
git add app/api/track-conversion/route.ts
git commit -m "feat: update all 12 conversion actions to Import type with per-CTA tracking"
git push
```

---

## Step 6 — Verify Deployment

After Vercel deploys, run this curl to confirm the first 3 core actions work:

```bash
curl -X POST https://lp-vercel.analytixlabs.co.in/api/track-conversion \
  -H "Content-Type: application/json" \
  -d '{"ctaName":"lp_blr_submit_lead_primary","gclid":"CjwKCAjwvqjOBhAGEiwAngeQndqXCtl4HUBtot7vJfIJp6pIl9ygZmZe-GSQwOlWdP4bafKTGnHjMRoCl4cQAvD_BwE"}'
```

**Expected success response:**
```json
{
  "success": true,
  "result": {
    "results": [
      { "conversionAction": "customers/4064995850/conversionActions/XXXXXXXXXX" }
    ]
  }
}
```

If you see `partialFailureError` with `INVALID_CONVERSION_ACTION_TYPE` — the Google Ads conversion action was not created as Import type. Inform Dhaval to recreate it.

---

## Checklist

**Before starting:**
- [ ] Received all 12 ctId values from Dhaval

**Code changes:**
- [ ] `CONVERSION_MAP` updated with all 12 entries in `route.ts`
- [ ] `ctaSource` state added to `page.tsx`
- [ ] Hero eligibility button updated
- [ ] Hero inline form `sourceName` and `onSuccess` updated
- [ ] Career Assurance button updated
- [ ] Curriculum brochure button updated
- [ ] Certifications button updated
- [ ] `LearningModes` callback updated
- [ ] `HowToEnrol` callback updated
- [ ] `BottomCTA` callback updated
- [ ] Sticky footer button updated
- [ ] Eligibility modal updated to use `ctaSource`
- [ ] Brochure modal updated to use `ctaSource`
- [ ] Demo modal updated with fixed source
- [ ] `HowToEnrol.tsx` prop type + button updated
- [ ] `BottomCTA.tsx` prop type + button updated
- [ ] All changes committed to correct file paths
- [ ] Pushed to GitHub
- [ ] Vercel deployment confirmed

**Testing:**
- [ ] Curl test returns `results:[{conversionAction:...}]` with no partialFailureError
- [ ] Submit form from Hero → CRM shows `PPC_BLR_lp_hero_check_eligibility`
- [ ] Submit form from Sticky → CRM shows `PPC_BLR_lp_sticky_check_eligibility`
- [ ] Submit brochure from Curriculum → CRM shows `PPC_BLR_lp_curriculum_download_brochure`
