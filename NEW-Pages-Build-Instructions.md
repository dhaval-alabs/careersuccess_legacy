# New Pages — Build Instructions
## For: Antigravity Development Team
## Prepared by: AnalytixLabs Digital Strategy
## Date: April 2026
## Source reference: careersuccess-legacy.vercel.app (existing Next.js project)

---

## Overview

Build 3 new pages in the `careersuccess-legacy` Next.js project, replicating the content of existing WordPress pages but using the established Next.js design system. All pages must use the existing global CSS, Tailwind config, fonts (Outfit headings / Inter body via `globals.css`), colour tokens, and component patterns already in the project.

| Page | New Route | Source Reference |
|---|---|---|
| Courses | `/analytixlabs-courses-lg` | careersuccess.analytixlabs.co.in/analytixlabs-courses-lg/ |
| Contact Us | `/analytixlabs-contact-us-lg` | careersuccess.analytixlabs.co.in/analytixlabs-contact-us/ |
| Placement | `/analytixlabs-placement-lg` | careersuccess.analytixlabs.co.in/analytixlabs-placement/ |

Each page gets its own folder under `app/`:
```
app/
  analytixlabs-courses-lg/
    page.tsx
    layout.tsx
  analytixlabs-contact-us-lg/
    page.tsx
    layout.tsx
  analytixlabs-placement-lg/
    page.tsx
    layout.tsx
```

---

## Global Rules (Apply to All 3 Pages)

**Design system — use exactly as established:**
- Colours: `#09263F` navy, `#29E8A4` teal, `#239bf5` blue, `#F5C842` yellow
- Fonts: do NOT set `fontFamily` inline anywhere — `globals.css` handles `h1–h4 → Outfit` and `body → Inter`
- Buttons: `.btn-primary` (teal pill), `.btn-secondary` (navy outline pill) from `globals.css`
- Cards: `.card-premium` class from `globals.css`
- Section padding: `py-24` (matches `--section-padding: 6rem`)
- Container: `max-w-[1600px] mx-auto px-4 sm:px-6`

**Shared components to reuse where noted:**
- `<Navbar />` — include on all 3 pages (same sticky nav as all other pages)
- `<Modal />` — existing generic modal for lead capture
- `<LeadCaptureForm />` — existing form component
- Footer: inline (same minimal footer used on other pages)
- Sticky mobile bar: include on Courses page only (not Placement or Contact)

**`layout.tsx` for all 3 pages:**
```tsx
export const metadata = {
  robots: { index: false, follow: false },
  // title and description set per page — see each page section below
};
```
All 3 pages are PPC/utility pages and must be `noindex`.

**Do not create** new conversion actions in Google Ads for these pages at this stage. Lead forms on these pages should fire the existing BLR conversion keys where applicable (see per-page notes). AnalytixLabs will confirm dedicated conversion actions before PPC spend is pointed here.

---

## Page 1 — Courses (`/analytixlabs-courses-lg`)

### `layout.tsx`
```tsx
export const metadata = {
  title: "AI & Data Science Courses | AnalytixLabs",
  description: "Browse AnalytixLabs courses in Data Science, Data Analytics, Business Analytics, AI, and Python. NASSCOM-FutureSkills Prime certified programmes with placement support.",
  robots: { index: false, follow: false },
};
```

### Section Order
```
1. <Navbar />
2. Hero — page title + tools strip
3. Course Cards Grid
4. Need Help section
5. Footer (inline, minimal)
6. Sticky mobile bar
7. Brochure Modal (existing <Modal /> + <LeadCaptureForm />)
```

Note: The WordPress page has a bottom CTA banner ("Hundreds are making the right decision…"). **Do not include this** — it is redundant and has been removed from scope.

---

### Section 2 — Hero

**Layout:** Single column, centred. Light background (`bg-white`).

**Content:**
```
Section label pill: "OUR COURSES"

H1: AI & Data Science Courses

Subheading (p):
Well integrated course modules mapped to specific job roles.
Amazing value for money and seamless experiential learning.
```

