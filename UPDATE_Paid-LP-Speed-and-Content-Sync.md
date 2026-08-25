# Paid Landing Pages — Speed Fix & Content Sync

## For: Dhaval / Antigravity Development Team
## Prepared by: Sumeet Bansal
## Date: 24 August 2026
## Applies to: the 9 paid landing pages on `careersuccess.analytixlabs.co.in`
## Priority: Part 1 HIGH (speed) · Part 2 HIGH (content) · Part 3 MEDIUM (measurement) · Part 4 next sprint

---

## Summary

| Part | Item | Effort |
|---|---|---|
| **1** | LCP 10.8–12.8s on 8 of 9 pages — get the tag stack off the critical path | Medium |
| **2A** | Stale batch dates — three environment variables | **2 minutes** |
| **2B** | Render `classroomBullet` — copy already written, never displayed | Small |
| **2C** | DA FAQ still quotes April prices | Small |
| **2D** | Consolidate the fee block, remove the advisor gate | Small |
| **2E** | Move repeated facts into one constants file | Medium |
| **2F** | Publish placement numbers | Small, after 2E |
| **3** | Measurement gaps — conversion tracking | Medium |
| **4** | Three new pages | Next sprint |

Good audit. It found the biggest problem on these pages and nothing else we ran could see it.
Two things you had already shipped — `WebAnalytics.tsx` for real-user CWV, and `app/robots.ts`
with AdsBot explicitly allowed — are closed and off this list.

**Nothing in this document is blocked.** Every fee figure below has been checked against the live
organic pages today. The paid-page fee cards are correct — do not change them.

---

# PART 1 — Speed: get the tag stack off the critical path

Diagnosis agreed. One reframe on why, then the build items.

**The reframe.** LCP is what depresses the Lighthouse score, but it does not track commercial
outcome on these nine pages. Rank correlation between LCP and cost per lead is **+0.03**; between
performance score and cost per lead, **+0.05**. Effectively zero. The fastest page in the estate
(`data-analyst-ai-course-bangalore`, LCP 2.7s) has the second-worst cost per lead at ₹815. The best
cost per lead, ₹465, sits on a 12.4-second page.

Main-thread block time looked more promising at +0.62 — plausible, because this funnel converts on
taps and form fills rather than on paint. But it falls to +0.50 excluding the Bangalore DA page and
**+0.29 excluding both Bangalore pages**. On nine data points driven by two, that is a hypothesis,
not a finding.

**So we fix twelve seconds because a twelve-second mobile page is indefensible on ₹5.3 lakh a
month — not because it will close the gap between pages.** Layout stability is genuinely excellent
(CLS 0.000–0.001) and needs nothing.

### 1A — Defer Contentsquare `[highest impact]`

`t.contentsquare.net/uxa/6b031b557520b.js` — ~184 KB, ~53% unused at load, executing during first paint.

Move to `requestIdleCallback`, or Next.js `<Script strategy="lazyOnload">`. Session replay and
heatmapping have no reason to run before the hero paints.

**Acceptance:** Contentsquare absent from the critical request chain; LCP on
`data-science-ai-course-gurgaon` improves by at least 3s in lab.

### 1B — Resolve the duplicate Google Ads tags

`AW-783236209` is configured in `app/layout.tsx`. `AW-17844610385` arrives via server-side GTM.
Both fire early.

Two problems in one: main-thread cost, and a plausible source of **double-counted conversions** —
which matters directly to the conversion values Karan is about to set. Decide which container owns
Ads conversions and remove the other path.

**Acceptance:** one Ads conversion ID firing per page; conversion counts in Google Ads unchanged or
lower, never higher.

### 1C — Move the font import out of the component

`components/CourseInfoSection.tsx` injects this inside a `<style>` tag:

```
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
```

A CSS `@import` serialises the font fetch behind the stylesheet parse, and this one sits in a client
component rather than the document head — on all nine pages. Replace with `next/font` (`DM_Sans`)
in `app/layout.tsx`. Nine weights are requested; the component uses 500–900, so drop 400.

**Acceptance:** no font `@import` anywhere in `components/`; FCP improves; no visible font swap.

