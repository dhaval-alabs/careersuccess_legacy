# AnalytixLabs PPC Landing Page — Project Knowledge File
## careersuccess-legacy.vercel.app
### Compiled: March 2026 | Sessions: Phase 1 (March 10) + Phase 2 (March 2026)

---

## 1. PROJECT OVERVIEW

**Client:** AnalytixLabs — Indian data science training institute
**URL:** https://careersuccess-legacy.vercel.app/
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Vercel
**External agency:** Antigravity (handles Git commits + Vercel deployments)
**Source spec:** `PPC_Full_Content_Revamp_Consolidated_v4.docx`

---

## 2. DESIGN SYSTEM

### Colour Tokens

| Name | Hex | Tailwind Class | CSS Variable |
|------|-----|---------------|-------------|
| Brand Navy | `#09263F` | `bg-brand-navy` / `text-brand-navy` | `--brand-navy` |
| Brand Teal | `#29E8A4` | `bg-brand-teal` / `text-brand-teal` | `--brand-green` |
| Blue Accent | `#239bf5` | — | — |
| Yellow Accent | `#F5C842` | — | `--brand-accent-yellow` |
| Light BG | `#f0faf8` | — | `--brand-bg-light` |

> **Note:** `--brand-green` in CSS vars = `#29E8A4` (teal). The variable name is legacy — the actual colour is teal not green.

### Typography

| Role | Font | How to use |
|------|------|-----------|
| Headings (h1–h4) | Outfit | Inherited automatically from `globals.css` — **do not add inline fontFamily** |
| Body / UI text | Inter | Inherited automatically — **do not add inline fontFamily** |
| Tailwind heading class | `font-display` | Maps to `var(--font-outfit)` via `tailwind.config.ts` |
| Tailwind body class | `font-sans` | Maps to `var(--font-inter)` via `tailwind.config.ts` |

Fonts are loaded via `next/font` in `layout.tsx` — no render-blocking imports.

### Spacing & Radius

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Border radius large | `--border-radius-lg` | `32px` |
| Border radius medium | `--border-radius-md` | `20px` |
| Border radius pill | `--border-radius-pill` | `99px` |
| Section padding | `--section-padding` | `6rem` |
| Container max | `--container-max` | `1600px` |

### Shadows

| Token | CSS Variable |
|-------|-------------|
| Premium card shadow | `--shadow-premium` → `0 30px 60px rgba(1,51,104,0.12)` |
| Green glow shadow | `--shadow-glow-green` → `0 0 30px rgba(46,204,113,0.25)` |

### Existing Global CSS Classes (`globals.css`)

```
.badge-news         — pill badge with backdrop blur
.glow-green         — text-shadow glow
.glow-border        — teal border + glow shadow
.btn-primary        — teal pill button
.btn-secondary      — navy outline pill button
.card-premium       — white card with premium shadow + hover lift
.animate-float      — 6s float animation
.animate-marquee    — 28s horizontal scroll
.animate-marquee-logos — 40s slower marquee for logos
.scrollbar-hide     — hide scrollbar
```

### `tailwind.config.ts` Extensions

```ts
colors: {
  brand: {
    teal: '#29E8A4',
    navy: '#09263F',
  }
},
fontFamily: {
  sans:    ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  display: ['var(--font-outfit)', 'Outfit', 'system-ui', 'sans-serif'],
}
```

---

## 3. FILE ARCHITECTURE

### Active Component Files (in use)

```
app/
  page.tsx                      ← Main page — all sections inlined + component imports
  layout.tsx                    ← Font loading (next/font), meta
  globals.css                   ← CSS variables, utility classes, keyframes

components/
  Navbar.tsx                    ← Sticky navbar — logo, phone, Enrol Now CTA
  Hero.tsx                      ← Dark navy hero with stats, form, badge strip
  Benefits.tsx                  ← 6-card "Why AnalytixLabs" section
  DetailedCurriculum.tsx        ← 11-module accordion grid
  LearningModes.tsx             ← 3 pricing cards with SVG icons (Phase 2)
  HowToEnrol.tsx                ← 3-step timeline with SVG icons + dark CTA (Phase 2)
  BottomCTA.tsx                 ← Dark navy finale CTA with teal glow blobs (Phase 2)
  StatsBar.tsx                  ← 4 coloured stat counter cards with count-up (Phase 2)
  CourseInfoSection.tsx         ← Course stats widget (hours, batches, fee)
  Modal.tsx                     ← Generic modal (eligibility, brochure, demo)
  LeadCaptureForm.tsx           ← Lead form with country code, city, loading state
  FAQ.tsx                       ← 12 new conversion-focused FAQs, 2-col accordion

forms/
  LeadCaptureForm.tsx           ← Path: components/forms/LeadCaptureForm.tsx
                                   Imports: createLeadAction from ../../app/actions/leads
```