Below the subheading, add a **tools strip** — a horizontal scrolling row of tool logo pills. Use the same `animate-marquee` class already in `globals.css`. Show the tool names as text pill badges (styled like `.tool-tag` from `CurriculumTiers`) since individual tool SVGs are not in the project. Tools to include as badge text:

`Python` `SQL` `Power BI` `Tableau` `Excel` `R` `Keras` `TensorFlow` `PyTorch` `Scikit-learn` `Pandas` `NumPy` `Matplotlib` `Seaborn` `Azure SQL` `AWS` `Git` `LangChain` `CrewAI` `AutoGen` `OpenAI` `Gemini` `Stable Diffusion` `DALL-E` `Spark` `MongoDB` `Scala` `FastAPI` `Streamlit`

---

### Section 3 — Course Cards Grid

**Layout:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

**Section heading:**
```
Section label pill: "LEARNING TRACKS"
H2: Comprehensive Learning Tracks
```

**Each card** uses `.card-premium` with the following structure:

```
[Course thumbnail image]    ← placeholder: /lp/images/courses/{slug}.webp
                               AnalytixLabs will upload actual images.
                               Use a navy (#09263F) bg placeholder div (aspect-video)
                               with course initials centred in teal text until images arrive.

[Course title — h3, Outfit font]

[Meta row — pills]:
  🗓 {duration}  |  📚 {classes}  |  🕐 {hours}  |  {level badge if applicable}

[Mode row]:
  {delivery mode text e.g. "Classroom | Live Online | Blended"}

[Price]:
  ₹{price}/- onwards   ← styled: large teal-accent font, navy text

[Two CTAs side by side]:
  [Check Your Eligibility →]   ← .btn-primary — opens Eligibility modal
  [Download Brochure]          ← .btn-secondary — opens Brochure modal
                                  passes course slug (see Dynamic Brochure section below)
```

**Course data (all 7 cards):**

| Slug | Title | Duration | Classes | Hours | Level | Mode | Price |
|---|---|---|---|---|---|---|---|
| `agentic-ai` | Agentic AI Course | 5 Months | — | 335 Hours | — | Fully Interactive Online | ₹40,000 |
| `data-analytics` | Data Analytics Course | 6 Months | 43 Classes | 445 Hours | — | Bootcamp Classroom | ₹56,490 |
| `data-science` | Data Science Course | — | 60 Classes | 675 Hours | Experience | Classroom \| Live Online \| Blended | ₹44,100 |
| `business-analytics` | Business Analytics Course | — | 43 Classes | 445 Hours | Experience | Classroom \| Live Online \| Blended | ₹39,900 |
| `full-stack-ai` | Full Stack Applied AI Course | 6 Months | — | 417 Hours | — | Classroom \| Live Online \| Blended | ₹51,000 |
| `data-visualization` | Data Visualization & Analytics | — | 16 Classes | 148 Hours | Beginner | Classroom \| Live Online \| Blended | ₹18,000 |
| `data-science-python` | Data Science With Python | — | 23 Classes | 265 Hours | Experience | Classroom \| Live Online \| Blended | ₹25,000 |

Show only the meta fields that are present for each course (some courses have no "Classes" count — omit that pill if empty).

---

### Section 4 — Need Help

**Layout:** Full-width centred section. Dark navy background (`bg-[#09263F]`).

**Content:**
```
H2: Need help? Call Us

[Call button]:  📞 +91 9555525908  → tel:9555525908   ← .btn-primary

[WhatsApp button]:  💬 WhatsApp  → https://api.whatsapp.com/send?phone=919555525908   ← .btn-primary (teal)
```

---

### Dynamic Brochure Mechanism — Courses Page

This replaces the generic "Download Brochure" that sends every lead to the same thank-you page regardless of which course they clicked.

**How it works:**

1. Each course card's "Download Brochure" button opens `<Modal />` with `<LeadCaptureForm />` pre-configured:
   - `sourceName` = `"DownloadBrochure"` (existing CRM master value — no change needed)
   - Pass a new prop `brochureCourse` = the course slug (e.g. `"data-analytics"`)
   - This slug is included in the `mx_notes` / `form_source` CRM field alongside the existing pattern

