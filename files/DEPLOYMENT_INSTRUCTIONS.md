# Antigravity Deployment Instructions
## Project: careersuccess_alabs (Next.js)
## Date: March 2026

---

## STEP 1 — REPLACE THESE FILES

Copy each file from this handoff into your project at the exact path shown.

| File | Destination Path in Project |
|------|-----------------------------|
| `Hero.tsx` | `components/Hero.tsx` |
| `Benefits.tsx` | `components/Benefits.tsx` |
| `DetailedCurriculum.tsx` | `components/DetailedCurriculum.tsx` |
| `LearningModes.tsx` | `components/LearningModes.tsx` ← **NEW FILE** |
| `Modal.tsx` | `components/Modal.tsx` |
| `LeadCaptureForm.tsx` | `components/forms/LeadCaptureForm.tsx` |
| `Navbar.tsx` | `components/Navbar.tsx` |

> All 7 files are pure Tailwind. No CSS module imports. Drop them in and they work.

---

## STEP 2 — EDIT `app/page.tsx`

Make these two changes only. Everything else in page.tsx is already correct.

### 2a. Add Navbar import at the top

Find this block at the top of `page.tsx`:
```tsx
import { useState } from "react";
import Image from "next/image";
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";
import CourseInfoSection from "../components/CourseInfoSection";
```

Replace with:
```tsx
import { useState } from "react";
import Image from "next/image";
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";
import CourseInfoSection from "../components/CourseInfoSection";
import Navbar from "../components/Navbar";
```

### 2b. Add `<Navbar />` inside `<main>`

Find this line inside the return:
```tsx
<main id="main-content">
```

Replace with:
```tsx
<main id="main-content">
  <Navbar />
```

---

## STEP 3 — DELETE THESE FILES

These are legacy components from a previous version. They are not imported anywhere in `page.tsx` and will never render. Safe to delete entirely.

```
components/Hero.module.css
components/Benefits.module.css
components/Navbar.module.css
components/Modal.module.css
components/forms/LeadCaptureForm.module.css
components/TrustBadgeSection.tsx
components/TrustBadgeSection.module.css
components/CourseOverview.tsx
components/CourseOverview.module.css
components/StatsAccent.tsx
components/StatsAccent.module.css
components/SuccessStories.tsx
components/SuccessStories.module.css
components/StickyContact.tsx
components/StickyContact.module.css
```

> If any `.module.css` file doesn't exist, skip it — no error.

---

## STEP 4 — VERIFY NO BROKEN IMPORTS

After the file changes, run:
```bash
npm run build
```

If it errors, check that `components/forms/LeadCaptureForm.tsx` still correctly references:
```tsx
import { createLeadAction } from '../../app/actions/leads'
```
The `../../` path is correct when the file lives at `components/forms/`.

---

## STEP 5 — PUSH TO GIT & DEPLOY

```bash
git add .
git commit -m "feat: UI redesign - Tailwind migration, 7 components replaced, Navbar added, legacy files removed"
git push origin main
```

Vercel will auto-deploy on push. If it doesn't trigger:
```bash
vercel --prod
```

---

## Summary of What Changed

| Component | What Changed |
|-----------|-------------|
| `Hero.tsx` | Tailwind (was CSS modules). Correct H1, subheading, badge strip, stats bar (20,000+ / 50+ / 9.6/10 / 12+), floating cards updated |
| `Benefits.tsx` | Tailwind (was CSS modules). All 6 cards replaced with correct revamp content. "Job Guarantee" removed |
| `DetailedCurriculum.tsx` | Tailwind (was CSS modules). Expanded from 6 → 11 modules. Accordion expand/collapse per card |
| `LearningModes.tsx` | **Brand new file.** Classroom card first. Pricing on all 3 cards. Featured centre card (Live Online). EMI line. Footer note |
| `Modal.tsx` | Tailwind (was CSS modules). Scale-in animation. Proper close button |
| `LeadCaptureForm.tsx` | Tailwind (was CSS modules). Loading spinner. Cleaner success state. Consistent with design system |
| `Navbar.tsx` | Tailwind (was CSS modules). Sticky. Phone number + Enrol CTA. Not previously wired into page |

## CSS Module Files Eliminated
`Hero.module.css`, `Benefits.module.css`, `Navbar.module.css`, `Modal.module.css`, `LeadCaptureForm.module.css` — all replaced by Tailwind utilities inline.

## Files NOT Changed (already correct in latest version)
- `app/page.tsx` — content is correct, only Navbar wiring needed (Step 2)
- `app/layout.tsx` — title and meta description already updated
- `components/FAQ.tsx` — already Tailwind, already has all 12 correct FAQs
- `components/CourseInfoSection.tsx` — already built and correct
- `app/globals.css` — no changes needed
- `tailwind.config.ts` — no changes needed
