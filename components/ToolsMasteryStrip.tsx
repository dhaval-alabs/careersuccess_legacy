'use client';

import { useEffect, useRef, useState } from "react";

const navy = "#09263F";
const teal = "#1DE5B5";

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

const TOOLS = [
  {
    name: "Microsoft Excel",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#217346">
        <path d="M16.2 21H7.8C6.81 21 6 20.19 6 19.2V4.8C6 3.81 6.81 3 7.8 3H16.2C17.19 3 18 3.81 18 4.8V19.2C18 20.19 17.19 21 16.2 21Z" opacity="0.1" />
        <path d="M14.25 21L6 18.3V5.7L14.25 3V21Z" fill="#217346" />
        <path d="M14.25 8.25H21V15.75H14.25V8.25Z" fill="#217346" opacity="0.5" />
        <path d="M9.75 14.25L7.5 12L9.75 9.75M12.75 9.75L15 12L12.75 14.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: "Advanced formulas, pivot tables, dashboards, and VBA macros for business reporting and data organisation.",
  },
  {
    name: "SQL",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#336791">
        <path d="M12 3C7.58 3 4 4.79 4 7V17C4 19.21 7.58 21 12 21C16.42 21 20 19.21 20 17V7C20 4.79 16.42 3 12 3ZM18 17C18 17.65 15.65 19 12 19C8.35 19 6 17.65 6 17V15.11C7.68 15.68 9.74 16 12 16C14.26 16 16.32 15.68 18 15.11V17ZM18 13.11C16.32 13.68 14.26 14 12 14C9.74 14 7.68 13.68 6 13.11V11.11C7.68 11.68 9.74 12 12 12C14.26 12 16.32 11.68 18 11.11V13.11ZM18 9.11C16.32 9.68 14.26 10 12 10C9.74 10 7.68 9.68 6 9.11V7C6 6.35 8.35 5 12 5C15.65 5 18 6.35 18 7V9.11Z" />
      </svg>
    ),
    desc: "Write complex queries, joins, subqueries, window functions, and CTEs. Practice on cloud databases (Azure SQL).",
  },
  {
    name: "Power BI",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#F2C811">
        <path d="M7 11h4v10H7V11zm6-4h4v14h-4V7zm6-4h4v18h-4V3z" />
        <path d="M2 15h4v6H2v-6z" opacity="0.6" />
      </svg>
    ),
    desc: "Build interactive dashboards, DAX measures, data modelling, and scheduled refresh pipelines for real-time reporting.",
  },
  {
    name: "Tableau",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2h8z" fill="#E97627" />
        <path d="M10 5L12 3L14 5M10 19L12 21L14 19M5 10L3 12L5 14M19 10L21 12L19 14" stroke="#E97627" strokeWidth="1" />
      </svg>
    ),
    desc: "Create stunning visual analytics, LOD expressions, and story-driven dashboards for stakeholder presentations.",
  },
  {
    name: "Python",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12.04 1.25c-3.15 0-2.95 1.36-2.95 1.36l.01 1.41h2.99v.42h-4.2c0 0-2.28-.26-2.28 2.24s1.94 2.16 1.94 2.16h1.16v-1.64c0 0-.03-1.95 1.91-1.95h3.04s1.85-.05 1.85-1.78-.01-2.22-.01-2.22s.22-2-3.47-2z" fill="#3776AB" />
        <path d="M11.96 22.75c3.15 0 2.95-1.36 2.95-1.36l-.01-1.41H11.9v-.42h4.2c0 0 2.28.26 2.28-2.24s-1.94-2.16-1.94-2.16h-1.16v1.64c0 0 .03 1.95-1.91 1.95h-3.04s-1.85.05-1.85 1.78.01 2.22.01 2.22s-.22 2 3.47 2z" fill="#FFD43B" />
      </svg>
    ),
    desc: "Pandas, NumPy, Matplotlib, and Seaborn for statistical analysis, EDA, and predictive modelling with regression.",
  },
  {
    name: "Generative AI",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={teal}>
        <path d="M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z" opacity="0.3" />
        <path d="M9 3l1.5 4.5h4.5l-3.5 3 1.5 4.5-4-3-4 3 1.5-4.5-3.5-3h4.5L9 3z" />
      </svg>
    ),
    desc: "Prompt engineering, AI-assisted coding for Python and SQL, and GenAI tools for automated BI narratives and reporting.",
  },
];

export default function ToolsMasteryStrip() {
  const [ref, visible] = useVisible();

  return (
    <section id="tools" className="py-16 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">TOOLS YOU WILL MASTER</span>
          </span>
          <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl mt-2 mb-3">
            Industry Tools. <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Hands-On Training.</span>
          </h2>
          <p className="text-[#4A6275] max-w-2xl mx-auto text-base leading-relaxed">
            Every tool taught with real business datasets. Not just theory: you build dashboards, write production queries, and automate reports from day one.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TOOLS.map((tool, i) => (
            <div
              key={tool.name}
              className="group bg-white border border-[#D6ECEB] rounded-2xl p-5 text-center transition-all duration-300 hover:border-[#1DE5B5] hover:shadow-[0_8px_32px_rgba(29,229,181,0.12)]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s, border-color 0.3s, box-shadow 0.3s`,
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 bg-[#F4FAFA] group-hover:bg-[#E6F7F6] transition-colors duration-300">
                {tool.icon}
              </div>
              <h3 className="font-bold text-[#09263F] text-sm mb-2">{tool.name}</h3>
              <p className="text-[#4A6275] text-[12px] leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
