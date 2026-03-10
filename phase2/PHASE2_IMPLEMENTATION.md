# Antigravity Implementation Instructions
## careersuccess_alabs — Phase 2 UI Upgrade
### Date: March 2026

---

## ⚠️ CRITICAL RULE — READ BEFORE TOUCHING ANY FILE

The project already has a fully wired design system. **Do not introduce new font families, raw hex values, or inline style overrides.** Every component must inherit from the existing theme.

### What already exists and must be used:

| Token | Tailwind Class | CSS Variable | Value |
|-------|---------------|-------------|-------|
| Heading font (Outfit) | `font-display` | — | via `var(--font-outfit)` |
| Body font (Inter) | `font-sans` | — | via `var(--font-inter)` |
| Brand teal | `bg-brand-teal` / `text-brand-teal` | `var(--brand-green)` | `#29E8A4` |
| Brand navy | `bg-brand-navy` / `text-brand-navy` | `var(--brand-navy)` | `#09263F` |
| Border radius md | — | `var(--border-radius-md)` | `20px` |
| Border radius pill | — | `var(--border-radius-pill)` | `99px` |
| Premium shadow | — | `var(--shadow-premium)` | `0 30px 60px rgba(1,51,104,0.12)` |

**In the delivered `.tsx` files**, you will find inline `style={{ fontFamily: "var(--font-outfit)" }}` in several places. **Before dropping any file in, do a find-and-replace in each file:**

```
FIND:    style={{ fontFamily: "var(--font-outfit)" }}
REPLACE: (remove the style prop entirely — h1/h2/h3/h4 already inherit Outfit from globals.css)

FIND:    fontFamily: "var(--font-outfit)"   (inside a style object)
REPLACE: (delete that line — headings inherit automatically)

FIND:    fontFamily: "var(--font-inter)"    (inside a style object)
REPLACE: (delete that line — body text inherits automatically)

FIND:    fontFamily: "system-ui, sans-serif"   (inside a style object)
REPLACE: (delete that line — body text inherits automatically)
```

> **Why?** `globals.css` already sets `h1, h2, h3, h4 { font-family: 'Outfit', sans-serif }` and `html, body { font-family: 'Inter', system-ui }`. The font variables are loaded via `next/font` in `layout.tsx`. Adding inline overrides breaks the inheritance chain.

---

## STEP 1 — DROP IN NEW COMPONENT FILES

Copy each delivered file to the exact destination path shown. Do not rename.

| Delivered File | Destination Path |
|----------------|-----------------|
| `LearningModes.tsx` | `components/LearningModes.tsx` ← replaces existing |
| `HowToEnrol.tsx` | `components/HowToEnrol.tsx` ← replaces existing |
| `BottomCTA.tsx` | `components/BottomCTA.tsx` ← new file |
| `StatsBar.tsx` | `components/StatsBar.tsx` ← new file |

> `CourseInfoSection.tsx` is **not in this batch** — leave it completely unchanged.

---

## STEP 2 — ADD TWO KEYFRAME ANIMATIONS TO `globals.css`

Open `app/globals.css` and paste the following **at the very end of the file**, after `.animate-marquee-logos`:

```css
/* BottomCTA — ambient blob animation */
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(20px, -20px) scale(1.06); }
}

/* StatsBar — count-up runs via JS, no CSS needed */
/* But add the stats section background utility: */
.stats-card-teal  { background-color: #29E8A4; }
.stats-card-yellow { background-color: #F5C842; }
.stats-card-blue  { background-color: #239bf5; }
.stats-card-navy  { background-color: #09263F; }
```

That is the **only** change to `globals.css`. No other additions needed.

---

## STEP 3 — WIRE COMPONENTS INTO `app/page.tsx`

### 3a. Add imports

Find the existing import block at the top of `page.tsx`:

```tsx
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";
import CourseInfoSection from "../components/CourseInfoSection";
import Navbar from "../components/Navbar";
```

Replace with:

```tsx
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";
import CourseInfoSection from "../components/CourseInfoSection";
import Navbar from "../components/Navbar";
import LearningModes from "../components/LearningModes";
import HowToEnrol from "../components/HowToEnrol";
import BottomCTA from "../components/BottomCTA";
import StatsBar from "../components/StatsBar";
```

---

### 3b. Replace the stats strip in the Hero section

In `page.tsx`, find the existing stats strip (the 4-number row below the lead form — looks like this):

```tsx
{/* Stats Strip */}
<div className="grid grid-cols-2 md:grid-cols-4 ...">
  <div>
    <p ...>20,000+</p>
    <p ...>Candidates Trained</p>
  </div>
  ...four stat blocks...
</div>
```

Replace the entire stats strip `<div>` block with:

```tsx
<StatsBar />
```

> The `StatsBar` component manages its own layout, animation, and colours internally. No wrapper div needed.

---

### 3c. Replace the inline Learning Modes section

Find the inline learning modes section in `page.tsx`. It begins with a comment or heading like `{/* Learning Modes */}` or `{/* Flexibility First */}` and contains the three pricing cards. Delete the entire section and replace with:

```tsx
<LearningModes onOpenDemo={() => setShowDemoModal(true)} />
```

