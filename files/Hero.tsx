'use client';
import LeadCaptureForm from './forms/LeadCaptureForm';

const STATS = [
  { value: '20,000+', label: 'Candidates Trained' },
  { value: '50+',     label: 'Companies Hired From Us' },
  { value: '9.6/10',  label: 'Avg Student Rating' },
  { value: '12+',     label: 'Years of Excellence' },
];

const BADGES = [
  'NASSCOM-FutureSkills Prime Certified',
  'Classroom + Live Online',
  'Placement with Fee-Back Guarantee',
  '1-Year LMS Access',
];

const FEATURES = [
  '700+ Hours of Training',
  '11 Modules incl. Gen AI',
  'NASSCOM-FutureSkills Prime Certified',
];

export default function Hero() {
  return (
    <section className="relative bg-[#09263F] overflow-hidden">

      {/* Subtle radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #29E8A4, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #239bf5, transparent 70%)' }} />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── LEFT: Content ── */}
          <div>
            {/* Batch pill */}
            <div className="badge-news mb-7 inline-flex">
              <span>Live</span>
              Next batch: 1 Mar Noida · 15 Mar Gurgaon
            </div>

            {/* H1 */}
            <h1 className="font-display text-white font-black text-4xl sm:text-5xl xl:text-[3.5rem] leading-[1.06] mb-5">
              Data Science Course<br />
              with{' '}
              <span className="text-[#29E8A4]">
                Guaranteed<br />Career Support
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-white/65 text-[1.05rem] leading-relaxed mb-7 max-w-[500px]">
              700+ hours. 11 modules. Classroom + online.
              NASSCOM-FutureSkills Prime certified. And a placement
              team that stays with you until you land the right role.
            </p>

            {/* Feature ticks */}
            <ul className="flex flex-col gap-2.5 mb-8">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#29E8A4]/20 border border-[#29E8A4]/40 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#29E8A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Badge strip */}
            <div className="flex flex-wrap gap-2 mb-10">
              {BADGES.map((b, i) => (
                <span
                  key={i}
                  className="text-[0.7rem] font-semibold text-white/75 border border-white/15 rounded-full px-3 py-1.5 bg-white/5 backdrop-blur-sm tracking-wide"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <button className="btn-primary text-[#09263F]! font-bold px-7 py-3.5 text-[0.95rem]">
                Check Your Eligibility →
              </button>
              <a
                href="tel:9555525908"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/25 text-white font-semibold text-[0.95rem] hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                </svg>
                Talk to an Advisor
              </a>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden border border-white/10">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className={`px-4 py-5 text-center bg-white/5 backdrop-blur-sm
                    ${i < STATS.length - 1 ? 'border-r border-white/10' : ''}`}
                >
                  <p className="font-display font-black text-[#29E8A4] text-2xl leading-none">{s.value}</p>
                  <p className="text-white/50 text-[0.7rem] mt-1.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Form + floating cards ── */}
          <div className="relative">
            {/* Form card */}
            <div className="bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.25)] p-7 sm:p-9 relative z-10">
              <h3 className="font-display text-[#09263F] text-xl font-bold mb-1">
                Get Free Career Counselling
              </h3>
              <p className="text-[#4A6275] text-sm mb-6">
                Fill the form below to connect with our experts.
              </p>
              <LeadCaptureForm />
            </div>

            {/* Floating — trained count */}
            <div className="absolute -left-6 top-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-float hidden lg:flex z-20">
              <div className="w-9 h-9 rounded-full bg-[#E6F7F6] flex items-center justify-center text-base">📊</div>
              <div>
                <p className="font-display font-black text-[#09263F] text-lg leading-none">20,000+</p>
                <p className="text-[#4A6275] text-[0.7rem] mt-0.5">Candidates Trained</p>
              </div>
            </div>

            {/* Floating — placement */}
            <div
              className="absolute -right-5 bottom-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-float hidden lg:flex z-20"
              style={{ animationDelay: '1.2s' }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#29E8A4] animate-pulse flex-shrink-0" />
              <div>
                <p className="font-bold text-[#09263F] text-sm leading-none">Placement Active</p>
                <p className="text-[#4A6275] text-[0.7rem] mt-0.5">50+ Hiring Partners</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
