'use client';

interface Mode {
  icon: string;
  mode: string;
  badge: string | null;
  price: string;
  priceNote: string;
  emi: string;
  description: string;
  highlights: string[];
  featured: boolean;
}

const MODES: Mode[] = [
  {
    icon: '🏛️',
    mode: 'Classroom & Bootcamp',
    badge: null,
    price: '₹68,440',
    priceNote: 'incl. taxes',
    emi: 'Starting ₹6,387/month · 0% interest EMI',
    description:
      'In-person training at our centres in Noida, Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, hands-on labs, direct faculty access, and on-campus placement activities.',
    highlights: [
      'Noida · Gurgaon · Bangalore',
      'Small batch sizes',
      'Hands-on lab sessions',
      'On-campus placement drives',
    ],
    featured: false,
  },
  {
    icon: '💻',
    mode: 'Interactive Live Online',
    badge: 'Most Popular',
    price: '₹59,000',
    priceNote: 'incl. taxes',
    emi: 'Starting ₹6,387/month · 0% interest EMI',
    description:
      'Real-time, instructor-led sessions from anywhere in India. Same faculty as classroom. Full LMS access with recordings for 1 year. Weekday evening and weekend batches available.',
    highlights: [
      'Real-time Q&A with faculty',
      'Weekday & weekend batches',
      '1-year recording access',
      'Same faculty as classroom',
    ],
    featured: true,
  },
  {
    icon: '🔀',
    mode: 'Blended eLearning',
    badge: null,
    price: '₹53,100',
    priceNote: 'incl. taxes',
    emi: 'Starting ₹6,387/month · 0% interest EMI',
    description:
      'Self-paced learning with recorded sessions and select live components. Maximum scheduling flexibility. Same curriculum and NASSCOM-FutureSkills Prime certification.',
    highlights: [
      'Maximum flexibility',
      'Self-paced + live mix',
      'Switch modes anytime',
      'Same curriculum & faculty',
    ],
    featured: false,
  },
];

function CheckIcon({ dark }: { dark?: boolean }) {
  return (
    <span
      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
        dark ? 'bg-[#29E8A4]/20' : 'bg-[#29E8A4]'
      }`}
    >
      <svg
        className={`w-2.5 h-2.5 ${dark ? 'text-[#29E8A4]' : 'text-[#09263F]'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function LearningModes() {
  return (
    <section className="py-24 bg-[#F7FAFC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">
            Flexible Learning
          </span>
          <h2 className="font-display text-[#09263F] font-black text-3xl sm:text-4xl mt-5 mb-4 leading-tight">
            Three Ways to Learn.{' '}
            <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">
              Transparent Pricing.
            </span>
          </h2>
          <p className="text-[#4A6275] max-w-lg mx-auto leading-relaxed">
            Same syllabus, same faculty, same NASSCOM-FutureSkills Prime
            certification. Pick what fits your schedule and budget.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {MODES.map((m, i) => (
            <div
              key={i}
              className={`relative rounded-3xl flex flex-col transition-all duration-300 overflow-hidden
                ${m.featured
                  ? 'bg-[#09263F] shadow-2xl shadow-[#09263F]/30 scale-[1.02] border-2 border-[#29E8A4]/30'
                  : 'bg-white border border-[#E6F0F7] hover:shadow-xl hover:-translate-y-1'
                }`}
            >
              {/* Most Popular badge */}
              {m.badge && (
                <div className="absolute -top-px left-0 right-0 flex justify-center">
                  <span className="bg-[#29E8A4] text-[#09263F] text-[0.65rem] font-black uppercase tracking-widest px-5 py-1.5 rounded-b-xl shadow">
                    {m.badge}
                  </span>
                </div>
              )}

              <div className={`p-8 flex flex-col flex-1 ${m.badge ? 'pt-10' : ''}`}>

                {/* Icon + mode */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-2xl w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    m.featured ? 'bg-white/10' : 'bg-[#F7FAFC]'
                  }`}>
                    {m.icon}
                  </span>
                  <h3 className={`font-display font-bold text-lg leading-tight ${
                    m.featured ? 'text-white' : 'text-[#09263F]'
                  }`}>
                    {m.mode}
                  </h3>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-6 ${
                  m.featured ? 'text-white/65' : 'text-[#4A6275]'
                }`}>
                  {m.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {m.highlights.map((h, j) => (
                    <li key={j} className={`flex items-center gap-2.5 text-sm font-medium ${
                      m.featured ? 'text-white/80' : 'text-[#09263F]'
                    }`}>
                      <CheckIcon dark={m.featured} />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Price block */}
                <div className={`border-t pt-6 mt-auto ${
                  m.featured ? 'border-white/15' : 'border-[#E6F0F7]'
                }`}>
                  <div className="mb-1">
                    <span className={`font-display font-black text-3xl ${
                      m.featured ? 'text-[#29E8A4]' : 'text-[#09263F]'
                    }`}>
                      {m.price}
                    </span>
                    <span className={`text-xs ml-1.5 ${
                      m.featured ? 'text-white/45' : 'text-[#4A6275]'
                    }`}>
                      {m.priceNote}
                    </span>
                  </div>
                  <p className={`text-xs mb-5 ${
                    m.featured ? 'text-white/45' : 'text-[#4A6275]'
                  }`}>
                    {m.emi}
                  </p>

                  <button
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                      m.featured
                        ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1fd090]'
                        : 'bg-[#09263F] text-white hover:bg-[#06192b]'
                    }`}
                  >
                    Check Your Eligibility →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-[#4A6275] text-xs mt-8">
          * All three modes include the same NASSCOM-FutureSkills Prime certification,
          11-module curriculum, and 8-week Placement Readiness Programme.
        </p>

        {/* Demo CTA */}
        <div className="text-center mt-8">
          <button className="btn-secondary font-semibold">
            Signup for a Demo Class →
          </button>
        </div>

      </div>
    </section>
  );
}