### 1D — Hero priority and preconnect

Explicit `fetchpriority="high"` on the hero visual; `preconnect` hints for the font and CDN origins.
Your recommendation, agreed.

### 1E — Investigate the Bangalore DA outlier

`data-analyst-ai-course-bangalore`: LCP 2.7s but TBT **1,440 ms** — three to five times every other
page. It paints fast, then blocks the main thread. Worth knowing what is different there, and
whether it reproduces or was a one-off run.

### 1F — Re-test

Re-run the nine-page Lighthouse sweep after 1A–1D, and re-read the TBT-to-cost relationship once
the tag stack is clean. If responsiveness does track cost per lead, that changes where we optimise next.

---

# PART 2 — Content sync

### 2A — Stale batch dates `[start here — two minutes]`

The "Upcoming Batches" strip shows **24 July** and **14 July 2026**. Both are six weeks in the past.

I traced the source. `components/UpcomingBatches.tsx` reads three environment variables:

```
NEXT_PUBLIC_BATCH_NOIDA
NEXT_PUBLIC_BATCH_GURGAON
NEXT_PUBLIC_BATCH_BANGALORE
```

They are stale in the deployment. The organic pages currently show:

| City | Next batch |
|---|---|
| Bangalore | 07 Sept |
| Noida | 15 Sept |
| Gurgaon | 22 Sept |

**Do now:** set the three variables to those values and redeploy. `NEXT_PUBLIC_` vars are inlined at
build time, so a redeploy is required — a dashboard edit alone will not take effect.

**Then make it not recur.** Two options, your call:

1. Read the dates at request time from whatever feeds the organic batch strip, so paid and organic
   can never diverge. Preferred.
2. Keep the env vars, but include the year (`15 Sept 2026`) and have `parseBatchDate` return `TBD`
   for any date already past. Cheaper, still needs someone to update it.

Right now there is no expiry guard at all — `parseBatchDate` returns `TBD` only for an *empty*
string, never for a past date. That is why this went unnoticed for six weeks.

A past date under "Upcoming Batches" is the single most damaging thing on these pages. It reads as
an abandoned site, at the exact moment someone is deciding whether to trust us with ₹60,000.

### 2B — Render `classroomBullet` `[cheapest win in the whole plan]`

Every page defines it. **Nothing in the codebase references it.** Confirmed:
`grep -rn "classroomBullet"` returns nine definitions and zero uses.

The copy is already written, per city, with metro detail:

| Page | Value |
|---|---|
| `data-analyst-ai-course-noida` | "Noida centre located at Sector 2 (near Sector 15 Metro, Gate no. 3). Weekend and weekday batches available." |
| `data-analyst-ai-course-gurgaon` | "Gurgaon centre located at Sector 44 (near HUDA City Centre). Weekend batches available." |
| `data-analyst-ai-course-bangalore` | "Bangalore centre located at HSR Layout (near Silk Board). Weekend and weekday batches available." |
| `data-analyst-ai-course-delhi` | "Delhi NCR centres in Noida (Sector 2) and Gurgaon (Sector 44). Weekend batches available." |
| `data-science-ai-course-*` | Equivalent per-city strings, shorter phrasing |

**Why this matters commercially:** all seven "near me" keywords score Below average on Google's
landing page experience, at roughly a 25% cost-per-lead premium over city-named keywords. The answer
to those queries is sitting in the file, unrendered.

**Build:** surface it in the "Real Classroom and Flexible Learning" card in the Why AnalytixLabs
section, and add `id="classroom"` to that section so Karan can deep-link proximity ad groups to it.

**Then extend it** into a proper location block: full street address, embedded map, nearest metro with
walking time, and batch days and times as a small table. Keep Delhi's honesty — it correctly says the
nearest centres are Noida and Gurgaon. Add travel time from central Delhi rather than softening it.

Addresses and batch patterns are coming to you separately.

### 2C — DA FAQ still quotes April prices

The four DA pages carry this at **line 191** of each `page.tsx`:

