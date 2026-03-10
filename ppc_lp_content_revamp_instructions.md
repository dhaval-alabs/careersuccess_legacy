# PPC Landing Page — Full Content Revamp Instructions
**File target:** `alabs-lp` landing page  
**Reference doc:** PPC_Full_Content_Revamp_Consolidated_v4.docx  
**Date:** March 2026  

---

> **Instructions for Antigravity:**  
> Apply each section below to the corresponding component/section in the `alabs-lp` landing page file.  
> Changes are marked `REPLACE`, `ADD`, or `REORDER`. Dev notes are included inline.  
> Priority order for deployment: Stats fix → Curriculum expansion → Pricing → FAQ rewrite → Career Guarantee.

---

## ⚠️ Live Page Audit — 10 March 2026

**Page audited:** https://careersuccess-legacy.vercel.app/  
**Result: 0 of 13 checklist items have been implemented.** The live page is entirely unchanged from the original. All instructions below remain outstanding.

| Section | Status | Issue |
|---------|--------|-------|
| Page `<title>` tag | ❌ Not done | Still reads "Certification Course in Data Science" |
| Hero — H1 | ❌ Not done | Old headline still live |
| Hero — Subheading | ❌ Not done | Old subheading still live |
| Hero — Badges | ❌ Not done | "Job Guarantee" and "NASSCOM Certified" still there |
| Hero — Stats Bar | ❌ Not done | All 4 numbers still wrong (10,000+ / 200+ / 4.8★) |
| Why AnalytixLabs — Header | ❌ Not done | Old header with em dash still live |
| Why AnalytixLabs — 6 Cards | ❌ Not done | Old cards (3 Learning Modes, Placement Readiness, Repeat Any Batch) still live |
| Curriculum — Header | ❌ Not done | Still says "6 deep-dive modules" |
| Curriculum — Module Cards | ❌ Not done | Still only 6 old modules, not 11 |
| Learning Modes — Header | ❌ Not done | Old header with em dash still live |
| Learning Modes — Pricing | ❌ Not done | No prices added |
| Learning Modes — Card Order | ❌ Not done | Live Online is still Card 1 (Classroom should be first) |
| Career Guarantee — Intro | ❌ Not done | "The only data science program..." still live |
| Career Guarantee — Guarantee Box | ❌ Not done | "No questions asked" and em dash still live |
| Career Guarantee — PRP Header | ❌ Not done | "All Courses — Placement Readiness" em dash still there |
| Alumni Testimonials | ❌ Not done | Section is entirely missing from the page |
| Certification — Plagiarism line | ❌ Not done | "Zero plagiarism policy strictly enforced" still live |
| Certification — NASSCOM/MeitY line | ❌ Not done | Additional copy not added |
| How to Enrol | ❌ Not done | Section is entirely missing from the page |
| FAQs | ❌ Not done | Old FAQs (wrong content, wrong questions) still live — see note below |
| Footer CTA | ❌ Not done | "10,000+" and em dash still live |

> **Note on FAQs:** The live page has a mix of old and irrelevant FAQs (including "What if I share my learning account details with my friend?" and "Can I download the recordings?") that are not part of the revamp spec. The dev must **delete all existing FAQs** and replace with the 12 new ones listed in Section 9 below.

> **Additional note — Page `<title>` tag:** Update the HTML `<title>` and meta title to match the new H1: `Data Science Course with Guaranteed Career Support | AnalytixLabs`

---

## Global Rules (Apply Everywhere)

- **Remove all em dashes (`—`) across the page.** Confirmed em dashes found on the live page at these exact locations:
  - Why section header: `"graduates — a complete end-to-end program"`
  - Card 3 (Live + Recorded Classes): `"your personal LMS — 1 year of access included"`
  - Career Guarantee box header: `"NASSCOM Certified — Job Guarantee"`
  - Career Guarantee section intro: `"within 6 months — we refund 50%"`
  - Placement Readiness box: `"All Courses — Placement Readiness"`
  - Footer CTA: `"speak to a counsellor — completely free"`