2. On form success, redirect to:
   ```
   /thankyou-download-brochure/?email={email}&name={name}&phone={phone}&course={slug}
   ```

3. Update `ThankYouPage` component (variant: `download-brochure`) to:
   - Read `course` URL param
   - If `course` param is present and matches a known slug, show a prominent download button:
     ```
     [⬇ Download {Course Name} Brochure]  → /lp/brochures/{slug}.pdf  (opens in new tab)
     ```
   - If `course` param is absent or unknown, show the existing generic confirmation message with no download button (fallback — safe)

4. PDF files: AnalytixLabs will upload brochure PDFs as:
   ```
   public/lp/brochures/agentic-ai.pdf
   public/lp/brochures/data-analytics.pdf
   public/lp/brochures/data-science.pdf
   public/lp/brochures/business-analytics.pdf
   public/lp/brochures/full-stack-ai.pdf
   public/lp/brochures/data-visualization.pdf
   public/lp/brochures/data-science-python.pdf
   ```
   Until PDFs are uploaded, the download button should not render (check file existence via a known list, not a runtime file check — hardcode the slug allowlist).

**Files to change for this mechanism:**
- `components/forms/LeadCaptureForm.tsx` — add optional `brochureCourse?: string` prop; include in redirect URL on success
- `components/ThankYouPage.tsx` — read `course` param; render course-specific download button if slug is in allowlist
- `app/analytixlabs-courses-lg/page.tsx` — pass `brochureCourse` when opening modal per card
- **No changes** to `app/api/submit-lead.ts`, CRM field structure, or conversion tracking

**Do not implement** if AnalytixLabs has not yet confirmed the brochure PDF file locations. Build the courses page with the modal wired but `brochureCourse` omitted until PDFs are confirmed. The generic thank-you flow remains the fallback.

---

### Conversion Tracking — Courses Page

Wire the "Check Your Eligibility" CTA on each card to the eligibility modal. Use `ctaSource` = `"lp_blr_submit_lead_primary"` temporarily (generic BLR key) until AnalytixLabs confirms dedicated conversion actions for this page.

Wire the "Download Brochure" CTA to `ctaSource` = `"lp_blr_download_brochure"` temporarily.

---

## Page 2 — Contact Us (`/analytixlabs-contact-us-lg`)

### `layout.tsx`
```tsx
export const metadata = {
  title: "Contact AnalytixLabs | Gurgaon, Bangalore, Noida",
  description: "Get in touch with AnalytixLabs. Call, WhatsApp, or visit our centres in Gurgaon, Bangalore, and Noida. We are here Monday to Saturday, 10 AM to 7 PM.",
  robots: { index: false, follow: false },
};
```

### Section Order
```
1. <Navbar />
2. Contact Hero — left: contact info + CTAs | right: brochure card
3. Locations — "Meet Us Here" with 3 location cards + maps
4. Footer (inline, minimal)
```

Note: The WordPress page has a bottom CTA banner ("Hundreds are making the right decision…"). **Do not include this** — removed from scope per brief.

No sticky mobile bar on this page.

---

### Section 2 — Contact Hero

**Layout:** Two-column grid (`grid lg:grid-cols-2 gap-12`), `py-24`, white background.

**Left column — contact info:**

```
Section label pill: "GET IN TOUCH"

H1: Contact Us

Subheading:
AnalytixLabs is here to support you at every step of your journey.

[CTA buttons row]:
  [📞 +91 95555 25908]   → tel:9555525908    ← .btn-primary (teal)
  [💬 WhatsApp]          → https://api.whatsapp.com/send?phone=919555525908   ← .btn-primary (teal)

Hours line:
  * (10:00 AM to 07:00 PM, Monday to Saturday)
  Style: small text, muted colour, italic

Email row:
  ✉ info@analytixlabs.co.in   → mailto:info@analytixlabs.co.in
  Style: .btn-secondary or plain styled link
```

**Right column — brochure card:**