> Find: `The Data Analyst + AI programme starts at Rs.47,200 (incl. taxes) for Blended eLearning, Rs.53,100 for Interactive Live Online, and Rs.61,360 for Classroom and Bootcamp. 0% interest EMI available.`
>
> Replace: `The Data Analyst + AI programme is Rs.53,100 (incl. taxes) for Blended eLearning, Rs.59,000 for Interactive Live Online, and Rs.68,440 for Classroom and Bootcamp. TIH at IIT Bombay or IIT Patna co-certified tracks are Rs.70,800, Rs.80,240 and Rs.87,320 respectively. 0% interest EMI available.`

Files: `data-analyst-ai-course-{noida,gurgaon,delhi,bangalore}/page.tsx`

**The fee cards and spec bar are correct — do not touch them.** ₹53,100 / ₹59,000 / ₹68,440 NASSCOM
and ₹70,800 / ₹80,240 / ₹87,320 TIH match the organic page exactly, for both DA and DS. The two
products are priced identically. `CourseInfoSection.tsx` hardcoding ₹53,100 without a `courseType`
branch is correct behaviour.

Only the FAQ drifted. It carries the April figures from `FIX_DA-AI-Pricing-Correction.md`; prices
have risen since, the cards were updated, the FAQ was not. A prospect who opens the FAQ currently
reads a lower number than the one they will be quoted.

`components/FAQ.tsx` line 8 already holds the correct figures — so the shared component is fine and
only the per-page FAQ arrays are stale. Which is the argument for 2E.

**Leave line 200 alone.** It describes the **Core Data Analytics** track (445 hours, 4–5 months) —
a separate non-AI product, not an error. I am confirming separately whether we still sell it; if we
do not, that answer comes out in a follow-up.

### 2D — Consolidate the fee block and remove the advisor gate

Current footnote:

> "*Fees shown are for the NASSCOM FutureSkills Prime certified programme. An upgrade to the TIH at
> IIT Bombay or TIH at IIT Patna co-certified tracks is available at an additional fee — speak to
> your learning advisor for details."

**Remove it.** The TIH figures are already on the page three sections further down, so the footnote
sends people to a phone call for something they can already read. The organic page publishes both
tracks side by side; the paid page should too.

**Build:** one fee table replacing both the three cards and the separate "Program Fees" text list:

| Mode | NASSCOM FutureSkills Prime | TIH at IIT Bombay / Patna | Duration | EMI |
|---|---|---|---|---|
| Blended eLearning | ₹53,100 | ₹70,800 | 6–8 months | 0% interest, up to 3 instalments |
| Interactive Live Online | ₹59,000 | ₹80,240 | 6–8 months | 0% interest, up to 3 instalments |
| Classroom & Bootcamp | ₹68,440 | ₹87,320 | 6–8 months | 0% interest, up to 3 instalments |

All figures inclusive of taxes. Same table for DA and DS. Add `id="fees"` to the section.

Add one line beneath it, matching organic: *candidates choose one TIH partner — IIT Bombay or IIT
Patna — at enrolment.* Right now the page implies both.

### 2E — Move repeated facts into one constants file

This is the fix that stops the whole category of problem.

The same fact currently lives in nine `page.tsx` files plus `CourseInfoSection.tsx`, `StatsBar.tsx`,
`Hero.tsx`, `FAQ.tsx`, `DetailedCurriculum.tsx` and `CareerServices.tsx`. That is why the FAQ and the
cards drifted apart, and it is why these three contradictions exist right now:

| Fact | Values in the codebase | Where |
|---|---|---|
| Companies hired from us | **50+** vs **700+** | `StatsBar.tsx` / `Hero.tsx` say 50+; DS page FAQs and `CareerServices.tsx` say 700+ |
| DS total hours | **546** vs **700+** vs **500+** | `CourseInfoSection.tsx` says 546; `Hero.tsx`, `FAQ.tsx`, `DetailedCurriculum.tsx` say 700+; the curriculum `<h2>` says 500+ |
| DS module count | **11** vs **8** | FAQ says 11 modules; curriculum sub-head says 8 |

**Build:** create `constants/courseFacts.ts` exporting one object per product — fees by mode and
track, duration, hours, module count, candidates trained, companies hired, rating, years. Refactor
all nine pages and all six components to read from it. No fact literal left in a page or component.