- **Replace every instance of "Job Guarantee"** with **"Placement with Fee-Back Guarantee"**. Found in: hero badges, Card 2 title, Career Guarantee box header, FAQ answer about placement guarantee.
- **Stats used throughout the page must be: `20,000+` / `50+` / `9.6/10` / `12+`.** Audit hero stats bar, Why section header, FAQ 10 answer, and footer CTA. All are currently wrong.

---

## 0. Page `<title>` Tag

**REPLACE:**
```
Certification Course in Data Science
```
**WITH:**
```
Data Science Course with Guaranteed Career Support | AnalytixLabs
```

---

## 1. Hero Section

### H1 Headline
**REPLACE:**
```
Certification Course in Data Science
```
**WITH:**
```
Data Science Course with Guaranteed Career Support
```

---

### Subheading
**REPLACE:**
```
An extensive industry-relevant Data Science course with Placement Assistance!
```
**WITH:**
```
700+ hours. 11 modules. Classroom + online. NASSCOM-FutureSkills Prime certified. And a placement team that stays with you until you land the right role.
```

---

### Hero Badges
**REPLACE:**
```
NASSCOM Certified | Live + Recorded Classes | Job Guarantee | 1-Year LMS Access
```
**WITH:**
```
NASSCOM-FutureSkills Prime Certified | Classroom + Live Online | Placement with Fee-Back Guarantee | 1-Year LMS Access
```

---

### Stats Bar (4 numbers)
**REPLACE all four stat blocks:**

| Stat | Current | Replace With |
|------|---------|--------------|
| Number | 10,000+ | **20,000+** |
| Label | Alumni Placed | Candidates Trained |
| Number | 200+ | **50+** |
| Label | Hiring Partners | Companies Hired From Us |
| Number | 4.8 ★ | **9.6/10** |
| Label | Google Rating | Avg Student Rating |
| Number | 12+ | **12+** *(no change)* |
| Label | Years of Excellence | Years of Excellence *(no change)* |

---

### Primary CTA
**NO CHANGE.** Keep `"Check Your Eligibility"` across hero, footer, and sticky mobile bar.

---

## 2. Why AnalytixLabs (6 Cards)

### Section Header
**REPLACE:**
```
Everything You Need to Land Your Dream Role

Built for working professionals and fresh graduates — a complete end-to-end program with real accountability.
```
**WITH:**
```
Everything You Need to Build a Career in Data Science

Built for working professionals and fresh graduates. A complete programme with real accountability, real classroom training, and a placement team that delivers. Rated 9.6/10 by 20,000+ past students.
```

---

### Card Layout (Replace all 6 cards)
> **Dev note:** Cards 1, 2, 3 are rewrites. Card 4 merges old "3 Learning Modes" + "Classroom" cards. Cards 5 and 6 are new (replace "Placement Readiness" and "Repeat Any Batch").

| # | Card Title | Copy |
|---|-----------|------|
| 1 | **NASSCOM-FutureSkills Prime Certified** | Globally recognised certification supported by MeitY, Government of India. The definitive mark of industry trust. |
| 2 | **Placement with Fee-Back Guarantee** | Complete the programme and meet the requirements. If you're not placed within 6 months, we refund 50% of your fee. Minimum annual package assured. |
| 3 | **Live + Recorded Classes** | Attend live instructor-led sessions or rewatch anytime via your personal LMS. 1 year of access included. |
| 4 | **Real Classroom + Flexible Learning** | Learn in-person in Noida, Gurgaon, or Bangalore. Or join live online sessions with the same faculty. Blend modes as your schedule demands. Same syllabus, same certification. |
| 5 | **Generative AI in the Curriculum** | Not an afterthought. Prompt engineering and Gen AI for Excel, SQL, Power BI, and Python are part of the core syllabus. |
| 6 | **Mentorship That Continues After Class** | Dedicated mentor support for projects, doubt resolution, and practical guidance between sessions. Regular interactions so you're never stuck. |

---

## 3. Curriculum Section (Major Expansion)

