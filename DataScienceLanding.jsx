"use client";
import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Placement", href: "#placement" },
  { label: "FAQs", href: "#faqs" },
];

const STATS = [
  { value: "10,000+", label: "Alumni Placed" },
  { value: "4.8★", label: "Google Rating" },
  { value: "200+", label: "Hiring Partners" },
  { value: "12+", label: "Years of Excellence" },
];

const HIGHLIGHTS = [
  {
    icon: "🎓",
    title: "NASSCOM Certified",
    desc: "Industry-recognised certification with global credibility.",
  },
  {
    icon: "💼",
    title: "Job Guarantee",
    desc: "50% fee refund + minimum package assurance if you don't get placed.",
  },
  {
    icon: "🎥",
    title: "Live + Recorded Classes",
    desc: "Attend live or catch up anytime via LMS — 1 year access included.",
  },
  {
    icon: "🏢",
    title: "3 Learning Modes",
    desc: "Online, Classroom (Noida / Gurgaon / Bangalore), or Blended.",
  },
  {
    icon: "🤝",
    title: "Placement Readiness",
    desc: "2-month placement module with mock interviews & recruitment drives.",
  },
  {
    icon: "🔁",
    title: "Repeat Any Batch",
    desc: "Missed a topic? Revisit any class within 1 year of course completion.",
  },
];

const MODULES = [
  {
    num: "01",
    title: "Python for Data Science",
    topics: ["NumPy & Pandas", "Data Wrangling", "EDA & Visualisation"],
  },
  {
    num: "02",
    title: "Statistics & Probability",
    topics: ["Descriptive Statistics", "Inferential Statistics", "Hypothesis Testing"],
  },
  {
    num: "03",
    title: "Machine Learning",
    topics: ["Supervised & Unsupervised", "Feature Engineering", "Model Evaluation"],
  },
  {
    num: "04",
    title: "Deep Learning & AI",
    topics: ["Neural Networks", "CNNs & RNNs", "NLP Fundamentals"],
  },
  {
    num: "05",
    title: "Business Analytics & BI",
    topics: ["Tableau / Power BI", "SQL for Analytics", "Dashboard Design"],
  },
  {
    num: "06",
    title: "Capstone & Placement",
    topics: ["Industry Projects", "Portfolio Building", "Mock Interviews"],
  },
];

const MODES = [
  {
    icon: "💻",
    title: "Interactive Online",
    desc: "Live instructor-led sessions you can attend from anywhere. Full LMS access with recordings.",
    tag: "Most Popular",
    tagColor: "bg-orange-100 text-orange-600",
  },
  {
    icon: "🏛️",
    title: "Classroom",
    desc: "In-person learning at our centres in Noida, Gurgaon, and Bangalore.",
    tag: "Hands-on",
    tagColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: "🔀",
    title: "Blended",
    desc: "Mix online and classroom sessions as per your schedule and location.",
    tag: "Flexible",
    tagColor: "bg-teal-100 text-teal-700",
  },
];

const FAQS = [
  {
    q: "What if I miss a class?",
    a: "Don't worry! All live classes are recorded and available in your LMS. You can also repeat any class within 1 year of course completion. Batch change policies apply.",
  },
  {
    q: "Does this course come with a placement guarantee?",
    a: "For NASSCOM Certified Courses, yes — Job Guarantee with 50% Fee Refund & Minimum Package Assurance if you don't get placed within 6 months of certification. Other courses include a 2-month placement readiness module.",
  },
  {
    q: "Can I download the recordings?",
    a: "No. Recordings are AnalytixLabs' intellectual property and are strictly protected under copyright. They can be streamed online via your LMS account only.",
  },
  {
    q: "How do I get my certificate?",
    a: "Complete weekly assignments and module case studies without plagiarism. Once evaluated, the certificate is awarded. A mock interview / viva may be held if you complete the course beyond the 1-year validity.",
  },
  {
    q: "How long is LMS access available?",
    a: "LMS and course recordings are available for 1 year. Partner content is available for 6 months. In genuine cases, access can be extended for up to 1 year post validity.",
  },
  {
    q: "What if I share my LMS credentials?",
    a: "Sharing login credentials is unauthorised. Multiple logins will flag in the system and access may be permanently terminated.",
  },
];

