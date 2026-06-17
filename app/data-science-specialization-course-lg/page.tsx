// Migrated Landing Page
'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { initBehaviourTracking } from '../../utils/trackBehaviour';
import LeadCaptureForm from "../../components/forms/LeadCaptureForm";
import HeroLeadCaptureForm from "../../components/HeroLeadCaptureForm";
import Modal from "../../components/Modal";
import StatsBar from "../../components/StatsBar";

// Dynamic imports for below-the-fold components (reduced hydration cost)
const FAQ = dynamic(() => import("../../components/FAQ"), { ssr: false });
const CourseInfoSection = dynamic(() => import("../../components/CourseInfoSection"), { ssr: false });
const LearningModes = dynamic(() => import("../../components/LearningModes"), { ssr: false });
const HowToEnrol = dynamic(() => import("../../components/HowToEnrol"), { ssr: false });
const BottomCTA = dynamic(() => import("../../components/BottomCTA"), { ssr: false });

// ─── Data ────────────────────────────────────────────────────────────────────


const TRUST_BADGES = [
  "Classroom + Live Online + Recordings",
  "Placement with Fee-Back Guarantee",
  "1-Year LMS Access",
];

const HIGHLIGHTS = [
  { icon: "🏅", title: "Certified by NASSCOM, TIH at IIT Bombay / Patna", desc: "NASSCOM-FutureSkills Prime certified, supported by MeitY, Government of India. Backed by Technology Innovation Hubs at IIT Bombay and IIT Patna — among India's most respected research institutions." },
  { icon: "🔒", title: "Placement with Fee-Back Guarantee", desc: "Complete the programme and meet the requirements. If you're not placed within 6 months, we refund 50% of your fee. Minimum annual package assured." },
  { icon: "🏛️", title: "Real Classroom + Flexible Learning", desc: "Learn in-person in Noida (Sector 2), Gurgaon (Sector 44), or Bangalore (HSR Layout). Or join live online sessions with the same faculty. Blend modes as your schedule demands." },
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
  { num: "11", title: "Career Readiness (8 weeks)", topics: ["Resume building", "Mock interviews", "Case study practice", "Simulated recruitment drives"] },
];

