"use client";
import { useState } from "react";

// ─── Brand Design Tokens ─────────────────────────────────────────────────────
// Primary:  Teal #00A99D  |  Dark Navy: #09263F  |  Mid Navy: #0E3A5E
// Accent:   Amber #F5A623 (CTAs / highlights only)
// Light BG: #F4FAFA       |  Text: #1A2E3B       |  Muted: #4A6275

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "10,000+", label: "Alumni Placed" },
  { value: "200+",    label: "Hiring Partners" },
  { value: "4.8 ★",  label: "Google Rating"  },
  { value: "12+",     label: "Years of Excellence" },
];

const TRUST_BADGES = [
  "NASSCOM Certified",
  "Live + Recorded Classes",
  "Job Guarantee",
  "1-Year LMS Access",
];

const HIGHLIGHTS = [
  { icon: "🏅", title: "NASSCOM Certified",     desc: "Globally recognised certification co-powered by NASSCOM — the definitive mark of industry trust." },
  { icon: "🔒", title: "Job Guarantee",          desc: "Get placed or receive 50% of your fee back. Minimum package assured within 6 months of certification." },
  { icon: "🎥", title: "Live + Recorded Classes",desc: "Attend live instructor-led sessions or rewatch anytime via your personal LMS — 1 year of access included." },
  { icon: "🏛️", title: "3 Learning Modes",       desc: "Online, Classroom (Noida / Gurgaon / Bangalore), or Blended — learn the way that fits your life." },
  { icon: "💼", title: "Placement Readiness",    desc: "Dedicated 2-month module: mock interviews, case studies & simulated recruitment drives with industry experts." },
  { icon: "🔁", title: "Repeat Any Batch",       desc: "Missed a module? Revisit any class for free within 1 year of course completion. Batch change policies apply." },
];

const MODULES = [
  { num: "01", title: "Python for Data Science",   topics: ["NumPy & Pandas", "Data Wrangling", "EDA & Visualisation"] },
  { num: "02", title: "Statistics & Probability",  topics: ["Descriptive Statistics", "Inferential Statistics", "Hypothesis Testing"] },
  { num: "03", title: "Machine Learning",           topics: ["Supervised & Unsupervised", "Feature Engineering", "Model Evaluation"] },
  { num: "04", title: "Deep Learning & NLP",        topics: ["Neural Networks", "CNNs & RNNs", "NLP Fundamentals"] },
  { num: "05", title: "Business Analytics & BI",   topics: ["Tableau / Power BI", "SQL for Analytics", "Dashboard Design"] },
  { num: "06", title: "Capstone & Placement Prep", topics: ["Industry Projects", "Portfolio Building", "Mock Interviews"] },
];

