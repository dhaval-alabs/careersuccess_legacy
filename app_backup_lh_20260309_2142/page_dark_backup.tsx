'use client';

import { useState } from "react";
import Image from "next/image";
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "10,000+", label: "Alumni Placed" },
  { value: "200+", label: "Hiring Partners" },
  { value: "4.8 ★", label: "Google Rating" },
  { value: "12+", label: "Years of Excellence" },
];

const TRUST_BADGES = [
  "NASSCOM Certified",
  "Live + Recorded Classes",
  "Job Guarantee",
  "1-Year LMS Access",
];

const HIGHLIGHTS = [
  { icon: "🏅", title: "NASSCOM Certified", desc: "Globally recognised certification co-powered by NASSCOM — the definitive mark of industry trust." },
  { icon: "🔒", title: "Job Guarantee", desc: "Get placed or receive 50% of your fee back. Minimum package assured within 6 months of certification." },
  { icon: "🎥", title: "Live + Recorded Classes", desc: "Attend live instructor-led sessions or rewatch anytime via your personal LMS — 1 year of access included." },
  { icon: "🏛️", title: "3 Learning Modes", desc: "Online, Classroom (Noida / Gurgaon / Bangalore), or Blended — learn the way that fits your life." },
  { icon: "💼", title: "Placement Readiness", desc: "Dedicated 2-month module: mock interviews, case studies & simulated recruitment drives with industry experts." },
  { icon: "🔁", title: "Repeat Any Batch", desc: "Missed a module? Revisit any class for free within 1 year of course completion. Batch change policies apply." },
];