### Section Header
**REPLACE:**
```
Industry-Designed Curriculum

6 deep-dive modules crafted with industry leaders to keep you ahead of the curve.
```
**WITH:**
```
What You'll Learn Across 700+ Hours

11 modules covering analytics, data science, machine learning, and generative AI. Curriculum designed with NASSCOM-FutureSkills Prime to match what the industry actually hires for.
```

---

### Module Cards (Replace all 6 with these 11)
> **Dev note:** Keep the same numbered card layout — just expand from 6 to 11 cards.

| # | Module | Key Topics |
|---|--------|-----------|
| 01 | **Building Blocks** | Analytics & data science intro, business problem solving, Excel fundamentals, foundational statistics |
| 02 | **Data Analytics: Excel, SQL & Power BI** | Advanced Excel, SQL (joins, window functions, CTEs), Power BI (DAX, dashboards, data modelling) |
| 03 | **Python for Data Science** | Core Python, NumPy, Pandas, data cleaning, EDA, data visualisation with Python libraries |
| 04 | **R for Data Science** *(optional eLearning)* | Data import/export, manipulation, analysis, visualisation, intro to predictive modelling in R |
| 05 | **Applied Statistics & Predictive Modelling** | Descriptive/inferential stats, hypothesis testing, linear and logistic regression, model evaluation |
| 06 | **Machine Learning** | Supervised (KNN, SVM, decision trees, ensemble), unsupervised (clustering, recommendations), time series |
| 07 | **Text Mining & NLP** | Regex, text vectorisation, Word2Vec, sentiment analysis, text classification, topic modelling, spaCy/NLTK |
| 08 | **Model Deployment & MLOps** | Git, Flask, cloud deployment, ML lifecycle, end-to-end MLOps pipeline, model monitoring in production |
| 09 | **Generative AI** | Prompt engineering, Gen AI for Excel/SQL/Power BI/Python, generative AI for ML workflows |
| 10 | **Capstone Projects** | 6 real-world projects across banking, e-commerce, telecom, retail. Portfolio you can show recruiters. |
| 11 | **Placement Readiness (8 weeks)** | Resume building, mock interviews, case study practice, simulated recruitment drives with industry pros |

> **Dev note:** Keep the "Download Brochure" CTA below the curriculum section.

---

## 4. Learning Modes + Fees

### Section Header
**REPLACE:**
```
Three Ways to Learn

Pick the mode that fits your life — or blend them for maximum flexibility.
```
**WITH:**
```
Three Ways to Learn. Transparent Pricing.

Same syllabus, same faculty, same NASSCOM-FutureSkills Prime certification. Pick what fits your schedule and budget.
```

---

### Card 1: Classroom & Bootcamp
> **Dev note:** MOVE this card to first position. It is the key differentiator.

**Title:** Classroom & Bootcamp  
**Price:** ₹68,440 (incl. taxes)  
**EMI:** Starting ₹6,387/month | 0% interest EMI available  
**Body:**
```
In-person training at our centres in Noida, Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, hands-on labs, direct faculty access, and on-campus placement activities.
```

---

### Card 2: Interactive Live Online
> **Dev note:** Add "Most Popular" badge.

**Title:** Interactive Live Online  
**Badge:** Most Popular  
**Price:** ₹59,000 (incl. taxes)  
**EMI:** Starting ₹6,387/month | 0% interest EMI available  
**Body:**
```
Real-time, instructor-led sessions from anywhere in India. Same faculty as classroom. Full LMS access with recordings for 1 year. Weekday evening and weekend batches available.
```

---

### Card 3: Blended eLearning

**Title:** Blended eLearning  
**Price:** ₹53,100 (incl. taxes)  
**EMI:** Starting ₹6,387/month | 0% interest EMI available  
**Body:**
```
Self-paced learning with recorded sessions and select live components. Maximum scheduling flexibility. Same curriculum and NASSCOM-FutureSkills Prime certification. Ideal for working professionals with unpredictable schedules.
```

> **Dev note:** Keep the "Signup for a Demo" CTA below this section.

---

## 5. Career Guarantee Section