Use `.card-premium`. Content:

```
[Heading]: Course Brochure
[Body]: Includes all guidelines, curriculum details, and fee information for our courses.

[CTA button]: Download Brochure   ← .btn-primary
```

This button opens the existing `<Modal />` with `<LeadCaptureForm />`:
- `sourceName` = `"DownloadBrochure"`
- `ctaSource` = `"lp_blr_download_brochure"` (temporary — same as current generic key)
- On success: redirect to `/thankyou-download-brochure/` (standard flow, no course param since this is generic)

Do not place an actual brochure image in this card. The WordPress page had a book mockup image — replace with a clean icon or just the text card. AnalytixLabs will provide an image asset if required.

---

### Section 3 — Meet Us Here

**Layout:** Full section, `bg-white`, `py-24`.

**Section heading:**
```
H2: Meet Us Here
```

**3 location cards** in a `grid lg:grid-cols-3 gap-8` layout. Each card uses `.card-premium`.

Card structure:
```
[City name — h3, Outfit font, navy]

[Phone row]:    📞 +91 9555525908

[Address row]:  📍 {full address}

[Hours row]:    🕐 10:00 AM - 7:00 PM

[Google Maps embed — iframe, height 220px, w-full, rounded-xl, border-0]
  → use the existing Google Maps embed URL for each location

[Open in Maps link]:  Open in Maps ↗   → Google Maps URL, opens _blank
  Style: small teal text link, below the map
```

**Location data:**

**Gurgaon:**
- Phone: +91 9555525908
- Address: 2nd Floor, Sidhartha House, Building No. 6, Sector 44, Gurugram, Haryana 122003 (600 metres from HUDA City Metro)
- Hours: 10:00 AM - 7:00 PM
- Maps link: https://maps.app.goo.gl/gurgaon-analytixlabs *(use the actual Google Maps pin URL visible in the iframe on the WP page — copy from browser)*
- Maps embed: `https://www.google.com/maps/embed?pb=!1m18!1m12...` *(copy iframe src from WP page source)*

**Bangalore:**
- Phone: +91 9555525908
- Address: Bldg 51/2, 1st Floor, 12th Main Rd, Near BDA Complex, Sector 6, HSR Layout Back Gate of BDA, Opp. A2B (Adyar Ananda Bhawan), Bengaluru, Karnataka 560102
- Hours: 10:00 AM - 7:00 PM
- Maps link: *(copy from WP page)*
- Maps embed: *(copy iframe src from WP page source)*

**Noida:**
- Phone: +91 9555525908
- Address: 1st Floor, A 78, A Block, Sector 2, Metro Gate 3, Noida, Uttar Pradesh 201301
- Hours: 10:00 AM - 7:00 PM
- Maps link: *(copy from WP page)*
- Maps embed: *(copy iframe src from WP page source)*

> **Action for Antigravity:** The Google Maps `iframe` embed URLs and the "Open in Maps" direct URLs need to be copied from the source WP page before it is taken down or modified. Access the WP pages directly in a browser, right-click the map → "Copy embed code" or view page source for the iframe src. Do this before beginning development.

---

## Page 3 — Placement (`/analytixlabs-placement-lg`)

### `layout.tsx`
```tsx
export const metadata = {
  title: "Placement Guarantee | AnalytixLabs Career Assurance",
  description: "AnalytixLabs offers a Job Guarantee with 50% Fee Refund on NASSCOM-FutureSkills Prime certified programmes. Read the full eligibility criteria and Placement Readiness Program details.",
  robots: { index: false, follow: false },
};
```

### Section Order
```
1. <Navbar />
2. Page Hero — title + intro
3. Job Guarantee — policy sections as styled accordions
4. Placement Readiness Program (PRP) — prose + components list
5. Bottom CTA — call button + 3 location direction buttons
6. Footer (inline, minimal)
```

No sticky mobile bar, no lead capture modal on this page. The bottom CTA redirects to Maps only (no form).

---

### Section 2 — Page Hero

**Layout:** Single column, centred, `py-16`, white background.

