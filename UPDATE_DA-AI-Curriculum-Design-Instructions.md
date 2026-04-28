# DA+AI Landing Pages — Curriculum Design + H1 + Logo Fixes
## For: Antigravity Development Team
## Prepared by: AnalytixLabs Digital Strategy
## Date: April 2026
## Applies to: All 4 DA+AI city pages (Delhi, Noida, Gurgaon, Bangalore)

---

## Overview

Three targeted changes based on review of the live DA+AI pages against the
existing DSAI city pages. No structural rebuilds — adjustments to the curriculum
section visual treatment, the H1 format, and the hero logo strip.

| # | Change | Priority | Component |
|---|---|---|---|
| 1 | H1 format: match DSAI two-line pattern | HIGH | page.tsx (each city) |
| 2 | Hide standalone NASSCOM logo from hero | MEDIUM | Hero / Navbar logo strip |
| 3 | Curriculum: AI modules get DSAI Tier 3 visual treatment | HIGH | CurriculumTiers component |

---

## Change 1 — H1 Format (All 4 Pages)

**Priority:** HIGH

The DSAI city pages use a two-line H1:

```
Line 1: Advanced Certification in
Line 2: Data Science & AI in {City}
```

Line 2 carries the visual weight — larger, gradient-highlighted, or bold.
Line 1 is a smaller qualifier above it.

The DA+AI pages currently have a single-line H1:
```
Data Analyst + AI Course in {City}
```

**Update to match the two-line DSAI pattern:**

| Page | Line 1 | Line 2 |
|---|---|---|
| Delhi | `Advanced Certification in` | `Data Analyst + AI in Delhi` |
| Noida | `Advanced Certification in` | `Data Analyst + AI in Noida` |
| Gurgaon | `Advanced Certification in` | `Data Analyst + AI in Gurgaon` |
| Bangalore | `Advanced Certification in` | `Data Analyst + AI in Bangalore` |

**Styling rule:** Apply exactly the same CSS treatment to Line 1 and Line 2 as is
used on the DSAI pages — do not invent a new pattern. Copy the className and
inline style approach directly from `data-science-ai-course-delhi/page.tsx` h1
block and substitute the new text.

---

## Change 2 — Hide Standalone NASSCOM Logo from Hero Logo Strip (All 4 Pages)

**Priority:** MEDIUM

**Problem:** The hero currently shows two separate logo images in the trust badge
strip:
1. A standalone NASSCOM-FutureSkills logo (standalone badge)
2. The IIT Bombay + IIT Patna co-branding image (which already contains the
   NASSCOM-FutureSkills logo embedded within it)

This causes NASSCOM to appear twice — once standalone, once inside the IIT image.

**Fix:** Hide the standalone NASSCOM image. Keep the IIT Bombay + IIT Patna image.

Find the standalone NASSCOM image in the hero logo strip. It references:
```
https://www.analytixlabs.co.in/wp-content/uploads/2026/01/nasscomfutureskills.webp
```

Add `hidden` or `display: none` to that specific `<img>` element. Do not remove
the element from the DOM entirely (keep it hidden so it can be re-enabled if
needed). Do not touch the IIT image — it stays visible.

Verify after: only one NASSCOM reference visible in the hero, inside the IIT
co-branding image.

---

## Change 3 — Curriculum Section: AI Modules Get DSAI Tier 3 Visual Treatment

**Priority:** HIGH

### Context

The DA+AI curriculum section currently has:
- A toggle: "Core Data Analytics" | "AI-Integrated Recommended"
- Core tab: 7 modules in a flat grid (Modules 01-07)
- AI-Integrated tab: 10 modules (7 Core + 3 new AI modules: 05A GenAI,
  05B Agentic AI, 05C Python for AI)

The DSAI pages use `CurriculumTiers` which visually separates AI modules
(Tier 3) with:
- A light teal/green background wrapper around the entire AI tier
- A teal left-border accent on the GenAI module card
- A yellow/lemon treatment on the Career Readiness module card
- A sub-label: "WHAT SETS THIS COURSE APART"

**The ask:** Keep the toggle button. But in the AI-Integrated tab, apply the
DSAI Tier 3 visual treatment to the AI modules section at the bottom.

---

### Layout of AI-Integrated Tab (after this change)

The AI-Integrated tab should render in two visually distinct zones:

**Zone A — Core Modules (unchanged, plain white):**
Modules 01-05 (Building Blocks, Excel & Power BI, SQL, Python, Industry Analytics)
Rendered in the existing flat grid, white background, no accent treatment.
Identical to how they appear in the Core tab.

**Zone B — AI Modules (new, DSAI Tier 3 style):**
Modules 05A, 05B, 05C + Module 07 (Placement Readiness)
Wrapped in a light teal/green background container.

---

### Zone B — Exact Visual Specification

