# DA+AI Landing Pages — Curriculum & Content Sync Instructions
## For: Antigravity Development Team
## Source A: analytixlabs.co.in/data-analyst-certification-courses/ (organic, authoritative)
## Source B: lp-vercel.analytixlabs.co.in/data-analyst-ai-course-delhi (live landing page)
## Date: April 2026
## Applies to: All 4 DA+AI city pages (Delhi, Noida, Gurgaon, Bangalore)

---

## What This File Covers

The organic course detail page is the authoritative source for course content.
The 4 DA+AI landing pages were built before the organic page's IIT co-branding,
AI curriculum modules, and stats were finalised. This file documents every gap
and provides exact copy to sync all 4 landing pages to the organic page.

---

## Gap Summary

| # | Gap | Impact | Section |
|---|---|---|---|
| 1 | IIT Bombay + IIT Patna co-branding missing entirely | HIGH — major trust signal absent | Hero + Certification section |
| 2 | Hours/Classes wrong: "450+ Hours" vs correct "445 Hours / 43 Classes" | MEDIUM | Hero meta strip |
| 3 | Duration missing: should show "6-10 Months" range | MEDIUM | Hero meta strip |
| 4 | AI-Integrated curriculum tab has no module content | HIGH — tab appears empty | Curriculum section |
| 5 | Upcoming batch dates not shown | MEDIUM — urgency signal missing | Hero / pricing section |
| 6 | Overview stats (assignments, self-study hours) not surfaced | LOW | Curriculum section |

---

## Change 1 — IIT Bombay + IIT Patna Co-Branding (All 4 Pages)

**Priority:** HIGH

The organic page prominently features an IIT Bombay and IIT Patna co-branding logo
in the hero section and throughout the page. The landing pages have no mention of
this at all. This is one of the strongest trust signals for the Indian market and
must be added immediately.

### 1a. Hero Section — Add IIT logo badge

The hero currently shows:
```
[NASSCOM-FutureSkills Prime logo]
```

Add immediately after the NASSCOM logo:

```
[IIT Bombay + IIT Patna co-branding logo]
Image URL: https://www.analytixlabs.co.in/wp-content/uploads/2024/12/Final-Logo-IITP-IITB-2026.webp
Alt text: IIT Bombay and IIT Patna — Academic Partners
```

Style: same height as the NASSCOM logo, displayed inline in the logo/badge strip.
Both logos should appear side-by-side in the existing trust badge row at the top
of the hero content area.

### 1b. Certification Section — Add IIT card

The current certification section shows two cards:
1. NASSCOM FutureSkills Prime
2. Data Analyst + AI Certificate (AnalytixLabs)

Add a third card:

```
[IIT Bombay + IIT Patna logo — same image URL as above]
Label: IIT Bombay + IIT Patna
Sub-label: Academic Partners
```

Style: same card treatment as the two existing certification cards.

### 1c. Hero Badge Strip — Add text mention

In the scrolling badge strip below the H1 (the line with "SQL & Power BI",
"Python for Analytics", etc.), add:

```
IIT Bombay + IIT Patna Academic Tie-Up
```

Insert this as the first badge in the strip, before "NASSCOM-FutureSkills Prime Certified".

---

## Change 2 — Hero Meta Stats: Correct Hours and Add Classes Count (All 4 Pages)

**Priority:** MEDIUM

**Current hero meta strip (landing page):**
```
0+ Candidates Trained | 0+ Companies Hired | 0.0/10 Rating | 0+ Years
```
(These are the count-up stats from StatsBar — these are fine.)

**Issue is in the course info widget / CourseInfoSection.**

The page currently shows "450+ Hours" as a single stat.

**Organic page shows:**
```
445 Hours
43 Classes
6-10 Months
```

**Update CourseInfoSection (or wherever these appear on the DA+AI pages) to show:**

| Stat | Value |
|---|---|
| Duration | 6-10 Months |
| Hours | 445-760 Hours* |
| Classes | 43 Classes |
| Assignments | 6 Assignments & Projects |