const FAQS = [
  {
    q: "What if I miss a class?",
    a: "All live classes are recorded and available in your LMS account. You can also repeat any class within 1 year of course completion (batch change policies apply). Please note that limited support may be available if you cannot complete the course within the 1-year validity.",
  },
  {
    q: "What if I share my LMS credentials with a friend?",
    a: "Sharing LMS login credentials is unauthorised. If the system detects multiple simultaneous logins, it will flag the account and your access to the LMS can be permanently terminated.",
  },
  {
    q: "Does this course come with a placement guarantee?",
    a: "For NASSCOM Certified Courses: Yes — Job Guarantee with 50% Fee Refund and Minimum Package Assurance if you're not placed within 6 months of certification. For all other courses: A comprehensive 2-month placement readiness module is included — covering interview prep, mock interviews, case studies, and simulated recruitment drives with industry experts.",
  },
  {
    q: "Can I download the class recordings?",
    a: "No. Recordings are AnalytixLabs' intellectual property, protected under the Copyright Act. They may only be streamed via your LMS account. Unauthorised downloading or distribution will result in immediate account suspension, forfeiture of course fees, and potential legal action.",
  },
  {
    q: "How do I receive my course certificate?",
    a: "Complete all weekly assignments and module-wise case studies without plagiarism. Once submissions are received and evaluated, the certificate is awarded. If you complete beyond the 1-year validity, a mock interview or viva may be conducted before the certificate is issued.",
  },
  {
    q: "For how long is LMS and recording access available?",
    a: "LMS and course recordings are available for 1 year. For this co-branded NASSCOM certification course, partner content access is limited to 6 months. In genuine cases, access can be extended for up to 1 additional year post the validity period.",
  },
  {
    q: "Do you offer Data Science Courses in Bangalore?",
    a: "Yes! AnalytixLabs offers Data Science Courses in Bangalore in Classroom, fully interactive Live Online, and self-paced Blended eLearning formats — all with placement support including resume building and interview preparation.",
  },
  {
    q: "Is there a learning centre near me?",
    a: "We have learning centres in Noida, Gurgaon, and Bangalore. If you're located elsewhere in India or abroad, our online and blended learning modes let you learn from anywhere.",
  },
  {
    q: "Is AnalytixLabs the best data science institute in India?",
    a: "AnalytixLabs is consistently voted among the top data science institutes in India. Our agile, industry-relevant curriculum, hands-on projects, NASSCOM certification, and proven placement track record have helped thousands of students launch and grow their data careers.",
  },
  {
    q: "Is this available as an online data science course?",
    a: "Absolutely. We offer three flexible modes: (1) Interactive Live Online with a real-time instructor, (2) Classroom / Bootcamp at our centres, and (3) Blended learning where you seamlessly mix both as per your schedule.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`group border rounded-xl overflow-hidden transition-all duration-300 ${open ? "border-[#00A99D] shadow-[0_4px_24px_rgba(0,169,157,0.12)]" : "border-[#D6ECEB] hover:border-[#00A99D]/50"}`}>
      <button onClick={() => setOpen(!open)} className="w-full text-left flex items-start justify-between gap-4 px-6 py-5 bg-white">
        <div className="flex items-start gap-3">
          <span className={`flex-shrink-0 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center mt-0.5 transition-colors ${open ? "bg-[#00A99D] text-white" : "bg-[#E6F7F6] text-[#00A99D]"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-semibold text-[#09263F] text-sm leading-snug">{q}</span>
        </div>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-base font-bold transition-all duration-300 mt-0.5 ${open ? "bg-[#00A99D] border-[#00A99D] text-white rotate-45" : "border-[#D6ECEB] text-[#4A6275] group-hover:border-[#00A99D] group-hover:text-[#00A99D]"}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 bg-[#F4FAFA] border-t border-[#E6F7F6]">
          <p className="text-[#4A6275] text-sm leading-relaxed pt-4 pl-9">{a}</p>
        </div>
      )}
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E6F7F6] flex items-center justify-center mt-0.5">
        <svg className="w-2.5 h-2.5 text-[#00A99D]" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span className="text-[#4A6275] text-sm leading-relaxed">{text}</span>
    </li>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DataScienceLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="font-sans bg-white text-[#1A2E3B] antialiased">

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#D6ECEB] shadow-[0_2px_12px_rgba(0,169,157,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#09263F] flex items-center justify-center">
              <span className="text-[#00A99D] font-black text-xs">AL</span>
            </div>
            <span className="font-black text-[#09263F] text-lg tracking-tight">
              Analytix<span className="text-[#00A99D]">Labs</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A6275]">
            {["Overview","Curriculum","Placement","FAQs"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#00A99D] transition-colors relative group">
                {l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#00A99D] group-hover:w-full transition-all duration-300"/>
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="tel:9555525908" className="flex items-center gap-1.5 text-sm text-[#4A6275] hover:text-[#00A99D] font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              9555525908
            </a>
            <a href="#enroll" className="bg-[#00A99D] hover:bg-[#008F84] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-[0_4px_14px_rgba(0,169,157,0.35)]">
              Enroll Free →
            </a>
          </div>

          <button className="md:hidden text-[#09263F]" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[#E6F7F6] px-4 pb-5">
            {["Overview","Curriculum","Placement","FAQs"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium text-[#4A6275] border-b border-[#F4FAFA] hover:text-[#00A99D]">{l}</a>
            ))}
            <a href="#enroll" className="mt-4 block bg-[#00A99D] text-white text-center font-bold py-3 rounded-xl">Enroll Free →</a>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          HERO — copy left | form right
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#09263F]">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#00A99D]/10 -translate-y-1/3 translate-x-1/3 blur-3xl"/>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0E3A5E]/80 translate-y-1/2 -translate-x-1/4 blur-2xl"/>
          <div className="absolute inset-0 opacity-[0.03]"
            style={{backgroundImage:"linear-gradient(#00A99D 1px,transparent 1px),linear-gradient(90deg,#00A99D 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1fr_440px] gap-12 items-center">

          {/* LEFT: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00A99D]/15 border border-[#00A99D]/30 text-[#4DCFC7] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A99D] animate-pulse"/>
              NASSCOM Certified Program
            </div>

            <h1 className="text-white text-4xl sm:text-5xl lg:text-[3.4rem] font-black leading-[1.1] mb-5 tracking-tight">
              Data Science
              <br/>
              <span className="text-[#00A99D]">Specialization</span>
              <br/>
              <span className="text-white/75 text-3xl sm:text-4xl font-bold">Course</span>
            </h1>

            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-[520px]">
              Master Python, ML, Deep Learning & BI under India's most trusted faculty.
              Get <span className="text-white font-semibold">job guaranteed</span> or receive{" "}
              <span className="text-[#00A99D] font-semibold">50% of your fee back</span>.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-10">
              {TRUST_BADGES.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/8 border border-white/15 px-3.5 py-1.5 rounded-full">
                  <svg className="w-3 h-3 text-[#00A99D] flex-shrink-0" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {b}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a href="#enroll" className="bg-[#00A99D] hover:bg-[#008F84] text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(0,169,157,0.4)] text-center">
                Enroll Now — Free Counselling
              </a>
              <a href="#curriculum" className="border border-white/20 text-white/80 hover:bg-white/8 font-semibold px-8 py-4 rounded-xl text-base transition-all text-center">
                View Curriculum →
              </a>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/5 px-4 py-4 text-center">
                  <div className="text-[#00A99D] font-black text-xl">{s.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Lead Capture Form */}
          <div id="enroll" className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="bg-[#00A99D] px-7 py-5">
              <h2 className="text-white font-black text-lg">Get Free Career Counselling</h2>
              <p className="text-white/75 text-xs mt-1">No spam. Our expert will call you within 24 hrs.</p>
            </div>
            <div className="px-7 py-6 space-y-4">
              {[{p:"Full Name",t:"text",i:"👤"},{p:"Email Address",t:"email",i:"✉️"},{p:"Phone Number",t:"tel",i:"📞"}].map(({p,t,i}) => (
                <div key={p} className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none">{i}</span>
                  <input type={t} placeholder={p}
                    className="w-full border border-[#D6ECEB] rounded-xl pl-10 pr-4 py-3 text-sm text-[#09263F] placeholder-[#9BBAC0] focus:outline-none focus:ring-2 focus:ring-[#00A99D]/40 focus:border-[#00A99D] transition-all bg-[#F4FAFA]"/>
                </div>
              ))}
              <select className="w-full border border-[#D6ECEB] rounded-xl px-4 py-3 text-sm text-[#4A6275] bg-[#F4FAFA] focus:outline-none focus:ring-2 focus:ring-[#00A99D]/40 focus:border-[#00A99D] transition-all">
                <option value="">Preferred Learning Mode</option>
                <option>Live Online (Interactive)</option>
                <option>Classroom — Noida</option>
                <option>Classroom — Gurgaon</option>
                <option>Classroom — Bangalore</option>
                <option>Blended (Online + Classroom)</option>
              </select>
              <select className="w-full border border-[#D6ECEB] rounded-xl px-4 py-3 text-sm text-[#4A6275] bg-[#F4FAFA] focus:outline-none focus:ring-2 focus:ring-[#00A99D]/40 focus:border-[#00A99D] transition-all">
                <option value="">Your Current Status</option>
                <option>Working Professional</option>
                <option>Final Year Student</option>
                <option>Fresh Graduate</option>
                <option>Career Switcher</option>
              </select>
              <button className="w-full bg-[#09263F] hover:bg-[#0E3A5E] text-white font-black py-4 rounded-xl transition-all text-sm tracking-wide shadow-[0_4px_20px_rgba(9,38,63,0.3)]">
                Request Free Counselling →
              </button>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex -space-x-1.5">
                  {["#00A99D","#0E3A5E","#F5A623","#008F84"].map((c,i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-bold"
                      style={{backgroundColor:c}}>{["A","B","C","D"][i]}</div>
                  ))}
                </div>
                <p className="text-[#4A6275] text-xs"><span className="font-bold text-[#09263F]">2,400+</span> enrolled this year</p>
              </div>
            </div>
            <div className="px-7 pb-5">
              <p className="text-center text-[10px] text-[#9BBAC0]">🔒 Your data is safe. We never share personal information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE TRUST BAR
      ══════════════════════════════════════ */}
      <div className="bg-[#00A99D] py-3 overflow-hidden">
        <div style={{animation:"marquee 28s linear infinite",display:"flex",width:"max-content",gap:"2.5rem",alignItems:"center"}}>
          {[...Array(3)].flatMap((_,ri) =>
            ["Amazon","Flipkart","HDFC Bank","Accenture","TCS","Infosys","Deloitte","IBM","Wipro","Cognizant","Capgemini","EY"].map((c,i) => (
              <span key={`${ri}-${i}`} className="text-white/90 font-black text-xs uppercase tracking-widest flex items-center gap-2 flex-shrink-0">
                <span className="text-white/40">◆</span> {c}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          WHY ANALYTIXLABS
      ══════════════════════════════════════ */}
      <section id="overview" className="py-20 bg-[#F4FAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-[#00A99D] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Why AnalytixLabs</span>
            <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-3">
              Everything You Need to Land<span className="text-[#00A99D]"> Your Dream Role</span>
            </h2>
            <p className="text-[#4A6275] max-w-xl mx-auto text-base">Built for working professionals and fresh graduates — a complete end-to-end program with real accountability.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="group bg-white border border-[#D6ECEB] rounded-2xl p-7 hover:border-[#00A99D] hover:shadow-[0_8px_32px_rgba(0,169,157,0.12)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#E6F7F6] group-hover:bg-[#00A99D] flex items-center justify-center text-xl mb-5 transition-colors duration-300">{h.icon}</div>
                <h3 className="font-black text-[#09263F] text-base mb-2">{h.title}</h3>
                <p className="text-[#4A6275] text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CURRICULUM
      ══════════════════════════════════════ */}
      <section id="curriculum" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[#00A99D] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">What You'll Learn</span>
              <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">Industry-Designed Curriculum</h2>
              <p className="text-[#4A6275] max-w-md">6 deep-dive modules crafted with industry leaders to keep you ahead of the curve.</p>
            </div>
            <a href="#enroll" className="flex-shrink-0 inline-flex items-center gap-2 border-2 border-[#00A99D] text-[#00A99D] hover:bg-[#00A99D] hover:text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
              Download Syllabus →
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map((m) => (
              <div key={m.num} className="relative border border-[#D6ECEB] rounded-2xl p-7 bg-white hover:border-[#00A99D] hover:shadow-[0_8px_32px_rgba(0,169,157,0.10)] transition-all duration-300 group overflow-hidden">
                <span className="absolute -top-2 -right-2 text-[80px] font-black text-[#F4FAFA] group-hover:text-[#E6F7F6] transition-colors select-none leading-none">{m.num}</span>
                <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#00A99D] bg-[#E6F7F6] px-3 py-1 rounded-full mb-4">Module {m.num}</span>
                <h3 className="font-black text-[#09263F] text-base mb-4 leading-snug pr-6">{m.title}</h3>
                <ul className="space-y-2.5">
                  {m.topics.map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-[#4A6275]">
                      <span className="w-4 h-4 rounded-full bg-[#E6F7F6] flex-shrink-0 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A99D]"/>
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          LEARNING MODES
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#F4FAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-[#00A99D] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Flexibility First</span>
            <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">Three Ways to Learn</h2>
            <p className="text-[#4A6275] max-w-md mx-auto">Pick the mode that fits your life — or blend them for maximum flexibility.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon:"💻", title:"Live Online", tag:"Most Popular", dark:true,  desc:"Instructor-led live sessions from anywhere. Full LMS access + recordings included.", features:["Real-time Q&A with faculty","Flexible batch timings","1-year recording access"] },
              { icon:"🏛️", title:"Classroom",   tag:"In-Person",    dark:false, desc:"Learn at our state-of-the-art centres in Noida, Gurgaon, and Bangalore.", features:["Hands-on lab sessions","Peer collaboration","On-campus placement drives"] },
              { icon:"🔀", title:"Blended",     tag:"Flexible",    dark:false, desc:"Seamlessly mix online and classroom sessions as per your schedule.", features:["Best of both worlds","Switch modes anytime","Same curriculum & faculty"] },
            ].map((m) => (
              <div key={m.title} className={`rounded-2xl p-8 border transition-all duration-300 group ${m.dark ? "bg-[#09263F] border-[#0E3A5E] hover:shadow-[0_12px_40px_rgba(9,38,63,0.3)]" : "bg-white border-[#D6ECEB] hover:border-[#00A99D] hover:shadow-[0_8px_32px_rgba(0,169,157,0.10)]"}`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="text-3xl">{m.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full ${m.dark ? "bg-[#00A99D]/20 text-[#4DCFC7]" : "bg-[#E6F7F6] text-[#00A99D]"}`}>{m.tag}</span>
                </div>
                <h3 className={`font-black text-xl mb-3 ${m.dark ? "text-white" : "text-[#09263F]"}`}>{m.title}</h3>
                <p className={`text-sm leading-relaxed mb-5 ${m.dark ? "text-white/60" : "text-[#4A6275]"}`}>{m.desc}</p>
                <ul className="space-y-2 mb-6">
                  {m.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-xs font-medium ${m.dark ? "text-white/70" : "text-[#4A6275]"}`}>
                      <svg className="w-3.5 h-3.5 text-[#00A99D] flex-shrink-0" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#enroll" className="text-xs font-bold inline-flex items-center gap-1.5 text-[#00A99D]">Enroll in this mode →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PLACEMENT GUARANTEE
      ══════════════════════════════════════ */}
      <section id="placement" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-[#00A99D] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Career Guarantee</span>
            <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-3">We're Invested in Your Success</h2>
            <p className="text-[#4A6275] max-w-xl mx-auto">The only data science program in India that backs its training with a real financial guarantee.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Guarantee card */}
            <div className="relative rounded-2xl overflow-hidden bg-[#09263F] p-9">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A99D]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"/>
              <div className="relative">
                <span className="inline-block bg-[#00A99D] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">NASSCOM Certified — Job Guarantee</span>
                <h3 className="text-white font-black text-2xl mb-1">Get Placed.</h3>
                <h3 className="text-[#00A99D] font-black text-2xl mb-5">Or Get 50% Back.</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-7">Meet the eligibility criteria and if you're not placed in a qualifying role with the assured minimum package within 6 months — we refund 50% of your fee. No questions asked.</p>
                <ul className="space-y-3 mb-8">
                  {["Minimum annual package assured","6-month post-certification placement window","NASSCOM globally recognised certificate","Dedicated placement relationship manager"].map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#00A99D] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {i}
                    </li>
                  ))}
                </ul>
                <a href="#enroll" className="inline-block bg-[#00A99D] hover:bg-[#008F84] text-white font-black px-7 py-3.5 rounded-xl transition-all shadow-[0_6px_20px_rgba(0,169,157,0.4)] text-sm">
                  Apply for Job Guarantee →
                </a>
              </div>
            </div>

            {/* Placement readiness card */}
            <div className="rounded-2xl border-2 border-[#D6ECEB] p-9 bg-[#F4FAFA]">
              <span className="inline-block bg-[#E6F7F6] text-[#00A99D] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">All Courses — Placement Readiness</span>
              <h3 className="text-[#09263F] font-black text-2xl mb-5">2-Month Industry-Focused<br/>Placement Module</h3>
              <p className="text-[#4A6275] text-sm leading-relaxed mb-7">A dedicated module that bridges the gap between learning and landing the right job — included in all courses.</p>
              <ul className="space-y-4">
                {[
                  {icon:"🎯",label:"Interview Preparation",     desc:"Structured prep for technical and HR rounds"},
                  {icon:"📝",label:"Practice Tests & Case Studies", desc:"Domain-specific assessment formats"},
                  {icon:"🤝",label:"Mock Interviews",            desc:"With active industry experts and hiring managers"},
                  {icon:"🚀",label:"Simulated Recruitment Drives",  desc:"Real hiring scenarios with AnalytixLabs partners"},
                  {icon:"📄",label:"Resume & LinkedIn Optimisation",desc:"ATS-ready profiles reviewed by professionals"},
                ].map(({icon,label,desc}) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="w-9 h-9 rounded-xl bg-white border border-[#D6ECEB] flex items-center justify-center text-base flex-shrink-0 shadow-sm">{icon}</span>
                    <div>
                      <div className="text-sm font-bold text-[#09263F]">{label}</div>
                      <div className="text-xs text-[#4A6275] mt-0.5">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Alumni strip */}
          <div className="mt-12 rounded-2xl border border-[#D6ECEB] bg-[#F4FAFA] px-8 py-7">
            <p className="text-center text-xs font-black uppercase tracking-widest text-[#9BBAC0] mb-6">Our Alumni Work At</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3">
              {["Amazon","Flipkart","HDFC Bank","Accenture","TCS","Infosys","Deloitte","IBM","Wipro","Cognizant"].map((c) => (
                <span key={c} className="text-[#4A6275] font-black text-sm tracking-tight opacity-60 hover:opacity-100 transition-opacity">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CERTIFICATE
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#F4FAFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#00A99D] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Your Credential</span>
            <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-5">Earn an Industry-Recognised Certificate</h2>
            <p className="text-[#4A6275] leading-relaxed mb-7 text-sm">Complete all assignments and module case studies under our strict zero-plagiarism policy. Once evaluated by our faculty, your certificate is awarded — carrying NASSCOM credibility that employers recognise instantly.</p>
            <ul className="space-y-3">
              {["Weekly assignments + module case studies","Rigorously evaluated by industry experts","Zero plagiarism policy strictly enforced","Shareable on LinkedIn, NASSCOM portal & job boards","Lifetime validity — your credential never expires"].map((i) => <CheckItem key={i} text={i}/>)}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#00A99D]/10 rounded-3xl blur-2xl scale-95"/>
            <div className="relative bg-[#09263F] rounded-2xl p-2 shadow-2xl">
              <div className="border border-[#00A99D]/30 rounded-xl p-8 text-center">
                <div className="flex justify-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#09263F] border border-[#00A99D]/30 flex items-center justify-center">
                    <span className="text-[#00A99D] font-black text-[10px]">AL</span>
                  </div>
                  <div className="text-white/30 text-xl font-thin leading-none self-center">×</div>
                  <div className="w-8 h-8 rounded-lg bg-[#00A99D]/20 border border-[#00A99D]/30 flex items-center justify-center">
                    <span className="text-[#00A99D] font-black text-[8px] leading-tight text-center">NA<br/>SS</span>
                  </div>
                </div>
                <div className="text-[#00A99D] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Certificate of Completion</div>
                <div className="text-white font-black text-xl mb-1">Data Science</div>
                <div className="text-white font-black text-xl mb-5">Specialization</div>
                <div className="w-12 h-0.5 bg-[#00A99D] mx-auto mb-5 rounded"/>
                <div className="text-white/40 text-[10px] mb-2 uppercase tracking-wider">Awarded to</div>
                <div className="text-white font-bold text-lg border-b border-white/15 pb-3 mb-4 mx-6 italic">Your Name Here</div>
                <p className="text-white/40 text-[10px] leading-relaxed">For successfully completing the Data Science<br/>Specialization program with distinction.</p>
                <div className="mt-5 flex justify-between items-end px-2">
                  <div><div className="w-16 h-0.5 bg-white/20 mb-1"/><div className="text-white/30 text-[9px]">Faculty Signature</div></div>
                  <div className="w-10 h-10 rounded-full border border-[#00A99D]/40 flex items-center justify-center">
                    <span className="text-[#00A99D] font-black text-[9px]">SEAL</span>
                  </div>
                  <div className="text-right"><div className="w-16 h-0.5 bg-white/20 mb-1 ml-auto"/><div className="text-white/30 text-[9px]">Director</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQs — all 10
      ══════════════════════════════════════ */}
      <section id="faqs" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#00A99D] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Got Questions?</span>
            <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-3">Frequently Asked Questions</h2>
            <p className="text-[#4A6275] max-w-md mx-auto text-sm">
              Everything you need to know before enrolling. Can't find the answer?{" "}
              <a href="https://api.whatsapp.com/send?phone=919555525908" className="text-[#00A99D] font-semibold hover:underline">Chat with us →</a>
            </p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => <FAQItem key={f.q} q={f.q} a={f.a} index={i}/>)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#09263F] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00A99D]/10 blur-3xl rounded-full"/>
          <div className="absolute inset-0 opacity-[0.03]"
            style={{backgroundImage:"linear-gradient(#00A99D 1px,transparent 1px),linear-gradient(90deg,#00A99D 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#00A99D]/15 border border-[#00A99D]/30 text-[#4DCFC7] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A99D] animate-pulse"/>
            Limited Seats Per Batch
          </div>
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4 leading-tight">
            Ready to Launch Your<br/><span className="text-[#00A99D]">Data Science Career?</span>
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-lg mx-auto">Join 10,000+ alumni who transformed their careers with AnalytixLabs. Enroll today or speak to a counsellor — completely free.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#enroll" className="bg-[#00A99D] hover:bg-[#008F84] text-white font-black px-10 py-4 rounded-xl transition-all shadow-[0_8px_30px_rgba(0,169,157,0.4)] text-base">
              Enroll Now — Free Counselling
            </a>
            <a href="https://api.whatsapp.com/send?phone=919555525908" target="_blank" rel="noreferrer"
              className="bg-white/8 hover:bg-white/15 border border-white/20 text-white font-semibold px-10 py-4 rounded-xl transition-all text-base">
              💬 Chat on WhatsApp
            </a>
          </div>
          <p className="text-white/30 text-xs mt-8">📍 Centres in Noida · Gurgaon · Bangalore &nbsp;|&nbsp; 📞 9555525908</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06192b] py-6 border-t border-white/5">
        <p className="text-center text-[#4A6275] text-xs">
          © {new Date().getFullYear()} AnalytixLabs. All rights reserved. &nbsp;|&nbsp;
          Recordings are protected under copyright law and are the intellectual property of AnalytixLabs.
        </p>
      </footer>

      {/* STICKY MOBILE BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D6ECEB] px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <a href="tel:9555525908" className="flex-1 flex items-center justify-center gap-1.5 border border-[#D6ECEB] text-[#09263F] font-bold py-3 rounded-xl text-sm">📞 Call</a>
        <a href="https://api.whatsapp.com/send?phone=919555525908" target="_blank" rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 border border-[#D6ECEB] text-[#09263F] font-bold py-3 rounded-xl text-sm">💬 Chat</a>
        <a href="#enroll" className="flex-1 bg-[#00A99D] text-white font-black py-3 rounded-xl text-sm text-center">Enroll Free</a>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