Copy the Tier 3 container styling directly from `CurriculumTiers.tsx`
(the DSAI component). Apply the same wrapper background, border-radius,
padding, and sub-label. Do not invent new values — reuse the exact tokens
already in that component.

**Container:**
- Background: same light teal/green as DSAI Tier 3 wrapper
  (check `CurriculumTiers.tsx` for the exact colour value)
- Border-radius: same as DSAI Tier 3 container
- Padding: same as DSAI Tier 3 container
- Top sub-label: `WHAT SETS THIS COURSE APART`
  Style: same uppercase tracking label as used in DSAI Tier 3

**Module card treatments within Zone B:**

| Module | Title | Treatment |
|---|---|---|
| 05A | Generative AI for Analysts | Teal left-border accent card (same as DSAI Module 09 / Generative AI card) |
| 05B | Agentic AI Systems | Standard card, no special accent |
| 05C | Python for AI and Automation | Standard card, no special accent |
| 07 | Placement Readiness | Yellow/lemon treatment (same as DSAI Module 11 / Career Readiness card) |

**Tags for each card:**

Module 05A — Generative AI for Analysts:
```
ChatGPT  Claude  Prompt Eng.  GenAI for Python/SQL/BI
```
(Match the tag set from DSAI Module 09 exactly — same tags, same style)

Module 05B — Agentic AI Systems:
```
AutoGen  LangChain  No-Code Agents  Multi-Step Workflows
```

Module 05C — Python for AI and Automation:
```
Python  API Integration  AI Orchestration  Automation
```

Module 07 — Placement Readiness (yellow treatment):
```
Resume  Mock Interviews  8 Weeks  Simulated Drives
```
(Match the tag set from DSAI Module 11 / Career Readiness exactly)

---

### Core Tab — No Change

The Core Data Analytics tab stays exactly as it is. This change only affects
the AI-Integrated tab. Do not touch Core tab layout, card styles, or module
content.

---

### Toggle Button — No Change

The "Core Data Analytics" | "AI-Integrated Recommended" toggle button stays
exactly as designed. Do not modify its appearance, position, or behaviour.
This is a deliberate design choice — keep it.

---

### Curriculum Section Heading (update text only)

The heading above the stats row and toggle currently reads:
```
What You Will Learn Across 450+ Hours
```

Update to:
```
Dual Certification Track — What You Will Learn
```

Sub-copy below heading (add if not already present):
```
Synced with the IIT Bombay + IIT Patna academic partnership. Choose between
our Core Analytics track or the AI-Integrated track for advanced automation.
```

---

## Post-Change Verification Checklist

### All 4 pages:

**H1:**
- [ ] H1 renders as two lines: "Advanced Certification in" on line 1,
      "Data Analyst + AI in {City}" on line 2
- [ ] Line 1 and Line 2 CSS matches the DSAI page H1 exactly
- [ ] City name is correct per page

**Logo strip:**
- [ ] Standalone NASSCOM image is hidden (not removed)
- [ ] IIT Bombay + IIT Patna image is visible
- [ ] No duplicate NASSCOM logos visible to the user

**Curriculum — Core tab:**
- [ ] Core tab unchanged: 7 modules, flat grid, white background
- [ ] Toggle button present and functional

**Curriculum — AI-Integrated tab:**
- [ ] First 5 modules (01-05) render in plain white grid — no green background
- [ ] Zone B wrapper has light teal/green background — same as DSAI Tier 3
- [ ] "WHAT SETS THIS COURSE APART" label appears above Zone B
- [ ] Module 05A (Generative AI for Analysts) has teal left-border accent
- [ ] Module 05A tags: ChatGPT, Claude, Prompt Eng., GenAI for Python/SQL/BI
- [ ] Module 05B (Agentic AI Systems) is a standard card in Zone B
- [ ] Module 05C (Python for AI and Automation) is a standard card in Zone B
- [ ] Module 07 (Placement Readiness) has yellow/lemon treatment
- [ ] Module 07 tags: Resume, Mock Interviews, 8 Weeks, Simulated Drives
- [ ] Toggle button still present and functional in AI-Integrated tab view

**Curriculum heading:**
- [ ] Section heading reads "Dual Certification Track — What You Will Learn"
- [ ] Sub-copy mentions "IIT Bombay + IIT Patna academic partnership"

---

## Suggested Commit Message

```
fix(da-ai-pages): H1 two-line format, hide duplicate NASSCOM logo,
curriculum AI modules get DSAI Tier 3 visual treatment

- H1: two-line "Advanced Certification in / Data Analyst + AI in {City}"
  matching DSAI page pattern exactly
- Hero: hide standalone NASSCOM image (IIT image already contains it)
- Curriculum AI-Integrated tab: core modules stay plain white;
  AI modules (05A GenAI, 05B Agentic, 05C Python, 07 Placement) wrapped
  in DSAI Tier 3 light green container with matching card accents
- Toggle button unchanged
- Curriculum heading updated to "Dual Certification Track — What You Will Learn"
```