```
Section label pill: "CAREER ASSURANCE"

H1: AnalytixLabs Placements

Body paragraph:
AnalytixLabs is a leading Data Science Institute founded in 2011 with the sole mission of imparting industry-relevant and practical skills to make you job-ready. The success of thousands of candidates over the years and the clientele of some of the world's most prestigious organisations is a testimony of the same.

Second paragraph:
With the rapid adoption of Analytics across industries, career opportunities in Data Science have grown exponentially. To help our students make the most of this demand, we offer exclusive Job Guarantee Programmes — exclusively through our Nasscom-FutureSkills Prime Certified Courses. These are further strengthened by our comprehensive Placement Readiness Program (PRP), which is included with all our courses.
```

---

### Section 3 — Job Guarantee

**Layout:** Max-width prose column (`max-w-4xl mx-auto`), white background, `py-16`.

Use a teal left-border accent card (`.glow-border` or a custom `border-l-4 border-[#29E8A4]` div) for the main guarantee statement:

```
[Accent card]:
  H2: Job Guarantee with 50% Fee Refund
  Subheading (teal): Applicable for Nasscom-FutureSkills Prime Certified Courses

  Body:
  At AnalytixLabs, we view your career success as a shared commitment. To reinforce this, we offer a Job Guarantee with 50% Fee Refund — ensuring you have the confidence to invest in your future.

  If you are unable to secure a Qualifying Position (a role in AI, ML, Data Science, Analytics, or a related field, with at least 30 working hours per week or a full-time contractual role of at least three months) within 6 months of the placement window, after meeting the stipulated requirements, we will refund 50% of your course fee.
```

Below the accent card, render each of the following subsections as an **accordion item** (same pattern as `<FAQ />` component — `<details><summary>` with the `+` toggle). This keeps the page compact for visitors who don't need to read all policy detail.

**Accordion item 1 — Which Learning Tracks Are Included?**
```
Summary: Which Learning Tracks Are Included?

Content (bulleted list):
• Full Stack AI Course
• Advanced Certification in Data Science
• Advanced Certification in Data Analytics with AI
• Executive Certification in Data Science with AI Specialization
```

**Accordion item 2 — Eligibility Criteria**
```
Summary: Eligibility Criteria

Content:
• Enrolled in an eligible Nasscom-FutureSkills Prime Certified Programme.
• Full fee paid (including GST).
• All academic, conduct, and placement engagement guidelines are followed.
• Hold a valid Graduate degree at the time of completion of PRP.
```

**Accordion item 3 — Academic and Course Completion Requirements**
```
Summary: Academic and Course Completion Requirements

Content:
• All assessments, vivas, and projects must be completed and submitted — including the Placement Readiness Module.
• Minimum 60% marks in evaluations and 70% attendance in live classes.
• The Student must complete the certification within one year of programme commencement (1.5 years in case of Executive Course).
• Extensions only in case of documented medical emergencies or serious personal issues, subject to approval.
```

**Accordion item 4 — Academic Integrity**
```
Summary: Academic Integrity

Content:
• Submissions are AI-proctored; all vivas and presentations are recorded.
• Zero tolerance for plagiarism or copying — disqualification upon detection.
• Additional presentation or viva rounds may be scheduled if any anomalies are found.
```

**Accordion item 5 — Placement Engagement**
```
Summary: Placement Engagement

Content:
• Mandatory completion of CV building, industry expert interview, attendance in regular Placement Readiness Module (PRP) sessions held and submissions that are planned for your preparation.
• Apply to at least 3 relevant roles per week and report activity to the placement team weekly.
• Mandatory appearance for 3 interviews arranged by AnalytixLabs.
• Prompt and professional communication with the placement team (response within 24 hours).
```

**Accordion item 6 — Minimum Salary Commitment**

Use a styled table (not an accordion — show this open by default):

