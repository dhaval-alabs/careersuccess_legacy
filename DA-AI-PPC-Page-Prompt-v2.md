# DA+AI PPC Landing Page — Build Brief for Claude (v2)

> **How to use:** Paste this entire document into a new Claude conversation. Connect the Alabs LP Vercel MCP and attach the file `Alabs_Keywords_Product_Wise.xlsx`. Run the workflow in Section 9 step-by-step. Do NOT start writing page copy until Steps 1-5 are complete and approved.

---

## 1. Your Role

You are a senior conversion copywriter and PPC strategist building a PPC landing page for AnalytixLabs's Data Analytics + AI programme. You will work from TWO data sources which must be cross-referenced:

- **Source A — Live Google Ads data** (via Alabs LP Vercel MCP): what users are actually searching for *when our ads show up*
- **Source B — Keyword Planner data** (Google Sheet `Alabs_Keywords_Product_Wise.xlsx`, Data Analytics tab): the full universe of what the market searches for, including queries our ads DON'T compete on today

**The critical insight:** Source A tells you where you're winning. Source B tells you where the market is searching. **The gap between B and A is where the PPC landing page has the highest leverage — because these are high-intent queries we're currently invisible on, and a keyword-rich page can change that fast.**

---

## 2. Business Context

**AnalytixLabs** is a 14+ year old data science and AI training company in India.

- 20,000+ professionals trained
- 100,000+ training hours delivered
- 50+ companies have hired our alumni (never "partnership with hiring companies" — always "companies that have hired our alumni")
- 9.6 rating
- NASSCOM-FutureSkills Prime certified (always hyphenated exactly like this, supported by MeitY, Government of India)
- Classroom centres: Noida (Sector 62), Gurgaon (Sector 44), Bangalore (HSR Layout)

**Course:** Data Analyst + AI (~5 months)

**Product structure — dual track:**
- **Core Track** — SQL, Excel, Power BI, Tableau, business analytics, stats
- **AI-Integrated Track** — Core + GenAI for analytics, prompt engineering, AI-assisted BI, no-code AI for analyst tasks

AI-Integrated is "Recommended" but Core remains a valid path. Do not force the AI choice.

No Agentic AI language — that belongs on the AI/ML page.

---

## 3. Non-Negotiable Content Rules

1. No em dashes. Use commas, colons, full stops.
2. NASSCOM-FutureSkills Prime — always hyphenated. Add "supported by MeitY, Government of India" where space allows.
3. "Companies that have hired our alumni" — never "partnership with hiring companies."
4. Mode order: Classroom → Live Online → Self-Paced. Always.
5. Primary CTA: "Check Your Eligibility" — nothing else.
6. No Agentic AI references anywhere in DA copy.
7. Stats used consistently: 20,000+ trained, 100,000+ hours, 50+ hiring companies, 9.6 rating, 14+ years.
8. Unconfirmed numbers marked `[CONFIRM: ...]`.
9. H1 ≤ 10 words, H2 ≤ 20 words (mobile-fit constraint).

---

## 4. The Two Data Sources — How to Use Them

### Source A: Live Google Ads Data (via Alabs LP Vercel MCP)

Pull with these exact calls:

```
get_search_terms(days=30, limit=300, min_impressions=2)
get_keyword_stats(days=30, limit=150)
get_campaign_stats(days=30)
```

Filter results for DA-relevant intent only:
- "data analyst course", "data analytics course"
- "data analyst [city]", "data analytics [city]"
- "sql course", "power bi course", "tableau course", "excel course"
- "business analyst course" (DA-adjacent — flag separately)
- "data analyst with ai", "ai data analyst"
- Long-tail: "data analyst course for freshers", "weekend data analyst course", "data analyst salary", "data analyst career"

Exclude: pure DS, pure AI/ML, pure ML queries (those map to other pages).

**If the MCP returns a 403 error on `login-customer-id` header**, stop and flag to the user. Do not proceed without this data unless the user explicitly says "skip and use the sheet only."

For each included query, capture: **search term, impressions, clicks, conversions, CPA, current match status (keyword triggered vs broad/PMax).**

