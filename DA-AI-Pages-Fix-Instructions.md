# DA+AI Landing Pages — Fix & Rewrite Instructions
## For: Antigravity Development Team
## Prepared by: AnalytixLabs Digital Strategy
## Date: April 2026

---

## Pages in Scope

| Page | URL | Change Type |
|---|---|---|
| Delhi | `/data-analyst-ai-course-delhi` | Shared fixes only |
| Noida | `/data-analyst-ai-course-noida` | Shared fixes only |
| Gurgaon | `/data-analyst-ai-course-gurgaon` | Shared fixes only |
| Bangalore | `/data-analyst-ai-course-bangalore` | Shared fixes + full section rewrites |

---

## Summary of All Changes

| # | Change | Priority | Affects |
|---|---|---|---|
| 1 | Reorder pricing cards | CRITICAL | All 4 pages |
| 2 | Update H1 text | HIGH | All 4 pages |
| 3 | Fix Delhi browser title tag | LOW | Delhi only |
| 4 | Add 3 missing FAQ items | HIGH | All 4 pages |
| 5 | Bangalore page rewrites | HIGH | Bangalore only |

**Do not change under any circumstance:** form field labels, CTA button text ("Check Your Eligibility" must remain the primary CTA on all forms), `fireConversion` calls, `ctaSource` prop values, `form_source` CRM mappings, modal wiring, WhatsApp/call links, sticky bar, FAQ #6 (classroom location question), or any section not listed in this document.

---

## Change 1 — Reorder Pricing Cards (All 4 Pages)

**Priority:** CRITICAL — violates the non-negotiable spec rule: Classroom must be listed first.

**Problem:** Current render order is Blended eLearning → Interactive Live Online → Classroom and Bootcamp.

**Required order:** Classroom and Bootcamp → Interactive Live Online → Blended eLearning.

The content of each card does not change. Reorder the card components in the pricing section so the final DOM order is:

1. **Classroom and Bootcamp** — label `IN-PERSON`, price ₹61,360, no "MOST POPULAR" badge
2. **Interactive Live Online** — label `LIVE` + `MOST POPULAR` badge, price ₹53,100
3. **Blended eLearning** — label `FLEXIBLE`, price ₹47,200

Same cards, same copy, same prices — render order change only.

---

## Change 2 — Update H1 Text (All 4 Pages)

**Priority:** HIGH — current H1 uses value-prop phrasing that does not match how users search.

**Current H1 pattern (all pages):**
```
Job-Ready Certification in Data Analyst + AI in [CITY]
```

**New H1 pattern:**
```
Data Analyst + AI Course in [CITY]
```

**Per-page values:**

| Page | New H1 |
|---|---|
| Delhi | `Data Analyst + AI Course in Delhi` |
| Noida | `Data Analyst + AI Course in Noida` |
| Gurgaon | `Data Analyst + AI Course in Gurgaon` |
| Bangalore | `Data Analyst + AI Course in Bangalore` |

The H2 subheadline immediately below the H1 does not change on Delhi, Noida, or Gurgaon. The Bangalore H2 is rewritten separately in Change 5.

---

## Change 3 — Fix Delhi Browser Title Tag (Delhi Only)

**Priority:** LOW — consistency fix.

**Problem:** The Delhi `<title>` tag says "Placement + Fee-Back Guarantee" while all three other city pages say "Placement Support." All four should be consistent.

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

## Change 4 — Add 3 Missing FAQ Items (All 4 Pages)

**Priority:** HIGH — pages currently have 9 FAQs; the minimum required is 12.

Add the following 3 items to the bottom of the FAQ accordion on all 4 pages. Replace the `[CITY]` token with the actual city name per page.

---

### FAQ 10 — Course duration

**Question:**
```
How long is the Data Analyst + AI course?
```

**Answer:**
```
The Core Data Analytics track runs across 450+ hours of structured learning, covering 7 modules from Excel and SQL through Python and Generative AI. The AI-Integrated track extends this further with additional GenAI modules for analysts who want to apply AI tools in their daily work. For working professionals on weekend or evening batches, most students complete the Core track in 4 to 5 months. Speak to our learning advisor for the current batch schedule in [CITY].
```

---

### FAQ 11 — Core vs AI-Integrated track

**Question:**
```
How do I choose between the Core and AI-Integrated tracks?
```

**Answer:**
```
The Core Data Analytics track is ideal if you are starting from scratch, switching careers, or want to build a solid foundation in SQL, Power BI, Python, and statistics before adding AI skills later. The AI-Integrated track is recommended for analysts who want to stay ahead: it includes everything in Core plus Generative AI for analysts, prompt engineering for SQL and Python, and AI-assisted BI reporting. Both tracks earn the same NASSCOM-FutureSkills Prime certification and come with full placement support. If you are unsure, our learning advisors can help you choose based on your current role and target outcome.
```

---

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

## Change 5 — Bangalore Page Rewrites (Bangalore Only)

**Priority:** HIGH — the Bangalore page is currently a city-token swap of the NCR template. The Bangalore market is meaningfully different: it is dominated by product companies, funded startups, and tech-first employers. Candidates search for roles like Product Analyst and Analytics Engineer as primary outcomes, not just Data Analyst. This change adjusts the hero subheadline, persona card outcomes, and Why AnalytixLabs classroom card to reflect that reality. All other sections (Tools, Alumni strip, Career Assurance, Pricing, Curriculum, Certification, Testimonials, FAQ) remain unchanged unless explicitly noted below.

---

### 5a. Hero Subheadline (Bangalore only)

