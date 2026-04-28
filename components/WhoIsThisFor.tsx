'use client';

import { useEffect, useRef, useState } from "react";

function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

function FresherIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12.5v5c0 0 2 2 6 2s6-2 6-2v-5" />
      <path d="M22 10v5" />
    </svg>
  );
}

function SwitcherIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h12" />
      <path d="M13 6l3 3-3 3" />
      <path d="M20 15H8" />
      <path d="M11 18l-3-3 3-3" />
    </svg>
  );
}

function ProfessionalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="14" rx="1.5" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function UpgraderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="3.5" height="6" rx="0.5" />
      <rect x="10.25" y="9" width="3.5" height="11" rx="0.5" />
      <rect x="17.5" y="4" width="3.5" height="16" rx="0.5" />
      <path d="M7 7l4-3 4 3 4-4" />
      <path d="M17 3h2v2" />
    </svg>
  );
}

const PERSONAS = [
  {
    title: "Freshers and Recent Graduates",
    painPoint: "You have a degree but no practical analytics skills employers demand.",
    forYouIf: "You want a structured, job-ready data analyst course for freshers that starts from zero and ends with placement support.",
    outcome: "Entry-level Data Analyst, MIS Analyst, or BI Analyst role within 6 months.",
    color: "#1DE5B5",
    bgColor: "#E6F7F6",
    iconBgColor: "#C2EFE8",
    titleColor: "#0F6E56",
    Icon: FresherIcon,
  },
  {
    title: "Non-Tech Career Switchers",
    painPoint: "You are in a non-technical role and want to transition into analytics without a coding background.",
    forYouIf: "You are looking for a career change to data analyst, starting from Excel and SQL foundations with no prior programming required.",
    outcome: "Transition into a data analytics role in retail, banking, or consulting.",
    color: "#239bf5",
    bgColor: "#E6F0F7",
    iconBgColor: "#C5DCEF",
    titleColor: "#185FA5",
    Icon: SwitcherIcon,
  },
  {
    title: "Working Professionals",
    painPoint: "Your current role needs data skills, but your schedule is packed.",
    forYouIf: "You need a data analyst course for working professionals with weekend batches, evening sessions, and flexible learning modes.",
    outcome: "Upskill to Senior Analyst, Analytics Manager, or transition to a data-centric function.",
    color: "#F5C842",
    bgColor: "#FFFBE6",
    iconBgColor: "#FAEDB8",
    titleColor: "#854F0B",
    Icon: ProfessionalIcon,
  },
  {
    title: "BI and Business Analyst Upgraders",
    painPoint: "You already work with data but want to add Python, AI, and predictive modelling to your toolkit.",
    forYouIf: "You are a business analyst or BI analyst looking to upgrade from Excel and Tableau to Python, SQL, and AI-integrated analytics.",
    outcome: "Move into Product Analyst, Senior BI Analyst, or Analytics Lead roles.",
    color: "#19dfaf",
    bgColor: "#E6F7F0",
    iconBgColor: "#BBF0DC",
    titleColor: "#0F6E56",
    Icon: UpgraderIcon,
  },
];