> `onOpenDemo` wires the "Signup for a Demo" button to the existing demo modal. If the demo modal state variable has a different name in your `page.tsx`, match it — check the existing `useState` calls at the top of the file.

---

### 3d. Replace the inline How to Enrol section

Find the section in `page.tsx` that starts with `{/* How to Enrol */}` or `{/* Simple 3-Step */}`. It contains three step cards AND a dark "Ready to Start?" CTA block. Delete the entire section (both the steps AND the dark CTA block below it) and replace with:

```tsx
<HowToEnrol onOpenEligibility={() => setShowEligibilityModal(true)} />
```

> The `HowToEnrol` component includes its own embedded dark CTA block at the bottom. Do not add a separate dark CTA below it.

---

### 3e. Replace the bottom CTA section

Find the bottom light-bg CTA section in `page.tsx` — it contains "Ready to Join India's Most Trusted…" heading and a "Start Your Career Transformation" button. Delete it and replace with:

```tsx
<BottomCTA onOpenEligibility={() => setShowEligibilityModal(true)} />
```

> This sits just above the `<FAQ />` component and just below `<HowToEnrol />`.

---

## STEP 4 — THREE CONTENT FIXES IN `page.tsx`

These are small targeted edits to existing inline content. Do them as find-and-replace inside `page.tsx`.

---

### Fix 1 — Certification section bullet text

**Find this exact string:**
```
Zero plagiarism policy strictly enforced
```

**Replace with:**
```
Original work policy — every certificate reflects genuine capability
```

> This appears in the certification bullet list (Your Credential section). Only one occurrence.

---

### Fix 2 — Curriculum grid empty slot

The curriculum grid uses `grid-cols-3` and 11 modules, leaving a blank cell in the last row. Find the curriculum grid wrapper div — it will have a class like `grid md:grid-cols-3` or similar.

**Find:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
```
_(exact class string may vary slightly — look for the grid containing the 11 module cards)_

**Replace with:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 [&>*:last-child]:md:col-start-2 [&>*:last-child]:lg:col-start-auto"
```

Or, simpler alternative — change the last row to span wider. Find Module 10 and Module 11 card wrappers and add:

```tsx
{/* On Module 10 card div — add this class */}
className="... lg:col-start-1"

{/* On Module 11 card div — add this class */}
className="... lg:col-start-2"
```

> This is cosmetic only — it centres the final two cards in the bottom row rather than leaving an empty right slot.

---

### Fix 3 — EMI line on pricing cards

> **Note:** This fix is already included in the delivered `LearningModes.tsx` — the EMI line `0% interest EMI · Starting ₹6,387/month` appears under every price. No additional action needed if you complete Step 3c above. Listed here for completeness.

---

## STEP 5 — VERIFY NO BROKEN PROPS

Before pushing, scan for these two prop names in `page.tsx` and confirm they match the actual modal state setters in your file:

| Prop in new component | What it should call | Default name to check for |
|----------------------|---------------------|--------------------------|
| `onOpenEligibility` | Opens eligibility modal | `setShowEligibilityModal(true)` |
| `onOpenDemo` | Opens demo/brochure modal | `setShowDemoModal(true)` |

If your `page.tsx` uses different state variable names (e.g. `setEligibilityOpen`), update the JSX accordingly in the four places above.

---

## STEP 6 — BUILD CHECK

```bash
npm run build
```

The build should complete with zero errors. Common things to check if it fails:

- `StatsBar.tsx` uses `useEffect` and `useRef` — confirm `"use client"` is at the top of the file
- `BottomCTA.tsx` uses `useState` for hover — confirm `"use client"` is at the top
- All four new files have `"use client"` as their very first line

---

## STEP 7 — GIT COMMIT AND DEPLOY

```bash
git add .
git commit -m "feat: Phase 2 UI — StatsBar, LearningModes, HowToEnrol, BottomCTA redesign + 3 content fixes"
git push origin main
```

Vercel will auto-deploy on push. If it doesn't trigger automatically:

```bash
vercel --prod
```

---

## Summary of All Changes

| Area | Change | File |
|------|--------|------|
| Stats strip | Replaced with animated colour-block `StatsBar` | `components/StatsBar.tsx` (new) |
| Learning Modes | New SVG icons, light teal gradient on featured card, EMI line on all cards | `components/LearningModes.tsx` (replace) |
| How to Enrol | New SVG icons, connected timeline with colour nodes and gradient line | `components/HowToEnrol.tsx` (replace) |
| Bottom CTA | Dark navy card with floating teal glow, animated button | `components/BottomCTA.tsx` (new) |
| globals.css | Two keyframe additions only — `blobFloat` + stats utilities | `app/globals.css` (append) |
| page.tsx | 4 component swaps + 3 content fixes | `app/page.tsx` (edit) |
| CourseInfoSection | **Untouched** | — |
| All other components | **Untouched** | — |

---

## Do Not Touch

- `components/FAQ.tsx`
- `components/CourseInfoSection.tsx`
- `components/Navbar.tsx`
- `components/Modal.tsx`
- `components/LeadCaptureForm.tsx`
- `app/globals.css` (except the two keyframe additions in Step 2)
- `tailwind.config.ts`
- `app/layout.tsx`
