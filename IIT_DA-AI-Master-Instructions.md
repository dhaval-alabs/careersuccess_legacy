# DA+AI Landing Pages — Master Change Instructions
## For: Antigravity Development Team
## Prepared by: AnalytixLabs Digital Strategy
## Date: April 2026
## Pages: /data-analyst-ai-course-delhi · noida · gurgaon · bangalore

---

## IMPORTANT — READ BEFORE STARTING

**Do not change under any circumstance:**
Form field labels, CTA button text ("Check Your Eligibility" remains primary CTA on all forms), `fireConversion` calls, `ctaSource` prop values, `form_source` CRM mappings, modal wiring, WhatsApp/call links, sticky bar, FAQ #6 (classroom location), any section not listed below.

**IIT name rule for all new copy in this document:**
- IIT Patna full name: `IIT Patna Vishlesan I-HUB Foundation`
- IIT Patna short form (badge pills only): `TIH at IIT Patna`
- IIT Bombay full name: `TIH Foundation for IoT & IoE at IIT Bombay`
- IIT Bombay short form (badge pills only): `TIH at IIT Bombay`
- All other IIT name variants are prohibited. Follow the approved implementation on the live homepage and PDPs for logo placement and styling.

---

## Master Change Summary

| # | Change | Priority | Affects |
|---|---|---|---|
| 1 | Reorder pricing cards | CRITICAL | All 4 pages |
| 2 | H1: two-line format matching DSAI pages | HIGH | All 4 pages |
| 3 | Add IIT co-branding to hero + certification section | HIGH | All 4 pages |
| 4 | Hide duplicate standalone NASSCOM logo | MEDIUM | All 4 pages |
| 5 | Fix CourseInfoSection stats | MEDIUM | All 4 pages |
| 6 | Add 3 missing FAQ items | HIGH | All 4 pages |
| 7 | AI-Integrated curriculum tab: add 3 AI modules + Tier 3 visual treatment | HIGH | All 4 pages |
| 8 | Update curriculum section heading + sub-copy | MEDIUM | All 4 pages |
| 9 | Add curriculum overview stats row | LOW | All 4 pages |
| 10 | Add batch dates strip to hero | MEDIUM | All 4 pages |
| 11 | Add IIT upgrade footnote to pricing section | HIGH | All 4 pages |
| 12 | Fix Delhi browser title tag | LOW | Delhi only |
| 13 | Bangalore page rewrites | HIGH | Bangalore only |

---

## Change 1 — Reorder Pricing Cards (All 4 Pages)

**Priority:** CRITICAL

Current render order: Blended eLearning → Interactive Live Online → Classroom and Bootcamp.

Required order:

1. **Classroom and Bootcamp** — label `IN-PERSON`, price ₹61,360 incl. taxes, no "MOST POPULAR" badge
2. **Interactive Live Online** — label `LIVE` + `MOST POPULAR` badge, price ₹53,100 incl. taxes
3. **Blended eLearning** — label `FLEXIBLE`, price ₹47,200 incl. taxes

Same cards, same copy, same prices — render order change only.

---

## Change 2 — H1: Two-Line Format (All 4 Pages)

**Priority:** HIGH

The DSAI pages use a two-line H1 with Line 1 as a smaller qualifier and Line 2 carrying the visual weight. Match this exactly.

**Copy the className and inline style from `data-science-ai-course-delhi/page.tsx` H1 block — do not invent new styling.**

| Page | Line 1 | Line 2 |
|---|---|---|
| Delhi | `Advanced Certification in` | `Data Analyst + AI in Delhi` |
| Noida | `Advanced Certification in` | `Data Analyst + AI in Noida` |
| Gurgaon | `Advanced Certification in` | `Data Analyst + AI in Gurgaon` |
| Bangalore | `Advanced Certification in` | `Data Analyst + AI in Bangalore` |

The H2 subheadline below the H1 does not change on Delhi, Noida, or Gurgaon. Bangalore H2 is rewritten in Change 13.

---