### Legacy Files — Deleted

```
components/Hero.module.css
components/Benefits.module.css
components/Navbar.module.css
components/Modal.module.css
components/forms/LeadCaptureForm.module.css
components/TrustBadgeSection.tsx + .module.css
components/CourseOverview.tsx + .module.css
components/StatsAccent.tsx + .module.css
components/SuccessStories.tsx + .module.css
components/StickyContact.tsx + .module.css
```

---

## 4. PAGE SECTION ORDER (`app/page.tsx`)

```
1.  <Navbar />
2.  Hero section (inline) — logo bar, H1, badges, CTAs
3.  <StatsBar />             ← Phase 2: replaced old inline stats strip
4.  <CourseInfoSection />    ← unchanged
5.  Benefits section (inline) — 6 cards
6.  <DetailedCurriculum />  — 11 modules
7.  <LearningModes />        ← Phase 2: replaced old inline pricing cards
8.  Career Guarantee section (inline)
9.  Alumni marquee (inline)
10. Testimonials (inline)
11. Certificate section (inline)
12. <HowToEnrol />           ← Phase 2: replaced old steps + dark CTA block
13. <BottomCTA />            ← Phase 2: replaced old light-bg CTA section
14. <FAQ />
15. Footer (inline)
16. Sticky mobile bar (inline)
17. Modals: Eligibility, Brochure, Demo
```

---

## 5. CONTENT RULES (from spec)

| Rule | Detail |
|------|--------|
| Primary CTA | Always "Check Your Eligibility →" |
| Em dashes | Never — use commas, colons, or reword |
| Job Guarantee | Always "Placement with Fee-Back Guarantee" |
| Stats | 20,000+ trained / 50+ companies / 9.6/10 rating / 12+ years |
| Placement copy | "Get Placed. Or Get 50% Back." — not "No questions asked" |
| Guarantee language | "One of the few…" — not "The only…" |
| Course hours | 700+ hours, 11 modules |
| NASSCOM | "NASSCOM-FutureSkills Prime" (not just NASSCOM) |
| Cert policy bullet | "Original work policy — every certificate reflects genuine capability" |

---

## 6. PHASE 1 DELIVERABLES (March 10 Session)

### What was done
Full content + Tailwind migration from CSS modules. All sections in `page.tsx` updated with correct spec content.

### Files delivered
| File | Change |
|------|--------|
| `Hero.tsx` | Tailwind migration. Correct H1, stats, badge strip |
| `Benefits.tsx` | Tailwind migration. 6 correct cards |
| `DetailedCurriculum.tsx` | Tailwind. 6 → 11 modules, accordion |
| `LearningModes.tsx` | New file. 3 pricing cards, classroom first |
| `Modal.tsx` | Tailwind migration. Scale-in animation |
| `LeadCaptureForm.tsx` | Tailwind migration. Spinner, success state |
| `Navbar.tsx` | Tailwind migration. Wired into page.tsx |

### Phase 1 Audit Result (post-deployment)
All 14 content checklist items confirmed live. Page title, H1, stats, badges, Why section, curriculum, learning modes, placement guarantee, testimonials, certificate, FAQs, footer — all correct.

---

## 7. PHASE 2 DELIVERABLES

### 7a. StatsBar Component

**File:** `components/StatsBar.tsx`

**Design:** 4 solid-colour cards in a 2×2 (mobile) / 4-col (desktop) grid.

| Card | Background | Text |
|------|-----------|------|
| 20,000+ Candidates Trained | `#29E8A4` (teal) | `#09263F` (navy) |
| 50+ Companies Hired | `#F5C842` (yellow) | `#09263F` (navy) |
| 9.6/10 Avg Rating | `#239bf5` (blue) | `#09263F` (navy) |
| 12+ Years Excellence | `#09263F` (navy) | `#29E8A4` (teal) |

**Features:**
- Count-up animation triggered by `IntersectionObserver` (fires on scroll, not on load)
- Cubic ease-out easing (`1 - Math.pow(1 - progress, 3)`)
- Staggered entrance: each card delays by `index * 0.1s`
- Hover shimmer: `rgba(255,255,255,0.08)` overlay
- 9.6 renders as decimal (`toFixed(1)`); others use `toLocaleString("en-IN")`