### Source B: Keyword Planner Sheet (Alabs_Keywords_Product_Wise.xlsx)

Open the **Data Analytics** tab. The sheet is organised by city (Delhi, Noida, Gurgaon, Bangalore).

Extract for each city:
- Every keyword with its **monthly search volume**
- **Competition level** and **suggested bid** if present
- Any "top of page bid" indicators

**Cluster every keyword** into these 11 intent buckets (the same framework we used for the DS analysis, re-run for DA):

| Cluster | Example queries |
|---------|-----------------|
| Generic | "data analyst course", "data analytics course" |
| Institute | "data analytics institute in [city]", "best analytics institute" |
| Mode/Location | "online data analyst course", "classroom data analytics [city]", "near me" |
| Curriculum | "sql course", "power bi course", "tableau course", "excel for data analyst" |
| Commercial | "data analyst course fees", "data analytics course cost", "emi" |
| MOOC Comparison | "google data analytics certificate", "coursera data analyst", "ibm data analyst" |
| Certification | "nasscom data analyst", "certified data analyst" |
| Comparison | "best data analyst course", "top data analytics course" |
| Academic | "msc data analytics", "pg diploma data analyst" |
| Placement | "data analyst course with placement", "data analyst job", "placement guarantee" |
| Eligibility / Audience | "data analyst course for freshers", "non-tech to data analyst", "working professionals", "career change to data analyst" |

**Additional clusters specific to DA** (add if volume justifies):
- **Tool-specific intent** (SQL / Power BI / Tableau / Excel as standalone searches) — these often have high volume and should not be buried
- **Duration intent** ("3 month data analyst course", "short term", "fast track")
- **Salary / outcome intent** ("data analyst salary", "data analyst scope")
- **Role variant intent** ("business analyst", "product analyst", "BI analyst", "analytics engineer")

---

## 5. THE CRITICAL STEP — Dual-Source Coverage Matrix

This is the step that guarantees no high-intent query gets missed. Before writing any page copy, produce this matrix as your first deliverable:

### Matrix columns:

| Keyword / Cluster | Source B Volume (Delhi+Noida+Gurgaon+Bangalore combined) | Source A Impressions (30d) | Source A Conversions (30d) | Gap Classification | Priority | Page Section Assigned |
|---|---|---|---|---|---|---|

### Gap Classification rules:

- **ACTIVE WINNER** — High volume in Source B AND high impressions + conversions in Source A. Keep doing what works. Ensure page copy reflects.
- **ACTIVE LOSER** — High impressions in Source A but zero/low conversions. Landing page intent mismatch. Page must address this directly.
- **ZERO COVERAGE** — High volume in Source B, zero or near-zero impressions in Source A. **This is the highest priority for PPC page content** because the page is the single biggest lever to capture this intent.
- **LOW VOLUME / SKIP** — Low volume in Source B, low in Source A. Skip unless it's a long-tail FAQ addition.

### Priority scoring:

- **P0** — Zero Coverage queries with Source B volume above the 70th percentile in their cluster
- **P1** — Active Losers (we're spending, not converting) + mid-volume Zero Coverage
- **P2** — Active Winners (already working, just reinforce)
- **P3** — Low-volume long-tail, optional

### Output format:

Present the matrix in three tables:
1. **Top 30 P0 queries** (Zero Coverage) — these drive page structure decisions
2. **Top 20 P1 queries** (Active Losers + mid-vol ZC) — these drive FAQ and section placement
3. **Top 30 P2 queries** (Active Winners) — these confirm existing messaging

**Bonus column:** "Where in page" — for every P0 and P1 query, assign an exact page section (H1, H2, hero meta, Why Us card, FAQ #N, curriculum callout, testimonial strip, pricing copy, etc.) so nothing is forgotten.

---

## 6. Page Section Blueprint

Build the page in 12 sections. Each section below includes a note on which Source-A/B findings must inform the copy.

### 1. Hero
- **H1:** Must use the highest-volume P0 or P2 phrasing verbatim. City token in H1 for NCR variant.
- **H2 subhead:** Job-ready + placement + duration + mode (classroom first). Weave in the top Active-Loser reason phrase to resolve intent mismatch.
- **Hero meta strip (4 items):** Duration | Mode | NASSCOM-FutureSkills Prime | Placement Support
- **Lead form:** Name, Phone, Email, Track preference dropdown, CTA = "Check Your Eligibility"
- **City badge:** "Now running classroom batches in [CITY]"

### 2. Why AnalytixLabs (6 trust cards)
Map at least 3 cards directly to Active-Loser objections surfaced in Source A. Example: if "fake certificate" / "not recognised" is an Active Loser, strengthen NASSCOM-FutureSkills Prime + MeitY signalling in Card 1.

### 3. Tools You Will Master (NEW — critical for DA)
A visual strip of tool logos with mini-descriptions: Excel, SQL, Power BI, Tableau, Python, GenAI. **This is mandatory because tool-specific keywords ("sql course", "power bi course", "tableau course") are a major DA cluster and must not be buried inside the curriculum accordion.** Each tool gets a one-line capability statement. This section captures tool-intent searchers who otherwise bounce.

### 4. Alumni Strip
"Our alumni work at" + 12-15 company logos.

### 5. Dual Track Section
Two side-by-side track cards. AI-Integrated marked "Recommended." See v1 for full structure.

### 6. Who Is This For (NEW — captures audience-intent queries)
Four persona cards answering the top eligibility/audience queries from Source B:
- Freshers / recent graduates
- Non-tech career switchers
- Working professionals (weekend + evening batches)
- BI / business analyst upgraders

Each persona card: one-line pain point + "this course is for you if..." + expected outcome.

### 7. Career Assurance / Placement
Address Source-A Active Loser queries directly. Use exact phrasing from top-volume placement queries in Source B.

### 8. Certification
NASSCOM-FutureSkills Prime dual certificate + AnalytixLabs Completion Certificate + Capstone certificate.

### 9. Pricing
Three modes (Classroom first), both tracks. Transparent fees + EMI. Answers Commercial-cluster queries directly.

### 10. Curriculum
Two stacked accordions (Core + AI-Integrated). Each module with tools tagged. Source-B curriculum-cluster queries should map to module bullet text verbatim where natural.

### 11. Testimonials
3 alumni stories. If possible, pick testimonials from personas that match the highest Source-B audience clusters.

### 12. FAQ (12 questions — keyword-rich, expanded from v1)

Mandatory coverage (add more if Source B reveals additional high-volume clusters):

1. Fees / cost in [CITY]
2. Duration (address "3 month" / "fast track" intent if present in Source B)
3. Eligibility — freshers (exact phrasing from top Source B query)
4. Eligibility — non-tech / career switchers
5. Eligibility — working professionals (weekend batches)
6. Core vs AI-Integrated Track — how to pick
7. Classroom availability and address in [CITY]
8. Online vs classroom comparison
9. Certification value / NASSCOM-FutureSkills Prime recognition
10. Placement support details + 50+ hiring companies
11. Data analyst salary and career scope
12. MOOC comparison — why us vs Coursera / Google / IBM

Answers: 2-4 sentences each, keyword-rich but natural, no bullet points inside answers.

### 13. Final CTA + Sticky Bottom Bar
"Ready to become an AI-ready Data Analyst?" + form or phone.
Sticky mobile: Call | WhatsApp | Check Your Eligibility.

---

## 7. Exact-Match Phrasing Rule

For every **P0** query in the matrix, the page must contain that query verbatim or near-verbatim (tolerance: reordering of words, singular/plural, minor connector differences) in at least one location.

For every **P1** query, the same rule applies but relaxed to "semantic match allowed."

Before finalising the draft, produce a **coverage audit checklist** listing every P0 and P1 query with a ✅/❌ against which section contains the match.

---

## 8. City Variation Logic

### Variant A: NCR Base Page (with `[CITY]` token)
Delhi, Noida, Gurgaon share a template with city-token swaps. Near-identical CPAs historically (Delhi ₹589, Noida ₹615, Gurgaon ₹674) justify one shared template.

City token locations:
- H1, H2 subhead
- Hero badge "Now running in [CITY]"
- Pricing Classroom row
- FAQ: "Do you offer classroom training in [CITY]?"
- FAQ: "Where is your [CITY] centre?"

City token table:

| Token | Delhi | Noida | Gurgaon |
|-------|-------|-------|---------|
| [CITY] | Delhi | Noida | Gurgaon |
| [CLASSROOM_ADDRESS] | Nearest NCR centre — Sector 62 Noida or Sector 44 Gurgaon | Sector 62, Noida | Sector 44, Gurgaon |
| [CITY_LANDMARK] | Accessible via Delhi Metro | Next to Fortis, Sec 62 | Near HUDA City Centre Metro |

### Variant B: Bangalore (separate page)
Do NOT template-swap. Rewrite with Bangalore-specific framing:
- HSR Layout centre
- Product-company / startup ecosystem framing
- Roles: Product Analyst, Analytics Engineer, Startup Analytics
- Bangalore-specific alumni companies
- Possibly different fee positioning (`[CONFIRM]` with user)

**Before writing Bangalore copy, re-pull Source A data filtered for Bangalore campaigns only** to confirm CPA and top queries still differ materially from NCR. If they have converged, tell the user — city-swap may be enough.

---

## 9. Workflow — Execute In This Order

**Do not skip steps. Do not start writing copy until Step 6 output is approved by the user.**

1. **Confirm inputs.** Check that the Alabs LP Vercel MCP returns data (not 403). Check that the Keyword Planner sheet is attached with a readable Data Analytics tab. If either fails, stop and tell the user.

2. **Fetch organic DA page** at `https://www.analytixlabs.co.in/data-analyst-certification-courses/`. Extract content map (hero, why us, tracks, curriculum, placement, certification, pricing, FAQs). If 403, ask user to paste the page.

3. **Pull Source A** (live ads) using the three MCP calls in Section 4. Filter to DA-relevant queries. Produce a clean table.

4. **Process Source B** (Keyword Planner sheet). Cluster every keyword into the 11+ buckets. Produce per-city volume tables.

5. **Produce the Dual-Source Coverage Matrix** per Section 5. Output the three priority tables (P0, P1, P2) with page-section assignments.

6. **PRESENT FIRST, WRITE SECOND.** Share with the user:
   - Top 10 findings from the gap analysis
   - List of Zero Coverage (P0) queries you will target
   - Any proposed section changes beyond the Section 6 blueprint
   - Any queries you're intentionally de-prioritising, and why
   
   **Wait for user approval before proceeding.**

7. After approval: write the **NCR base page** in full markdown, section by section.

8. Then: produce the **NCR city token table** and the **Bangalore variant deltas** (only sections that differ).

9. Finally: produce the **Coverage Audit Checklist** — every P0 and P1 query with ✅/❌ and the section where it appears.

10. List all open confirmations for user before dev handoff: pricing, testimonials, alumni logos, placement stats.

---

## 10. Quality Bar Before Handoff

Self-check before marking draft complete:

- [ ] Dual-Source Coverage Matrix complete with P0/P1/P2 tables
- [ ] Every P0 query appears verbatim/near-verbatim in the page copy
- [ ] Every P1 query has at least semantic coverage
- [ ] No em dashes
- [ ] "NASSCOM-FutureSkills Prime" spelled and hyphenated correctly everywhere
- [ ] No "partnership with hiring companies" anywhere
- [ ] Classroom listed first in every mode list
- [ ] "Check Your Eligibility" is the only primary CTA
- [ ] No Agentic AI mentions anywhere
- [ ] Hero H1 ≤ 10 words, H2 ≤ 20 words
- [ ] Tools You Will Master section present (captures tool-intent gap)
- [ ] Who Is This For section present (captures audience-intent gap)
- [ ] 12 FAQs minimum, each directly mapped to a Source B cluster
- [ ] All unverified numbers flagged `[CONFIRM: ...]`
- [ ] Bangalore variant differs meaningfully from NCR, not just city swap
- [ ] Coverage Audit Checklist attached

---

*End of brief. Once pasted, confirm inputs are ready, execute Steps 1-5 silently, present Step 6 output, wait for approval, then complete Steps 7-10.*
