'use client';

import { useState } from "react";

interface Props {
  onOpenBrochure: () => void;
}

const CORE_MODULES = [
  { num: "01", title: "Building Blocks", desc: "Foundations of mathematics, statistics, and problem-solving for data analysis.", tags: ["Maths", "Stats", "Problem-Solving"] },
  { num: "02", title: "Excel and Power BI", desc: "Business intelligence, data visualization, dashboards, pivot tables, and DAX measures.", tags: ["Excel", "Power BI", "DAX", "Dashboards"] },
  { num: "03", title: "SQL and Data Management", desc: "RDBMS, ETL pipelines, complex joins, window functions, CTEs, and cloud SQL (Azure).", tags: ["SQL", "Azure", "ETL", "Cloud"] },
  { num: "04", title: "Python for Data Analysis", desc: "Core Python, Pandas, NumPy, EDA, statistical analysis, and predictive modelling.", tags: ["Python", "Pandas", "NumPy", "EDA"] },
  { num: "05", title: "Industry Analytics", desc: "Marketing analytics, operations analytics, risk analytics across retail, BFSI, telecom.", tags: ["Marketing", "Operations", "Risk", "BFSI"] },
  { num: "06", title: "Capstone Projects", desc: "End-to-end data analytics projects: requirement gathering, pipeline building, and final viva.", tags: ["3 Projects", "Portfolio", "Pipeline"] },
  { num: "07", title: "Placement Readiness", desc: "Resume building, mock interviews, career coaching, and placement drives over 8 weeks.", tags: ["Resume", "Mock Interviews", "8 Weeks"] },
];

const AI_MODULES = [
  { num: "AI-1", title: "Generative AI for Analysts", desc: "Prompt engineering, AI-assisted SQL and Python coding, GenAI for automated BI narratives and Power BI storytelling.", tags: ["ChatGPT", "Prompt Eng.", "GenAI for BI"] },
  { num: "AI-2", title: "No-Code AI Tools", desc: "Build predictive models and automate analysis workflows without writing code. Ideal for business users upgrading to AI.", tags: ["No-Code", "AutoML", "AI Workflows"] },
  { num: "AI-3", title: "Python for AI Analytics", desc: "Specialised Python foundation designed for AI-enhanced data analysis, automation, and reporting pipelines.", tags: ["Python", "AI Automation", "Pipelines"] },
];

export default function DACurriculumSection({ onOpenBrochure }: Props) {
  const [activeTrack, setActiveTrack] = useState<'core' | 'ai'>('core');

  return (
    <section id="curriculum" className="py-16 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">CURRICULUM</span>
          </span>
          <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl leading-tight mb-3">
            What You Will Learn Across{' '}
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">450+ Hours</span>
          </h2>
          <p className="text-[#4A6275] text-base leading-relaxed">
            Two tracks: Core Data Analytics for a solid foundation, or AI-Integrated for analysts who want to lead with AI. Both tracks earn the same NASSCOM-FutureSkills Prime certification.
          </p>
        </div>

        {/* Track Toggle */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTrack('core')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTrack === 'core'
                ? 'bg-[#09263F] text-white shadow-lg'
                : 'bg-[#F4FAFA] text-[#4A6275] border border-[#D6ECEB] hover:bg-[#E6F7F6]'
            }`}
          >
            Core Data Analytics
          </button>
          <button
            onClick={() => setActiveTrack('ai')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTrack === 'ai'
                ? 'bg-[#09263F] text-white shadow-lg'
                : 'bg-[#F4FAFA] text-[#4A6275] border border-[#D6ECEB] hover:bg-[#E6F7F6]'
            }`}
          >
            AI-Integrated
            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#1DE5B5] text-[#09263F] px-2 py-0.5 rounded-full">Recommended</span>
          </button>
        </div>

        {/* Core Track */}
        <div className="space-y-3">
          {CORE_MODULES.map((m) => (
            <div key={m.num} className="bg-white border border-[#D6ECEB] rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:border-[#1DE5B5] transition-colors">
              <span className="inline-flex items-center gap-2 bg-[#E6F7F6] text-[#09263F] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0">
                Module {m.num}
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#09263F] mb-1">{m.title}</h4>
                <p className="text-[12px] text-[#4A6275] leading-relaxed mb-2">{m.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-[#F4FAFA] text-[#09263F] px-2 py-0.5 rounded-full font-medium border border-[#D6ECEB]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* AI Modules (shown when AI track active) */}
          {activeTrack === 'ai' && (
            <div className="border border-[#1DE5B5] rounded-2xl p-5 mt-4" style={{ background: 'linear-gradient(135deg, #fefbe5 0%, #e6fbf1 50%, #ecfafe 100%)' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 bg-[#79f4c8] text-[#09263F] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  AI-Integrated Modules
                </span>
                <span className="text-[11px] text-[#4A6275] font-medium">Additional to Core Track</span>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {AI_MODULES.map((m) => (
                  <div key={m.num} className="bg-white/80 backdrop-blur-sm border border-[#D6ECEB] rounded-xl p-4">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#1DE5B5] text-[#09263F] px-2 py-0.5 rounded-full mb-2">{m.num}</span>
                    <h4 className="text-[13px] font-bold text-[#09263F] leading-snug mb-1">{m.title}</h4>
                    <p className="text-[11px] text-[#4A6275] leading-relaxed mb-2">{m.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {m.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-[#E6F7F6] text-[#09263F] px-2 py-0.5 rounded-full font-medium border border-[#D6ECEB]">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onOpenBrochure}
            className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.25)] active:scale-95"
          >
            Download Full Syllabus →
          </button>
        </div>
      </div>
    </section>
  );
}
