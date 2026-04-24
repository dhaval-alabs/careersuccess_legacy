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
    icon: "📊",
    tagColor: "#217346",
    desc: "Advanced formulas, pivot tables, dashboards, and VBA macros for business reporting and data organisation.",
    keywords: "excel course, excel for data analyst"
  },
  {
    name: "SQL",
    icon: "🗄️",
    tagColor: "#336791",
    desc: "Write complex queries, joins, subqueries, window functions, and CTEs. Practice on cloud databases (Azure SQL).",
    keywords: "sql course, sql for data analysis"
  },
  {
    name: "Power BI",
    icon: "📈",
    tagColor: "#F2C811",
    desc: "Build interactive dashboards, DAX measures, data modelling, and scheduled refresh pipelines for real-time reporting.",
    keywords: "power bi course, power bi training"
  },
  {
    name: "Tableau",
    icon: "📉",
    tagColor: "#E97627",
    desc: "Create stunning visual analytics, LOD expressions, and story-driven dashboards for stakeholder presentations.",
    keywords: "tableau course, tableau training"
  },
  {
    name: "Python",
    icon: "🐍",
    tagColor: "#3776AB",
    desc: "Pandas, NumPy, Matplotlib, and Seaborn for statistical analysis, EDA, and predictive modelling with regression.",
    keywords: "python for data analysis, python for data analytics"
  },
  {
    name: "Generative AI",
    icon: "🤖",
    tagColor: teal,
    desc: "Prompt engineering, AI-assisted coding for Python and SQL, and GenAI tools for automated BI narratives and reporting.",
    keywords: "ai data analytics course"
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
              <p className="text-[#4A6275] text-[11px] leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