**Find — current Bangalore subheadline:**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, and AI-assisted analytics. NASSCOM-certified course with 100% placement support at our HSR Layout, Bangalore centre.
```

**Replace with:**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, Tableau, and AI-assisted analytics — tools that Bangalore's product companies, startups, and BFSI firms use every day. NASSCOM-FutureSkills Prime certified. Classroom training at HSR Layout.
```

---

### 5b. "Who Is This For" — Persona Card Expected Outcomes (Bangalore only)

Update only the **Expected outcome** line in each of the 4 persona cards. The card titles, lead-in quotes, and "This course is for you if" lines do not change.

**Card 1 — Freshers and Recent Graduates**

Find:
```
Expected outcome: Entry-level Data Analyst, MIS Analyst, or BI Analyst role within 6 months.
```

Replace with:
```
Expected outcome: Entry-level Data Analyst, Product Analyst, or MIS Analyst role at a Bangalore startup or enterprise within 6 months.
```

---

**Card 2 — Non-Tech Career Switchers**

Find:
```
Expected outcome: Transition into a data analytics role in retail, banking, or consulting.
```

Replace with:
```
Expected outcome: Transition into a data analytics role in Bangalore's fintech, e-commerce, or consulting ecosystem.
```

---

**Card 3 — Working Professionals**

Find:
```
Expected outcome: Upskill to Senior Analyst, Analytics Manager, or transition to a data-centric function.
```

Replace with:
```
Expected outcome: Upskill to Senior Analyst, Analytics Manager, or move into a data-centric role at a Bangalore product company.
```

---

**Card 4 — BI and Business Analyst Upgraders**

Find:
```
Expected outcome: Move into Product Analyst, Senior BI Analyst, or Analytics Lead roles.
```

Replace with:
```
Expected outcome: Move into Product Analyst, Analytics Engineer, or Senior BI Analyst roles at Bangalore's tech and product-led companies.
```

---

### 5c. Why AnalytixLabs — Classroom Card Body Text (Bangalore only)

**Find (in the "Real Classroom and Flexible Learning" card):**
```
Learn in-person in Bangalore (HSR Layout). Or join live online sessions with the same faculty. Blend modes as your schedule demands.
```

**Replace with:**
```
Learn in-person at our HSR Layout centre, accessible from Koramangala, BTM Layout, and Electronic City. Or join live online sessions with the same faculty. Weekend and evening batches available for working professionals.
```

---

### 5d. Confirm Before Going Live — Bangalore Items (Do Not Block Other Changes)

Implement 5a, 5b, and 5c now. The items below require AnalytixLabs to supply content before Antigravity can act on them — implement them as a follow-up once confirmed.

| Item | Action Required from AnalytixLabs |
|---|---|
| **Testimonials** | Current 3 testimonials are from NCR-based alumni. Provide 1 to 2 Bangalore-based alumni quotes (name, current role, company) to replace or supplement at least one card. |
| **Alumni logos** | Current logos (Amazon, Flipkart, TCS, etc.) work for all cities. Confirm whether there are Bangalore-specific product companies or startups worth adding to the marquee. |
| **Bangalore classroom fees** | The original brief flagged this as a possible difference. Confirm whether Bangalore classroom pricing (currently ₹61,360 incl. taxes) should differ from NCR or remain the same. |

---

## Post-Change Verification Checklist

After deploying, verify on each page in a fresh browser (Ctrl+Shift+R):

### All 4 pages:
- [ ] Pricing: Classroom card appears **first** (leftmost on desktop, topmost on mobile)
- [ ] Pricing: Live Online card carries the "MOST POPULAR" badge
- [ ] Pricing: Blended card appears **last**
- [ ] H1 reads "Data Analyst + AI Course in [CITY]" — no "Job-Ready Certification" prefix
- [ ] FAQ section has **12 items** total (scroll to bottom to confirm)
- [ ] FAQ 10 question: "How long is the Data Analyst + AI course?"
- [ ] FAQ 11 question: "How do I choose between the Core and AI-Integrated tracks?"
- [ ] FAQ 12 question contains "Google Data Analytics Certificate"
- [ ] FAQ 10, 11, 12 answers contain the correct city name, not "[CITY]"
- [ ] "Check Your Eligibility" is the CTA text on all form submit buttons
- [ ] Sticky bar at bottom: unchanged

### Delhi page only:
- [ ] Browser tab title: "Data Analytics + AI Course in Delhi | Placement Support | AnalytixLabs"

### Bangalore page only:
- [ ] Hero subheadline contains "product companies, startups, and BFSI"
- [ ] Hero subheadline contains "HSR Layout"
- [ ] Fresher persona outcome mentions "Product Analyst"
- [ ] Career Switcher persona outcome mentions "fintech" or "e-commerce"
- [ ] Working Professionals persona outcome mentions "product company"
- [ ] BI Upgrader persona outcome mentions "Analytics Engineer"
- [ ] Classroom Why-Us card mentions "Koramangala" and "Electronic City"
- [ ] No NCR-specific phrasing (Delhi NCR, Noida, Gurgaon) appears in any Bangalore-specific text

---

## Suggested Commit Message

```
fix(da-ai-pages): pricing order, H1, FAQs all cities + Bangalore ecosystem rewrite

- Pricing: reorder cards Classroom first on all 4 pages (spec violation fix)
- H1: "Data Analyst + AI Course in [City]" on all 4 pages
- Delhi title tag: "Placement Support" to match Noida, Gurgaon, Bangalore
- FAQ: add items 10 (duration), 11 (track selection), 12 (MOOC comparison) to all pages
- Bangalore: hero subheadline, persona outcomes, classroom card rewritten
  for product-company and startup ecosystem framing
```
