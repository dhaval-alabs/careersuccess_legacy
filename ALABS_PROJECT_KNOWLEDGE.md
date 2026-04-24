# AnalytixLabs PPC Landing Page — Project Knowledge File
## careersuccess-legacy.vercel.app
### Compiled: March 2026 | Updated: April 21, 2026 (Blog Tracking implementation for colleague)

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
  page.tsx                                     ← Original DA page (not in active PPC use)
  layout.tsx                                   ← Font loading (next/font), meta
  globals.css                                  ← CSS variables, utility classes, keyframes
  data-science-specialization-course-lg/
    page.tsx                                   ← Original BLR landing page (DA+AI, lp_blr_*)
    layout.tsx                                 ← noindex meta for BLR PPC page
  data-science-ai-course-delhi/
    page.tsx                                   ← Delhi DSAI landing page (dsai_del_*)
    layout.tsx                                 ← noindex + Delhi-specific meta tags
  data-science-ai-course-noida/
    page.tsx                                   ← Noida DSAI landing page (dsai_noi_*)
    layout.tsx                                 ← noindex + Noida-specific meta tags
  data-science-ai-course-gurgaon/
    page.tsx                                   ← Gurgaon DSAI landing page (dsai_grg_*)
    layout.tsx                                 ← noindex + Gurgaon-specific meta tags
  data-science-ai-course-bangalore/
    page.tsx                                   ← Bangalore DSAI landing page (dsai_blr_*)
    layout.tsx                                 ← noindex + Bangalore-specific meta tags
  api/
    track-conversion/route.ts                  ← Server-side Google Ads Conversions API
    [transport]/route.ts                       ← Google Ads MCP server (6 tools)

components/
  Navbar.tsx                                   ← Sticky navbar — logo, phone, Enrol Now CTA
  Hero.tsx                                     ← Dark navy hero with stats, form, badge strip
  Benefits.tsx                                 ← 6-card "Why AnalytixLabs" section
  DetailedCurriculum.tsx                       ← 11-module accordion grid (original BLR page)
  CurriculumTiers.tsx                          ← 3-tier visual curriculum (DSAI city pages)
  CurriculumTiersV2.tsx                        ← 2-column 70/30 redesign (Delhi page only — pending rollout)
  LearningModes.tsx                            ← 3 pricing cards with SVG icons
  HowToEnrol.tsx                               ← 3-step timeline with SVG icons + dark CTA
  BottomCTA.tsx                                ← Dark navy finale CTA with teal glow blobs
  StatsBar.tsx                                 ← 4 coloured stat counter cards with count-up
  CourseInfoSection.tsx                        ← Course stats widget (hours, batches, fee)
  Modal.tsx                                    ← Generic modal (eligibility, brochure, demo)
  LeadCaptureForm.tsx                          ← Lead form with country code, city, loading state
  FAQ.tsx                                      ← 12 conversion-focused FAQs, 2-col accordion

forms/
  LeadCaptureForm.tsx                          ← Path: components/forms/LeadCaptureForm.tsx
                                                  Imports: createLeadAction from ../../app/actions/leads

scripts/
  create-dsai-conversion-actions.js           ← One-time Google Ads API script — provisioned 48 DSAI conversion actions
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

## 4. LANDING PAGES

### 4a. Original BLR Page (`/data-science-specialization-course-lg`)

The first PPC landing page — Data Analytics + AI course, Bangalore. Uses `lp_blr_*` conversion keys.

**Section order:**
```
1.  <Navbar />
2.  Hero section (inline) — logo bar, H1, badges, CTAs
3.  <StatsBar />
4.  <CourseInfoSection />
5.  Benefits section (inline) — 6 cards
6.  <DetailedCurriculum />   — 11 modules, accordion grid
7.  <LearningModes />
8.  Career Guarantee section (inline)
9.  Alumni marquee (inline)
10. Testimonials (inline)
11. Certificate section (inline)
12. <HowToEnrol />
13. <BottomCTA />
14. <FAQ />
15. Footer (inline)
16. Sticky mobile bar (inline)
17. Modals: Eligibility, Brochure, Demo
```

### 4b. DSAI City Pages (4 pages)

New pages for the Data Science & AI course, one per city. Exact replicas of the BLR page with city-specific overrides:

| Page | Route | Conv. prefix | CRM prefix | H1 City |
|---|---|---|---|---|
| Delhi | `/data-science-ai-course-delhi` | `dsai_del_` | `PPC_DEL` | Delhi |
| Noida | `/data-science-ai-course-noida` | `dsai_noi_` | `PPC_NOI` | Noida |
| Gurgaon | `/data-science-ai-course-gurgaon` | `dsai_grg_` | `PPC_GRG` | Gurgaon |
| Bangalore | `/data-science-ai-course-bangalore` | `dsai_blr_` | `PPC_BLR2` | Bangalore |

**City-specific overrides:**
- H1: Two-line format — "Advanced Certification in / Data Science & AI in {City}"
- Subheadline: City name included
- Classroom bullet in LearningModes: "{City} campus" phrasing
- FAQ 6 (classroom location): City-specific
- FAQ 12 (about the city): City-specific
- Conversion keys: `dsai_{city}_{section}` prefix
- `layout.tsx`: `robots: noindex` + city-specific title and meta description

**Shared (identical across all 4 city pages):**
- All section content other than city-specific items above
- Form fields, modals, sticky bar, thank-you pages
- StatsBar, Benefits, Testimonials, Certifications, etc.
- `CurriculumTiers` component (original 3-tier design)

**Section order for DSAI city pages** (same as BLR page, with `CurriculumTiers` instead of `DetailedCurriculum`):
```
1.  <Navbar />
2.  Hero (with 2-line H1)
3.  <StatsBar />
4.  <CourseInfoSection />
5.  Benefits section
6.  <CurriculumTiers />    ← 3-tier visual layout (Foundation / DS+ML / AI+Career)
7.  <LearningModes />
8.  Career Guarantee section
9.  Alumni marquee
10. Testimonials
11. Certificate section
12. <HowToEnrol />
13. <BottomCTA />
14. <FAQ />               ← City-specific FAQs 6 and 12
15. Footer
16. Sticky mobile bar
17. Modals: Eligibility, Brochure, Demo
```

---

## 5. CURRICULUM COMPONENTS

### `CurriculumTiers` (original — all DSAI city pages)

3-tier visual design with modules grouped by learning stage:

| Tier | Label | Modules | Visual treatment |
|---|---|---|---|
| Tier 1 | Foundation | Foundations, Excel & SQL, Power BI | Standard |
| Tier 2 | DS & Machine Learning | Python, Statistics & ML, Advanced Analytics | Standard |
| Tier 3 | AI & Career Readiness | Generative AI (Module 09), Agentic AI (Module 10), Capstone (Module 10b), Placement Readiness (Module 11) | Gradient background, teal border. Module 09 (Gen AI) given most visual weight. Module 11 (Placement) in yellow treatment |

### `CurriculumTiersV2` (redesign — Delhi page only, pending rollout)

2-column 70/30 split layout:

- **Left column (70%):** Tier 1 + Tier 2, each rendered in a 2×2 module grid
- **Right column (30%):** Tier 3 modules stacked vertically — Module 09 (Generative AI) prominent, Module 10 (Capstone), Module 11 (Placement Readiness) in yellow

Currently wired to the Delhi page only for visual review. Roll out to Noida, Gurgaon, and Bangalore pages once approved.

---

## 6. CONTENT RULES (from spec)

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

## 7. CONVERSION TRACKING ARCHITECTURE

### Architecture principle
Server-side Conversions API (`/api/track-conversion`) is the **sole source** of conversion data in Google Ads. Client-side `gtag` conversion events on ThankYouPages have been removed to prevent double-counting.

### fireConversion function (in page.tsx files)
- Called in `onSuccess` of each `LeadCaptureForm` instance
- Uses `keepalive: true` so the request survives page redirect to ThankYouPage
- Guards against empty `ctaName` (no-ops silently)
- `ctaName` must match a key in `CONVERSION_MAP` in `route.ts`

### OAuth token caching
`/api/track-conversion/route.ts` caches the Google OAuth access token in module-level memory with a 55-minute TTL. No round-trip to Google OAuth on every conversion request.

### CORS
The `track-conversion` endpoint has full CORS headers configured — required because the Cloudflare-routed domain (`careersuccess.analytixlabs.co.in`) makes cross-origin requests to the Vercel API.

### Click tracking (not conversions)
- Hero call link, sticky call link → `gtag('event', 'CS-Calls')`
- Sticky WhatsApp link → `gtag('event', 'CS-WhatsApp')`

---

