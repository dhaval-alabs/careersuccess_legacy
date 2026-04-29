'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { initBehaviourTracking } from '../../utils/trackBehaviour';
import LeadCaptureForm from "../../components/forms/LeadCaptureForm";
import HeroLeadCaptureForm from "../../components/HeroLeadCaptureForm";
import Modal from "../../components/Modal";
import StatsBar from "../../components/StatsBar";
import DACurriculumSection from "../../components/DACurriculumSection";
import ToolsMasteryStrip from "../../components/ToolsMasteryStrip";
import WhoIsThisFor from "../../components/WhoIsThisFor";
import DALearningModes from "../../components/DALearningModes";

const CourseInfoSection = dynamic(() => import("../../components/CourseInfoSection"), { ssr: false });
const HowToEnrol = dynamic(() => import("../../components/HowToEnrol"), { ssr: false });
const BottomCTA = dynamic(() => import("../../components/BottomCTA"), { ssr: false });

// ─── City Config ─────────────────────────────────────────────────────────────

const config = {
  h1City: "in Noida",
  subhead: "Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, and AI-assisted analytics. Complete course with 100% placement support at our Sector 15, Noida centre.",
  classroomBullet: "Noida centre located at Sector 15 (near Metro). Weekend and weekday batches available.",
  faq6answer: "Yes. AnalytixLabs offers classroom Data Analytics training at Noida Sector 15, Gurgaon Sector 44, and Bangalore (HSR Layout).",
  faq12nearby: "Sector 62, Sector 18, and Greater Noida",
  cityPrefix: "daai_noi",
  crmPrefix: "PPC_DA_NOI",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const HIGHLIGHTS = [
  { icon: "🏅", title: "NASSCOM-FutureSkills Prime Certified", desc: "Globally recognised certification supported by MeitY, Government of India. The definitive mark of industry trust." },
  { icon: "🔒", title: "Placement with Fee-Back Guarantee", desc: "Complete the programme and meet the requirements. If you are not placed within 6 months, we refund 50% of your fee. Minimum annual package assured." },
  { icon: "🏛️", title: "Real Classroom and Flexible Learning", desc: "Learn in-person in Noida Sector 15. Or join live online sessions with the same faculty. Blend modes as your schedule demands." },
  { icon: "🤖", title: "AI-Assisted Analytics Built In", desc: "Master prompt engineering for SQL and Python, and use Generative AI tools to automate reporting and data cleaning. Stay ahead of the curve." },
  { icon: "🎥", title: "Live and Recorded Classes", desc: "Attend live instructor-led sessions or rewatch anytime via your personal LMS. 1 year of access included." },
  { icon: "🤝", title: "Mentorship Beyond the Class", desc: "Dedicated mentor support for projects, doubt resolution, and practical guidance between sessions. You are never stuck." },
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

// ─── FAQ Sub-component ────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#D6ECEB] rounded-2xl overflow-hidden">
      <button
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F4FAFA] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-bold text-[#09263F] text-sm leading-snug">{q}</span>
        <svg className={`w-5 h-5 text-[#1DE5B5] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-[#4A6275] leading-relaxed border-t border-[#D6ECEB] pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NoidaDAAIPage() {
  const [ctaSource, setCtaSource] = useState<string>('');
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasPassedCurriculum, setHasPassedCurriculum] = useState(false);

  const gclidRef = useRef<string | null>(null);
  const gbraidRef = useRef<string | null>(null);

  useEffect(() => {
    initBehaviourTracking();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get('gclid');
    if (gclid) {
      sessionStorage.setItem('gclid', gclid);
      gclidRef.current = gclid;
    } else {
      gclidRef.current = sessionStorage.getItem('gclid');
    }

    const gbraid = params.get('gbraid');
    if (gbraid) {
      sessionStorage.setItem('gbraid', gbraid);
      gbraidRef.current = gbraid;
    } else {
      gbraidRef.current = sessionStorage.getItem('gbraid');
    }
  }, []);

  function fireConversion(ctaName: string, email?: string) {
    if (!ctaName) return;
    const gclid = gclidRef.current || sessionStorage.getItem('gclid');
    const gbraid = gbraidRef.current || sessionStorage.getItem('gbraid');
    if (!gclid && !gbraid && !email) return;

    fetch('https://lp-vercel.analytixlabs.co.in/api/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ctaName, gclid: gclid || undefined, gbraid: gbraid || undefined, email }),
      keepalive: true,
    }).catch((e) => console.error('Conversion tracking failed:', e));
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const curriculumSection = document.getElementById('curriculum');
      if (curriculumSection) {
        const curriculumOffset = curriculumSection.offsetTop;
        const windowHeight = window.innerHeight;
        const targetPoint = curriculumOffset - windowHeight / 2;
        const rawProgress = Math.min(scrollY / targetPoint, 1);
        let effectiveProgress = 0;
        if (rawProgress > 0.1) {
          effectiveProgress = (rawProgress - 0.1) / 0.9;
        }
        setScrollProgress(effectiveProgress);
        setHasPassedCurriculum(scrollY > targetPoint);
      }
      setShowSticky(scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProgressiveColor = (progress: number) => {
    if (progress <= 0) return 'rgba(255, 255, 255, 1)';
    const opacity = Math.min(progress * 1.5, 1);
    if (progress < 0.33) {
      const f = progress / 0.33;
      return `rgba(255, 255, ${Math.round(255 - (255 - 240) * f)}, ${opacity})`;
    } else if (progress < 0.66) {
      const f = (progress - 0.33) / 0.33;
      return `rgba(${Math.round(255 - (255 - 200) * f)}, 255, 240, ${opacity})`;
    } else {
      const f = (progress - 0.66) / 0.34;
      return `rgba(${Math.round(200 - (200 - 29) * f)}, ${Math.round(255 - (255 - 229) * f)}, ${Math.round(240 - (240 - 181) * f)}, ${opacity})`;
    }
  };

  const FAQS = [
    { q: "How much does the Data Analyst + AI course cost?", a: "The Data Analyst + AI programme starts at Rs.35,400 (incl. taxes) for Blended eLearning, Rs.41,300 for Live Online, and Rs.53,100 for Classroom. 0% interest EMI available." },
    { q: "Does this course come with a placement guarantee?", a: "Yes. Placement with Fee-Back Guarantee. Complete the programme, meet the requirements, and if you are not placed within 6 months, we refund 50% of your course fee." },
    { q: "What is the eligibility for this Data Analytics course?", a: "No prior coding experience required. The programme starts from foundations. 20,000+ candidates trained, including many from non-technical backgrounds." },
    { q: "What is covered in the syllabus?", a: "SQL, Power BI, Tableau, Excel, Python foundations, and AI-assisted analytics including prompt engineering for data workflows." },
    { q: "What certification do I receive?", a: "Dual certification from NASSCOM-FutureSkills Prime (backed by MeitY, Government of India) and AnalytixLabs." },
    { q: `Do you offer classroom training ${config.h1City}?`, a: config.faq6answer },
    { q: "Can I do this course while working full-time?", a: "Yes. Weekend sessions and recorded classes make it perfect for working professionals." },
    { q: "What salary can I expect after completing this?", a: "Freshers typically start at Rs.4.5-8 LPA. Experienced professionals see significant hikes, with alumni reaching up to Rs.25 LPA in senior analyst roles." },
    { q: "Does this course cover Generative AI?", a: "Yes. We've integrated GenAI for Python/SQL/BI workflows, making you a 10x more productive analyst." },
    { q: "How long is the Data Analyst + AI course?", a: "The Core Data Analytics track runs across 445 hours of structured learning, covering 7 modules from Excel and SQL through Python and Generative AI. The AI-Integrated track extends this further with additional GenAI modules for analysts who want to apply AI tools in their daily work. For working professionals on weekend or evening batches, most students complete the Core track in 4 to 5 months. Speak to our learning advisor for the current batch schedule in Noida." },
    { q: "How do I choose between the Core and AI-Integrated tracks?", a: "The Core Data Analytics track is ideal if you are starting from scratch, switching careers, or want to build a solid foundation in SQL, Power BI, Python, and statistics before adding AI skills later. The AI-Integrated track is recommended for analysts who want to stay ahead: it includes everything in Core plus Generative AI for analysts, prompt engineering for SQL and Python, and AI-assisted BI reporting. Both tracks earn the same NASSCOM-FutureSkills Prime certification and come with full placement support. If you are unsure, our learning advisors can help you choose based on your current role and target outcome." },
    { q: "How does this compare to the Google Data Analytics Certificate or IBM Data Analyst course on Coursera?", a: "Google and IBM offer solid introductory certificates, and we respect them. The difference is in depth, support, and outcome accountability. Our programme covers a broader curriculum including SQL on cloud databases, advanced Power BI with DAX, Python for predictive modelling, and Generative AI for analysts — skills that go significantly beyond what either of those programmes cover. More importantly, this course includes live instructor-led sessions, mentorship, real capstone projects reviewed by faculty, and a dedicated placement team working to get you hired in Noida and across India. Google and IBM certificates carry no placement support or fee-back guarantee. We also hold NASSCOM-FutureSkills Prime accreditation, supported by MeitY, Government of India — a credential that carries substantially more weight with Indian employers than a global MOOC certificate." },
  ];

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
                  <Image
                    src="https://www.analytixlabs.co.in/wp-content/uploads/2026/03/alabs-hd.webp"
                    alt="AnalytixLabs Icon"
                    width={48} height={48}
                    className="w-auto h-[3.5rem] sm:hidden max-w-[30vw] object-contain"
                    priority
                    sizes="(max-width: 640px) 48px, 0px"
                  />
                  <Image
                    src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp"
                    alt="AnalytixLabs - Data Analytics Training Institute"
                    width={200} height={45}
                    className="w-auto h-[4rem] hidden sm:block"
                    priority
                    sizes="(min-width: 640px) 200px, 0px"
                  />
                </div>
                <div className="w-px h-8 bg-[#D6ECEB]" />
                <Image
                  src="https://www.analytixlabs.co.in/wp-content/uploads/2026/04/IITB_IITP_Nasscom.webp"
                  alt="IIT Bombay, IIT Patna and Nasscom — Partners"
                  width={300} height={60}
                  className="w-auto h-[4.5rem] sm:h-[6.5rem] max-w-[65vw] sm:max-w-none object-contain"
                  priority
                />
              </div>

              <h1 className="text-[#09263F] text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] mb-5 tracking-tight">
                Advanced Certification in
                <br />
                <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Data Analyst & AI</span>{' '}
                <span className="text-[#09263F]">{config.h1City}</span>
              </h1>

              <p className="text-[#4A6275] text-base leading-relaxed mb-6 max-w-xl">
                SQL, Power BI, Python, and Generative AI — all in one NASSCOM-FutureSkills Prime certified programme. Classroom and online batches in Noida.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
                {["In collaboration with TIH at IIT Bombay and TIH at IIT Patna", "NASSCOM-FutureSkills Prime Certified", "SQL & Power BI", "Python for Analytics", "Generative AI Integration", "Placement + Fee-Back Guarantee"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm font-semibold text-[#4A6275]">
                    <svg className="w-4 h-4 text-[#239bf5] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>

              {/* UPCOMING BATCHES ROW */}
              <div className="mb-10">
                <p className="text-xs font-bold text-[#09263F] uppercase tracking-widest mb-3 hidden">Upcoming Batches:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { date: process.env.NEXT_PUBLIC_BATCH_DATE_NOIDA,   city: 'Noida'   },
                    { date: process.env.NEXT_PUBLIC_BATCH_DATE_GURGAON, city: 'Gurgaon' },
                    { date: process.env.NEXT_PUBLIC_BATCH_DATE_BANGALORE, city: 'Bangalore' },
                  ].filter(b => b.date).map((b) => (
                    <div key={b.city} className="bg-[#09263F] text-[#1DE5B5] px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm">
                      <span className="opacity-80">{b.date}</span>
                      <span className="w-1 h-1 bg-[#1DE5B5] rounded-full opacity-40"></span>
                      <span>{b.city}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => { setCtaSource(`Hero_CheckEligibility`); setIsEligibilityOpen(true); }}
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

            <div id="enroll" className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-[#D6ECEB]">
              <HeroLeadCaptureForm
                title="Get Free Career Counselling"
                sourceName={`${config.crmPrefix}_Hero_DownloadBrochure`}
                typeFilter="PPC_DownloadBrochure"
                buttonText="Download Brochure"
                thankYouPath="/thankyou-download-brochure"
                onSuccess={(email) => fireConversion(`${config.cityPrefix}_Hero_DownloadBrochure`, email)}
              />
            </div>
          </div>
        </section>

        <CourseInfoSection locations={['noida']} />

        {/* NEW SECTION: TOOLS MASTERY */}
        <ToolsMasteryStrip />

        {/* NEW SECTION: WHO IS THIS FOR */}
        <WhoIsThisFor />

        {/* WHY ANALYTIXLABS + ALUMNI MARQUEE */}
        <section id="overview" className="py-10 bg-[#F4FAFA]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7]">Why AnalytixLabs</span>
              <h2 className="text-[#09263F] font-bold text-3xl sm:text-5xl mt-4 mb-4">
                Everything You Need to Build a <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Career in Data Analytics</span>
              </h2>
              <p className="text-[#4A6275] max-w-2xl mx-auto text-base leading-relaxed">
                Built for working professionals and fresh graduates. A complete programme with real accountability, real classroom training, and a placement team that delivers.
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

            <div className="rounded-2xl border border-[#D6ECEB] bg-white/50 backdrop-blur-sm px-0 py-8 overflow-hidden">
              <p className="text-center text-sm font-bold uppercase tracking-widest text-[#1a2b4a] mb-8">Our Alumni Work At</p>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #F4FAFA 40%, transparent)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F4FAFA 40%, transparent)' }} />
                <div className="flex w-max gap-12 items-center animate-marquee-logos">
                  {[...Array(3)].flatMap((_, ri) =>
                    ALUMNI_COMPANIES.map((c, i) => (
                      <div key={`${ri}-${i}`} className="flex-shrink-0 flex items-center justify-center h-12">
                        <Image src={c.url} alt={c.name} width={c.width} height={c.height} className={`${c.h || 'h-8'} w-auto object-contain opacity-100 transition-opacity`} />
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
              <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl mt-4 mb-2">We are Invested in Your <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Success</span></h2>
              <p className="text-[#4A6275] max-w-2xl mx-auto">Master the skills and get placed. We stand by our training quality with a 50% fee-back commitment.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-3xl overflow-hidden p-9 border border-[#D6ECEB] shadow-lg" style={{ background: 'linear-gradient(45deg, #FEFBE5, #E6FBF1, #ECFAFE)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DE5B5]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="relative">
                  <span className="inline-block bg-[#79f4c8] text-[#09263F] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">NASSCOM Certified. Career Supported.</span>
                  <h3 className="text-4xl font-bold text-[#09263F] mb-4 font-outfit">Get Placed. Or Get 50% Back.</h3>
                  <p className="text-[#4A6275] text-lg leading-relaxed mb-8 font-medium">If you are not placed in a qualifying role within 6 months of course completion, we refund 50% of your course fee.</p>
                  <ul className="space-y-3 mb-8">
                    {["Minimum annual package assured", "6-month post-certification placement window", "NASSCOM globally recognised certificate", "Dedicated placement relationship manager"].map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A6275]">
                        <svg className="w-4 h-4 text-[#239bf5] flex-shrink-0 mt-0.5" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { setCtaSource(`Placement_CheckEligibility`); setIsEligibilityOpen(true); }}
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
                <p className="text-[#4A6275] text-sm leading-relaxed mb-8">You earn a co-branded certificate with NASSCOM FutureSkills Prime instantly validating your skills for the global market.</p>
                <div className="space-y-5">
                  {[{ t: "NASSCOM-FutureSkills Prime", d: "Backed by the Ministry of Electronics and IT (MeitY)." }, { t: "Applied Projects", d: "Portfolio of industry projects using real-world business data." }, { t: "Career Readiness", d: "8 weeks of mock interviews and resume reviews." }].map((item) => (
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

        {/* NEW SECTION: DALearningModes */}
        <DALearningModes onOpenDemo={() => { setCtaSource(`Pricing_SignupDemo`); setIsDemoOpen(true); }} />

        {/* CURRICULUM */}
        <DACurriculumSection onOpenBrochure={() => { setCtaSource(`Curriculum_DownloadBrochure`); setIsBrochureOpen(true); }} />

        {/* COMBINED CERTIFICATE & TESTIMONIALS */}
        <section className="py-12 bg-[#f0faf8]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="flex flex-col">
                <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] self-start mb-6">
                  <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Your Credential</span>
                </span>
                <h2 className="text-[#09263F] font-bold text-3xl sm:text-[2.6rem] leading-tight mb-6">
                  Industry Recognised <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Certification</span>
                </h2>
                <p className="text-[#4A6275] text-base leading-relaxed mb-10 pr-4">
                  AnalytixLabs is a NASSCOM-FutureSkills Prime accredited training partner. Upon successful completion, you will receive a dual certification recognized by top global recruiters.
                </p>
                <div className="flex flex-col items-center gap-10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03]">
                      <div className="aspect-[1024/724] relative mb-4">
                        <Image src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Nasscom-Certification-1024x724-1-300x212.jpg" alt="NASSCOM Certification" fill className="object-contain rounded-lg shadow-sm" sizes="(max-width: 768px) 100vw, 300px" />
                      </div>
                      <p className="text-[#09263F] font-bold text-sm text-center">NASSCOM FutureSkills Prime</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03]">
                      <div className="aspect-[1024/724] relative mb-4">
                        <Image src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Alabs_DS-Advanced-Certification-in-Data-Science-AI-300x212.jpg" alt="AnalytixLabs Certification" fill className="object-contain rounded-lg shadow-sm" sizes="(max-width: 768px) 100vw, 300px" />
                      </div>
                      <p className="text-[#09263F] font-bold text-sm text-center">Data Analyst + AI Certificate</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#D6ECEB] transform transition-transform hover:scale-[1.03]">
                      <div className="aspect-[1024/724] relative mb-4 flex items-center justify-center">
                        <Image src="https://www.analytixlabs.co.in/wp-content/uploads/2026/04/IITB_IITP_Nasscom.webp" alt="IIT Bombay, IIT Patna and Nasscom — Partners" width={400} height={212} className="object-contain rounded-lg shadow-sm w-full h-auto" />
                      </div>
                      <p className="text-[#09263F] font-bold text-sm text-center">IIT Bombay, IIT Patna & Nasscom</p>
                      <p className="text-[#4A6275] text-[10px] font-bold text-center mt-1 uppercase tracking-wider">Official Partners</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setCtaSource(`Certificate_CheckEligibility`); setIsEligibilityOpen(true); }}
                    className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] active:scale-95"
                  >
                    Get Started →
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] self-start mb-6">Success Stories</span>
                <h2 className="text-[#09263F] font-bold text-3xl sm:text-[2.6rem] leading-tight mb-10">Rated <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">9.6/10</span> by Our Alumni</h2>
                <div className="space-y-6">
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-white p-7 rounded-3xl shadow-sm border border-[#E6F0F7] flex flex-col hover:shadow-md transition-shadow">
                      <p className="text-[#4A6275] text-[13px] italic leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
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

        <HowToEnrol onOpenEligibility={() => { setCtaSource(`Enrol_CheckEligibility`); setIsEligibilityOpen(true); }} />

        {/* FAQ SECTION */}
        <section className="py-16 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">FAQ</span>
              <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl">Frequently Asked Questions</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        <BottomCTA onOpenEligibility={() => { setCtaSource(`Bottom_CheckEligibility`); setIsEligibilityOpen(true); }} />

        <footer className="bg-[#06192b] pt-8 pb-32 border-t border-white/5">
          <p className="text-center text-[#4A6275] text-xs">&copy; {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.</p>
        </footer>

        {/* UNIVERSAL STICKY BAR */}
        <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#D6ECEB] px-4 py-3 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 transform ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
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
              onClick={() => { setCtaSource(`Sticky_CheckEligibility`); setIsEligibilityOpen(true); }}
              className={`flex-1 relative overflow-hidden border border-[#D6ECEB] text-[#09263F] font-bold py-3 sm:py-4 rounded-xl text-xs sm:text-sm transition-all duration-300 ${hasPassedCurriculum ? 'animate-breathing-glow shadow-[0_0_25px_rgba(29,229,181,0.6)] border-[#1DE5B5]' : (scrollProgress > 0.8 ? 'shadow-[0_0_20px_rgba(29,229,181,0.5)] border-[#1DE5B5]' : '')}`}
              style={{ backgroundColor: hasPassedCurriculum ? '#1DE5B5' : getProgressiveColor(scrollProgress) }}
            >
              <span className="relative z-10">Check Eligibility</span>
            </button>
          </div>
        </div>

        {/* MODALS */}
        <Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
          <LeadCaptureForm
            title="Check Your Eligibility"
            sourceName={`${config.crmPrefix}_${ctaSource}`}
            typeFilter="PPC_CheckEligibility"
            buttonText="Check Your Eligibility →"
            thankYouPath="/thankyou-check-your-eligibility"
            onSuccess={(email) => fireConversion(`${config.cityPrefix}_${ctaSource}`, email)}
          />
        </Modal>
        <Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
          <LeadCaptureForm
            title="Download Brochure"
            sourceName={`${config.crmPrefix}_${ctaSource}`}
            typeFilter="PPC_DownloadBrochure"
            buttonText="Download Now →"
            thankYouPath="/thankyou-download-brochure"
            onSuccess={(email) => fireConversion(`${config.cityPrefix}_${ctaSource}`, email)}
          />
        </Modal>
        <Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)}>
          <LeadCaptureForm
            title="Signup for a Demo"
            sourceName={`${config.crmPrefix}_Pricing_SignupDemo`}
            typeFilter="PPC_SignupDemo"
            buttonText="Signup for a Demo"
            thankYouPath="/thankyou-signup"
            onSuccess={(email) => fireConversion(`${config.cityPrefix}_Pricing_SignupDemo`, email)}
          />
        </Modal>

      </main>
    </div>
  );
}
