'use client';

import { useState } from "react";

interface Props {
  onOpenBrochure: () => void;
}

interface Module {
  num: string;
  title: string;
  tags: string[];
  desc?: string;
  highlight?: boolean;
}

const CORE_MODULES: Module[] = [
  { num: "01", title: "Building Blocks", tags: ["Maths", "Stats", "Problem-Solving"] },
  { num: "02", title: "Excel and Power BI", tags: ["Excel", "Power BI", "DAX", "Dashboards"] },
  { num: "03", title: "SQL and Data Management", tags: ["SQL", "Azure", "ETL", "Cloud"] },
  { num: "04", title: "Python for Data Analysis", tags: ["Python", "Pandas", "NumPy", "EDA"] },
  { num: "05", title: "Industry Analytics", tags: ["Marketing", "Operations", "Risk", "BFSI"] },
  { num: "06", title: "Capstone Projects", tags: ["3 Projects", "Portfolio", "Pipeline"] },
  { num: "07", title: "Placement Readiness", tags: ["Resume", "Mock Interviews", "8 Weeks"] },
];

const AI_EXTENDED_MODULES: Module[] = [
  { num: "01", title: "Building Blocks", tags: ["Maths", "Stats", "Problem-Solving"] },
  { num: "02", title: "Excel and Power BI", tags: ["Excel", "Power BI", "DAX", "Dashboards"] },
  { num: "03", title: "SQL and Data Management", tags: ["SQL", "Azure", "ETL", "Cloud"] },
  { num: "04", title: "Python for Data Analysis", tags: ["Python", "Pandas", "NumPy", "EDA"] },
  { num: "05", title: "Industry Analytics", tags: ["Marketing", "Operations", "Risk", "BFSI"] },
  { 
    num: "05A", 
    title: "Generative AI for Analysts", 
    tags: ["GenAI", "Prompt Engineering", "Power BI", "SQL Automation"],
    desc: "Use Generative AI to accelerate your analytics workflow. Write SQL faster with AI-assisted query generation, automate Python scripts, and build dynamic Power BI narratives using GenAI tools.",
    highlight: true
  },
  { 
    num: "05B", 
    title: "Agentic AI Systems", 
    tags: ["No-Code Agents", "AutoGen", "LangChain", "Multi-Step Workflows"],
    desc: "Build and manage No-Code AI Agents that autonomously plan, reason, and execute multi-step analytics workflows. Design agent pipelines that monitor live data and handle data validation.",
    highlight: true
  },
  { 
    num: "05C", 
    title: "Python for AI and Automation", 
    tags: ["Python", "API Integration", "AI Orchestration", "Automation"],
    desc: "A specialised Python module designed to control and scale Agentic AI systems. Covers API integrations, orchestration libraries, and building data pipelines that connect AI agents.",
    highlight: true
  },
  { num: "06", title: "Capstone Projects", tags: ["3 Projects", "Portfolio", "Pipeline"] },
  { num: "07", title: "Placement Readiness", tags: ["Resume", "Mock Interviews", "8 Weeks"] },
];

export default function DACurriculumSection({ onOpenBrochure }: Props) {
  const [activeTab, setActiveTab] = useState<'core' | 'ai'>('ai');

  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Authoritative Curriculum · 445-760 Hours</span>
          </span>
          <h2 className="text-[#09263F] font-bold text-3xl sm:text-5xl leading-tight mb-4">
            Dual Certification Track —{' '}
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">What You Will Learn</span>
          </h2>
          <p className="text-[#4A6275] text-base leading-relaxed max-w-3xl mx-auto">
            Synced with the IIT Bombay + IIT Patna academic partnership. Choose between our Core Analytics track or the AI-Integrated track for advanced automation.
          </p>
        </div>

        {/* Change 5: Overview Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#f8fcfb] border border-[#D6ECEB] rounded-2xl p-6 flex items-start gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-[#D6ECEB] text-[#1DE5B5]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-[#09263F]">43 Classes</p>
              <p className="text-xs text-[#4A6275] font-medium leading-relaxed">445 hours of structured learning</p>
            </div>
          </div>
          <div className="bg-[#f8fcfb] border border-[#D6ECEB] rounded-2xl p-6 flex items-start gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-[#D6ECEB] text-[#239bf5]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-[#09263F]">90 Hours</p>
              <p className="text-xs text-[#4A6275] font-medium leading-relaxed">Self-study + 6 assignments and projects</p>
            </div>
          </div>
          <div className="bg-[#f8fcfb] border border-[#D6ECEB] rounded-2xl p-6 flex items-start gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-[#D6ECEB] text-[#FFEA79]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-[#09263F]">8 Weeks</p>
              <p className="text-xs text-[#4A6275] font-medium leading-relaxed">Placement Readiness Program included</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#f0f9f9] p-1.5 rounded-2xl border border-[#D6ECEB] flex gap-1">
            <button
              onClick={() => setActiveTab('core')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'core' 
                ? 'bg-[#09263F] text-white shadow-lg' 
                : 'text-[#4A6275] hover:bg-white'
              }`}
            >
              Core Data Analytics
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ai' 
                ? 'bg-[#1DE5B5] text-[#09263F] shadow-lg' 
                : 'text-[#4A6275] hover:bg-white'
              }`}
            >
              AI-Integrated Recommended
              <span className="bg-[#09263F] text-white text-[9px] px-1.5 py-0.5 rounded-md">NEW</span>
            </button>
          </div>
        </div>

        {/* Tab Description */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          {activeTab === 'ai' ? (
            <p className="text-[#4A6275] text-sm leading-relaxed font-medium">
              Everything in the Core track, plus three AI modules that put you ahead of the market. The AI-Integrated track earns the same NASSCOM-FutureSkills Prime certification with an extended syllabus of 760+ hours.
            </p>
          ) : (
            <p className="text-[#4A6275] text-sm leading-relaxed font-medium">
              Our flagship analytics program covering the essential tool-stack for data professionals. 445 hours of comprehensive training from foundations to industry applications.
            </p>
          )}
        </div>

        {/* Grid of Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === 'core' ? CORE_MODULES : AI_EXTENDED_MODULES).map((m) => (
            <div 
              key={m.num} 
              className={`bg-white border rounded-2xl p-6 transition-all group hover:shadow-xl ${
                m.highlight ? 'border-[#1DE5B5] ring-1 ring-[#1DE5B5]/20 shadow-lg' : 'border-[#D6ECEB]'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6275] opacity-60">MODULE {m.num}</span>
                {m.highlight && <span className="bg-[#1DE5B5] text-[#09263F] text-[8px] font-black px-1.5 py-0.5 rounded-md">AI MODULE</span>}
              </div>
              <h4 className="text-[15px] font-bold text-[#09263F] mb-3 h-10 flex items-center">{m.title}</h4>
              {m.desc && <p className="text-[11px] text-[#4A6275] leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">{m.desc}</p>}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {m.tags.map((tag) => (
                  <span key={tag} className="text-[9px] bg-[#F4FAFA] text-[#09263F] px-2 py-0.5 rounded-full font-bold border border-[#D6ECEB]">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Download CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenBrochure}
            className="bg-[#09263F] hover:bg-[#0c3150] text-white font-bold px-10 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(9,38,63,0.2)] active:scale-95 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5 text-[#1DE5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Full Curriculum
          </button>
        </div>
      </div>
    </section>
  );
}