*Note on hours range: Core track = 445 hours. AI-Integrated track goes up to 760 hours
including the additional GenAI and Agentic AI modules. Show the range "445-760 Hours"
so both tracks are represented.

---

## Change 3 — Curriculum: Add AI-Integrated Track Module Content (All 4 Pages)

**Priority:** HIGH

**Current state:** The curriculum section has two tabs — "Core Data Analytics" and
"AI-Integrated Recommended". The Core tab has 7 modules with content. The
AI-Integrated tab appears to have no module content (tab exists but content is empty
or identical to Core).

**Required state:** The AI-Integrated tab should show the Core modules PLUS 3
additional AI-specific modules. Here is the complete module list for each tab.

---

### Tab 1 — Core Data Analytics (no change to existing modules)

Verify these 7 modules are present and correct:

| Module | Title | Tags |
|---|---|---|
| Module 01 | Building Blocks | Maths, Stats, Problem-Solving |
| Module 02 | Excel and Power BI | Excel, Power BI, DAX, Dashboards |
| Module 03 | SQL and Data Management | SQL, Azure, ETL, Cloud |
| Module 04 | Python for Data Analysis | Python, Pandas, NumPy, EDA |
| Module 05 | Industry Analytics | Marketing, Operations, Risk, BFSI |
| Module 06 | Capstone Projects | 3 Projects, Portfolio, Pipeline |
| Module 07 | Placement Readiness | Resume, Mock Interviews, 8 Weeks |

These are correct on the live pages — no changes needed to Core tab content.

---

### Tab 2 — AI-Integrated (add 3 new modules after Module 05, before Capstone)

The AI-Integrated tab should show all 7 Core modules PLUS the following 3 additional
modules inserted between Module 05 (Industry Analytics) and Module 06 (Capstone):

**Module 05A — Generative AI for Analysts**

```
Title: Generative AI for Analysts
Tags: GenAI, Prompt Engineering, Power BI, SQL Automation

Description:
Use Generative AI to accelerate your analytics workflow. Write SQL faster with
AI-assisted query generation, automate Python scripts, and build dynamic Power BI
narratives using GenAI tools. Includes hands-on prompt engineering for data tasks
and AI-assisted data cleaning and reporting pipelines.
```

**Module 05B — Agentic AI Systems**

```
Title: Agentic AI Systems
Tags: No-Code Agents, AutoGen, LangChain, Multi-Step Workflows

Description:
Build and manage No-Code AI Agents that autonomously plan, reason, and execute
multi-step analytics workflows. Design agent pipelines that monitor live data,
trigger automated reports, handle data validation, and escalate anomalies — all
without writing a backend from scratch.
```

**Module 05C — Python for AI and Automation**

```
Title: Python for AI and Automation
Tags: Python, API Integration, AI Orchestration, Automation

Description:
A specialised Python module designed to control and scale Agentic AI systems.
Covers API integrations, orchestration libraries, building data pipelines that
connect AI agents to live business data, and deploying lightweight AI-assisted
analytics tools.
```

So the AI-Integrated tab has 10 modules total:
01 Building Blocks → 02 Excel and Power BI → 03 SQL → 04 Python →
05 Industry Analytics → 05A GenAI for Analysts → 05B Agentic AI Systems →
05C Python for AI → 06 Capstone Projects → 07 Placement Readiness

The section intro text for the AI-Integrated tab should read:
```
Everything in the Core track, plus three AI modules that put you ahead of
the market. The AI-Integrated track earns the same NASSCOM-FutureSkills Prime
certification with an extended syllabus of 760+ hours.
```

---

## Change 4 — Add Upcoming Batch Dates (All 4 Pages)

**Priority:** MEDIUM — urgency signal currently absent from landing pages.

The organic page shows specific upcoming batch start dates per city. The landing
pages have no batch dates anywhere.

**Batch dates are already managed as Vercel environment variables.**
Do not hardcode them in page.tsx. Wire the hero strip to the existing env vars.

**Add a batch dates row** in the hero section, below the H1 and subheadline,
above the CTA buttons. Style as a simple horizontal strip of 3 date pills.

**Content format per pill:**
```
[Date]  [City]
```