export default function WhoIsThisFor({ subtitle }: { subtitle?: string }) {
  const [ref, visible] = useVisible();
  const [activePersona, setActivePersona] = useState<number | null>(null);

  return (
    <section id="who-is-this-for" className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1DE5B5]/5 -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#239bf5]/5 translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-6">
            WHO IS THIS FOR
          </span>
          <h2 className="text-[#09263F] font-bold text-4xl sm:text-5xl mt-2 mb-6 tracking-tight">
            Built for Every <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Starting Point</span>
          </h2>
          <p className="text-[#4A6275] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            {subtitle || "Whether you are a fresher, a working professional, or switching careers: our curriculum adapts to your specific goals."}
          </p>
        </div>

        {/* Mobile Accordion / Desktop Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-8">
          {PERSONAS.map((persona, i) => {
            const Icon = persona.Icon;
            const isOpen = activePersona === i;
            
            return (
              <div
                key={persona.title}
                onClick={() => {
                  setActivePersona(isOpen ? null : i);
                }}
                className={`group bg-white rounded-none sm:rounded-3xl overflow-hidden shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] border-b sm:border border-[#E6F0F7] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer sm:cursor-default ${
                  isOpen ? 'ring-0 sm:ring-2 ring-[#1DE5B5]/30' : ''
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(40px)",
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s, box-shadow 0.4s`,
                }}
              >
                {/* Icon + Title Header */}
                <div 
                  className="flex sm:block items-center gap-4 sm:gap-0"
                  style={{ backgroundColor: persona.bgColor, padding: "20px 24px 16px" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: persona.iconBgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: persona.titleColor,
                      marginBottom: 10,
                    }}
                    className="sm:mb-2.5 flex-shrink-0"
                  >
                    <Icon />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <h3 className="font-bold text-sm sm:text-base leading-snug" style={{ color: persona.titleColor }}>
                      {persona.title}
                    </h3>
                    {/* Chevron for mobile */}
                    <svg 
                      className={`w-5 h-5 sm:hidden transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                      style={{ color: persona.titleColor }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Content Section - Hidden on mobile unless open */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 sm:max-h-none opacity-0 sm:opacity-100'
                }`}>
                  <div className="p-6 sm:p-8">
                    <div className="space-y-4 mb-8">
                      <p className="text-[#4A6275] text-sm leading-relaxed italic border-l-2 pl-4" style={{ borderColor: persona.color }}>
                        &ldquo;{persona.painPoint}&rdquo;
                      </p>
                      <p className="text-[#4A6275] text-sm leading-relaxed">
                        <span className="font-bold text-[#09263F]">Ideal for:</span> {persona.forYouIf}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-[#F0F7F7]">
                      <p className="text-sm font-bold text-[#09263F] mb-1">Expected Outcome:</p>
                      <p className="text-[13px] text-[#4A6275] leading-relaxed">
                        {persona.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Backup of the original section
export function WhoIsThisForV1({ subtitle }: { subtitle?: string }) {
  const PERSONAS_OLD = [
    {
      icon: "🎓",
      title: "Freshers and Recent Graduates",
      painPoint: "You have a degree but no practical analytics skills employers demand.",
      forYouIf: "You want a structured, job-ready data analyst course for freshers that starts from zero and ends with placement support.",
      outcome: "Entry-level Data Analyst, MIS Analyst, or BI Analyst role within 6 months.",
      color: "#1DE5B5",
      bgColor: "#87F0D7",
    },
    {
      icon: "🔄",
      title: "Non-Tech Career Switchers",
      painPoint: "You are in a non-technical role and want to transition into analytics without a coding background.",
      forYouIf: "You are looking for a career change to data analyst, starting from Excel and SQL foundations with no prior programming required.",
      outcome: "Transition into a data analytics role in retail, banking, or consulting.",
      color: "#239bf5",
      bgColor: "#88E2FF",
    },
    {
      icon: "💼",
      title: "Working Professionals",
      painPoint: "Your current role needs data skills, but your schedule is packed.",
      forYouIf: "You need a data analyst course for working professionals with weekend batches, evening sessions, and flexible learning modes.",
      outcome: "Upskill to Senior Analyst, Analytics Manager, or transition to a data-centric function.",
      color: "#F5C842",
      bgColor: "#FFF385",
    },
    {
      icon: "📊",
      title: "BI and Business Analyst Upgraders",
      painPoint: "You already work with data but want to add Python, AI, and predictive modelling to your toolkit.",
      forYouIf: "You are a business analyst or BI analyst looking to upgrade from Excel and Tableau to Python, SQL, and AI-integrated analytics.",
      outcome: "Move into Product Analyst, Senior BI Analyst, or Analytics Lead roles.",
      color: "#19dfaf",
      bgColor: "#B7F2BA",
    },
  ];

  return (
    <section id="who-is-this-for-v1" className="py-16 bg-[#F4FAFA]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">WHO IS THIS FOR (V1)</span>
          </span>
          <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl mt-2 mb-3">
            Built for Every <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Starting Point</span>
          </h2>
          <p className="text-[#4A6275] max-w-2xl mx-auto text-base leading-relaxed">
            {subtitle || "Whether you are a fresher, a working professional, or switching careers: this data analyst course meets you where you are."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 opacity-50 pointer-events-none">
          {PERSONAS_OLD.map((persona, i) => (
            <div
              key={persona.title}
              className="bg-white border border-[#D6ECEB] rounded-2xl p-6 flex flex-col"
              style={{
                borderTop: `3px solid ${persona.color}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: persona.bgColor }}
              >
                {persona.icon}
              </div>
              <h3 className="font-bold text-[#09263F] text-sm mb-3">{persona.title}</h3>
              <p className="text-[#4A6275] text-[13px] leading-relaxed mb-3 italic">&ldquo;{persona.painPoint}&rdquo;</p>
              <p className="text-[#09263F] text-[13px] leading-relaxed mb-3 font-medium">
                <span className="font-bold" style={{ color: persona.color }}>This course is for you if:</span> {persona.forYouIf}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