## 8. PHASE 1 DELIVERABLES (March 10 Session)

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
All 14 content checklist items confirmed live.

---

## 9. PHASE 2 DELIVERABLES

### 9a. StatsBar Component

**Design:** 4 solid-colour cards in a 2×2 (mobile) / 4-col (desktop) grid.

| Card | Background | Text |
|------|-----------|------|
| 20,000+ Candidates Trained | `#29E8A4` (teal) | `#09263F` (navy) |
| 50+ Companies Hired | `#F5C842` (yellow) | `#09263F` (navy) |
| 9.6/10 Avg Rating | `#239bf5` (blue) | `#09263F` (navy) |
| 12+ Years Excellence | `#09263F` (navy) | `#29E8A4` (teal) |

Features: count-up animation (IntersectionObserver), staggered entrance, hover shimmer.

### 9b. LearningModes Component

3 pricing cards — all light background, all dark navy text.

| Card | Background | Featured |
|------|-----------|---------|
| Classroom & Bootcamp | `#fff` | No |
| Interactive Live Online | teal gradient | Yes — scale(1.03), teal border, teal button |
| Blended eLearning | `#fff` | No |

EMI line on all cards: `0% interest EMI · Starting ₹6,387/month` (blue text).

### 9c. HowToEnrol Component

3-column editorial timeline. Contains embedded dark navy CTA block at bottom — do not add a separate CTA below it.

### 9d. BottomCTA Component

Full-width dark navy rounded card with animated teal blobs, pulsing pill, gradient underline.

---

## 10. PHASE 3 — DSAI CITY PAGES (April 2026)

### What was done
1. **`CurriculumTiers` component** — new 3-tier visual curriculum replacing `DetailedCurriculum` for the DSAI course pages
2. **4 city landing pages** — Delhi, Noida, Gurgaon, Bangalore at their respective routes
3. **48 conversion actions provisioned** via `scripts/create-dsai-conversion-actions.js` (Google Ads API v23, `UPLOAD_CLICKS` type, `category: 'DEFAULT'`)
4. **`CONVERSION_MAP` populated** in `route.ts` with all 48 live action IDs
5. **H1 2-line fix** applied across all 4 city pages

### What was done (conversion tracking fixes, same session)
1. **Disabled duplicate gtag on ThankYouPage** — server-side API is sole source
2. **`keepalive: true`** added to `fireConversion` fetch
3. **Hero brochure key corrected** — `lp_hero_download_brochure` not `lp_blr_download_brochure`
4. **CS-Calls + CS-WhatsApp gtag click tracking** added to hero + sticky bar
5. **OAuth token cache** — module-level, 55-min TTL
6. **CORS headers** added to `track-conversion` endpoint
7. **`lookup_gclid` MCP tool** added (6th tool)
8. **`get_conversion_stats` metric fixes** — removed incompatible cost/cpa fields for API v23

### Phase 4 — `CurriculumTiersV2` (April 2026)

New 2-column 70/30 curriculum layout deployed to Delhi page only for review. Pending approval before rollout to Noida, Gurgaon, Bangalore.

---

## 11. SVG ICON LIBRARY

All icons are hand-drawn SVGs — no emoji, no icon library dependencies.

### Learning Modes Icons (44×44 viewBox)
- **ClassroomIcon:** Building facade with columns, chalkboard, teal cornerstone
- **LiveOnlineIcon:** WiFi arcs to laptop, teal play button, red LIVE badge
- **BlendedIcon:** Left = building column, right = dark screen with code lines; teal/yellow merge arrows

### How to Enrol Icons (44×44 viewBox)
- **TalkIcon:** Speech bubble with 5 waveform bars, teal dot
- **ReserveIcon:** Calendar with dark navy header, large teal checkmark
- **LaunchIcon:** Rocket with porthole, teal fins, yellow+orange flame, scattered stars

**Icon usage rule:** All icons are light-treatment only (light card backgrounds).

---

## 12. THREE CONTENT FIXES (from Phase 2 audit)

| Fix | Location | Status |
|-----|----------|--------|
| **Fix 1** — Cert bullet: "Original work policy — every certificate reflects genuine capability" | `page.tsx` — Certificate section | ✅ Deployed |
| **Fix 2** — Curriculum grid empty slot (11 modules in 3-col grid) | `page.tsx` — add `lg:col-start-1` to Module 10, `lg:col-start-2` to Module 11 | ⚠️ Pending visual confirmation |
| **Fix 3** — EMI line on pricing cards | `LearningModes.tsx` | ✅ Included |