const MODULES = [
  { num: "01", title: "Python for Data Science", topics: ["NumPy & Pandas", "Data Wrangling", "EDA & Visualisation"] },
  { num: "02", title: "Statistics & Probability", topics: ["Descriptive Statistics", "Inferential Statistics", "Hypothesis Testing"] },
  { num: "03", title: "Machine Learning", topics: ["Supervised & Unsupervised", "Feature Engineering", "Model Evaluation"] },
  { num: "04", title: "Deep Learning & NLP", topics: ["Neural Networks", "CNNs & RNNs", "NLP Fundamentals"] },
  { num: "05", title: "Business Analytics & BI", topics: ["Tableau / Power BI", "SQL for Analytics", "Dashboard Design"] },
  { num: "06", title: "Capstone & Placement Prep", topics: ["Industry Projects", "Portfolio Building", "Mock Interviews"] },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E6F7F6] flex items-center justify-center mt-0.5">
        <svg className="w-2.5 h-2.5 text-[#00A99D]" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[#4A6275] text-sm leading-relaxed">{text}</span>
    </li>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="font-sans bg-white text-[#1A2E3B] antialiased">

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#D6ECEB] shadow-[0_2px_12px_rgba(0,169,157,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp"
              alt="AnalytixLabs"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A6275]">
            {["Overview", "Curriculum", "Placement", "FAQs"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#00A99D] transition-colors relative group">
                {l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#00A99D] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="tel:9555525908" className="flex items-center gap-1.5 text-sm text-[#4A6275] hover:text-[#00A99D] font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              9555525908
            </a>
            <button onClick={() => setIsEligibilityOpen(true)} className="bg-[#00A99D] hover:bg-[#008F84] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-[0_4px_14px_rgba(0,169,157,0.35)]">
              Enroll Free →
            </button>
          </div>

          <button className="md:hidden text-[#09263F]" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[#E6F7F6] px-4 pb-5">
            {["Overview", "Curriculum", "Placement", "FAQs"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium text-[#4A6275] border-b border-[#F4FAFA] hover:text-[#00A99D]">{l}</a>
            ))}
            <button onClick={() => { setIsEligibilityOpen(true); setMobileOpen(false); }} className="mt-4 w-full block bg-[#00A99D] text-white text-center font-bold py-3 rounded-xl">Enroll Free →</button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          HERO — copy left | form right
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#09263F]">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#00A99D]/10 -translate-y-1/3 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0E3A5E]/80 translate-y-1/2 -translate-x-1/4 blur-2xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#00A99D 1px,transparent 1px),linear-gradient(90deg,#00A99D 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1fr_440px] gap-12 items-center">

          {/* LEFT: Copy */}
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#00A99D]/15 border border-[#00A99D]/30 text-[#4DCFC7] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                1st March Noida
              </div>
              <div className="inline-flex items-center gap-2 bg-[#FFEA79]/15 border border-[#FFEA79]/30 text-[#FFEA79] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                15th March Gurgaon
              </div>
            </div>

            <h1 className="text-white text-4xl sm:text-5xl lg:text-[3.4rem] font-black leading-[1.1] mb-5 tracking-tight">
              Certification Course
              <br />
              <span className="text-[#00A99D]">in Data Science</span>
            </h1>

            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-[520px]">
              An extensive industry-relevant Data Science course with Placement Assistance!
            </p>

            <div className="flex flex-wrap gap-2.5 mb-10">
              {TRUST_BADGES.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/8 border border-white/15 px-3.5 py-1.5 rounded-full">
                  <svg className="w-3 h-3 text-[#00A99D] flex-shrink-0" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <button
                onClick={() => setIsEligibilityOpen(true)}
                className="bg-[#00A99D] hover:bg-[#008F84] text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(0,169,157,0.4)] text-center"
              >
                Check Your Eligibility →
              </button>
              <a href="tel:9555525908" className="border border-white/20 text-white/80 hover:bg-white/8 font-semibold px-8 py-4 rounded-xl text-base transition-all text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Talk to Our Learning Advisor
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
            <LeadCaptureForm
              title="Get Free Career Counselling"
              sourceName="PPC_Hero_V8"
              buttonText="Request Free Counselling →"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE TRUST BAR
      ══════════════════════════════════════ */}
      <div className="bg-[#00A99D] py-3 overflow-hidden">
        <div className="flex w-max gap-10 items-center animate-marquee">
          {[...Array(3)].flatMap((_, ri) =>
            ["Amazon", "Flipkart", "HDFC Bank", "Accenture", "TCS", "Infosys", "Deloitte", "IBM", "Wipro", "Cognizant", "Capgemini", "EY"].map((c, i) => (
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
            <button onClick={() => setIsBrochureOpen(true)} className="flex-shrink-0 inline-flex items-center gap-2 border-2 border-[#00A99D] text-[#00A99D] hover:bg-[#00A99D] hover:text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
              Download Brochure →
            </button>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A99D]" />
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
              { icon: "💻", title: "Live Online", tag: "Most Popular", dark: true, desc: "Instructor-led live sessions from anywhere. Full LMS access + recordings included.", features: ["Real-time Q&A with faculty", "Flexible batch timings", "1-year recording access"] },
              { icon: "🏛️", title: "Classroom", tag: "In-Person", dark: false, desc: "Learn at our state-of-the-art centres in Noida, Gurgaon, and Bangalore.", features: ["Hands-on lab sessions", "Peer collaboration", "On-campus placement drives"] },
              { icon: "🔀", title: "Blended", tag: "Flexible", dark: false, desc: "Seamlessly mix online and classroom sessions as per your schedule.", features: ["Best of both worlds", "Switch modes anytime", "Same curriculum & faculty"] },
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
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setIsEligibilityOpen(true)} className="text-xs font-bold inline-flex items-center gap-1.5 text-[#00A99D]">Enroll in this mode →</button>
              </div>
            ))}
          </div>
          {/* Demo Signup Button - Centered below cards */}
          <div className="mt-12 text-center">
            <button onClick={() => setIsDemoOpen(true)} className="bg-[#00A99D] hover:bg-[#008F84] text-white font-bold px-10 py-5 rounded-xl transition-all shadow-[0_8px_24px_rgba(0,169,157,0.3)] text-lg">
              Signup for a Demo
            </button>
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A99D]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="relative">
                <span className="inline-block bg-[#00A99D] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">NASSCOM Certified — Job Guarantee</span>
                <h3 className="text-white font-black text-2xl mb-1">Get Placed.</h3>
                <h3 className="text-[#00A99D] font-black text-2xl mb-5">Or Get 50% Back.</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-7">Meet the eligibility criteria and if you're not placed in a qualifying role with the assured minimum package within 6 months — we refund 50% of your fee. No questions asked.</p>
                <ul className="space-y-3 mb-8">
                  {["Minimum annual package assured", "6-month post-certification placement window", "NASSCOM globally recognised certificate", "Dedicated placement relationship manager"].map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <svg className="w-4 h-4 text-[#00A99D] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {i}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setIsEligibilityOpen(true)} className="inline-block bg-[#00A99D] hover:bg-[#008F84] text-white font-black px-7 py-3.5 rounded-xl transition-all shadow-[0_6px_20px_rgba(0,169,157,0.4)] text-sm">
                  Apply for Job Guarantee →
                </button>
              </div>
            </div>

            {/* Placement readiness card */}
            <div className="rounded-2xl border-2 border-[#D6ECEB] p-9 bg-[#F4FAFA]">
              <span className="inline-block bg-[#E6F7F6] text-[#00A99D] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">All Courses — Placement Readiness</span>
              <h3 className="text-[#09263F] font-black text-2xl mb-5">2-Month Industry-Focused<br />Placement Module</h3>
              <p className="text-[#4A6275] text-sm leading-relaxed mb-7">A dedicated module that bridges the gap between learning and landing the right job — included in all courses.</p>
              <ul className="space-y-4">
                {[
                  { icon: "🎯", label: "Interview Preparation", desc: "Structured prep for technical and HR rounds" },
                  { icon: "📝", label: "Practice Tests & Case Studies", desc: "Domain-specific assessment formats" },
                  { icon: "🤝", label: "Mock Interviews", desc: "With active industry experts and hiring managers" },
                  { icon: "🚀", label: "Simulated Recruitment Drives", desc: "Real hiring scenarios with AnalytixLabs partners" },
                  { icon: "📄", label: "Resume & LinkedIn Optimisation", desc: "ATS-ready profiles reviewed by professionals" },
                ].map(({ icon, label, desc }) => (
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
              {["Amazon", "Flipkart", "HDFC Bank", "Accenture", "TCS", "Infosys", "Deloitte", "IBM", "Wipro", "Cognizant"].map((c) => (
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
              {["Weekly assignments + module case studies", "Rigorously evaluated by industry experts", "Zero plagiarism policy strictly enforced", "Shareable on LinkedIn, NASSCOM portal & job boards", "Lifetime validity — your credential never expires"].map((i) => <CheckItem key={i} text={i} />)}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-[#D6ECEB]">
              <Image
                src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Nasscom-Certification-1024x724-1-300x212.jpg"
                alt="NASSCOM Certification"
                width={400}
                height={280}
                className="w-full h-auto rounded-lg"
              />
              <p className="text-[#09263F] font-bold text-xs mt-3 text-center">NASSCOM FutureSkills Prime</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-[#D6ECEB]">
              <Image
                src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Alabs_DS-Advanced-Certification-in-Data-Science-AI-300x212.jpg"
                alt="AnalytixLabs Certification"
                width={400}
                height={280}
                className="w-full h-auto rounded-lg"
              />
              <p className="text-[#09263F] font-bold text-xs mt-3 text-center">AnalytixLabs Advanced Certificate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQs — Harmonized V7
      ══════════════════════════════════════ */}
      <FAQ />

      {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#09263F] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00A99D]/10 blur-3xl rounded-full" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#00A99D 1px,transparent 1px),linear-gradient(90deg,#00A99D 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#00A99D]/15 border border-[#00A99D]/30 text-[#4DCFC7] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A99D] animate-pulse" />
            Limited Seats Per Batch
          </div>
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-4 leading-tight">
            Ready to Launch Your<br /><span className="text-[#00A99D]">Data Science Career?</span>
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-lg mx-auto">Join 10,000+ alumni who transformed their careers with AnalytixLabs. Enroll today or speak to a counsellor — completely free.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsEligibilityOpen(true)}
              className="bg-[#00A99D] hover:bg-[#008F84] text-white font-black px-10 py-4 rounded-xl transition-all shadow-[0_8px_30px_rgba(0,169,157,0.4)] text-base"
            >
              Check Your Eligibility →
            </button>
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
        <button onClick={() => setIsEligibilityOpen(true)} className="flex-1 bg-[#00A99D] text-white font-black py-3 rounded-xl text-sm text-center">Check Eligibility</button>
      </div>

      {/* Modals */}
      <Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
        <LeadCaptureForm
          title="Check Your Eligibility"
          sourceName="PPC_CheckEligibility_V8"
          buttonText="Check Eligibility →"
        />
      </Modal>

      <Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
        <LeadCaptureForm
          title="Download Brochure"
          sourceName="PPC_downloadBrochure_V8"
          buttonText="Download Now →"
        />
      </Modal>

      <Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)}>
        <LeadCaptureForm
          title="Signup for a Demo"
          sourceName="PPC_signUpForDemo"
          buttonText="Signup for a Demo"
        />
      </Modal>

    </div>
  );
}