**Do the refactor first and leave the disputed values exactly as they are.** Once every reference
points at one constant, correcting a number is a one-line change. I am confirming the correct values
for companies-hired, DS hours and DS modules and will send them as a short follow-up — at that point
each is a single edit rather than a hunt across sixteen files.

**Two things to know before you start:**

- `files/` and `phase2/` contain duplicate copies of `Hero.tsx`, `StatsBar.tsx` and
  `DetailedCurriculum.tsx`. If those are dead, delete them in this commit — otherwise the next person
  edits the wrong copy. If they are live, tell me and I will treat them as in scope.
- `app/delhi-otp/` and `app/analytixlabs-courses-lg/` are two further pages carrying the same facts
  and the same unrendered `classroomBullet`. They are outside the nine that carry spend. Include them
  in the refactor if they are live; confirm either way.

### 2F — Publish placement numbers `[approved, after 2E]`

"Minimum annual package assured" currently appears with no figure attached. Every placement-intent
paid query converts at approximately zero.

**Approved to publish.** The block needs: median annual package for placed learners, placement rate,
number placed in the last 12 months, and the actual terms of the 50% fee-back guarantee — what
"meet the requirements" means.

**Build the block wired to `courseFacts.ts` (2E) with the fields in place.** Figures follow in the
same message as the 2E values. Ship the block and the numbers together — nothing goes live with a
placeholder.

**Also:** the organic DA page attaches the Job Guarantee specifically to the AI-integrated track and
offers the non-AI track "placement assistance and interview preparation" only. Our paid pages imply
the guarantee broadly. Once I confirm the scope, the qualifying line goes in here.

Add `id="outcomes"` to the Career Assurance section. The alumni employer logo wall is fine as it
stands — it is the numbers that are missing, not the logos.

---

# PART 3 — Measurement

Open since the first audit. Every cost-per-lead figure we quote depends on these.

1. **`/lp/thankyou-check-your-eligibility` — 503 page views in 30 days, no `form_submission` event
   firing.** `/thank-you/` (293 views) and `/thank-you-org/` (337 views) both fire correctly. If that
   is right, roughly 45% of form completions are unrecorded and every cost-per-lead number in
   circulation is pessimistic. **Highest priority in this part.**

2. **`form_submission` fires on the thank-you page, not the landing page.** GA4 therefore cannot
   attribute any conversion back to the page that produced it — which is why landing-page reporting
   has always been thin. Either fire on the LP, or pass the originating page as an event parameter.

3. **Confirm which CRM webhook is live.** `crm_webhook_qualified_lead` (₹1,200 / ₹20,000 converted)
   versus `crm_webhook_qualified_sclx` (₹2,000 / ₹10,000). Both sets are enabled in Google Ads.
   Disable the redundant one and tell Karan which survives.

4. **LSQ qualification rate by lead source** — form vs call vs WhatsApp. Karan needs this to value
   calls and WhatsApp properly. They currently carry ₹0 on a Maximize Conversion Value strategy,
   which means the two highest-volume actions in the account are invisible to bidding. ₹200 is the
   interim floor; the real number should replace it.

5. **70% form abandonment.** 2,070 `form_start` against 611 `form_submission` in 30 days. Undiagnosed.
   Worth a Contentsquare replay pass on the form specifically, once 1A has it loading properly.

---

# PART 4 — Three new pages

Next sprint. Not a rebuild — one new page each, following the existing component set.

| Page | Why | Blocks |
|---|---|---|
| **AI / GenAI — pan-India, not a city page** | ~150,000/month cluster volume; `ai course` alone at 60,500. Geo-qualified AI demand is 4,400/month in Delhi and Bangalore but only 480 in Gurgaon and Noida — a city structure would starve. | Karan's new AI campaign has nowhere to land |
| **Business Analyst** | 18,100/month, distinct from Business Analytics, currently converting at zero whenever it leaks into the DA campaigns | — |
| **Competitor comparison** | Competitor keywords sit at Quality Score 1–3 precisely because nothing answers the comparison. Raw material exists — every page has a Coursera and IBM comparison buried in its FAQ. | Karan reactivating competitor keywords |