---

## 13. CONVERSION TRACKING & CRM

**Google Ads account:** `AW-783236209` (original BLR page) / `4064995850` (server-side API account)

**Thank You pages:** 4 pages — gtag fires Enhanced Conversions on load (email + phone from URL params). Note: this is the original BLR thank-you setup. DSAI city pages use the same thank-you pages.

**CRM:** LeadSquared integration with 17+ custom fields

**Lead form fields:**
- Full Name
- Email Address
- Current City (dropdown — 15 cities)
- Mobile Number (country code + 10-digit)
- Privacy policy consent checkbox

---

## 14. DEPLOYMENT WORKFLOW

```bash
# Standard deploy
git add .
git commit -m "feat: [description]"
git push origin main
# Vercel auto-deploys on push to main
```

After deploying, wait 2–3 minutes then do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R).

---

## 15. AUDIT HISTORY

### Phase 1 Audit (March 10)
All 14 content checklist items confirmed live. ✅

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

### Phase 3 Audit (April 2026)
| Check | Result |
|-------|--------|
| 4 DSAI city pages live | ✅ |
| CurriculumTiers component | ✅ |
| H1 2-line across all DSAI pages | ✅ |
| 48 conversion actions live in CONVERSION_MAP | ✅ |
| Hero brochure key fix | ✅ |
| Duplicate conversion fix (gtag removed from ThankYouPage) | ✅ |
| keepalive + CS-Calls + CS-WhatsApp | ✅ |
| OAuth token cache | ✅ |
| CORS on track-conversion | ✅ |
| lookup_gclid MCP tool (6th tool) | ✅ |
| get_conversion_stats metric fixes | ✅ |
### Phase 4 Audit (April 2026)
| Check | Result |
|-------|--------|
| CurriculumTiersV2 on Delhi page | ✅ |
| CurriculumTiersV2 rollout to other cities | ⏳ Pending review |

### Phase 5 Audit (April 21, 2026)
| Check | Result |
|-------|--------|
| Blog Assets Kit Created (`blog-assets/`) | ✅ |
| Advanced Behaviour Tracking (Rage clicks, TOC) | ✅ |
| Blog-specific CRM submission API | ✅ |
| Simplified Blog Lead Form | ✅ |

---

## 16. KNOWN BEHAVIOURS

- **StatsBar shows `0+` in page source** — correct. Count-up is client-side JS, SSR always shows `0`.
- **Tailwind `max-w-5xl` is overridden** — `globals.css` sets it to `80rem !important` (wider than Tailwind default of 64rem).
- **Font families must not be set inline** — `globals.css` handles `h1–h4 → Outfit` and `body → Inter` globally.
- **DSAI pages are `noindex`** — each city page has its own `layout.tsx` with `robots: { index: false, follow: false }`. These pages are PPC-only and should never be indexed.
- **Cloudflare Worker unchanged** — no route configuration changes needed for new city pages; `/lp/*` wildcard covers all.

---

## 17. FILES NOT TO TOUCH

```
components/FAQ.tsx
components/CourseInfoSection.tsx
app/layout.tsx
tailwind.config.ts
app/globals.css  (append-only — never edit existing rules)
```

---

## 18. QUICK REFERENCE — MODAL STATE PROPS

| Prop name on component | Typical state setter | Triggers |
|-----------------------|---------------------|---------|
| `onOpenEligibility` | `setShowEligibilityModal(true)` | Check Your Eligibility modal |
| `onOpenDemo` | `setShowDemoModal(true)` | Signup for a Demo / Brochure modal |
| `onOpenBrochure` | `setShowBrochureModal(true)` | Download Brochure (DetailedCurriculum) |

> Always cross-check the actual `useState` variable names in `page.tsx` — they may differ from the defaults above.

---

## 19. FUTURE WORK / PENDING

| Item | Status | Notes |
|------|--------|-------|
| CurriculumTiersV2 rollout to Noida, Gurgaon, Bangalore | ⏳ Pending Delhi review | Wire in same way as Delhi page.tsx |
| Curriculum grid empty slot fix (original BLR page) | ⚠️ Pending | Add `lg:col-start-1` to Module 10, `lg:col-start-2` to Module 11 |
| Future course landing pages (DA, BA, ML) | Not started | Use naming convention `da_`, `ba_`, `ml_` for conversion keys |