```
H3: Minimum Salary Commitment

[Table — use the design system table style: navy thead, teal accent on featured row]:

| Programme | Minimum CTC (Annual) |
|---|---|
| Advanced Certification in Data Analytics with AI | ₹5,00,000 |
| Advanced Certification in Data Science / Full Stack AI Course | ₹6,00,000 |
| Executive Certification in Data Science & AI | ₹10,00,000 |

Below table (body text):
For working professionals, a minimum 20% salary hike, as long as it meets the above threshold for their course type.
```

**Accordion item 7 — For Undergraduate Students**
```
Summary: For Undergraduate Students

Content:
• Timely Re-engagement for Placement Support: Students should proactively reconnect with the Placement team as soon as they become eligible for internships or full-time opportunities.
• Placement Window for Students: Students must initiate placement support no later than the beginning of their final year. Requests outside this window may not be accommodated.
• Impact of Extended Graduation Timelines: If graduation is delayed due to backlogs, arrears, or other reasons, placement support cannot be extended beyond the originally expected graduation timeline.
• Skill Refresh Requirement: Placement support is aligned with current industry expectations. If skill gaps are identified, students will need to complete assigned revision modules before proceeding. Refresher modules will be provided at no additional cost.
```

**Accordion item 8 — Refund Terms**
```
Summary: Refund Terms

Content:
• If you meet all requirements and do not secure a Qualifying Position within 6 months, you may apply for a refund of 50% of the course fee.
• Your 6-month placement window starts only after you complete both your certification and the mandatory Placement Readiness Program (PRP) (max. 3 months post-certification).
• Refund requests must be submitted within 21 days after the 6-month period ends.
```

**Accordion item 9 — Disqualification Scenarios**
```
Summary: Disqualification Scenarios

Content:
• Rejecting qualifying offers or ghosting interviews.
• Failure to submit on time or participate in placement efforts.
• Plagiarism or dishonesty during coursework or evaluations.
• Taking jobs in unrelated fields or outside prescribed roles.
• Communication lapses or non-responsiveness.
• Lack of improvement after repeated feedback from AnalytixLabs or hiring companies despite multiple interview opportunities.
```

**Note block** (below all accordions, styled as a subtle info box):
```
Note: This Career Assurance Promise policy document will be officially shared with eligible students via email upon successful enrolment and verification. Please retain a copy for your records.
```

---

### Section 4 — Placement Readiness Program (PRP)

**Layout:** Max-width prose column, `bg-[#f0faf8]` (light teal bg), `py-16`.

```
H2: Placement Readiness Program (PRP)

Intro paragraph:
The Placement Readiness Program (PRP) is a comprehensive, 2-month industry-aligned module aimed at equipping participants with the essential technical and soft skills required for successful employment.

This programme is an integral part of our placement support initiative and includes the following components:
```

Render the 6 PRP components as a **2-column card grid** (`grid sm:grid-cols-2 gap-6`), each as a `.card-premium`. Each card:

```
[Icon — SVG, 28px, teal accent]
[Component name — h3]
[Description — body text]
```

**PRP component cards:**

| Card | Icon suggestion | Title | Description |
|---|---|---|---|
| 1 | Briefcase | Internship | Build essential business communication skills — problem solving, data-driven decision-making, and presentation — while gaining hands-on project experience across different industries and functions. |
| 2 | Book | Interview Preparation | Structured recaps of key technical topics to reinforce core concepts commonly assessed during interviews. |
| 3 | Clipboard | Practice and Assessment | Regular practice tests, case studies, and simulated recruitment drives to build confidence and familiarity with real-world hiring processes. |
| 4 | Chat bubble | Soft Skills Coaching | Focused sessions to enhance business communication, problem-solving, and professional behaviour, tailored to workplace expectations. |
| 5 | Play circle | Mock Interviews | Interactive mock interview sessions with an industry panel, offering personalised feedback and performance insights to help students improve. |
| 6 | User check | One-on-One Guidance | Individual mentorship and feedback from experienced professionals to refine interview techniques and address skill gaps. |

Use the same SVG icon pattern already established in `HowToEnrol.tsx` — stroke-based, 24×24 viewBox, teal stroke.

