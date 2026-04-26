'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import LeadCaptureForm from '../../components/forms/LeadCaptureForm';

// ─── Course Data ──────────────────────────────────────────────────────────────

interface Course {
  slug: string;
  title: string;
  duration?: string;
  classes?: string;
  hours: string;
  level?: string;
  mode: string;
  price: string;
  initials: string;
}

const COURSES: Course[] = [
  {
    slug: 'agentic-ai',
    title: 'Agentic AI Course',
    duration: '5 Months',
    hours: '335 Hours',
    mode: 'Fully Interactive Online',
    price: '40,000',
    initials: 'AI',
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics Course',
    duration: '6 Months',
    classes: '43 Classes',
    hours: '445 Hours',
    mode: 'Bootcamp Classroom',
    price: '56,490',
    initials: 'DA',
  },
  {
    slug: 'data-science',
    title: 'Data Science Course',
    classes: '60 Classes',
    hours: '675 Hours',
    level: 'Experience',
    mode: 'Classroom | Live Online | Blended',
    price: '44,100',
    initials: 'DS',
  },
  {
    slug: 'business-analytics',
    title: 'Business Analytics Course',
    classes: '43 Classes',
    hours: '445 Hours',
    level: 'Experience',
    mode: 'Classroom | Live Online | Blended',
    price: '39,900',
    initials: 'BA',
  },
  {
    slug: 'full-stack-ai',
    title: 'Full Stack Applied AI Course',
    duration: '6 Months',
    hours: '417 Hours',
    mode: 'Classroom | Live Online | Blended',
    price: '51,000',
    initials: 'FS',
  },
  {
    slug: 'data-visualization',
    title: 'Data Visualization & Analytics',
    classes: '16 Classes',
    hours: '148 Hours',
    level: 'Beginner',
    mode: 'Classroom | Live Online | Blended',
    price: '18,000',
    initials: 'DV',
  },
  {
    slug: 'data-science-python',
    title: 'Data Science With Python',
    classes: '23 Classes',
    hours: '265 Hours',
    level: 'Experience',
    mode: 'Classroom | Live Online | Blended',
    price: '25,000',
    initials: 'PY',
  },
];

// ─── Brochure Config ─────────────────────────────────────────────────────────
// Use env vars for brochure URLs. Set these in Vercel dashboard.
// Format: NEXT_PUBLIC_BROCHURE_<SLUG_UPPERCASED_DASHES_TO_UNDERSCORES>
// e.g. NEXT_PUBLIC_BROCHURE_AGENTIC_AI, NEXT_PUBLIC_BROCHURE_DATA_ANALYTICS, etc.

function getBrochureEnvKey(slug: string): string {
  return `NEXT_PUBLIC_BROCHURE_${slug.toUpperCase().replace(/-/g, '_')}`;
}

function getBrochureUrl(slug: string): string | null {
  const key = getBrochureEnvKey(slug);
  return (process.env as Record<string, string | undefined>)[key] || null;
}

// ─── Tool Tags Strip ─────────────────────────────────────────────────────────