### Section Intro
**REPLACE:**
```
We're Invested in Your Success

The only data science program in India that backs its training with a real financial guarantee.
```
**WITH:**
```
We're Invested in Your Success

One of the few data science programmes in India that puts real money behind its placement commitment.
```

---

### Guarantee Box
**REPLACE:**
```
NASSCOM Certified — Job Guarantee

Get Placed. Or Get 50% Back.

Meet the eligibility criteria and if you're not placed in a qualifying role with the assured minimum package within 6 months — we refund 50% of your fee. No questions asked.
```
**WITH:**
```
NASSCOM-FutureSkills Prime Certified. Career-Backed.

Get Placed. Or Get 50% Back.

Complete the programme, meet the stipulated requirements, and if you're not placed in a qualifying role with the assured minimum package within 6 months of certification, we refund 50% of your course fee.
```
> **Dev note:** Removed "No questions asked" and "Job Guarantee" label. Promise is identical; framing is honest.

---

### Placement Readiness Box Header
**REPLACE:**
```
All Courses — Placement Readiness
```
**WITH:**
```
Included in All Courses: Placement Readiness
```
> Remaining PRP content (mock interviews, case studies, etc.) stays as-is.

---

## 6. Alumni Testimonials (NEW SECTION)

> **Dev note:** ADD this section between the Certification section and the FAQ. The page currently has zero testimonials — this is a significant gap for a paid PPC page.

**Section Heading:**
```
What Our Alumni Say
```

**Testimonial 1**  
*Piyush Ganar, Class of 2012, IIM Ahmedabad — Director of Operations, Kenty.AI*  
> "The course material is very easy to understand and the case studies were based on real-time business problems. What I love most about AnalytixLabs is that they never operated like a typical commercial enterprise but more like a temple for learning."

**Testimonial 2**  
*Raajeev Kumar Sahu — Senior Manager, Data Science, FinTech Startup*  
> "The course was very structured and gave real-world problems to practice. It also boosted my skills to start participating in hackathons. The placement team was very well organised and connected to industry leaders."

**Testimonial 3**  
*Surbhi Sultania — Analytics Manager, Mastercard Data & Services*  
> "AnalytixLabs is a one-stop solution if you want to break into the field of analytics. The faculty brings years of industry experience and the support continues well beyond the course."

> **Dev note:** Show name, designation, and company for each. Keep each quote to 2–3 lines.

---

## 7. Certification Section

### Plagiarism Line
**REPLACE:**
```
Zero plagiarism policy strictly enforced
```
**WITH:**
```
Original work policy ensures every certificate reflects genuine capability
```

---

### ADD after certificate images:
```
Both certifications are widely recognised by employers across India. The NASSCOM-FutureSkills Prime certification is backed by the Ministry of Electronics & IT, Government of India, making it one of the most credible data science certifications available today.
```

---

## 8. How to Enrol (NEW SECTION)

> **Dev note:** ADD between the Testimonials section and FAQ. This answers the #1 pre-conversion anxiety: "What happens after I fill this form?"

**Section Heading:**
```
Getting Started is Simple
```

**Step 1: Talk to Us.**  
Fill the form on this page or call us directly. A learning advisor will connect with you to understand your background, career goals, and recommend the right learning mode.

**Step 2: Reserve Your Seat.**  
Pick your batch and centre. Classroom batches run in Noida, Gurgaon, and Bangalore. Online and blended batches start every month.

**Step 3: Start Learning.**  
LMS access and batch confirmation within 24 hours of registration. 0% EMI and instalment options available.

---

## 9. FAQs (Full Rewrite — 12 Questions)

> **Dev note — IMPORTANT:** DELETE all existing FAQs on the page. The current live FAQs include questions like "What if I share my learning account details with my friend?" and "Can I download the recordings?" — these are NOT part of the revamp and must be removed. Replace the entire FAQ section with these 12 questions only.

**Section Header:**
```
Common Questions
```

---

**FAQ 1: How much does the data science course cost?**  
*Search terms: data science course fees, how much data science course cost, course charges, fees in [city]*