## Change 3 — Add IIT Co-Branding (All 4 Pages)

**Priority:** HIGH

### 3a. Hero badge strip

Add the IIT co-branding logo to the hero trust badge strip, alongside the existing NASSCOM logo:

```
Image URL: https://www.analytixlabs.co.in/wp-content/uploads/2024/12/Final-Logo-IITP-IITB-2026.webp
Alt text:  IIT Bombay and IIT Patna — Academic Partners
```

Style: same height as the NASSCOM logo, inline in the existing badge row.

Also add this text badge as the first item in the scrolling badge strip (before "NASSCOM-FutureSkills Prime Certified"):

```
In collaboration with TIH at IIT Bombay and TIH at IIT Patna
```

### 3b. Certification section — add third card

Current certification section has 2 cards: NASSCOM FutureSkills Prime, AnalytixLabs certificate.

Add a third card using the same card treatment:

```
Image: same URL as above
Label: IIT Bombay + IIT Patna
Sub-label: Academic Partners
```

---

## Change 4 — Hide Duplicate NASSCOM Logo (All 4 Pages)

**Priority:** MEDIUM

The IIT co-branding image (added in Change 3) already contains the NASSCOM logo embedded. The standalone NASSCOM image in the hero strip causes a duplicate.

Find the standalone NASSCOM image referencing:
```
https://www.analytixlabs.co.in/wp-content/uploads/2026/01/nasscomfutureskills.webp
```

Add `hidden` to that `<img>` element. Do not delete it from the DOM — keep it hidden for easy reversal.

---

## Change 5 — Fix CourseInfoSection Stats (All 4 Pages)

**Priority:** MEDIUM

Current display shows "450+ Hours" as a single stat. Update to show all four values:

| Stat | Value |
|---|---|
| Duration | 6-10 Months |
| Hours | 445-760 Hours |
| Classes | 43 Classes |
| Assignments | 6 Assignments & Projects |

Note on hours: Core track = 445 hours. AI-Integrated track = up to 760 hours with the 3 additional AI modules.

---

## Change 6 — Add 3 Missing FAQ Items (All 4 Pages)

**Priority:** HIGH

Pages currently have 9 FAQs. Add these 3 to the bottom of the FAQ accordion. Replace `[CITY]` with the actual city name per page.

### FAQ 10 — Course duration

**Question:**
```
How long is the Data Analyst + AI course?
```

**Answer:**
```
The Core Data Analytics track runs across 445 hours of structured learning, covering 7 modules from Excel and SQL through Python and Generative AI. The AI-Integrated track extends this further with additional GenAI modules for analysts who want to apply AI tools in their daily work. For working professionals on weekend or evening batches, most students complete the Core track in 4 to 5 months. Speak to our learning advisor for the current batch schedule in [CITY].
```

### FAQ 11 — Core vs AI-Integrated track

**Question:**
```
How do I choose between the Core and AI-Integrated tracks?
```

**Answer:**
```
The Core Data Analytics track is ideal if you are starting from scratch, switching careers, or want to build a solid foundation in SQL, Power BI, Python, and statistics before adding AI skills later. The AI-Integrated track is recommended for analysts who want to stay ahead: it includes everything in Core plus Generative AI for analysts, prompt engineering for SQL and Python, and AI-assisted BI reporting. Both tracks earn the same NASSCOM-FutureSkills Prime certification and come with full placement support. If you are unsure, our learning advisors can help you choose based on your current role and target outcome.
```

### FAQ 12 — MOOC comparison

**Question:**
```
How does this compare to the Google Data Analytics Certificate or IBM Data Analyst course on Coursera?
```

**Answer:**
```
Google and IBM offer solid introductory certificates, and we respect them. The difference is in depth, support, and outcome accountability. Our programme covers a broader curriculum including SQL on cloud databases, advanced Power BI with DAX, Python for predictive modelling, and Generative AI for analysts — skills that go significantly beyond what either of those programmes cover. More importantly, this course includes live instructor-led sessions, mentorship, real capstone projects reviewed by faculty, and a dedicated placement team working to get you hired in [CITY] and across India. Google and IBM certificates carry no placement support or fee-back guarantee. We also hold NASSCOM-FutureSkills Prime accreditation, supported by MeitY, Government of India — a credential that carries substantially more weight with Indian employers than a global MOOC certificate.
```

