# Scroll Depth Tracking Fix

**Project:** AnalytixLabs LP (careersuccess-legacy.vercel.app)  
**Prepared for:** Antigravity  
**Date:** March 2026  
**Priority:** Medium — affects behaviour data quality sent to CRM

---

## Problem

Scroll depth is always reported as `0%` in the CRM lead notes, even when the user scrolled halfway down the page before submitting the form.

**Root cause:** `initBehaviourTracking()` is currently called inside `LeadCaptureForm.tsx` which is rendered inside a Modal. The Modal only mounts when the user clicks a CTA button — by which point the user has already scrolled. This resets `maxScrollPct` to 0 and attaches the scroll listener too late to capture any prior scrolling. Additionally, modals often lock body scroll so no further scroll events fire after the modal opens.

**Fix:** Move `initBehaviourTracking()` to `page.tsx` so it fires on page load — before any scrolling happens.

---

## Files to Update

### 1. `app/data-science-specialization-course-lg/page.tsx`

**Add the import at the top of the file** alongside existing imports:

```typescript
import { initBehaviourTracking } from '../../utils/trackBehaviour'
```

**Add a new `useEffect` inside the component** alongside the existing `useEffect` blocks:

```typescript
useEffect(() => {
  initBehaviourTracking()
}, [])
```

> Place this near the top of the component, just after the state declarations — alongside the existing scroll tracking `useEffect`.

---

### 2. `app/components/forms/LeadCaptureForm.tsx`

**Two changes — remove `initBehaviourTracking` from this file entirely.**

**Change 1 — Update the import line:**

Find:
```typescript
import { initBehaviourTracking, recordFirstField, getBehaviourSnapshot } from '../../utils/trackBehaviour';
```

Replace with:
```typescript
import { recordFirstField, getBehaviourSnapshot } from '../../utils/trackBehaviour';
```

---

**Change 2 — Remove the `useEffect` that calls `initBehaviourTracking`:**

Find and delete this entire block:
```typescript
useEffect(() => {
  initBehaviourTracking();
}, []);
```

> After removing this, check if `useEffect` is still used elsewhere in `LeadCaptureForm.tsx`. If not, remove it from the React import too:

```typescript
// If useEffect is no longer used, change this:
import { useState, useTransition, FormEvent, useEffect } from 'react';

// To this:
import { useState, useTransition, FormEvent } from 'react';
```

---

## Commit and Push

```bash
git add app/data-science-specialization-course-lg/page.tsx
git add app/components/forms/LeadCaptureForm.tsx
git commit -m "fix: move initBehaviourTracking to page.tsx to capture scroll depth correctly"
git push
```

---

## How It Works After This Fix

```
Page loads
    ↓
initBehaviourTracking() fires immediately (maxScrollPct = 0, scroll listener attached)
    ↓
User scrolls to 50% of page
    ↓
Scroll listener updates maxScrollPct = 50
    ↓
User clicks CTA → modal opens → fills form → submits
    ↓
getBehaviourSnapshot() reads maxScrollPct = 50 ✅
```

---

## Checklist

- [ ] `initBehaviourTracking` import added to `page.tsx`
- [ ] `useEffect(() => { initBehaviourTracking() }, [])` added to `page.tsx`
- [ ] `initBehaviourTracking` removed from import in `LeadCaptureForm.tsx`
- [ ] `useEffect` block calling `initBehaviourTracking` removed from `LeadCaptureForm.tsx`
- [ ] `useEffect` removed from React import in `LeadCaptureForm.tsx` if no longer used
- [ ] Changes committed to correct file paths
- [ ] Pushed to GitHub and Vercel deployment confirmed
- [ ] Tested: submit a form after scrolling halfway — CRM notes should show `Scroll Depth: ~50%`
