'use client';

import { useState } from "react";
import Image from "next/image";
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";
import CourseInfoSection from "../components/CourseInfoSection";

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "20,000+", label: "Candidates Trained" },
  { value: "50+", label: "Companies Hired From Us" },
  { value: "9.6/10", label: "Avg Student Rating" },
  { value: "12+", label: "Years of Excellence" },
];

const TRUST_BADGES = [
  "Classroom + Live Online + Recordings",
  "Placement with Fee-Back Guarantee",
  "1-Year LMS Access",
];

const HIGHLIGHTS = [
  { icon: "🏅", title: "NASSCOM-FutureSkills Prime Certified", desc: "Globally recognised certification supported by MeitY, Government of India. The definitive mark of industry trust." },
  { icon: "🔒", title: "Placement with Fee-Back Guarantee", desc: "Complete the programme and meet the requirements. If you're not placed within 6 months, we refund 50% of your fee. Minimum annual package assured." },
  { icon: "🎥", title: "Live + Recorded Classes", desc: "Attend live instructor-led sessions or rewatch anytime via your personal LMS. 1 year of access included." },
  { icon: "🏛️", title: "Real Classroom + Flexible Learning", desc: "Learn in-person in Noida, Gurgaon, or Bangalore. Or join live online sessions with the same faculty. Blend modes as your schedule demands." },
  { icon: "🤖", title: "Generative AI in the Curriculum", desc: "Not an afterthought. Prompt engineering and Gen AI for Excel, SQL, Power BI, and Python are part of the core syllabus." },
  { icon: "🤝", title: "Mentorship Beyond the Class", desc: "Dedicated mentor support for projects, doubt resolution, and practical guidance between sessions. You're never stuck." },
];