const ALUMNI_COMPANIES = [
  { name: "Amazon", url: "/lp/images/alumni/amazon.svg", h: "h-8", width: 120, height: 32 },
  { name: "Flipkart", url: "/lp/images/alumni/flipkart.svg", h: "h-11", width: 140, height: 44 },
  { name: "HDFC Bank", url: "/lp/images/alumni/hdfc.svg", h: "h-9", width: 120, height: 36 },
  { name: "Accenture", url: "/lp/images/alumni/accenture.svg", h: "h-8", width: 120, height: 32 },
  { name: "TCS", url: "/lp/images/alumni/tcs.svg", h: "h-11", width: 120, height: 44 },
  { name: "IBM", url: "/lp/images/alumni/ibm.svg", h: "h-9", width: 100, height: 36 },
  { name: "Deloitte", url: "/lp/images/alumni/deloitte.svg", h: "h-9", width: 120, height: 36 },
  { name: "Wipro", url: "/lp/images/alumni/wipro.svg", h: "h-11", width: 120, height: 44 },
  { name: "Cognizant", url: "/lp/images/alumni/cognizant.svg", h: "h-8", width: 140, height: 32 },
  { name: "Infosys", url: "/lp/images/alumni/infosys.svg", h: "h-8", width: 120, height: 32 },
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
  const [ctaSource, setCtaSource] = useState<string>('')
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasPassedCurriculum, setHasPassedCurriculum] = useState(false);

  // ─── Conversion Tracking ─────────────────────────────────────────────────────
  const gclidRef = useRef<string | null>(null)
  const gbraidRef = useRef<string | null>(null)

  useEffect(() => {
    initBehaviourTracking()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const gclid = params.get('gclid')
    if (gclid) {
      sessionStorage.setItem('gclid', gclid)
      gclidRef.current = gclid
    } else {
      gclidRef.current = sessionStorage.getItem('gclid')
    }

    const gbraid = params.get('gbraid')
    if (gbraid) {
      sessionStorage.setItem('gbraid', gbraid)
      gbraidRef.current = gbraid
    } else {
      gbraidRef.current = sessionStorage.getItem('gbraid')
    }
  }, [])

  function fireConversion(ctaName: string, email?: string) {
    // Fix: guard empty ctaName (e.g. if modal opened before ctaSource was set)
    if (!ctaName) return
    const gclid = gclidRef.current || sessionStorage.getItem('gclid')
    const gbraid = gbraidRef.current || sessionStorage.getItem('gbraid')
    // Need at least gclid, gbraid, or email to record a conversion
    if (!gclid && !gbraid && !email) return
    // Fix: keepalive keeps the request alive through page navigation/redirect.
    // Without it the browser cancels the in-flight fetch when window.location changes.
    fetch('https://lp-vercel.analytixlabs.co.in/api/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ctaName,
        gclid: gclid || undefined,
        gbraid: gbraid || undefined,
        email,
      }),
      keepalive: true,
    }).catch((e) => console.error('Conversion tracking failed:', e))
  }
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const curriculumSection = document.getElementById('curriculum');
      
      if (curriculumSection) {
        const curriculumOffset = curriculumSection.offsetTop;
        const windowHeight = window.innerHeight;
        const targetPoint = curriculumOffset - windowHeight / 2;
        
        // Calculate raw progress relative to curriculum (0 to 1)
        const rawProgress = Math.min(scrollY / targetPoint, 1);
        
        // 0-10% deadzone: No color change (effective progress 0)
        // 10-100%: Interpolate colors (effective progress 0 to 1)
        let effectiveProgress = 0;
        if (rawProgress > 0.1) {
          effectiveProgress = (rawProgress - 0.1) / 0.9;
        }
        
        setScrollProgress(effectiveProgress);
        setHasPassedCurriculum(scrollY > targetPoint);
      }

      // Show sticky after scrolling 400px
      if (scrollY > 400) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Color Interpolation Helper: White -> Very Light Yellow -> Lemon -> Light Mint -> Green (#1DE5B5)
  const getProgressiveColor = (progress: number) => {
    if (progress <= 0) return 'rgba(255, 255, 255, 1)';
    
    // progress: 0 to 1
    // Color targets: 
    // hsl(60, 100%, 98%) -- Very Light Yellow
    // hsl(65, 95%, 85%)  -- Lemon
    // hsl(140, 75%, 90%) -- Light Mint
    // rgb(29, 229, 181) -- Final Green
    
    const opacity = Math.min(progress * 1.5, 1); // Opacity increases faster than color
    
    if (progress < 0.33) {
      // White to Very Light Yellow
      const f = progress / 0.33;
      const r = 255;
      const g = 255;
      const b = 255 - (255 - 240) * f;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (progress < 0.66) {
      // Light Yellow to Lemon/Mint
      const f = (progress - 0.33) / 0.33;
      const r = 255 - (255 - 200) * f;
      const g = 255;
      const b = 240 - (240 - 240) * f; // Keep blue low for greener/yellower
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else {
      // Mint to Final Green (29, 229, 181)
      const f = (progress - 0.66) / 0.34;
      const r = 200 - (200 - 29) * f;
      const g = 255 - (255 - 229) * f;
      const b = 240 - (240 - 181) * f;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  };

  return (
    <div className="font-sans bg-white text-[#1A2E3B] antialiased">
      <main id="main-content">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1DE5B5]/5 -translate-y-1/3 translate-x-1/3 blur-[80px]" />
            <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#9BE9FF]/8 blur-[70px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#FFEA79]/5 blur-[60px]" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "linear-gradient(#1DE5B5 1px,transparent 1px),linear-gradient(90deg,#1DE5B5 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1fr_500px] gap-12 items-center">
            <div>
              <div className="mb-10 flex items-center gap-4 sm:gap-8">
                <div className="flex-shrink-0">
                  {/* Mobile Mobile Icon */}
                  <Image 
                    src="/lp/images/alabs-hd.webp" 
                    alt="AnalytixLabs Icon" 
                    width={48} height={48} 
                    className="w-auto h-[3.5rem] sm:hidden max-w-[30vw] object-contain" 
                    priority 
                    sizes="(max-width: 640px) 48px, 0px"
                  />
                  {/* Desktop Logo */}
                  <Image 
                    src="/lp/images/analytixlabs-logo.webp" 
                    alt="AnalytixLabs - Data Science Training Institute" 
                    width={180} height={40} 
                    className="w-auto h-[4rem] hidden sm:block" 
                    priority 
                    sizes="(min-width: 640px) 180px, 0px"
                  />
                </div>
                <div className="w-px h-8 bg-[#D6ECEB]" />
                <Image 
                  src="/lp/images/Final-Logo-IITP-IITB-2026.webp" 
                  alt="IIT Bombay, IIT Patna and Nasscom — Partners" 
                  width={300} height={60} 
                  className="w-auto h-[4.5rem] sm:h-[6.5rem] max-w-[65vw] sm:max-w-none object-contain" 
                  priority 
                />
              </div>

              <h1 className="text-[#09263F] text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] mb-5 tracking-tight">
                Data Science Course with
                <br />
                <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Guaranteed Career Support</span>
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
                {["TIH at IIT Bombay + IIT Patna and Nasscom Futureskills", "Classroom", "Online", "AI Integrated curriculum", "Placement + Fee-Back Guarantee"].map((item) => (
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
                  onClick={() => { setCtaSource('Hero_CheckEligibility'); setIsEligibilityOpen(true) }} 
                  className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] active:scale-95"
                >
                  Check Your Eligibility →
                </button>
                <a
                  href="tel:9555525908"
                  onClick={() => window.gtag?.('event', 'conversion', { send_to: 'AW-783236209/3q4MCJXktaobEPH4vPUC' })}
                  className="bg-[#FFEA79] hover:bg-[#FFD700] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_4px_14px_rgba(255,234,121,0.4)] text-center flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-4 h-4 text-[#09263F]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Talk to Our Learning Advisor
                </a>
              </div>
              <StatsBar />
            </div>

            <div id="enroll" className="hidden lg:block bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-[#D6ECEB]">
              <LeadCaptureForm 
                title="Get Free Career Counselling" 
                sourceName="PPC_BLR_Hero_DownloadBrochure" 
                typeFilter="PPC_DownloadBrochure" 
                buttonText="Download Brochure"
                thankYouPath="/thankyou-download-brochure"
                onSuccess={(email) => fireConversion('lp_Hero_DownloadBrochure', email)}
              />
            </div>
          </div>
        </section>

        <CourseInfoSection locations={['noida', 'gurgaon']} />

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
                        <Image 
                          src={c.url} 
                          alt={c.name} 
                          width={c.width}
                          height={c.height}
                          className={`${c.h || 'h-8'} w-auto object-contain opacity-100 transition-opacity`} 
                        />
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
                    onClick={() => { setCtaSource('Placement_CheckEligibility'); setIsEligibilityOpen(true) }} 
                    className="w-full bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] flex items-center justify-center gap-2 group active:scale-95"
                  >
                    See If You Qualify →
                  </button>
                </div>
              </div>
              <div className="rounded-3xl bg-[#F4FAFA] p-9 border border-[#D6ECEB]">
                <span className="inline-block bg-[#D6ECEB] text-[#09263F] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">Global Recognition</span>
                <h2 className="text-[#09263F] font-bold text-2xl mb-1">A Certificate That</h2>
                <h3 className="text-[#239bf5] font-bold text-2xl mb-5">Employers Recognise.</h3>
                <p className="text-[#4A6275] text-sm leading-relaxed mb-8">Not just another piece of paper. You earn a co-branded certificate with NASSCOM FutureSkills Prime instantly validating your skills.</p>
                <div className="space-y-5">
                  {[{ t: "NASSCOM-FutureSkills Prime", d: "Backed by the Ministry of Electronics and IT (MeitY)." }, { t: "Applied Projects", d: "Portfolio of 6 capstone projects using real-world business data." }, { t: "Career Readiness", d: "8 weeks of mock interviews and resume reviews." }].map((item) => (
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

        <LearningModes onOpenDemo={() => { setCtaSource('Pricing_SignupDemo'); setIsDemoOpen(true) }} />

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
                onClick={() => { setCtaSource('Curriculum_DownloadBrochure'); setIsBrochureOpen(true) }} 
                className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] flex-shrink-0 active:scale-95"
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03]">
                      <Image 
                        src="/lp/images/Nasscom-Certification-1024x724-1-300x212.jpg" 
                        alt="NASSCOM Certification" 
                        width={600} height={420} 
                        className="w-full h-auto rounded-lg shadow-sm"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                      <p className="text-[#09263F] font-bold text-sm mt-4 text-center">NASSCOM FutureSkills Prime</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03]">
                      <Image 
                        src="/lp/images/Alabs_DS-Advanced-Certification-in-Data-Science-AI-300x212.jpg" 
                        alt="AnalytixLabs Certification" 
                        width={600} height={420} 
                        className="w-full h-auto rounded-lg shadow-sm"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                      <p className="text-[#09263F] font-bold text-sm mt-4 text-center">Advanced AI Certificate</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03] flex flex-col justify-center">
                      <div className="bg-[#F4FAFA] rounded-lg p-4 flex items-center justify-center h-full min-h-[140px]">
                        <Image src="/lp/images/Final-Logo-IITP-IITB-2026.webp" alt="Official Partners" width={400} height={120} className="w-full h-auto object-contain" />
                      </div>
                      <p className="text-[#09263F] font-bold text-sm mt-4 text-center">Official Partner Branding</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setCtaSource('Certificate_CheckEligibility'); setIsEligibilityOpen(true) }} 
                    className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] active:scale-95"
                  >
                    Get Started →
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

        <HowToEnrol onOpenEligibility={(source) => { setCtaSource(source); setIsEligibilityOpen(true) }} />
        <FAQ />
        <BottomCTA onOpenEligibility={(source) => { setCtaSource(source); setIsEligibilityOpen(true) }} />

        <footer className="bg-[#06192b] pt-8 pb-32 border-t border-white/5">
          <p className="text-center text-[#4A6275] text-xs">&copy; {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.</p>
        </footer>

        {/* UNIVERSAL STICKY BAR */}
        <div 
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#D6ECEB] px-4 py-3 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 transform ${
            showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <div className="max-w-[1600px] mx-auto w-full flex gap-3">
            <a href="tel:9555525908"
              onClick={() => window.gtag?.('event', 'conversion', { send_to: 'AW-783236209/3q4MCJXktaobEPH4vPUC' })}
              className="flex-1 flex items-center justify-center py-3 sm:py-4 border border-[#D6ECEB] text-[#09263F] font-bold rounded-xl text-xs sm:text-sm hover:bg-[#F4FAFA] transition-colors bg-white">
              📞 <span className="hidden sm:inline ml-1">Call Now:</span> 9555525908
            </a>
            <a href="https://api.whatsapp.com/send?phone=919555525908" target="_blank" rel="noreferrer"
              onClick={() => window.gtag?.('event', 'conversion', { send_to: 'AW-783236209/p4XvCI3TtaobEPH4vPUC' })}
              className="flex-1 flex items-center justify-center border border-[#D6ECEB] text-[#09263F] font-bold py-3 sm:py-4 rounded-xl text-xs sm:text-sm hover:bg-[#F4FAFA] transition-colors bg-white">
              💬 <span className="hidden sm:inline ml-1">Chat on</span> WhatsApp
            </a>
            <button 
              onClick={() => { setCtaSource('Sticky_CheckEligibility'); setIsEligibilityOpen(true) }} 
              className={`flex-1 relative overflow-hidden border border-[#D6ECEB] text-[#09263F] font-bold py-3 sm:py-4 rounded-xl text-xs sm:text-sm transition-all duration-300 ${
                hasPassedCurriculum ? 'animate-breathing-glow shadow-[0_0_25px_rgba(29,229,181,0.6)] border-[#1DE5B5]' : (scrollProgress > 0.8 ? 'shadow-[0_0_20px_rgba(29,229,181,0.5)] border-[#1DE5B5]' : '')
              }`}
              style={{ 
                backgroundColor: hasPassedCurriculum ? '#1DE5B5' : getProgressiveColor(scrollProgress)
              }}
            >
              <span className="relative z-10">Check Eligibility</span>
            </button>
          </div>
        </div>

        <Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
          {ctaSource === 'Hero_CheckEligibility' || ctaSource === 'Sticky_CheckEligibility' ? (
            <HeroLeadCaptureForm 
              title="Check Your Eligibility" 
              sourceName={`PPC_BLR_${ctaSource}`}
              typeFilter="PPC_CheckEligibility" 
              buttonText="Check Eligibility →"
              thankYouPath="/thankyou-check-your-eligibility"
              onSuccess={(email) => fireConversion(`lp_${ctaSource}`, email)}
              qualificationConfigKey="data-science-specialization"
            />
          ) : (
            <LeadCaptureForm 
              title="Check Your Eligibility" 
              sourceName={`PPC_BLR_${ctaSource}`}
              typeFilter="PPC_CheckEligibility" 
              buttonText="Check Eligibility →"
              thankYouPath="/thankyou-check-your-eligibility"
              onSuccess={(email) => fireConversion(`lp_${ctaSource}`, email)}
            />
          )}
        </Modal>
        <Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
          <LeadCaptureForm 
            title="Download Brochure" 
            sourceName={`PPC_BLR_${ctaSource}`}
            typeFilter="PPC_DownloadBrochure" 
            buttonText="Download Now →"
            thankYouPath="/thankyou-download-brochure"
            onSuccess={(email) => fireConversion(`lp_${ctaSource}`, email)}
          />
        </Modal>
        <Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)}>
          <LeadCaptureForm 
            title="Signup for a Demo" 
            sourceName={`PPC_BLR_${ctaSource}`}
            typeFilter="PPC_SignupDemo" 
            buttonText="Signup for a Demo"
            thankYouPath="/thankyou-signup"
            onSuccess={(email) => fireConversion(`lp_${ctaSource}`, email)}
          />
        </Modal>

      </main>
    </div>
  );
}