```
Please Note paragraph (below cards, styled as subtle info box):
Participation in PRP does not guarantee job placement. It is designed to maximise preparedness and improve employability through structured learning and expert-led evaluation.

Final paragraph:
To earn the certification and begin with PRP, students must successfully complete a series of AI-proctored assessments, including case studies, multiple-choice questions (MCQs), and viva evaluations. Each candidate is allowed two attempts per assessment. These assessments are designed to evaluate your comprehensive understanding. A minimum score of 60% is required in each test and section to pass.
```

---

### Section 5 — Bottom CTA (Placement Page)

**Layout:** Dark navy full-width section (`bg-[#09263F]`), `py-16`, centred.

This section is **not a lead capture** — it is purely a contact/directions block.

```
H2: Ready to Get Started?
(colour: white)

Subheading:
Talk to our team or visit us at a centre near you.
(colour: muted white, rgba(255,255,255,0.6))

[Call button]:
  📞 +91 95555 25908   → tel:9555525908   ← .btn-primary (teal)

[3 directions buttons in a row — sm:flex-row, gap-4]:
```

Each directions button is `.btn-secondary` styled with white text and white border (for dark bg context — see `HowToEnrol.tsx` dark section button pattern):

| Button label | Google Maps URL |
|---|---|
| Noida Campus → | https://maps.app.goo.gl/noida *(use actual Maps URL from WP page)* |
| Gurgaon Campus → | https://maps.app.goo.gl/gurgaon *(use actual Maps URL from WP page)* |
| Bangalore Campus → | https://maps.app.goo.gl/bangalore *(use actual Maps URL from WP page)* |

All 3 map links open in `_blank`. No lead capture, no modal, no conversion event on these buttons.

> **Action for Antigravity:** Copy the actual Google Maps URLs from the WP placement page before development. The placeholders above are not real URLs.

---

## Post-Build Verification Checklist

### All 3 pages:
- [ ] `robots: noindex` confirmed in each `layout.tsx`
- [ ] `<Navbar />` renders correctly — same as all other pages
- [ ] No inline `fontFamily` set anywhere in new components
- [ ] No em-dashes (—) in any copy — use commas or colons
- [ ] All CTA button text matches spec exactly
- [ ] No bottom CTA banner ("Hundreds are making the right decision…") on any of the 3 pages

### Courses page:
- [ ] 7 course cards render in `grid-cols-3` on desktop
- [ ] Placeholder nav bg div shows for each card until images uploaded
- [ ] "Check Your Eligibility" opens eligibility modal
- [ ] "Download Brochure" opens brochure modal with correct `sourceName`
- [ ] Tools strip scrolls horizontally with `animate-marquee`
- [ ] Sticky mobile bar is present
- [ ] If dynamic brochure implemented: thank-you page shows course-specific download link when `course` param is present

### Contact page:
- [ ] Phone CTA button fires `tel:9555525908`
- [ ] WhatsApp button opens correct WA link
- [ ] "Download Brochure" card button opens modal, `sourceName = "DownloadBrochure"`
- [ ] All 3 Google Maps iframes load correctly
- [ ] "Open in Maps" links open in `_blank`
- [ ] No bottom CTA section present

### Placement page:
- [ ] All 9 accordion items present and toggle correctly
- [ ] Salary table renders with correct data (3 rows)
- [ ] PRP section has 6 cards in 2-column grid
- [ ] 3 directions buttons at the bottom open correct Google Maps links in `_blank`
- [ ] No lead capture form, no modal on this page
- [ ] No sticky mobile bar

---

## Suggested Commit Message

```
feat(new-pages): add courses, contact, placement pages in Next.js design system

- /analytixlabs-courses-lg: 7 course cards, tools strip, dynamic brochure foundation
- /analytixlabs-contact-us-lg: contact hero, brochure card, 3 location cards with Maps
- /analytixlabs-placement-lg: guarantee policy accordions, PRP cards, directions CTA
- All pages: noindex, Navbar, design system tokens, no bottom CTA banner
- ThankYouPage: brochure-course param support (if dynamic brochure confirmed)
- LeadCaptureForm: brochureCourse prop added (if dynamic brochure confirmed)
```