If capacity is one page, it is the AI page. Which product it sells is being confirmed — copy comes
to you with the brief.

---

# PARKED

**The ₹1.97 lakh/month budget question.** All four city campaigns are losing 28–32% of impressions
to budget, and Brand is losing 17% at the cheapest cost per lead in the account. Closing that gap
would absorb roughly ₹1.97 lakh a month at current cost per lead. Parked until Parts 1–2 have landed
and we can see what the corrected numbers look like.

---

# Verification checklist

**Part 1 — speed**
- [ ] Contentsquare absent from the critical request chain on all 9 pages
- [ ] Exactly one Google Ads conversion ID firing per page
- [ ] No font `@import` remaining in `components/`
- [ ] Hero has explicit `fetchpriority`; preconnect hints present
- [ ] Lighthouse mobile re-run on all 9 — LCP under 4s
- [ ] Bangalore DA TBT explained or reduced

**Part 2 — content**
- [ ] Batch dates current on all 9; no past date can render under "Upcoming Batches"
- [ ] `classroomBullet` visible on all 9
- [ ] Anchors live: `#fees`, `#curriculum`, `#outcomes`, `#classroom`
- [ ] DA FAQ fee sentence replaced on all 4 DA pages
- [ ] Fee cards and spec bar **unchanged**
- [ ] One fee table per page showing both tracks; advisor-gate footnote removed
- [ ] "choose one TIH partner at enrolment" line present
- [ ] `constants/courseFacts.ts` exists; no fact literal left in any page or component
- [ ] `files/` and `phase2/` duplicates resolved
- [ ] `delhi-otp` and `analytixlabs-courses-lg` confirmed in or out of scope
- [ ] Placement block built and wired, shipped with real figures

**Part 3 — measurement**
- [ ] `form_submission` fires on `/lp/thankyou-check-your-eligibility`
- [ ] Landing page attributable for every conversion in GA4
- [ ] One CRM webhook set enabled, Karan informed
- [ ] LSQ qualification rate by source sent to Karan

---

# Suggested commits

```
fix(lp): refresh batch dates and guard against past dates rendering

- Set NEXT_PUBLIC_BATCH_{NOIDA,GURGAON,BANGALORE} to Sept batches
- parseBatchDate returns TBD for any date already past
- Was showing 24 July / 14 July as "Upcoming" for six weeks
```

```
perf(lp): defer Contentsquare, dedupe Ads tags, move DM Sans to next/font

- Contentsquare -> lazyOnload / requestIdleCallback (184KB off critical path)
- Remove duplicate Ads conversion ID; single container owns conversions
- Replace @import in CourseInfoSection with next/font in layout, drop w400
- Add fetchpriority to hero + preconnect hints
- Target: LCP 12.8s -> under 4s on mobile lab
```

```
fix(lp): render classroomBullet and add section anchors on all 9 pages

- classroomBullet was defined per page and never referenced
- Surfaces per-city address, metro and batch pattern
- Add #fees, #curriculum, #outcomes, #classroom anchors
- Addresses Below-average LP experience on proximity keywords
```

```
fix(lp): update DA FAQ fees to current price list

- FAQ carried April figures (47,200/53,100/61,360); cards were already current
- Now 53,100/59,000/68,440 NASSCOM + 70,800/80,240/87,320 TIH
- Fee cards and spec bar deliberately unchanged - they match organic
```

```
refactor(lp): single source of truth for course facts

- New constants/courseFacts.ts; all 9 pages and 6 components read from it
- No behaviour change - disputed values carried over verbatim
- Removes duplicate copies in files/ and phase2/
```

---

## One process note

The April pricing brief said: *"search all 4 page.tsx files to locate every instance."* That
discipline is what stops this recurring, and it is why 2E matters more than any single copy fix in
this document.

Second half of the same lesson, from my side: a fix brief records what was true the day it was
written. When a number needs checking, the live organic page is the source — not the last brief that
mentioned it. I got that wrong once this week and it cost a round trip.