// ─── Utility: Accordion Item ─────────────────────────────────────────────────

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${open ? "shadow-md" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-center px-6 py-5 bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 text-base pr-4">{q}</span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${open ? "bg-orange-500 rotate-45" : "bg-navy-600 bg-[#1a3a5c]"}`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white text-slate-600 text-sm leading-relaxed border-t border-slate-100">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DataScienceLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans text-slate-800 bg-white antialiased">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-[#1a3a5c] font-black text-xl tracking-tight">
              Analytix<span className="text-orange-500">Labs</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-orange-500 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:9555525908"
              className="text-sm text-slate-600 hover:text-orange-500 font-medium"
            >
              📞 9555525908
            </a>
            <a
              href="#enroll"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Enroll Now
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pb-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium text-slate-700 border-b border-slate-50 hover:text-orange-500"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#enroll"
              className="mt-3 block bg-orange-500 text-white text-center font-bold py-3 rounded-lg"
            >
              Enroll Now
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d2744] via-[#1a3a5c] to-[#0f4c81]">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left copy */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full mb-5">
              🏆 NASSCOM Certified Program
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black leading-tight text-white mb-5">
              Data Science{" "}
              <span className="text-orange-400">Specialization</span>
              <br />Course
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              Master Python, ML, Deep Learning & BI with India's most trusted data science institute.
              Get <strong className="text-white">job guaranteed</strong> or receive 50% of your fee back.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-9">
              {["Job Guarantee", "Live Classes", "1 Yr LMS Access", "Industry Projects"].map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full"
                >
                  ✓ {b}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#enroll"
                id="enroll"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 text-center text-base"
              >
                Enroll Now — Get Free Counselling
              </a>
              <a
                href="#curriculum"
                className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all text-center text-base"
              >
                View Curriculum →
              </a>
            </div>
          </div>

          {/* Right — Lead Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-[#1a3a5c] font-black text-xl mb-1">Get Free Counselling</h2>
            <p className="text-slate-500 text-sm mb-6">Talk to our expert. No spam, promise.</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Preferred Learning Mode</option>
                <option>Online (Live)</option>
                <option>Classroom — Noida</option>
                <option>Classroom — Gurgaon</option>
                <option>Classroom — Bangalore</option>
                <option>Blended</option>
              </select>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-200 text-sm">
                Request Free Counselling →
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">
              By submitting, you agree to our privacy policy.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#1a3a5c] py-6">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-orange-400">{s.value}</div>
              <div className="text-xs font-medium text-slate-300 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW / HIGHLIGHTS ── */}
      <section id="overview" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Why AnalytixLabs</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a5c] mt-2">
              Everything You Need to Launch Your Career
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              A complete, industry-ready program built for working professionals and fresh graduates alike.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{h.icon}</div>
                <h3 className="font-bold text-[#1a3a5c] text-base mb-2 group-hover:text-orange-500 transition-colors">
                  {h.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section id="curriculum" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">What You'll Learn</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a5c] mt-2">
              Comprehensive Curriculum
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              6 in-depth modules designed with industry experts to keep you ahead of the curve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m) => (
              <div
                key={m.num}
                className="relative border border-slate-100 rounded-2xl p-7 bg-gradient-to-br from-white to-slate-50 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute top-5 right-5 text-5xl font-black text-slate-100 group-hover:text-orange-100 transition-colors select-none">
                  {m.num}
                </span>
                <h3 className="font-black text-[#1a3a5c] text-base mb-4 pr-8 leading-snug">
                  {m.title}
                </h3>
                <ul className="space-y-2">
                  {m.topics.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="#enroll"
              className="inline-block bg-[#1a3a5c] hover:bg-[#0d2744] text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              Download Full Syllabus →
            </a>
          </div>
        </div>
      </section>

      {/* ── LEARNING MODES ── */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Flexibility First</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a5c] mt-2">
              Choose Your Learning Mode
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Learn the way that fits your life — online, in-person, or a mix of both.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MODES.map((m) => (
              <div
                key={m.title}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-4xl mb-5">{m.icon}</div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-black text-[#1a3a5c] text-lg">{m.title}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${m.tagColor}`}>
                    {m.tag}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
                <a
                  href="#enroll"
                  className="mt-6 inline-flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all"
                >
                  Enroll in this mode →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLACEMENT ── */}
      <section id="placement" className="py-20 bg-[#0d2744]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-orange-400 text-sm font-bold uppercase tracking-widest">Career First</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Placement Guarantee — Or 50% Fee Back
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">
              We back our training with a real guarantee. If you're not placed in 6 months, you get your money back.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* NASSCOM card */}
            <div className="relative rounded-2xl overflow-hidden border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-8">
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                NASSCOM Certified
              </div>
              <h3 className="text-white font-black text-xl mb-4 mt-2">Job Guarantee Program</h3>
              <ul className="space-y-3 mb-6">
                {[
                  "✅ Guaranteed job placement or 50% fee refund",
                  "✅ Minimum annual package assured",
                  "✅ 6-month post-certification support",
                  "✅ NASSCOM globally recognised certificate",
                ].map((i) => (
                  <li key={i} className="text-slate-300 text-sm">
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href="#enroll"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Apply for Job Guarantee →
              </a>
            </div>

            {/* Placement assistance card */}
            <div className="rounded-2xl border border-blue-400/20 bg-white/5 p-8">
              <h3 className="text-white font-black text-xl mb-4">Placement Readiness Module</h3>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Included in all other courses — a dedicated 2-month, industry-focused module to prepare you for the job market.
              </p>
              <ul className="space-y-3">
                {[
                  "Interview Preparation & Practice Tests",
                  "Case Studies & Simulated Recruitment Drives",
                  "Mock Interviews with Industry Experts",
                  "Resume Building & LinkedIn Optimisation",
                  "Soft Skills & Communication Training",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-blue-400 mt-0.5">→</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logos strip placeholder */}
          <div className="mt-14 text-center">
            <p className="text-slate-500 text-sm font-medium mb-6 uppercase tracking-widest">
              Our alumni work at
            </p>
            <div className="flex flex-wrap justify-center gap-6 opacity-60">
              {["Amazon", "Flipkart", "HDFC", "Accenture", "TCS", "Infosys", "Deloitte", "IBM"].map(
                (c) => (
                  <span
                    key={c}
                    className="text-slate-400 font-black text-sm tracking-tight"
                  >
                    {c}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Recognition</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a5c] mt-2 mb-5">
              Earn an Industry‑Recognised Certificate
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Complete all assignments and module-wise case studies without plagiarism to receive your
              AnalytixLabs Data Science Specialization certificate — backed by NASSCOM credibility.
            </p>
            <ul className="space-y-3">
              {[
                "Weekly assignments + module case studies",
                "Evaluated by industry experts",
                "Zero plagiarism policy",
                "Shareable on LinkedIn & job portals",
              ].map((i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 text-sm">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    ✓
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          {/* Certificate visual */}
          <div className="bg-gradient-to-br from-[#0d2744] to-[#1a3a5c] rounded-2xl p-8 text-center shadow-2xl">
            <div className="border-2 border-orange-500/50 rounded-xl p-6">
              <div className="text-orange-400 font-black text-xs uppercase tracking-widest mb-2">
                AnalytixLabs × NASSCOM
              </div>
              <div className="text-white font-black text-xl mb-1">Certificate of Completion</div>
              <div className="text-slate-400 text-xs mb-6">Data Science Specialization</div>
              <div className="w-16 h-1 bg-orange-500 mx-auto rounded mb-6" />
              <div className="text-slate-500 text-xs italic mb-4">Awarded to</div>
              <div className="text-white font-semibold text-lg border-b border-slate-600 pb-2 mb-4 mx-8">
                Your Name Here
              </div>
              <div className="text-slate-400 text-xs leading-relaxed">
                For successfully completing the Data Science Specialization program with distinction.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section id="faqs" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a5c] mt-2">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 bg-gradient-to-r from-[#0d2744] to-[#1a3a5c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Start Your Data Science Career?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join 10,000+ alumni who transformed their careers with AnalytixLabs.
            Enroll today or talk to a counsellor for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#enroll"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 text-base"
            >
              Enroll Now — Free Counselling
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=919555525908"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-10 py-4 rounded-xl transition-all text-base"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            📍 Centres in Noida · Gurgaon · Bangalore &nbsp;|&nbsp; 📞 9555525908
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#07192d] py-8 text-center">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} AnalytixLabs. All rights reserved. &nbsp;|&nbsp; Recordings
          are protected under copyright law.
        </p>
      </footer>
    </div>
  );
}