---

## Change 7 — AI-Integrated Curriculum Tab: Modules + Visual Treatment (All 4 Pages)

**Priority:** HIGH

### 7a. Add 3 AI modules to the AI-Integrated tab

The AI-Integrated tab currently shows only the 7 Core modules (same as Core tab). Add 3 new modules inserted between Module 05 (Industry Analytics) and Module 06 (Capstone Projects).

**Module 05A — Generative AI for Analysts**

```
Title: Generative AI for Analysts
Tags: ChatGPT  Claude  Prompt Eng.  GenAI for Python/SQL/BI
Description: Use Generative AI to accelerate your analytics workflow. Write SQL faster with AI-assisted query generation, automate Python scripts, and build dynamic Power BI narratives using GenAI tools. Includes hands-on prompt engineering for data tasks and AI-assisted data cleaning and reporting pipelines.
```

**Module 05B — Agentic AI Systems**

```
Title: Agentic AI Systems
Tags: AutoGen  LangChain  No-Code Agents  Multi-Step Workflows
Description: Build and manage No-Code AI Agents that autonomously plan, reason, and execute multi-step analytics workflows. Design agent pipelines that monitor live data, trigger automated reports, handle data validation, and escalate anomalies.
```

**Module 05C — Python for AI and Automation**

```
Title: Python for AI and Automation
Tags: Python  API Integration  AI Orchestration  Automation
Description: A specialised Python module for controlling and scaling Agentic AI systems. Covers API integrations, orchestration libraries, building data pipelines that connect AI agents to live business data, and deploying lightweight AI-assisted analytics tools.
```

Complete AI-Integrated tab order (10 modules total):
```
01 Building Blocks
02 Excel and Power BI
03 SQL and Data Management
04 Python for Data Analysis
05 Industry Analytics
05A Generative AI for Analysts   ← NEW
05B Agentic AI Systems            ← NEW
05C Python for AI and Automation  ← NEW
06 Capstone Projects
07 Placement Readiness
```

AI-Integrated tab intro text:
```
Everything in the Core track, plus three AI modules that put you ahead of the market. The AI-Integrated track earns the same NASSCOM-FutureSkills Prime certification with an extended syllabus of 760+ hours.
```

### 7b. Apply DSAI Tier 3 visual treatment to AI modules in the AI-Integrated tab

**Keep the toggle button exactly as designed. This change only affects what renders inside the AI-Integrated tab.**

The AI-Integrated tab renders in two visually distinct zones:

**Zone A — Core Modules (Modules 01-05): no change**
Plain white grid, identical to Core tab. No colour treatment.

**Zone B — AI Modules (Modules 05A, 05B, 05C, 07):**

Copy the Tier 3 container styling directly from `CurriculumTiers.tsx`. Use the exact same background colour, border-radius, and padding — do not invent new values.

Container:
- Background: same light teal/green as DSAI Tier 3 wrapper (check `CurriculumTiers.tsx`)
- Sub-label above Zone B: `WHAT SETS THIS COURSE APART` (same styling as DSAI Tier 3 label)

Module card treatments inside Zone B:

| Module | Treatment |
|---|---|
| 05A — Generative AI for Analysts | Teal left-border accent (same as DSAI Module 09) |
| 05B — Agentic AI Systems | Standard card, no accent |
| 05C — Python for AI and Automation | Standard card, no accent |
| 07 — Placement Readiness | Yellow/lemon treatment (same as DSAI Module 11) |

Module 07 tags (Placement Readiness):
```
Resume  Mock Interviews  8 Weeks  Simulated Drives
```

**Core tab: no change.** Do not touch Core tab layout, card styles, or module content.

---