**In `globals.css` — add at end:**
```css
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(20px, -20px) scale(1.06); }
}
```

---

### 7b. LearningModes Component

**File:** `components/LearningModes.tsx`

**Design:** 3 pricing cards, light background throughout (no dark card).

| Card | Background | Featured Treatment |
|------|-----------|-------------------|
| Classroom & Bootcamp | `#fff` | Plain white |
| Interactive Live Online | `linear-gradient(145deg, #cef9e8 → #eafdf5 → #f5fffb)` | Teal gradient, scale(1.03), teal border, teal shadow |
| Blended eLearning | `#fff` | Plain white |

**Key specs:**
- All text dark navy on all cards (no white-on-dark)
- Price: `2.4rem font-extrabold` navy
- EMI line: `0% interest EMI · Starting ₹6,387/month` in blue on all 3 cards
- Featured CTA button: teal bg + navy text. Others: navy bg + white text
- SVG icons (not emojis) — see Section 8

**Props:**
```tsx
<LearningModes onOpenDemo={() => setShowDemoModal(true)} />
```

---

### 7c. HowToEnrol Component

**File:** `components/HowToEnrol.tsx`

**Design:** 3-column editorial timeline with circular icon nodes above each card.

| Step | Accent Colour | Icon |
|------|-------------|------|
| 01 — Talk to Us | `#29E8A4` (teal) | Speech bubble with waveform bars |
| 02 — Reserve Your Seat | `#F5C842` (yellow) | Calendar with teal checkmark |
| 03 — Start Learning | `#239bf5` (blue) | Rocket with teal fins + yellow flame |

**Features:**
- Gradient connector line between nodes: `teal → yellow → blue`
- Watermark step numbers (`01`, `02`, `03`) ghost behind each card
- Embedded dark navy "Ready to Start?" CTA block at bottom
- Animated teal glow blobs using `blobFloat` keyframe

**Props:**
```tsx
<HowToEnrol onOpenEligibility={() => setShowEligibilityModal(true)} />
```

> ⚠️ This component includes the dark CTA block internally. Do not add a separate CTA below it.

---

### 7d. BottomCTA Component

**File:** `components/BottomCTA.tsx`

**Design:** Full-width dark navy rounded card with ambient teal glow, animated blobs, gradient underline.

**Features:**
- Two floating teal glow blobs (`blobFloat` animation, 6s and 8s, running in reverse)
- Central radial glow behind the heading
- Pulsing dot in "LIMITED SEATS PER BATCH" pill
- CTA button: teal bg, navy text, hover scale(1.04) + intensified box-shadow
- Mini stats row: 20,000+ / 9.6/10 / 12+ Yrs
- Gradient underline: `transparent → teal44 → transparent`

**Props:**
```tsx
<BottomCTA onOpenEligibility={() => setShowEligibilityModal(true)} />
```

---

## 8. SVG ICON LIBRARY

All icons are hand-drawn SVGs — no emoji, no icon library dependencies.

### Learning Modes Icons

#### ClassroomIcon
```
Concept: Classical building facade with 3 columns, small chalkboard, teal cornerstone
Strokes: navy (#09263F) | Fills: #e8f7fd, #c7e8f7 | Accent: teal (#29E8A4)
Size: 44×44 viewBox
```

#### LiveOnlineIcon
```
Concept: WiFi arcs cascading to laptop screen, teal play button, red LIVE badge
Strokes: navy | Screen fill: navy | WiFi/play: teal | Badge: #e83a3a
Size: 44×44 viewBox
```

#### BlendedIcon
```
Concept: Left half = building column, right half = dark screen with code lines
Centre merge arrows: teal (up) + yellow (down) indicating bidirectional switch
Size: 44×44 viewBox
```

### How to Enrol Icons

#### TalkIcon
```
Concept: Speech bubble containing 5 waveform bars (alternating teal/blue heights)
Teal dot in corner signals online/active status
Size: 44×44 viewBox
```

#### ReserveIcon
```
Concept: Calendar with dark navy header labelled "BATCH" in teal
Large teal checkmark circle punched into date grid
Size: 44×44 viewBox
```

#### LaunchIcon
```
Concept: Rocket with porthole window (blue), teal fins, yellow+orange flame trail
Stars scattered (teal, blue, yellow) around rocket body
Size: 44×44 viewBox
```