const MODULES = [
  { num: "01", title: "Building Blocks", topics: ["Analytics & data science intro", "Business problem solving", "Excel fundamentals", "Foundational statistics"] },
  { num: "02", title: "Data Analytics: Excel, SQL & Power BI", topics: ["Advanced Excel", "SQL (joins, window functions, CTEs)", "Power BI (DAX, dashboards, data modelling)"] },
  { num: "03", title: "Python for Data Science", topics: ["Core Python, NumPy, Pandas", "Data cleaning, EDA", "Data visualisation with Python libraries"] },
  { num: "04", title: "R for Data Science (optional eLearning)", topics: ["Data import/export", "Manipulation & analysis", "Predictive modelling in R"] },
  { num: "05", title: "Applied Statistics & Predictive Modelling", topics: ["Descriptive/inferential stats", "Hypothesis testing", "Linear & logistic regression", "Model evaluation"] },
  { num: "06", title: "Machine Learning", topics: ["Supervised (KNN, SVM, trees, ensemble)", "Unsupervised (Clustering, recommendation)", "Time series analysis"] },
  { num: "07", title: "Text Mining & NLP", topics: ["Regex, text vectorisation, Word2Vec", "Sentiment analysis, text classification", "spaCy/NLTK"] },
  { num: "08", title: "Model Deployment & MLOps", topics: ["Git, Flask, Cloud deployment", "ML lifecycle", "Monitoring in production"] },
  { num: "09", title: "Generative AI", topics: ["Prompt engineering", "Gen AI for Excel/SQL/Power BI/Python", "Gen AI for ML workflows"] },
  { num: "10", title: "Capstone Projects", topics: ["6 real-world projects", "Banking & E-commerce", "Portfolio building"] },
  { num: "11", title: "Placement Readiness (8 weeks)", topics: ["Resume building", "Mock interviews", "Case study practice", "Simulated recruitment drives"] },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E6F7F6] flex items-center justify-center mt-0.5">
        <svg className="w-2.5 h-2.5 text-[#29E8A4]" viewBox="0 0 12 10" fill="none">
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
      <main id="main-content">

        {/* ══════════════════════════════════════
          HERO - copy left | form right
      ══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white">
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#29E8A4]/10 -translate-y-1/3 translate-x-1/3 blur-[120px]" />
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#9BE9FF]/15 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#FFEA79]/10 blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "linear-gradient(#29E8A4 1px,transparent 1px),linear-gradient(90deg,#29E8A4 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1fr_500px] gap-12 items-center">

            {/* LEFT: Copy */}
            <div>
              {/* Logos inside hero */}
              <div className="mb-10 flex items-center gap-6 sm:gap-8">
                <Image
                  src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp"
                  alt="AnalytixLabs"
                  width={180}
                  height={40}
                  className="h-9 sm:h-10 w-auto"
                  priority
                />
                <div className="w-px h-8 bg-[#D6ECEB]" />
                <Image
                  src="https://www.analytixlabs.co.in/wp-content/uploads/2026/03/logo-nasscom-ministry-removebg.webp"
                  alt="Nasscom Futureskills"
                  width={160}
                  height={40}
                  className="h-8 sm:h-9 w-auto"
                  priority
                />
              </div>

              {/* Removed badges above H1 */}

              <h1 className="text-[#09263F] text-4xl sm:text-5xl lg:text-[3.4rem] font-black leading-[1.1] mb-5 tracking-tight">
                Data Science Course with
                <br />
                <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Guaranteed Career Support</span>
              </h1>

              <p className="text-[#4A6275] text-base sm:text-lg leading-relaxed mb-8 max-w-[620px]">
                700+ hours. 11 modules. Classroom + online. NASSCOM-FutureSkills Prime certified. And a placement team that stays with you until you land the right role.
              </p>

              <div className="flex flex-wrap gap-2.5 mb-10">
                {TRUST_BADGES.map((b) => (
                  <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-[#4A6275] bg-[#F4FBFA] border border-[#D6ECEB] px-3.5 py-1.5 rounded-full">
                    <svg className="w-3 h-3 text-[#239bf5] flex-shrink-0" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {b}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <button
                  onClick={() => setIsEligibilityOpen(true)}
                  className="bg-[#29E8A4] hover:bg-[#24d193] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(41,232,164,0.3)] text-center"
                >
                  Check Your Eligibility →
                </button>
                <a href="tel:9555525908" className="bg-[#FFEA79] hover:bg-[#FFD700] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all text-center flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,234,121,0.4)]">
                  <svg className="w-4 h-4 text-[#09263F]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Talk to Our Learning Advisor
                </a>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#D6ECEB] rounded-2xl overflow-hidden border border-[#D6ECEB]">
                {STATS.map((s, idx) => {
                  const colors = ['text-[#29E8A4]', 'text-[#FFD700]', 'text-[#00BFFF]', 'text-[#29E8A4]'];
                  return (
                    <div key={s.label} className="bg-white/60 px-4 py-4 text-center backdrop-blur-sm">
                      <div className={`${colors[idx % 4]} font-black text-xl`}>{s.value}</div>
                      <div className="text-[#4A6275]/70 text-xs mt-0.5">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Lead Capture Form */}
            <div id="enroll" className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-[#D6ECEB]">
              <LeadCaptureForm
                title="Get Free Career Counselling"
                sourceName="PPC_Hero_V8"
                buttonText="Request Free Counselling →"
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          COURSE OVERVIEW SECTION
      ══════════════════════════════════════ */}
        <CourseInfoSection />

        {/* ══════════════════════════════════════
          WHY ANALYTIXLABS
      ══════════════════════════════════════ */}
        <section id="overview" className="py-20 bg-[#F4FAFA]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Why AnalytixLabs</span>
              <h2 className="text-[#09263F] font-black text-3xl sm:text-5xl mt-4 mb-4">
                Everything You Need to Build a <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Career in Data Science</span>
              </h2>
              <p className="text-[#4A6275] max-w-2xl mx-auto text-base leading-relaxed">
                Built for working professionals and fresh graduates. A complete programme with real accountability, real classroom training, and a placement team that delivers. Rated 9.6/10 by 20,000+ past students.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HIGHLIGHTS.map((h, idx) => {
                const colorType = idx % 3;
                const borderClass = colorType === 1 ? 'hover:border-[#FFEA79] hover:shadow-[0_8px_32px_rgba(255,234,121,0.15)]' : colorType === 2 ? 'hover:border-[#9BE9FF] hover:shadow-[0_8px_32px_rgba(155,233,255,0.15)]' : 'hover:border-[#29E8A4] hover:shadow-[0_8px_32px_rgba(41,232,164,0.12)]';
                const iconBgClass = colorType === 1 ? 'bg-[#FFFBE6] group-hover:bg-[#FFEA79]' : colorType === 2 ? 'bg-[#E6FAFF] group-hover:bg-[#9BE9FF]' : 'bg-[#E6F7F6] group-hover:bg-[#29E8A4]';

                return (
                  <div key={h.title} className={`group bg-white border border-[#D6ECEB] rounded-2xl p-7 transition-all duration-300 ${borderClass}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 transition-colors duration-300 ${iconBgClass}`}>{h.icon}</div>
                    <h3 className="font-black text-[#09263F] text-base mb-2">{h.title}</h3>
                    <p className="text-[#4A6275] text-sm leading-relaxed">{h.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          CURRICULUM
      ══════════════════════════════════════ */}
        <section id="curriculum" className="py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">What You'll Learn</span>
                <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">What You'll Learn Across <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">700+ Hours</span></h2>
                <p className="text-[#4A6275] max-w-2xl">11 modules covering analytics, data science, machine learning, and generative AI. Curriculum designed with NASSCOM-FutureSkills Prime to match what the industry actually hires for.</p>
              </div>
              <button onClick={() => setIsBrochureOpen(true)} className="flex-shrink-0 inline-flex items-center gap-2 border-2 border-[#29E8A4] text-[#09263F] hover:bg-[#29E8A4] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Download Brochure →
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {MODULES.map((m, idx) => {
                const modColors = [
                  { dot: '#29E8A4', dotBg: '#E6F7F6', tagText: 'text-[#09263F]', tagBg: 'bg-[#E6F7F6]', border: 'hover:border-[#29E8A4] hover:shadow-[0_8px_32px_rgba(41,232,164,0.10)]' },
                  { dot: '#FFB800', dotBg: '#FFFBE6', tagText: 'text-[#09263F]', tagBg: 'bg-[#FFFBE6]', border: 'hover:border-[#FFEA79] hover:shadow-[0_8px_32px_rgba(255,234,121,0.15)]' },
                  { dot: '#00BFFF', dotBg: '#E6FAFF', tagText: 'text-[#09263F]', tagBg: 'bg-[#E6FAFF]', border: 'hover:border-[#9BE9FF] hover:shadow-[0_8px_32px_rgba(155,233,255,0.15)]' },
                ];
                const c = modColors[idx % 3];
                return (
                  <div key={m.num} className={`relative border border-[#D6ECEB] rounded-2xl p-7 bg-white transition-all duration-300 group overflow-hidden ${c.border}`}>
                    <span className="absolute -top-2 -right-2 text-[80px] font-black text-[#F4FAFA] group-hover:text-[#E8F4F4] transition-colors select-none leading-none">{m.num}</span>
                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest ${c.tagText} ${c.tagBg} px-3 py-1 rounded-full mb-4`}>Module {m.num}</span>
                    <h3 className="font-black text-[#09263F] text-base mb-4 leading-snug pr-6">{m.title}</h3>
                    <ul className="space-y-2.5">
                      {m.topics.map((t) => (
                        <li key={t} className="flex items-center gap-2.5 text-sm text-[#4A6275]">
                          <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: c.dotBg }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          LEARNING MODES
      ══════════════════════════════════════ */}
        <section className="py-20 bg-[#F4FAFA]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Flexibility First</span>
              <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">Three Ways to Learn. <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Transparent</span> Pricing.</h2>
              <p className="text-[#4A6275] max-w-md mx-auto">Same syllabus, same faculty, same NASSCOM certification. Pick what fits your schedule and budget.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: "🏛️", title: "Classroom & Bootcamp", tag: "In-Person", price: "₹68,440", accent: '#FFB800', accentBg: '#FFFBE6', desc: "In-person training at our centres in Noida, Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, hands-on labs, direct faculty access, and on-campus placement activities.", features: ["Hands-on lab sessions", "Peer collaboration", "On-campus placement drives"] },
                { icon: "💻", title: "Interactive Live Online", tag: "Most Popular", price: "₹59,000", accent: '#29E8A4', accentBg: '#E6F7F6', gradient: true, desc: "Real-time, instructor-led sessions from anywhere in India. Same faculty as classroom. Full LMS access with recordings for 1 year. Weekday evening and weekend batches available.", features: ["Real-time Q&A with faculty", "Flexible batch timings", "1-year recording access"] },
                { icon: "🔀", title: "Blended eLearning", tag: "Flexible", price: "₹53,100", accent: '#00BFFF', accentBg: '#E6FAFF', desc: "Self-paced learning with recorded sessions and select live components. Maximum scheduling flexibility. Same curriculum and NASSCOM certification. Ideal for working professionals with unpredictable schedules.", features: ["Best of both worlds", "Switch modes anytime", "Same curriculum & faculty"] },
              ].map((m) => (
                <div key={m.title} className="rounded-2xl p-8 border transition-all duration-300 group bg-white border-[#D6ECEB] hover:shadow-lg hover:border-[#29E8A4]" style={m.gradient ? { background: 'linear-gradient(45deg, #FEFBE5, #E6FBF1, #ECFAFE)' } : {}}>
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-3xl">{m.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full" style={{ background: m.tag === 'Most Popular' ? '#79f4c8' : m.accentBg, color: '#09263F' }}>{m.tag}</span>
                  </div>
                  <h3 className="font-black text-[#09263F] text-xl mb-1">{m.title}</h3>
                  <div className="text-lg font-black mb-3 text-[#239bf5]">{m.price} <span className="text-[10px] font-medium opacity-70">(incl. taxes)</span></div>
                  <p className="text-sm leading-relaxed mb-5 text-[#4A6275]">{m.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {m.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs font-medium text-[#4A6275]">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 12 10" fill="none" style={{ color: m.accent }}>
                          <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Demo Signup Button - Centered below cards */}
            <div className="mt-12 text-center">
              <button onClick={() => setIsDemoOpen(true)} className="bg-[#29E8A4] hover:bg-[#24d193] text-[#09263F] font-bold px-10 py-5 rounded-xl transition-all shadow-[0_8px_24px_rgba(41,232,164,0.3)] text-lg">
                Signup for a Demo →
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          PLACEMENT GUARANTEE
      ══════════════════════════════════════ */}
        <section id="placement" className="py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Career Assurance</span>
              <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">We're Invested in Your <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Success</span></h2>
              <p className="text-[#4A6275] max-w-2xl mx-auto">One of the few data science programmes in India that puts real money behind its placement commitment.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Guarantee card */}
              <div className="relative rounded-3xl overflow-hidden p-9 border border-[#D6ECEB] shadow-lg" style={{ background: 'linear-gradient(45deg, #FEFBE5, #E6FBF1, #ECFAFE)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#29E8A4]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="relative">
                  <span className="inline-block bg-[#79f4c8] text-[#09263F] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">NASSCOM Certified. Career Supported.</span>
                  <h3 className="text-4xl font-black text-[#09263F] mb-4 font-outfit">Get Placed. Or Get 50% Back.</h3>
                  <p className="text-[#4A6275] text-lg leading-relaxed mb-8 font-medium">
                    Complete the programme, meet the stipulated requirements, and if you're not placed in a qualifying role with the assured minimum package within 6 months of certification, we refund 50% of your course fee.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {["Minimum annual package assured", "6-month post-certification placement window", "NASSCOM globally recognised certificate", "Dedicated placement relationship manager"].map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6275]">
                        <svg className="w-4 h-4 text-[#239bf5] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setIsEligibilityOpen(true)} className="w-full bg-[#09263F] text-white font-bold py-4 rounded-xl hover:bg-[#1a3a5a] transition-all flex items-center justify-center gap-2 group">
                    Check Your Eligibility
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Assistance card */}
              <div className="rounded-3xl bg-[#F4FAFA] p-9 border border-[#D6ECEB]">
                <span className="inline-block bg-[#D6ECEB] text-[#09263F] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">Global Recognition</span>
                <h3 className="text-[#09263F] font-black text-2xl mb-1">A Certificate That</h3>
                <h3 className="text-[#239bf5] font-black text-2xl mb-5">Employers Recognise.</h3>
                <p className="text-[#4A6275] text-sm leading-relaxed mb-8">Not just another piece of paper. You earn a co-branded certificate with NASSCOM FutureSkills Prime (a Government of India initiative) instantly validating your skills to top recruiters.</p>
                <div className="space-y-5">
                  {[
                    { t: "NASSCOM-FutureSkills Prime", d: "Backed by the Ministry of Electronics and IT (MeitY)." },
                    { t: "Applied Projects", d: "Portfolio of 6 capstone projects using real-world business data." },
                    { t: "Placement Readiness", d: "8 weeks of mock interviews, resume reviews, and case study practice." },
                  ].map((item) => (
                    <div key={item.t} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D6ECEB]">
                        <svg className="w-5 h-5 text-[#29E8A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#09263F]">{item.t}</h4>
                        <p className="text-xs text-[#4A6275] mt-1">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alumni strip: auto-sliding marquee */}
            <div className="mt-12 rounded-2xl border border-[#D6ECEB] bg-[#F4FAFA] px-0 py-7 overflow-hidden">
              <p className="text-center text-xs font-black uppercase tracking-widest text-[#9BBAC0] mb-6">Our Alumni Work At</p>
              {/* Marquee with gradient masks */}
              <div className="relative">
                {/* Left gradient fade */}
                <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #F4FAFA 40%, transparent)' }} />
                {/* Right gradient fade */}
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F4FAFA 40%, transparent)' }} />
                {/* Auto-scrolling track */}
                <div className="flex w-max gap-12 items-center animate-marquee-logos">
                  {[...Array(3)].flatMap((_, ri) =>
                    [
                      { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
                      { name: "Flipkart", url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Flipkart_logo_%282026%29.svg" },
                      { name: "HDFC Bank", url: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" },
                      { name: "Accenture", url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
                      { name: "TCS", url: "https://upload.wikimedia.org/wikipedia/commons/9/9b/TATA_Consultancy_Services_Logo.svg" },
                      { name: "IBM", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
                      { name: "Deloitte", url: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_Deloitte.svg" },
                      { name: "Wipro", url: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
                      { name: "Cognizant", url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg" },
                      { name: "Infosys", url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Infosys_Technologies_logo.svg" },
                    ].map((c, i) => (
                      <div key={`${ri}-${i}`} className="flex-shrink-0 flex items-center justify-center h-9">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.url}
                          alt={c.name}
                          className="h-7 w-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
        <section className="py-12 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Success Stories</span>
              <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">Rated <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">9.6/10</span> by Our Alumni</h2>
              <p className="text-[#4A6275] max-w-md mx-auto">What Our Alumni Say</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Piyush Ganar",
                  role: "Director of Operations",
                  company: "Kenty.AI",
                  extra: "Class of 2012, IIM Ahmedabad",
                  text: "The course material is very easy to understand and the case studies were based on real-time business problems. What I love most about AnalytixLabs is that they never operated like a typical commercial enterprise but more like a temple for learning."
                },
                {
                  name: "Raajeev Kumar Sahu",
                  role: "Senior Manager, Data Science",
                  company: "FinTech Startup",
                  text: "The course was very structured and gave real-world problems to practice. It also boosted my skills to start participating in hackathons. The placement team was very well organised and connected to industry leaders."
                },
                {
                  name: "Surbhi Sultania",
                  role: "Analytics Manager",
                  company: "Mastercard Data & Services",
                  text: "AnalytixLabs is a one-stop solution if you want to break into the field of analytics. The faculty brings years of industry experience and the support continues well beyond the course."
                }
              ].map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-[#E6F0F7] flex flex-col">
                  <div className="text-[#29E8A4] text-4xl font-serif mb-4">"</div>
                  <p className="text-[#4A6275] text-sm italic leading-relaxed mb-8 flex-grow">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#29E8A4]/20 to-[#239bf5]/20 flex items-center justify-center font-black text-[#239bf5]">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#09263F]">{t.name}</div>
                      <div className="text-[10px] text-[#4A6275] font-bold uppercase tracking-wider">{t.role}</div>
                      <div className="text-[10px] text-[#239bf5] font-black">{t.company}</div>
                      {t.extra && <div className="text-[9px] text-[#4A6275] mt-0.5">{t.extra}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          CERTIFICATE
      ══════════════════════════════════════ */}
        <section className="py-20 bg-[#F4FAFA]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#09263F] text-xs font-black uppercase tracking-widest bg-[#9BE9FF]/40 px-4 py-1.5 rounded-full">Your Credential</span>
              <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">Earn an <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Industry-Recognised</span> Certificate</h2>
              <p className="text-[#4A6275] max-w-2xl mx-auto mb-12">
                Original work policy ensures every certificate reflects genuine capability. Both certifications are widely recognised by employers across India. The NASSCOM-FutureSkills Prime certification is backed by the Ministry of Electronics & IT, Government of India, making it one of the most credible data science certifications available today.
              </p>
              <ul className="space-y-3">
                {["Weekly assignments + module case studies", "Rigorously evaluated by industry experts", "Zero plagiarism policy strictly enforced", "Shareable on LinkedIn, NASSCOM portal & job boards", "Lifetime validity. Your credential never expires"].map((i) => <CheckItem key={i} text={i} />)}
              </ul>
              <button
                onClick={() => setIsEligibilityOpen(true)}
                className="mt-10 bg-[#09263F] text-white font-bold px-8 py-4 rounded-xl text-sm hover:bg-[#1a3a5a] transition-all flex items-center gap-2 group shadow-lg"
              >
                Check Your Eligibility →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-[#D6ECEB]">
                <Image
                  src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Nasscom-Certification-1024x724-1-300x212.jpg"
                  alt="NASSCOM Certification"
                  width={440}
                  height={308}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-[#09263F] font-bold text-xs mt-3 text-center">NASSCOM FutureSkills Prime</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg border border-[#D6ECEB]">
                <Image
                  src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Alabs_DS-Advanced-Certification-in-Data-Science-AI-300x212.jpg"
                  alt="AnalytixLabs Certification"
                  width={440}
                  height={308}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-[#09263F] font-bold text-xs mt-3 text-center">AnalytixLabs Advanced Certificate</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          HOW TO ENROL
      ══════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Simple 3-Step Process</span>
              <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">Getting <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Started</span> is Simple</h2>
              <p className="text-[#4A6275] max-w-md mx-auto">Your journey to a data science career in three simple steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Step 1: Talk to Us", desc: "Fill the form or call us directly. A learning advisor will understand your goals and recommend the right mode.", color: '#29E8A4', bg: '#E6F7F6' },
                { title: "Step 2: Reserve Your Seat", desc: "Pick your batch and centre. Batches run in Noida, Gurgaon, and Bangalore, or join live online sessions.", color: '#FFEA79', bg: '#FFFBE6' },
                { title: "Step 3: Start Learning", desc: "LMS access and batch confirmation within 24 hours. 0% EMI and flexible instalment options available.", color: '#9BE9FF', bg: '#E6FAFF' }
              ].map((step, i) => (
                <div key={i} className="relative z-10 bg-white border border-[#D6ECEB] p-8 rounded-3xl text-center shadow-lg transition-all hover:border-current" style={{ color: step.color }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 font-black text-lg" style={{ background: step.bg, color: '#09263F' }}>{`0${i + 1}`}</div>
                  <h4 className="text-[#09263F] font-black text-xl mb-3">{step.title}</h4>
                  <p className="text-[#4A6275] text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center bg-[#09263F] rounded-3xl p-12">
              <h2 className="text-white font-black text-3xl sm:text-5xl mb-6">Ready to Start?</h2>
              <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
                Join 20,000+ professionals who trained with AnalytixLabs. Check your eligibility or talk to a learning advisor. No commitment, no pressure.
              </p>
              <button onClick={() => setIsEligibilityOpen(true)} className="bg-[#29E8A4] text-[#09263F] font-bold px-10 py-5 rounded-full text-lg hover:bg-[#24d193] transition-all shadow-xl">
                Check Eligibility →
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
          FAQs: Harmonized V7
      ══════════════════════════════════════ */}
        <FAQ />

        {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#29E8A4]/10 blur-[100px] rounded-full" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "linear-gradient(#29E8A4 1px,transparent 1px),linear-gradient(90deg,#29E8A4 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-[#29E8A4]/15 border border-[#29E8A4]/30 text-[#09263F] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#29E8A4] animate-pulse" />
              Limited Seats per batch
            </div>
            <h2 className="text-[#09263F] font-black text-4xl sm:text-6xl mb-8 leading-tight">
              Ready to Join India's Most <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Trusted</span> Data Science Institute?
            </h2>
            <p className="text-[#4A6275] text-lg sm:text-xl mb-12 font-medium leading-relaxed">
              Join 20,000+ graduates. Get NASSCOM certified. Land your dream role with our fee-back guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setIsEligibilityOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#9BE9FF] to-[#29E8A4] text-[#09263F] px-12 py-5 rounded-full font-black text-xl hover:shadow-[0_20px_40px_rgba(41,232,164,0.4)] transition-all transform hover:-translate-y-1 shadow-[0_20px_40px_rgba(155,233,255,0.3)] flex items-center justify-center gap-3 group"
              >
                Start Your Career Transformation
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60">
              <div className="text-center">
                <div className="text-[#09263F] font-black text-xl">20,000+</div>
                <div className="text-[#4A6275] text-[10px] font-bold uppercase tracking-widest">Trained</div>
              </div>
              <div className="text-center">
                <div className="text-[#09263F] font-black text-xl">9.6/10</div>
                <div className="text-[#4A6275] text-[10px] font-bold uppercase tracking-widest">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-[#09263F] font-black text-xl">12+ Yrs</div>
                <div className="text-[#4A6275] text-[10px] font-bold uppercase tracking-widest">Excellence</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#06192b] py-6 border-t border-white/5">
          <p className="text-center text-[#4A6275] text-xs">
            &copy; {new Date().getFullYear()} AnalytixLabs. All rights reserved. &nbsp;|&nbsp;
            Recordings are protected under copyright law and are the intellectual property of AnalytixLabs.
          </p>
        </footer>

        {/* STICKY MOBILE BAR */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D6ECEB] px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <a href="tel:9555525908" className="flex-1 flex items-center justify-center gap-1.5 border border-[#D6ECEB] text-[#09263F] font-bold py-3 rounded-xl text-sm">📞 Call</a>
          <a href="https://api.whatsapp.com/send?phone=919555525908" target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 border border-[#D6ECEB] text-[#09263F] font-bold py-3 rounded-xl text-sm">💬 Chat</a>
          <button onClick={() => setIsEligibilityOpen(true)} className="flex-1 bg-[#29E8A4] text-[#09263F] font-black py-3 rounded-xl text-sm text-center">Check Eligibility</button>
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

      </main>
    </div>
  );
}