**Read dates from Vercel environment variables:**

```tsx
const UPCOMING_BATCHES = [
  { date: process.env.NEXT_PUBLIC_BATCH_DATE_GURGAON, city: 'Gurgaon' },
  { date: process.env.NEXT_PUBLIC_BATCH_DATE_NOIDA,   city: 'Noida'   },
  { date: process.env.NEXT_PUBLIC_BATCH_DATE_BANGALORE, city: 'Bangalore' },
].filter(b => b.date); // omit any city where env var is not set
```

Confirm the exact environment variable names with AnalytixLabs before wiring —
the names above follow the `NEXT_PUBLIC_BATCH_DATE_{CITY}` convention but the
actual names may differ. Check the Vercel dashboard → Project → Settings →
Environment Variables for the careersuccess-legacy project.

**Per-page display rule** (sort order of pills only — content from env vars):
- Delhi page: Gurgaon → Noida → Bangalore
- Noida page: Noida → Gurgaon → Bangalore
- Gurgaon page: Gurgaon → Noida → Bangalore
- Bangalore page: Bangalore → Gurgaon → Noida

**Label above the pills:**
```
Upcoming Batches:
```

**Style:** Small pill badges, navy background with teal text, matching the existing
badge style in the hero. Display-only — no interactivity, no link.

If a date env var is not set or empty, that city's pill should be omitted silently
(the `.filter` above handles this). Never render an empty pill.

---

## Change 5 — Curriculum Section: Add Overview Stats Row (All 4 Pages)

**Priority:** LOW

The organic page shows a compact overview row above the curriculum with:
- Number of classes x hours
- Self-study hours + assignments count
- Placement Readiness Program mention

Add this as a 3-column info row above the module tabs in the curriculum section:

```
[Column 1]
Icon: calendar
Stat: 43 Classes
Sub: 445 hours of structured learning

[Column 2]
Icon: book
Stat: 90 Hours
Sub: Self-study + 6 assignments and projects

[Column 3]
Icon: users
Stat: 8 Weeks
Sub: Placement Readiness Program included
```

Style: same 3-column card row pattern as `CourseInfoSection.tsx`.
Use existing icon SVG patterns from the project (do not add emoji).

---

## Post-Change Verification Checklist

### All 4 pages:

- [ ] IIT Bombay + IIT Patna logo appears in hero badge strip alongside NASSCOM logo
- [ ] IIT logo alt text: "IIT Bombay and IIT Patna — Academic Partners"
- [ ] Certification section has 3 cards: NASSCOM, AnalytixLabs cert, IIT co-branding
- [ ] Hero badge strip includes "IIT Bombay + IIT Patna Academic Tie-Up" as first badge
- [ ] CourseInfoSection shows: "6-10 Months", "445-760 Hours", "43 Classes", "6 Assignments"
- [ ] Curriculum AI-Integrated tab has 10 modules (7 Core + 3 AI)
- [ ] Module 05A title: "Generative AI for Analysts"
- [ ] Module 05B title: "Agentic AI Systems"
- [ ] Module 05C title: "Python for AI and Automation"
- [ ] AI-Integrated tab intro text mentions "760+ hours"
- [ ] Batch dates strip visible in hero — pills render for each city where env var is set
- [ ] Dates read from Vercel env vars (confirm exact variable names in Vercel dashboard)
- [ ] Empty pill does not render if env var is unset
- [ ] Curriculum overview stats row present above module tabs
- [ ] No inline fontFamily set in any new elements
- [ ] No em-dashes in any new copy

---

## Suggested Commit Message

```
feat(da-ai-pages): sync curriculum and trust signals with organic course page

- Add IIT Bombay + IIT Patna co-branding to hero, badge strip, certification section
- Fix CourseInfoSection: 6-10 Months, 445-760 Hours, 43 Classes, 6 Assignments
- AI-Integrated curriculum tab: add 3 AI modules (GenAI, Agentic AI, Python for AI)
- Add upcoming batch dates strip to hero on all 4 city pages (reads from Vercel env vars)
- Add curriculum overview stats row (classes, self-study, PRP) above module tabs
```