## Change 8 — Curriculum Section Heading (All 4 Pages)

**Priority:** MEDIUM

**Find (current heading):**
```
What You Will Learn Across 450+ Hours
```

**Replace with:**
```
Dual Certification Track — What You Will Learn
```

**Sub-copy below heading (add if not already present):**
```
In collaboration with TIH at IIT Bombay and TIH at IIT Patna. Choose between our Core Analytics track or the AI-Integrated track for advanced automation.
```

---

## Change 9 — Curriculum Overview Stats Row (All 4 Pages)

**Priority:** LOW

Add a 3-column info row above the tab toggle in the curriculum section. Use the same pattern as `CourseInfoSection.tsx`. Use SVG icons — no emoji.

| Column | Icon | Stat | Sub-label |
|---|---|---|---|
| 1 | Calendar | 43 Classes | 445 hours of structured learning |
| 2 | Book | 90 Hours | Self-study + 6 assignments and projects |
| 3 | Users | 8 Weeks | Placement Readiness Program included |

---

## Change 10 — Add Batch Dates Strip to Hero (All 4 Pages)

**Priority:** MEDIUM

Add a row of date pills below the H1/subheadline, above the CTA buttons.

**Batch dates are managed as Vercel environment variables — do not hardcode.**

```tsx
const UPCOMING_BATCHES = [
  { date: process.env.NEXT_PUBLIC_BATCH_DATE_GURGAON,   city: 'Gurgaon'   },
  { date: process.env.NEXT_PUBLIC_BATCH_DATE_NOIDA,     city: 'Noida'     },
  { date: process.env.NEXT_PUBLIC_BATCH_DATE_BANGALORE, city: 'Bangalore' },
].filter(b => b.date);
```

Confirm exact env var names in Vercel dashboard before wiring (the `NEXT_PUBLIC_BATCH_DATE_*` convention above may differ from actual names in the project).

**Label above pills:** `Upcoming Batches:`

**Style:** Small navy-background, teal-text pill badges matching the existing hero badge style. Display-only — no link, no interactivity.

**Sort order per page:**
- Delhi: Gurgaon → Noida → Bangalore
- Noida: Noida → Gurgaon → Bangalore
- Gurgaon: Gurgaon → Noida → Bangalore
- Bangalore: Bangalore → Gurgaon → Noida

If an env var is unset or empty, omit that pill silently. Never render an empty pill.

---

## Change 11 — IIT Upgrade Footnote on Pricing Section (All 4 Pages)

**Priority:** HIGH — must be live before PPC traffic starts.

### Step 1 — Add asterisk to all 3 pricing card fee amounts

```
₹61,360 incl. taxes*
₹53,100 incl. taxes*
₹47,200 incl. taxes*
```

Use `<sup>*</sup>` — visually small and unobtrusive.

### Step 2 — Add footnote below the pricing card grid

Place immediately below the 3 cards (after the guarantee strip, or directly below the grid). Do not place inside any card.

**Footnote text:**
```
* Fees shown are for the NASSCOM-FutureSkills Prime certified programme. An upgrade to the IIT Patna Vishlesan I-HUB Foundation co-certified track is available at an additional fee — speak to your learning advisor for details.
```

**Styling:**
- Font size: `text-xs` / `text-[12px]`
- Colour: `text-[#4A6275]` (muted)
- Max width: `max-w-2xl`
- Alignment: left
- No background, no border, no card wrapper

### Logo asset reference

IIT Patna logo file: `IITP.webp` (already uploaded to project).
Alt text: `IIT Patna Vishlesan I-HUB Foundation`

---

## Change 12 — Fix Delhi Browser Title Tag (Delhi Only)

**Priority:** LOW

**Find in Delhi `layout.tsx`:**
```
Data Analytics + AI Course in Delhi | Placement + Fee-Back Guarantee | AnalytixLabs
```

**Replace with:**
```
Data Analytics + AI Course in Delhi | Placement Support | AnalytixLabs
```

No other pages need a title change.

---

