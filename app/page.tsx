// Final UI Polish - Ready for deployment
'use client';

import { useState } from "react";
import Image from "next/image";
import LeadCaptureForm from "../components/forms/LeadCaptureForm";
import Modal from "../components/Modal";
import FAQ from "../components/FAQ";
import CourseInfoSection from "../components/CourseInfoSection";
import LearningModes from "../components/LearningModes";
import HowToEnrol from "../components/HowToEnrol";
import BottomCTA from "../components/BottomCTA";
import StatsBar from "../components/StatsBar";

// ─── Data ────────────────────────────────────────────────────────────────────


const TRUST_BADGES = [
  "Classroom + Live Online + Recordings",
  "Placement with Fee-Back Guarantee",
  "1-Year LMS Access",
];

const HIGHLIGHTS = [
  { icon: "🏅", title: "NASSCOM-FutureSkills Prime Certified", desc: "Globally recognised certification supported by MeitY, Government of India. The definitive mark of industry trust." },
  { icon: "🔒", title: "Placement with Fee-Back Guarantee", desc: "Complete the programme and meet the requirements. If you're not placed within 6 months, we refund 50% of your fee. Minimum annual package assured." },
  { icon: "🏛️", title: "Real Classroom + Flexible Learning", desc: "Learn in-person in Noida, Gurgaon, or Bangalore. Or join live online sessions with the same faculty. Blend modes as your schedule demands." },
  { icon: "🎥", title: "Live + Recorded Classes", desc: "Attend live instructor-led sessions or rewatch anytime via your personal LMS. 1 year of access included." },
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

const ALUMNI_COMPANIES = [
  { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", h: "h-8" },
  { name: "Flipkart", url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Flipkart_logo_%282026%29.svg", h: "h-11" },
  { name: "HDFC Bank", url: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", h: "h-9" },
  { name: "Accenture", url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", h: "h-8" },
  { name: "TCS", url: "https://upload.wikimedia.org/wikipedia/commons/9/9b/TATA_Consultancy_Services_Logo.svg", h: "h-11" },
  { name: "IBM", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", h: "h-9" },
  { name: "Deloitte", url: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_Deloitte.svg", h: "h-9" },
  { name: "Wipro", url: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg", h: "h-11" },
  { name: "Cognizant", url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg", h: "h-8" },
  { name: "Infosys", url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Infosys_Technologies_logo.svg", h: "h-8" },
];

const TESTIMONIALS = [
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
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E6F7F6] flex items-center justify-center mt-0.5">
        <svg className="w-2.5 h-2.5 text-[#1DE5B5]" viewBox="0 0 12 10" fill="none">
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

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#1DE5B5]/10 -translate-y-1/3 translate-x-1/3 blur-[120px]" />
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#9BE9FF]/15 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#FFEA79]/10 blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "linear-gradient(#1DE5B5 1px,transparent 1px),linear-gradient(90deg,#1DE5B5 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1fr_500px] gap-12 items-center">
            <div>
              <div className="mb-10 flex items-center gap-4 sm:gap-8">
                <div className="flex-shrink-0">
                  {/* Mobile Mobile Icon */}
                  <Image 
                    src="https://www.analytixlabs.co.in/wp-content/uploads/2026/03/alabs-hd.webp" 
                    alt="AnalytixLabs Icon" 
                    width={48} height={48} 
                    className="w-auto h-[4.5rem] sm:hidden" 
                    priority 
                  />
                  {/* Desktop Logo */}
                  <Image 
                    src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp" 
                    alt="AnalytixLabs" 
                    width={180} height={40} 
                    className="w-auto h-[3.5rem] hidden sm:block" 
                    priority 
                  />
                </div>
                <div className="w-px h-8 bg-[#D6ECEB]" />
                <Image src="https://www.analytixlabs.co.in/wp-content/uploads/2026/03/logo-nasscom-ministry.webp" alt="Nasscom Futureskills" width={160} height={40} className="w-auto h-[5.25rem]" priority />
              </div>

              <h1 className="text-[#09263F] text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] mb-5 tracking-tight">
                Data Science Course with
                <br />
                <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Guaranteed Career Support</span>
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
                {["Classroom", "Online", "Blended", "675 Hours"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm font-semibold text-[#4A6275]">
                    <svg className="w-4 h-4 text-[#239bf5] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </span>
                ))}
                <div className="basis-full h-0" />
                {["Placement + Fee-Back Guarantee", "Industry & Govt. Accredited Certificate"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm font-semibold text-[#4A6275]">
                    <svg className="w-4 h-4 text-[#239bf5] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => setIsEligibilityOpen(true)} 
                  className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-4.5 rounded-xl text-lg transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] active:scale-95"
                >
                  Check Your Eligibility →
                </button>
                <a 
                  href="tel:9555525908" 
                  className="bg-[#FFEA79] hover:bg-[#FFD700] text-[#09263F] font-bold px-10 py-4.5 rounded-xl text-lg transition-all shadow-[0_4px_14px_rgba(255,234,121,0.4)] text-center flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-4 h-4 text-[#09263F]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Talk to Our Learning Advisor
                </a>
              </div>
              <StatsBar />
            </div>

            <div id="enroll" className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-[#D6ECEB]">
              <LeadCaptureForm 
                title="Get Free Career Counselling" 
                sourceName="Hero Section Form" 
                typeFilter="PPC_downloadBrochure" 
                buttonText="Download Brochure"
                thankYouPath="/thankyou-download-brochure"
              />
            </div>
          </div>
        </section>

        <CourseInfoSection />

        {/* WHY ANALYTIXLABS + ALUMNI MARQUEE */}
        <section id="overview" className="py-10 bg-[#F4FAFA]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7]">Why AnalytixLabs</span>
              <h2 className="text-[#09263F] font-bold text-3xl sm:text-5xl mt-4 mb-4">
                Everything You Need to Build a <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Career in Data Science</span>
              </h2>
              <p className="text-[#4A6275] max-w-2xl mx-auto text-base leading-relaxed">
                Built for working professionals and fresh graduates. A complete programme with real accountability, real classroom training, and a placement team that delivers. Rated 9.6/10 by 20,000+ past students.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {HIGHLIGHTS.map((h, idx) => {
                const colorType = idx % 3;
                const borderClass = colorType === 1 ? 'hover:border-[#FFEA79] hover:shadow-[0_8px_32px_rgba(255,234,121,0.15)]' : colorType === 2 ? 'hover:border-[#9BE9FF] hover:shadow-[0_8px_32px_rgba(155,233,255,0.15)]' : 'hover:border-[#1DE5B5] hover:shadow-[0_8px_32px_rgba(29,229,181,0.12)]';
                const iconBgClass = colorType === 1 ? 'bg-[#FFFBE6] group-hover:bg-[#FFEA79]' : colorType === 2 ? 'bg-[#E6FAFF] group-hover:bg-[#9BE9FF]' : 'bg-[#E6F7F6] group-hover:bg-[#1DE5B5]';
                return (
                  <div key={h.title} className={`group bg-white border border-[#D6ECEB] rounded-2xl p-7 transition-all duration-300 ${borderClass}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 transition-colors duration-300 ${iconBgClass}`}>{h.icon}</div>
                    <h3 className="font-bold text-[#09263F] text-base mb-2">{h.title}</h3>
                    <p className="text-[#4A6275] text-sm leading-relaxed">{h.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Alumni Marquee moved inside Why AnalytixLabs */}
            <div className="rounded-2xl border border-[#D6ECEB] bg-white/50 backdrop-blur-sm px-0 py-8 overflow-hidden">
              <p className="text-center text-sm font-bold uppercase tracking-widest text-[#1a2b4a] mb-8">Our Alumni Work At</p>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #F4FAFA 40%, transparent)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F4FAFA 40%, transparent)' }} />
                <div className="flex w-max gap-12 items-center animate-marquee-logos">
                  {[...Array(3)].flatMap((_, ri) =>
                    ALUMNI_COMPANIES.map((c, i) => (
                      <div key={`${ri}-${i}`} className="flex-shrink-0 flex items-center justify-center h-12">
                        <img src={c.url} alt={c.name} className={`${c.h || 'h-8'} w-auto object-contain opacity-100 transition-opacity`} loading="lazy" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAREER ASSURANCE */}
        <section id="placement" className="py-10 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7]">Career Assurance</span>
              <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl mt-4 mb-2">We're Invested in Your <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Success</span></h2>
              <p className="text-[#4A6275] max-w-2xl mx-auto">One of the few data science programmes in India that puts real money behind its placement commitment.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-3xl overflow-hidden p-9 border border-[#D6ECEB] shadow-lg" style={{ background: 'linear-gradient(45deg, #FEFBE5, #E6FBF1, #ECFAFE)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DE5B5]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="relative">
                  <span className="inline-block bg-[#79f4c8] text-[#09263F] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">NASSCOM Certified. Career Supported.</span>
                  <h3 className="text-4xl font-bold text-[#09263F] mb-4 font-outfit">Get Placed. Or Get 50% Back.</h3>
                  <p className="text-[#4A6275] text-lg leading-relaxed mb-8 font-medium">Complete the programme, meet the requirements, and if you're not placed in a qualifying role within 6 months, we refund 50% of your course fee.</p>
                  <ul className="space-y-3 mb-8">
                    {["Minimum annual package assured", "6-month post-certification placement window", "NASSCOM globally recognised certificate", "Dedicated placement relationship manager"].map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6275]">
                        <svg className="w-4 h-4 text-[#239bf5] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setIsEligibilityOpen(true)} 
                    className="w-full bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold py-4.5 rounded-xl text-lg transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] flex items-center justify-center gap-2 group active:scale-95"
                  >
                    Check Eligibility 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="rounded-3xl bg-[#F4FAFA] p-9 border border-[#D6ECEB]">
                <span className="inline-block bg-[#D6ECEB] text-[#09263F] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">Global Recognition</span>
                <h3 className="text-[#09263F] font-bold text-2xl mb-1">A Certificate That</h3>
                <h3 className="text-[#239bf5] font-bold text-2xl mb-5">Employers Recognise.</h3>
                <p className="text-[#4A6275] text-sm leading-relaxed mb-8">Not just another piece of paper. You earn a co-branded certificate with NASSCOM FutureSkills Prime instantly validating your skills.</p>
                <div className="space-y-5">
                  {[{ t: "NASSCOM-FutureSkills Prime", d: "Backed by the Ministry of Electronics and IT (MeitY)." }, { t: "Applied Projects", d: "Portfolio of 6 capstone projects using real-world business data." }, { t: "Placement Readiness", d: "8 weeks of mock interviews and resume reviews." }].map((item) => (
                    <div key={item.t} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D6ECEB]"><svg className="w-5 h-5 text-[#1DE5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                      <div><h4 className="text-sm font-bold text-[#09263F]">{item.t}</h4><p className="text-xs text-[#4A6275] mt-1">{item.d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <LearningModes onOpenDemo={() => setIsDemoOpen(true)} />

        <section id="curriculum" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
              <div className="max-w-3xl">
                <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
                  <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">FLEXIBILITY FIRST</span>
                </span>
                <h2 className="text-[#09263F] font-bold text-4xl sm:text-5xl leading-tight mb-4">
                  What You'll Learn Across <br />
                  <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">700+ Hours</span>
                </h2>
                <p className="text-[#4A6275] text-lg leading-relaxed">
                  11 modules covering analytics, data science, ML, and AI. <br className="hidden md:block" />
                  Curriculum designed with NASSCOM-FutureSkills Prime.
                </p>
              </div>
              <button 
                onClick={() => setIsBrochureOpen(true)} 
                className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-4.5 rounded-xl text-lg transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] flex-shrink-0 active:scale-95"
              >
                Download Brochure →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MODULES.map((m, idx) => {
                const modColors = [{ dot: '#1DE5B5', dotBg: '#E6F7F6', tagText: 'text-[#09263F]', tagBg: 'bg-[#E6F7F6]', border: 'hover:border-[#1DE5B5] hover:shadow-[0_8px_32px_rgba(29,229,181,0.10)]' }, { dot: '#FFB800', dotBg: '#FFFBE6', tagText: 'text-[#09263F]', tagBg: 'bg-[#FFFBE6]', border: 'hover:border-[#FFEA79] hover:shadow-[0_8px_32px_rgba(255,234,121,0.15)]' }, { dot: '#00BFFF', dotBg: '#E6FAFF', tagText: 'text-[#09263F]', tagBg: 'bg-[#E6FAFF]', border: 'hover:border-[#9BE9FF] hover:shadow-[0_8px_32px_rgba(155,233,255,0.15)]' }];
                const c = modColors[idx % 3];
                return (
                  <div key={m.num} className={`relative border border-[#D6ECEB] rounded-2xl p-8 bg-white transition-all duration-300 group overflow-hidden ${c.border} h-full`}>
                    <span className="absolute -top-2 -right-2 text-[80px] font-bold text-[#F4FAFA] group-hover:text-[#E8F4F4] select-none leading-none">{m.num}</span>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-widest ${c.tagText} ${c.tagBg} px-3 py-1 rounded-full mb-4`}>Module {m.num}</span>
                    <h3 className="font-bold text-[#09263F] text-base mb-4 leading-snug pr-6">{m.title}</h3>
                    <ul className="space-y-2.5">
                      {m.topics.map((t) => (
                        <li key={t} className="flex items-center gap-2.5 text-sm text-[#4A6275]"><span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: c.dotBg }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} /></span>{t}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMBINED CERTIFICATE & TESTIMONIALS */}
        <section className="py-12 bg-[#f0faf8]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              
              {/* LEFT: Certificate info */}
              <div className="flex flex-col">
                <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] self-start mb-6">
                  <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Your Credential</span>
                </span>
                <h2 className="text-[#09263F] font-bold text-3xl sm:text-[2.6rem] leading-tight mb-6">
                  Industry Recognised <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Certification</span>
                </h2>
                <p className="text-[#4A6275] text-base leading-relaxed mb-10 pr-4">
                  AnalytixLabs is a NASSCOM-FutureSkills Prime accredited training partner. Upon successful completion of the programme, you will receive a dual certification that is recognized by top global recruiters and Fortune 500 companies.
                </p>
                <div className="flex flex-col items-center gap-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03]">
                      <Image src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Nasscom-Certification-1024x724-1-300x212.jpg" alt="NASSCOM Certification" width={600} height={420} className="w-full h-auto rounded-lg shadow-sm" />
                      <p className="text-[#09263F] font-bold text-sm mt-4 text-center">NASSCOM FutureSkills Prime</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03]">
                      <Image src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Alabs_DS-Advanced-Certification-in-Data-Science-AI-300x212.jpg" alt="AnalytixLabs Certification" width={600} height={420} className="w-full h-auto rounded-lg shadow-sm" />
                      <p className="text-[#09263F] font-bold text-sm mt-4 text-center">Advanced AI Certificate</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEligibilityOpen(true)} 
                    className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-4.5 rounded-xl text-lg transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] active:scale-95"
                  >
                    Check Your Eligibility →
                  </button>
                </div>
              </div>

              {/* RIGHT: Success Stories */}
              <div className="flex flex-col">
                <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] self-start mb-6">Success Stories</span>
                <h2 className="text-[#09263F] font-bold text-3xl sm:text-[2.6rem] leading-tight mb-10">Rated <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">9.6/10</span> by Our Alumni</h2>
                
                <div className="space-y-6">
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-white p-7 rounded-3xl shadow-sm border border-[#E6F0F7] flex flex-col hover:shadow-md transition-shadow">
                      <p className="text-[#4A6275] text-[13px] italic leading-relaxed mb-6">"{t.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1DE5B5]/20 to-[#239bf5]/20 flex items-center justify-center font-bold text-[#239bf5] text-sm">
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#09263F]">{t.name}</div>
                          <div className="text-[10px] text-[#4A6275] font-bold uppercase tracking-wider">{t.role} @ {t.company}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        <HowToEnrol onOpenEligibility={() => setIsEligibilityOpen(true)} />
        <FAQ />
        <BottomCTA onOpenEligibility={() => setIsEligibilityOpen(true)} />

        <footer className="bg-[#06192b] py-8 border-t border-white/5">
          <p className="text-center text-[#4A6275] text-xs">&copy; {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.</p>
        </footer>

        {/* MOBILE STICKY */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D6ECEB] px-4 py-3 flex gap-3 shadow-2xl">
          <a href="tel:9555525908" className="flex-1 flex items-center justify-center py-3 border border-[#D6ECEB] text-[#09263F] font-bold rounded-xl text-xs">📞 Call</a>
          <a href="https://api.whatsapp.com/send?phone=919555525908" target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center border border-[#D6ECEB] text-[#09263F] font-bold py-3 rounded-xl text-xs">💬 Chat</a>
          <button onClick={() => setIsEligibilityOpen(true)} className="flex-1 border border-[#D6ECEB] text-[#09263F] font-bold py-3 rounded-xl text-xs">Check Eligibility</button>
        </div>

        {/* MODALS */}
        <Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
          <LeadCaptureForm 
            title="Check Your Eligibility" 
            sourceName="Check Your Eligibility Modal" 
            typeFilter="PPC_CheckEligibility" 
            buttonText="Check Eligibility →"
            thankYouPath="/thankyou-check-your-eligibility"
          />
        </Modal>
        <Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
          <LeadCaptureForm 
            title="Download Brochure" 
            sourceName="Download Brochure Modal" 
            typeFilter="PPC_downloadBrochure" 
            buttonText="Download Now →"
            thankYouPath="/thankyou-download-brochure"
          />
        </Modal>
        <Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)}>
          <LeadCaptureForm 
            title="Signup for a Demo" 
            sourceName="Signup for a Demo Modal" 
            typeFilter="PPC_signUpForDemo" 
            buttonText="Signup for a Demo"
            thankYouPath="/thankyou-signup"
          />
        </Modal>

      </main>
    </div>
  );
}