Fees depend on your learning mode. Classroom: ₹68,440. Live Online: ₹59,000. Blended eLearning: ₹53,100 (all inclusive of taxes). The syllabus, faculty, and NASSCOM-FutureSkills Prime certification are identical across all three. 0% interest EMI is available, and you can pay in up to 3 instalments. The full programme runs 700+ hours over 8 months.

---

**FAQ 2: Does this course come with a placement guarantee?**  
*Search terms: data science course with placement guarantee, job guarantee course in data science*

Yes. For NASSCOM-FutureSkills Prime certified courses, we offer a placement commitment with a 50% fee-back guarantee. Complete the programme, meet the stipulated requirements, and if you're not placed in a qualifying role with the assured minimum annual package within 6 months of certification, 50% of your fee is refunded. Every student also goes through an 8-week Placement Readiness Programme with mock interviews, resume reviews, and simulated recruitment drives.

---

**FAQ 3: What is the eligibility for this data science course?**  
*Search terms: data science course eligibility, data scientist qualifications required, eligibility criteria*

There is no strict eligibility barrier. The course is designed for absolute beginners with no prior coding or technical background. Graduates from any stream (engineering, commerce, arts, science) can enrol. Working professionals looking to transition into data science are equally welcome. Our learning advisors can help you evaluate your profile before you commit.

> **Dev note:** Directly supports the "Check Your Eligibility" CTA. People clicking it want reassurance.

---

**FAQ 4: What subjects are covered in the syllabus?**  
*Search terms: data science course syllabus, data science full course, brochure*

11 modules across 700+ hours: Excel, SQL, Power BI, Python, R (optional), Applied Statistics, Predictive Modelling, Machine Learning, NLP, Model Deployment/MLOps, and Generative AI. You also complete 6 capstone projects and 20+ graded assignments using real business datasets. Download the brochure for the full topic-wise breakdown.

---

**FAQ 5: What certification do I receive?**  
*Search terms: data science certification course, data science certificate online, data science professional certification*

Two certifications: an Advanced Certification from AnalytixLabs and a certification from NASSCOM-FutureSkills Prime (a Government of India initiative backed by MeitY). Both are widely recognised by employers. Certification is awarded after completing all assessments (case studies, MCQs, and viva) within the course timeline. Two attempts per assessment.

---

**FAQ 6: Do you offer classroom training near me?**  
*Search terms: data science course near me, data science course in [city], offline data science course*

Yes. Classroom batches run at our centres in Noida, Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, instructor-led, hands-on. Most institutes have gone fully online. We haven't, because face-to-face mentorship produces noticeably better outcomes. If you're not near a centre, the Interactive Live Online mode gives you the same faculty and real-time interaction.

---

**FAQ 7: Can I do this course while working full-time?**  
*Search terms: data science course online, data science course duration and fees, online data science course*

Absolutely. Most of our students are working professionals. Live online batches run on weekday evenings and weekends. Classroom sessions have weekend options too. Blended eLearning gives maximum flexibility. Plan for about 8–10 hours per week for self-study alongside classes. All sessions are recorded and available on your LMS for a full year.

---

**FAQ 8: What salary can I expect after completing this?**  
*Search terms: data science salary, data scientist salary, jobs after data science course, scope of data science in india*

Entry-level data science roles in India typically pay ₹6–10 LPA. Mid-level: ₹12–20 LPA. Senior roles go beyond ₹25 LPA. Common titles include Data Scientist, ML Engineer, BI Analyst, and Analytics Consultant. Demand spans banking, e-commerce, consulting, healthcare, and tech. Our alumni work at companies like Amazon, Flipkart, HDFC Bank, Accenture, Deloitte, and many others.

---

**FAQ 9: Does this course cover AI and machine learning?**  
*Search terms: ai and data science course, artificial intelligence data science course, ai ml course with placement*

Yes. Machine learning is a core part of the curriculum: supervised/unsupervised learning, ensemble methods, time series, and NLP. The programme also includes a dedicated Generative AI module covering prompt engineering and Gen AI for Excel, SQL, Power BI, and Python. For deeper AI specialisation, we also offer standalone AI and Agentic AI courses.