## Change 13 — Bangalore Page Rewrites (Bangalore Only)

**Priority:** HIGH

All other sections on the Bangalore page (Tools, Alumni, Career Assurance, Pricing, Curriculum, Certification, Testimonials, FAQ) remain unchanged unless listed below.

### 13a. Hero subheadline

**Find:**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, and AI-assisted analytics. NASSCOM-certified course with 100% placement support at our HSR Layout, Bangalore centre.
```

**Replace with:**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, Tableau, and AI-assisted analytics — tools that Bangalore's product companies, startups, and BFSI firms use every day. NASSCOM-FutureSkills Prime certified. Classroom training at HSR Layout.
```

### 13b. "Who Is This For" — Expected Outcome lines only

Change only the Expected outcome line in each persona card. Titles, quotes, and "Ideal for" lines are unchanged.

**Card 1 — Freshers and Recent Graduates**

Find: `Entry-level Data Analyst, MIS Analyst, or BI Analyst role within 6 months.`

Replace: `Entry-level Data Analyst, Product Analyst, or MIS Analyst role at a Bangalore startup or enterprise within 6 months.`

**Card 2 — Non-Tech Career Switchers**

Find: `Transition into a data analytics role in retail, banking, or consulting.`

Replace: `Transition into a data analytics role in Bangalore's fintech, e-commerce, or consulting ecosystem.`

**Card 3 — Working Professionals**

Find: `Upskill to Senior Analyst, Analytics Manager, or transition to a data-centric function.`

Replace: `Upskill to Senior Analyst, Analytics Manager, or move into a data-centric role at a Bangalore product company.`

**Card 4 — BI and Business Analyst Upgraders**

Find: `Move into Product Analyst, Senior BI Analyst, or Analytics Lead roles.`

Replace: `Move into Product Analyst, Analytics Engineer, or Senior BI Analyst roles at Bangalore's tech and product-led companies.`

### 13c. Why AnalytixLabs — Classroom card body text

**Find:**
```
Learn in-person in Bangalore (HSR Layout). Or join live online sessions with the same faculty. Blend modes as your schedule demands.
```

**Replace:**
```
Learn in-person at our HSR Layout centre, accessible from Koramangala, BTM Layout, and Electronic City. Or join live online sessions with the same faculty. Weekend and evening batches available for working professionals.
```

### 13d. Confirm before going live — Bangalore pending items

Implement 13a, 13b, 13c now. The following require AnalytixLabs to confirm before Antigravity can act:

| Item | Required from AnalytixLabs |
|---|---|
| Testimonials | Provide 1-2 Bangalore-based alumni quotes (name, current role, company) to replace at least one NCR testimonial card |
| Alumni logos | Confirm whether any Bangalore-specific companies should be added to the marquee |
| Bangalore classroom fee | Confirm whether ₹61,360 incl. taxes applies to Bangalore or differs |

---

## Consolidated Verification Checklist

Run on all 4 pages in a fresh browser (Ctrl+Shift+R) after deploying.

### All 4 pages

**Pricing:**
- [ ] Classroom card is first (leftmost desktop, topmost mobile)
- [ ] Live Online card has "MOST POPULAR" badge
- [ ] Blended card is last
- [ ] All 3 fee amounts show `<sup>*</sup>` asterisk
- [ ] Footnote appears below card grid in muted small text
- [ ] Footnote reads "IIT Patna Vishlesan I-HUB Foundation"
- [ ] Footnote is NOT inside a card

**H1:**
- [ ] Renders as two lines: "Advanced Certification in" / "Data Analyst + AI in {City}"
- [ ] Styling matches DSAI page H1 exactly
- [ ] City name correct per page

**Hero:**
- [ ] IIT co-branding logo visible in trust badge strip
- [ ] IIT logo alt text: "IIT Bombay and IIT Patna — Academic Partners"
- [ ] Standalone NASSCOM logo is hidden (not deleted)
- [ ] No duplicate NASSCOM logos visible
- [ ] Badge strip includes "In collaboration with TIH at IIT Bombay and TIH at IIT Patna" as first badge
- [ ] Batch date pills visible (only for cities where env var is set)
- [ ] No empty pill rendered