const TOOLS = [
  'Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'R', 'Keras',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib',
  'Seaborn', 'Azure SQL', 'AWS', 'Git', 'LangChain', 'CrewAI', 'AutoGen',
  'OpenAI', 'Gemini', 'Stable Diffusion', 'DALL-E', 'Spark', 'MongoDB',
  'Scala', 'FastAPI', 'Streamlit',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  function openEligibility() {
    setIsEligibilityOpen(true);
  }

  function openBrochure(course: Course) {
    setActiveCourse(course);
    setIsBrochureOpen(true);
  }

  // Brochure thank-you path includes course slug so ThankYouPage can show specific download
  const brochureThankyouPath = activeCourse
    ? `/thankyou-download-brochure?course=${activeCourse.slug}`
    : '/thankyou-download-brochure';

  return (
    <div className="font-sans bg-white text-[#1A2E3B] antialiased">
      <Navbar />
      <main id="main-content">

        {/* ── HERO ── */}
        <section className="py-16 bg-white text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1DE5B5]/5 -translate-y-1/3 translate-x-1/3 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#9BE9FF]/8 blur-[70px]" />
          </div>
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6">
            <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-6">
              <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Our Courses</span>
            </span>
            <h1 className="text-[#09263F] font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              AI & Data Science Courses
            </h1>
            <p className="text-[#4A6275] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Well integrated course modules mapped to specific job roles. Amazing value for money and seamless experiential learning.
            </p>

            {/* Tools Strip */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white 40%, transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white 40%, transparent)' }} />
              <div className="flex w-max gap-3 items-center animate-marquee py-2">
                {[...Array(3)].flatMap((_, ri) =>
                  TOOLS.map((tool, i) => (
                    <span
                      key={`${ri}-${i}`}
                      className="flex-shrink-0 text-[12px] font-semibold bg-[#F4FAFA] text-[#09263F] px-3 py-1.5 rounded-full border border-[#D6ECEB] whitespace-nowrap"
                    >
                      {tool}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── COURSE CARDS GRID ── */}
        <section className="py-16 bg-[#F4FAFA]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
                <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Learning Tracks</span>
              </span>
              <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl">Comprehensive Learning Tracks</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {COURSES.map((course) => (
                <div key={course.slug} className="card-premium flex flex-col">
                  {/* Placeholder thumbnail */}
                  <div className="aspect-video bg-[#09263F] rounded-xl mb-6 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <span className="text-[#1DE5B5] font-bold text-3xl tracking-widest opacity-40">{course.initials}</span>
                  </div>

                  <h3 className="text-[#09263F] font-bold text-lg mb-4 leading-snug">{course.title}</h3>

                  {/* Meta pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.duration && (
                      <span className="text-[11px] bg-[#E6F7F6] text-[#09263F] px-2.5 py-1 rounded-full font-semibold border border-[#D6ECEB]">
                        🗓 {course.duration}
                      </span>
                    )}
                    {course.classes && (
                      <span className="text-[11px] bg-[#E6F7F6] text-[#09263F] px-2.5 py-1 rounded-full font-semibold border border-[#D6ECEB]">
                        📚 {course.classes}
                      </span>
                    )}
                    <span className="text-[11px] bg-[#E6F7F6] text-[#09263F] px-2.5 py-1 rounded-full font-semibold border border-[#D6ECEB]">
                      🕐 {course.hours}
                    </span>
                    {course.level && (
                      <span className="text-[11px] bg-[#FFFBE6] text-[#09263F] px-2.5 py-1 rounded-full font-semibold border border-[#F5C842]/30">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Mode */}
                  <p className="text-[12px] text-[#4A6275] mb-4 font-medium">{course.mode}</p>

                  {/* Price */}
                  <p className="text-2xl font-bold text-[#09263F] mb-6 mt-auto">
                    <span className="text-[#1DE5B5]">₹{course.price}</span>
                    <span className="text-[14px] font-normal text-[#4A6275]">/- onwards</span>
                  </p>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={openEligibility}
                      className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold py-3 rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(29,229,181,0.25)] active:scale-95"
                    >
                      Check Eligibility →
                    </button>
                    <button
                      onClick={() => openBrochure(course)}
                      className="border-2 border-[#09263F] text-[#09263F] hover:bg-[#09263F] hover:text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
                    >
                      Download Brochure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEED HELP ── */}
        <section className="py-16 bg-[#09263F] text-center">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <h2 className="text-white font-bold text-3xl sm:text-4xl mb-8">Need help? Call Us</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:9555525908"
                className="inline-flex items-center justify-center gap-2 bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-full text-base transition-all shadow-[0_4px_14px_rgba(29,229,181,0.3)]"
              >
                📞 +91 9555525908
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=919555525908"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b957] text-white font-bold px-8 py-4 rounded-full text-base transition-all shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#06192b] py-6 border-t border-white/5">
          <p className="text-center text-[#4A6275] text-xs">
            © {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.
          </p>
        </footer>

        {/* ── STICKY MOBILE BAR ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#D6ECEB] px-4 py-3 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="max-w-[1600px] mx-auto w-full flex gap-3">
            <a
              href="tel:9555525908"
              className="flex-1 flex items-center justify-center py-3 border border-[#D6ECEB] text-[#09263F] font-bold rounded-xl text-sm hover:bg-[#F4FAFA] transition-colors bg-white"
            >
              📞 9555525908
            </a>
            <button
              onClick={openEligibility}
              className="flex-1 bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
            >
              Check Eligibility
            </button>
          </div>
        </div>

        {/* ── MODALS ── */}
        <Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
          <LeadCaptureForm
            title="Check Your Eligibility"
            sourceName="lp_blr_submit_lead_primary"
            typeFilter="PPC_CheckEligibility"
            buttonText="Check Eligibility →"
            thankYouPath="/thankyou-check-your-eligibility"
          />
        </Modal>

        <Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
          <LeadCaptureForm
            title={activeCourse ? `Download ${activeCourse.title} Brochure` : 'Download Brochure'}
            sourceName="lp_blr_download_brochure"
            typeFilter="PPC_DownloadBrochure"
            buttonText="Download Now →"
            thankYouPath={brochureThankyouPath}
          />
        </Modal>
      </main>
    </div>
  );
}
