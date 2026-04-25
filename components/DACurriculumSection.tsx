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
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Dual-Track Curriculum · 450+ Hours</span>
          </span>
          <h2 className="text-[#09263F] font-bold text-3xl sm:text-5xl leading-tight mb-4">
            Data Analyst + AI —{' '}
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">What You Will Learn</span>
          </h2>
          <p className="text-[#4A6275] text-base leading-relaxed max-w-3xl mx-auto">
            Master the core analytics foundations first, then supercharge your productivity with Generative AI tools designed for modern analysts.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-stretch">
          
          {/* LEFT COLUMN: CORE TRACK */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#09263F] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                Track 01
              </span>
              <h3 className="text-xl font-bold text-[#09263F]">Core Data Analytics Foundation</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {CORE_MODULES.map((m) => (
                <div key={m.num} className="bg-white border border-[#D6ECEB] rounded-2xl p-6 transition-all duration-300 hover:border-[#1DE5B5] hover:shadow-md group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-bold uppercase tracking-widest text-[#1DE5B5] group-hover:text-[#09263F] transition-colors">
                      Module {m.num}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#09263F] mb-2">{m.title}</h4>
                  <p className="text-[14px] text-[#4A6275] leading-relaxed mb-4">{m.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {m.tags.map((tag) => (
                      <span key={tag} className="text-[12px] bg-[#F4FAFA] text-[#09263F] px-2 py-0.5 rounded-full font-medium border border-[#D6ECEB]">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: AI TRACK */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6 lg:pl-4">
              <span className="bg-[#1DE5B5] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                Track 02
              </span>
              <h3 className="text-xl font-bold text-[#09263F]">AI-Integrated Layer</h3>
            </div>

            <div className="flex-1 bg-gradient-to-b from-[#fefbe5] via-[#e6fbf1] to-[#ecfafe] border border-[#1DE5B5] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#09263F] text-white px-3 py-1 rounded-full">Recommended</span>
                <span className="text-[11px] text-[#4A6275] font-medium">Included in the Course</span>
              </div>

              <div className="space-y-6">
                {AI_MODULES.map((m) => (
                  <div key={m.num} className="bg-white/60 backdrop-blur-sm border border-[#D6ECEB] rounded-2xl p-5 hover:border-[#1DE5B5] transition-colors group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#09263F] opacity-60">{m.num}</span>
                      <svg className="w-5 h-5 text-[#1DE5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-base font-bold text-[#09263F] mb-2">{m.title}</h4>
                    <p className="text-[12px] text-[#4A6275] leading-relaxed mb-4">{m.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-white text-[#09263F] px-2 py-0.5 rounded-full font-medium border border-[#D6ECEB] group-hover:border-[#1DE5B5] transition-colors">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Unique value add box */}
              <div className="mt-8 pt-6 border-t border-[#1DE5B5]/20">
                <h5 className="text-sm font-bold text-[#09263F] mb-3">What sets this apart?</h5>
                <ul className="space-y-2">
                  {[
                    "Master Prompt Engineering for data tasks",
                    "AI-assisted SQL & Python coding",
                    "Automated dashboard narratives",
                    "Dual Certification (NASSCOM + AI)"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-[#4A6275]">
                      <svg className="w-3.5 h-3.5 text-[#1DE5B5] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Download CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#4A6275] text-sm mb-6 font-medium">Want the complete day-wise breakdown?</p>
          <button
            onClick={onOpenBrochure}
            className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.25)] active:scale-95 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Full Dual-Track Syllabus
          </button>
        </div>
      </div>
    </section>
  );
}
