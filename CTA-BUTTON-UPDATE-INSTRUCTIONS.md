# CTA Button Text Update — Instructions for Claude Code
## AnalytixLabs Landing Pages
**Date:** April 2026  
**Scope:** All 5 DSAI city pages + original BLR page  
**Risk level:** Low — text-only changes, no logic or tracking changes

---

## Objective

Replace repetitive "Check Your Eligibility" CTA button labels with section-appropriate text. The same eligibility modal still opens on every click — only the visible button label changes. **No conversion tracking, form logic, or `fireConversion` calls should be modified.**

---

## Files to Edit

```
app/data-science-specialization-course-lg/page.tsx        ← Original BLR page
app/data-science-ai-course-delhi/page.tsx                 ← Delhi
app/data-science-ai-course-noida/page.tsx                 ← Noida
app/data-science-ai-course-gurgaon/page.tsx               ← Gurgaon
app/data-science-ai-course-bangalore/page.tsx              ← Bangalore
```

All 5 files get the **same** text changes. The sections are structured identically across pages.

---

## Changes — Section by Section

### 1. Hero Section — NO CHANGE

Keep as-is: **"Check Your Eligibility →"**

This is the anchor CTA. Do not modify.

---

### 2. Career Assurance / Placement Guarantee Section

**Current text:** `Check Eligibility` or `Check Your Eligibility →`  
**New text:** `See If You Qualify →`

**How to find it:** Look for the section with heading containing "Invested in Your Success" or "Get Placed. Or Get 50% Back." — the CTA button inside this block is what needs updating.

**What NOT to change:**
- `ctaSource` value stays unchanged (e.g. `dsai_grg_placement_check_eligibility`)
- `onOpenEligibility` handler stays unchanged
- `form_source` / CRM mapping stays unchanged

---

### 3. Certificate / Credential Section

**Current text:** `Check Your Eligibility →`  
**New text:** `Get Started →`

**How to find it:** Look for the section with heading containing "Employers Recognise" or "Industry Recognised Certification" — the CTA button below the certificate images.

**What NOT to change:**
- `ctaSource` value stays unchanged (e.g. `dsai_grg_certificate_check_eligibility`)
- `onOpenEligibility` handler stays unchanged

---

### 4. How to Enrol Section

**Current text:** `Check Your Eligibility →`  
**New text:** `Talk to a Learning Advisor →`

**How to find it:** This is inside the `<HowToEnrol />` component OR an inline "Getting Started" / "How to Enrol" section. The primary CTA button within this section needs updating.

**Important:** If the CTA text is passed as a prop to `<HowToEnrol />`, update the prop value. If it's hardcoded inside `components/HowToEnrol.tsx`, update it there instead — but only if all pages share the same component. Check whether the button text is:
- (a) hardcoded in `HowToEnrol.tsx` → update once in the component file
- (b) passed as a prop from each `page.tsx` → update in all 5 page files

If updating `HowToEnrol.tsx` directly, add this file to the edit list:
```
components/HowToEnrol.tsx
```

**What NOT to change:**
- `ctaSource` value stays unchanged (e.g. `dsai_grg_enrol_check_eligibility`)
- `onOpenEligibility` handler stays unchanged

---

### 5. Bottom CTA Section

**Current text:** `Check Your Eligibility →`  
**New text:** `Reserve Your Spot →`

**How to find it:** This is inside the `<BottomCTA />` component — the dark navy full-width banner near the end of the page, before the FAQ. 

**Same logic as HowToEnrol:** Check whether the button text is hardcoded in `components/BottomCTA.tsx` or passed as a prop. Update accordingly.

If updating `BottomCTA.tsx` directly, add this file to the edit list:
```
components/BottomCTA.tsx
```

**What NOT to change:**
- `ctaSource` value stays unchanged (e.g. `dsai_grg_bottom_check_eligibility`)
- `onOpenEligibility` handler stays unchanged

---

### 6. Sticky Footer Bar — NO CHANGE

Keep as-is: **"Check Eligibility"**

Do not modify the sticky footer CTA.

---

## Summary Table

| # | Section | Old Text | New Text | Change? |
|---|---------|----------|----------|---------|
| 1 | Hero | Check Your Eligibility → | Check Your Eligibility → | ❌ No |
| 2 | Career Assurance | Check Eligibility | See If You Qualify → | ✅ Yes |
| 3 | Certificate | Check Your Eligibility → | Get Started → | ✅ Yes |
| 4 | How to Enrol | Check Your Eligibility → | Talk to a Learning Advisor → | ✅ Yes |
| 5 | Bottom CTA | Check Your Eligibility → | Reserve Your Spot → | ✅ Yes |
| 6 | Sticky Footer | Check Eligibility | Check Eligibility | ❌ No |

---

## Do NOT Change (Checklist)

- [ ] `ctaSource` state values — these are conversion tracking keys, not display text
- [ ] `fireConversion()` calls or `ctaName` arguments
- [ ] `onOpenEligibility` / `onOpenDemo` / `onOpenBrochure` handler wiring
- [ ] `form_source` values sent to CRM
- [ ] Any conversion key in `CONVERSION_MAP`
- [ ] The form component (`LeadCaptureForm.tsx`) — no changes needed
- [ ] The modal component (`Modal.tsx`) — no changes needed
- [ ] The sticky mobile bar CTA text

---

## Verification After Changes

1. **Visual check:** Each of the 5 pages should show 4 distinct CTA labels (Hero stays "Check Your Eligibility", the other 4 are new text)
2. **Functional check:** Every button still opens the eligibility modal
3. **Console check:** No errors in browser console
4. **Conversion check:** Submit a test lead from each changed section on one page (e.g. Gurgaon) and verify:
   - `fireConversion` fires with the correct `ctaName` (unchanged)
   - CRM receives the correct `form_source` (unchanged)
   - The modal, form fields, and success redirect all work normally

---

## Commit Message

```
feat: diversify CTA button labels across landing page sections

Replace repetitive "Check Your Eligibility" with section-appropriate
labels (See If You Qualify, Get Started, Talk to a Learning Advisor,
Reserve Your Spot). No changes to conversion tracking, form logic,
or CRM integration. Sticky footer CTA unchanged.
```
