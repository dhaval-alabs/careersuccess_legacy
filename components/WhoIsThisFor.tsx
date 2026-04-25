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

const PERSONAS = [
  {
    title: "Freshers and Recent Graduates",
    painPoint: "You have a degree but no practical analytics skills employers demand.",
    forYouIf: "You want a structured, job-ready data analyst course for freshers that starts from zero and ends with placement support.",
    outcome: "Entry-level Data Analyst, MIS Analyst, or BI Analyst role within 6 months.",
    color: "#1DE5B5",
    bgColor: "#E6F7F6",
    image: "https://images.unsplash.com/photo-1599566662334-905d6e25539d?q=80&w=800&auto=format&fit=crop&v=2",
  },
  {
    title: "Non-Tech Career Switchers",
    painPoint: "You are in a non-technical role and want to transition into analytics without a coding background.",
    forYouIf: "You are looking for a career change to data analyst, starting from Excel and SQL foundations with no prior programming required.",
    outcome: "Transition into a data analytics role in retail, banking, or consulting.",
    color: "#239bf5",
    bgColor: "#E6F0F7",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop&v=2",
  },
  {
    title: "Working Professionals",
    painPoint: "Your current role needs data skills, but your schedule is packed.",
    forYouIf: "You need a data analyst course for working professionals with weekend batches, evening sessions, and flexible learning modes.",
    outcome: "Upskill to Senior Analyst, Analytics Manager, or transition to a data-centric function.",
    color: "#F5C842",
    bgColor: "#FFFBE6",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=800&auto=format&fit=crop&v=2",
  },
  {
    title: "BI and Business Analyst Upgraders",
    painPoint: "You already work with data but want to add Python, AI, and predictive modelling to your toolkit.",
    forYouIf: "You are a business analyst or BI analyst looking to upgrade from Excel and Tableau to Python, SQL, and AI-integrated analytics.",
    outcome: "Move into Product Analyst, Senior BI Analyst, or Analytics Lead roles.",
    color: "#19dfaf",
    bgColor: "#E6F7F6",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop&v=2",
  },
];

export default function WhoIsThisFor({ subtitle }: { subtitle?: string }) {
  const [ref, visible] = useVisible();

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

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PERSONAS.map((persona, i) => (
            <div
              key={persona.title}
              className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#E6F0F7] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s, box-shadow 0.4s`,
              }}
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={persona.image}
                  alt={persona.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div 
                  className="absolute bottom-4 left-6 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md"
                  style={{ backgroundColor: `${persona.color}88` }}
                >
                  Target Persona
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <h3 className="font-bold text-[#09263F] text-lg mb-4 group-hover:text-[#239bf5] transition-colors">{persona.title}</h3>
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
          ))}
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