### Icon Usage Rule
All icons accept light treatment only (light card background). The `dark` prop variant exists in source but is unused — all cards are light in production.

---

## 9. THREE CONTENT FIXES (from audit)

| Fix | Location | Status |
|-----|----------|--------|
| **Fix 1** — Cert bullet: "Zero plagiarism policy strictly enforced" → "Original work policy — every certificate reflects genuine capability" | `page.tsx` — Certificate section bullet list | ✅ Deployed |
| **Fix 2** — Curriculum grid empty slot: 11 modules in 3-col grid leaves blank cell in last row | `page.tsx` — curriculum grid wrapper, add `lg:col-start-1` to Module 10, `lg:col-start-2` to Module 11 | ⚠️ Visual only — pending screenshot confirmation |
| **Fix 3** — EMI line on pricing cards | `LearningModes.tsx` — under each price | ✅ Included in new component |

---

## 10. CONVERSION TRACKING & CRM

**Google Ads account:** `AW-783236209`

**Thank You pages:** 4 pages with conversion tracking

**CRM:** LeadSquared integration with 17 custom fields

**Lead form fields:**
- Full Name
- Email Address
- Current City (dropdown — 15 cities)
- Mobile Number (country code + 10-digit)
- Privacy policy consent checkbox

---

## 11. DEPLOYMENT WORKFLOW

```bash
# Standard deploy
git add .
git commit -m "feat: [description]"
git push origin main
# Vercel auto-deploys on push to main

# Force deploy if auto doesn't trigger
vercel --prod
```

**Important:** The web fetcher caches pages. After deploying, wait 2–3 minutes then do a hard refresh in browser (Ctrl+Shift+R / Cmd+Shift+R) to bypass browser cache. The fetch bot may also return cached HTML — verify changes visually in browser screenshots.

---

## 12. AUDIT HISTORY

### Phase 1 Audit (post-deployment, March 10)
| Check | Result |
|-------|--------|
| Page title | ✅ |
| H1 | ✅ |
| Stats (20,000+ / 50+ / 9.6/10 / 12+) | ✅ |
| Badge strip — no "Job Guarantee" | ✅ |
| Why section heading | ✅ |
| 6 benefit cards | ✅ |
| 11 curriculum modules | ✅ |
| Learning modes with pricing | ✅ |
| Career guarantee copy | ✅ |
| Cert bullet fix | ✅ |
| FAQs — 12 new questions | ✅ |
| How to Enrol steps | ✅ |
| Bottom CTA stats | ✅ |

### Phase 2 Audit (post-deployment)
| Check | Result |
|-------|--------|
| StatsBar coloured cards | ✅ |
| LearningModes — new icons | ✅ |
| LearningModes — EMI line | ✅ |
| LearningModes — teal gradient featured card | ✅ |
| HowToEnrol — SVG icons | ✅ |
| BottomCTA — deployed | ✅ |
| Cert bullet fix | ✅ |
| Curriculum grid empty slot | ⚠️ Pending visual confirmation |

---

## 13. KNOWN BEHAVIOURS

- **StatsBar shows `0+` in page source** — this is correct. The count-up animation is client-side JS triggered by `IntersectionObserver` after React hydration. Server-rendered HTML always shows `0`.
- **Tailwind `max-w-5xl` is overridden** — `globals.css` sets `.max-w-5xl { max-width: 80rem !important }` (wider than Tailwind default of 64rem).
- **Font families must not be set inline** — `globals.css` handles `h1–h4 → Outfit` and `body → Inter` globally. Any inline `fontFamily` style prop overrides this chain.

---

## 14. FILES NOT TO TOUCH

```
components/FAQ.tsx
components/CourseInfoSection.tsx
app/layout.tsx
tailwind.config.ts
app/globals.css  (append-only — never edit existing rules)
```

---

## 15. QUICK REFERENCE — MODAL STATE PROPS

When wiring new components into `page.tsx`, confirm these state variable names match:

| Prop name on component | Typical state setter | Triggers |
|-----------------------|---------------------|---------|
| `onOpenEligibility` | `setShowEligibilityModal(true)` | Check Your Eligibility modal |
| `onOpenDemo` | `setShowDemoModal(true)` | Signup for a Demo / Brochure modal |
| `onOpenBrochure` | `setShowBrochureModal(true)` | Download Brochure (DetailedCurriculum) |

> Always cross-check the actual `useState` variable names in `page.tsx` — they may differ from the defaults above.