---

**FAQ 10: Why should I choose AnalytixLabs over other institutes?**  
*Search terms: best data science course, top data science courses in India, best institute for data science*

We've been training professionals in data science, AI, and analytics since 2011. 20,000+ candidates trained, 100,000+ training hours delivered, and a 9.6 average student rating. Unlike most institutes that operate purely online, we run genuine classroom batches in three cities. Curriculum co-developed with NASSCOM-FutureSkills Prime. And 50+ companies have hired our alumni. Book a free demo class and judge for yourself.

---

**FAQ 11: How does this compare to a PG or master's degree in data science?**  
*Search terms: PG in data science, PG diploma in data science, data science degree, master data science course*

A PG or master's typically runs 1–2 years and costs ₹2–5 lakhs or more. Our programme covers the same core skill set in 8 months at a fraction of the cost. The key difference: our curriculum is industry-designed, not academic. You work on real business projects, learn deployment and MLOps, and get dedicated placement support. For working professionals who want to transition without pausing their career for 2 years, this is the more practical path.

---

**FAQ 12: What if I miss a class?**  
*Search terms: operational concern (pre-enrolment anxiety reducer)*

Every live session is recorded and available on your LMS within 24 hours. Review the recording and raise questions with faculty during office hours or at the start of the next class. You can also repeat any class with a subsequent batch within one year of enrolment.

---

## 10. Footer CTA

**REPLACE:**
```
Ready to Launch Your Data Science Career?

Join 10,000+ alumni who transformed their careers with AnalytixLabs. Enroll today or speak to a counsellor — completely free.

Check Your Eligibility →
```
**WITH:**
```
Ready to Start?

Join 20,000+ professionals who trained with AnalytixLabs. Check your eligibility or talk to a learning advisor. No commitment, no pressure.

Check Your Eligibility →
```
> **Dev note:** Keep "Check Your Eligibility" consistent with hero. WhatsApp chat button stays alongside.

---

## 11. Implementation Checklist

> **Audit date: 10 March 2026 — All items below are pending. Zero changes have been applied to the live page.**

| # | Task | Owner | Status |
|---|------|-------|--------|
| 0 | Update `<title>` tag to new H1 copy | Dev | ☐ |
| 1 | Fix stats bar: 20,000+ / 50+ / 9.6/10 / 12+ | Dev | ☐ |
| 2 | Update H1, subheading, and hero badges | Dev + Content | ☐ |
| 3 | Expand curriculum from 6 modules to 11 | Dev + Content | ☐ |
| 4 | Add pricing to learning mode cards + reorder (Classroom first) | Dev | ☐ |
| 5 | Rewrite Career Guarantee section (remove "No questions asked" + "Job Guarantee") | Content | ☐ |
| 6 | Replace Why AnalytixLabs cards: rewrite Card 2, merge Card 4, add Gen AI (Card 5), add Mentorship (Card 6), remove Repeat Batch | Dev + Content | ☐ |
| 7 | Add Alumni Testimonials section (3 testimonials) between Certification and FAQ | Dev + Content | ☐ |
| 8 | Add Certification section copy enhancement (plagiarism line + NASSCOM/MeitY line) | Content | ☐ |
| 9 | Add "How to Enrol" 3-step section between Testimonials and FAQ | Dev + Content | ☐ |
| 10 | DELETE all current FAQs. Replace with 12 new ones listed in Section 9 | Dev + Content | ☐ |
| 11 | Update footer CTA copy + stat (10,000 → 20,000) | Content | ☐ |
| 12 | Remove all em dashes from page (6 confirmed locations — see Global Rules) | QA | ☐ |
| 13 | QA: Check all stats match across hero, Why section, FAQ 10, footer | QA | ☐ |

---

**Priority order for highest conversion impact:**
1. Stats fix (#1)
2. Curriculum expansion (#3)
3. Pricing visibility (#4)
4. FAQ rewrite (#10)
5. Career Guarantee rewrite (#5)