**CourseInfoSection:**
- [ ] Shows: 6-10 Months / 445-760 Hours / 43 Classes / 6 Assignments

**Curriculum:**
- [ ] Section heading: "Dual Certification Track — What You Will Learn"
- [ ] Sub-copy mentions "TIH at IIT Bombay and TIH at IIT Patna"
- [ ] Overview stats row present above toggle (43 Classes / 90 Hours / 8 Weeks)
- [ ] Toggle button present and functional
- [ ] Core tab: 7 modules, unchanged, flat white grid
- [ ] AI-Integrated tab: 10 modules total (7 Core + 3 AI)
- [ ] Module 05A title: "Generative AI for Analysts" — teal left-border accent
- [ ] Module 05A tags: ChatGPT, Claude, Prompt Eng., GenAI for Python/SQL/BI
- [ ] Module 05B title: "Agentic AI Systems" — standard card
- [ ] Module 05C title: "Python for AI and Automation" — standard card
- [ ] Module 07 (Placement Readiness) — yellow/lemon treatment
- [ ] Module 07 tags: Resume, Mock Interviews, 8 Weeks, Simulated Drives
- [ ] "WHAT SETS THIS COURSE APART" label above Zone B
- [ ] Zone B wrapper has light teal/green background matching DSAI Tier 3

**Certification section:**
- [ ] 3 cards: NASSCOM / AnalytixLabs / IIT co-branding
- [ ] IIT card label: "IIT Bombay + IIT Patna"

**FAQ:**
- [ ] 12 FAQ items total
- [ ] FAQ 10: "How long is the Data Analyst + AI course?"
- [ ] FAQ 11: "How do I choose between the Core and AI-Integrated tracks?"
- [ ] FAQ 12 contains "Google Data Analytics Certificate"
- [ ] All 3 new FAQ answers have correct city name substituted for [CITY]

**Global:**
- [ ] "Check Your Eligibility" is CTA text on all form submit buttons
- [ ] No inline fontFamily anywhere in new elements
- [ ] No em-dashes in any new copy
- [ ] Sticky bar unchanged

### Delhi page only
- [ ] Browser title: "Data Analytics + AI Course in Delhi | Placement Support | AnalytixLabs"

### Bangalore page only
- [ ] Hero subheadline contains "product companies, startups, and BFSI"
- [ ] Hero subheadline contains "HSR Layout"
- [ ] Fresher outcome: "Product Analyst"
- [ ] Career Switcher outcome: "fintech" or "e-commerce"
- [ ] Working Professionals outcome: "product company"
- [ ] BI Upgrader outcome: "Analytics Engineer"
- [ ] Classroom Why-Us card mentions "Koramangala" and "Electronic City"
- [ ] No NCR-specific phrasing in Bangalore-specific copy

---

## Commit Message

```
feat(da-ai-pages): full content + design sync across all 4 city pages

- Pricing: Classroom first, asterisk on fees, IIT upgrade footnote
- H1: two-line "Advanced Certification in / Data Analyst + AI in {City}"
- Hero: IIT co-branding logo + badge, standalone NASSCOM hidden, batch dates from env vars
- CourseInfoSection: 6-10 Months, 445-760 Hours, 43 Classes, 6 Assignments
- FAQ: add items 10 (duration), 11 (track choice), 12 (MOOC comparison)
- Curriculum heading: "Dual Certification Track — What You Will Learn"
- Curriculum AI-Integrated tab: 3 new AI modules (05A GenAI, 05B Agentic, 05C Python for AI)
- Curriculum AI-Integrated tab: Zone B with DSAI Tier 3 green treatment + card accents
- Certification section: add IIT co-branding as third card
- Delhi title tag: "Placement Support" (matches other city pages)
- Bangalore: hero subheadline, persona outcomes, classroom card — product-company framing
```
