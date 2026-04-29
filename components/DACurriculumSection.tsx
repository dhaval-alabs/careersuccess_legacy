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
  { num: "06", title: "Capstone Projects", tags: ["3 Projects", "Portfolio", "Pipeline"] },
  { 
    num: "05A", 
    title: "Generative AI for Analysts", 
    tags: ["ChatGPT", "Claude", "Prompt Eng.", "GenAI for Python/SQL/BI"],
    desc: "Use Generative AI to accelerate your analytics workflow. Write SQL faster with AI-assisted query generation, automate Python scripts, and build dynamic Power BI narratives using GenAI tools. Includes hands-on prompt engineering for data tasks and AI-assisted data cleaning and reporting pipelines.",
    highlight: true
  },
  { 
    num: "05B", 
    title: "Agentic AI Systems", 
    tags: ["AutoGen", "LangChain", "No-Code Agents", "Multi-Step Workflows"],
    desc: "Build and manage No-Code AI Agents that autonomously plan, reason, and execute multi-step analytics workflows. Design agent pipelines that monitor live data, trigger automated reports, handle data validation, and escalate anomalies.",
    highlight: true
  },
  { 
    num: "05C", 
    title: "Python for AI and Automation", 
    tags: ["Python", "API Integration", "AI Orchestration", "Automation"],
    desc: "A specialised Python module for controlling and scaling Agentic AI systems. Covers API integrations, orchestration libraries, building data pipelines that connect AI agents to live business data, and deploying lightweight AI-assisted analytics tools.",
    highlight: true
  },
  { 
    num: "07", 
    title: "Placement Readiness", 
    tags: ["Resume", "Mock Interviews", "8 Weeks", "Simulated Drives"],
    highlight: false // Special treatment handled in renderer
  },
];

function ModuleCard({ m, type = 'standard' }: { m: Module; type?: 'standard' | 'ai' | 'placement' }) {
  const isAI = type === 'ai';
  const isPlacement = type === 'placement';
  
  let cardClass = "bg-white border-[#D6ECEB] border rounded-2xl p-6 transition-all group hover:shadow-xl";
  let tagClass = "text-[9px] bg-[#F4FAFA] text-[#09263F] px-2 py-0.5 rounded-full font-bold border border-[#D6ECEB]";
  let labelClass = "text-[10px] font-bold uppercase tracking-widest text-[#4A6275] opacity-60";

  if (isAI && m.num === '05A') {
    cardClass = "bg-[#E6F7F6] border-l-[3px] border-l-[#1DE5B5] border border-[#D6ECEB] rounded-2xl p-6 transition-all group hover:shadow-xl";
  } else if (isPlacement) {
    cardClass = "bg-[#FFFBE6] border border-[#FFB800] rounded-2xl p-6 transition-all group hover:shadow-xl";
    tagClass = "text-[9px] bg-[#FFFBE6] text-[#09263F] px-2 py-0.5 rounded-full font-bold border border-[#FFB800]";
    labelClass = "text-[10px] font-bold uppercase tracking-widest text-[#09263F] opacity-100";
  }

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-start mb-4">
        <span className={labelClass}>MODULE {m.num}</span>
        {isAI && <span className="bg-[#1DE5B5] text-[#09263F] text-[8px] font-black px-1.5 py-0.5 rounded-md">AI MODULE</span>}
      </div>
      <h4 className="text-[15px] font-bold text-[#09263F] mb-3 h-10 flex items-center leading-tight">{m.title}</h4>
      {m.desc && <p className="text-[11px] text-[#4A6275] leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">{m.desc}</p>}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {m.tags.map((tag) => (
          <span key={tag} className={tagClass}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

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

        {/* Overview Stats Row */}
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-[#09263F]">6-10 Months</p>
              <p className="text-xs text-[#4A6275] font-medium leading-relaxed">Self-paced study + assignments</p>
            </div>
          </div>
          <div className="bg-[#f8fcfb] border border-[#D6ECEB] rounded-2xl p-6 flex items-start gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-[#D6ECEB] text-[#FFEA79]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-xl font-bold text-[#09263F]">100% Placement</p>
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
        {activeTab === 'core' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_MODULES.map((m) => (
              <div key={m.num}>
                <ModuleCard m={m} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Zone A: Core Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AI_EXTENDED_MODULES.filter(m => ['01','02','03','04','05','06'].includes(m.num)).map((m) => (
                <ModuleCard key={m.num} m={m} />
              ))}
            </div>

            {/* Zone B: AI + Placement Readiness */}
            <div 
              className="border border-[#1DE5B5] rounded-3xl p-8 sm:p-10"
              style={{ background: 'linear-gradient(135deg, #fefbe5 0%, #e6fbf1 50%, #ecfafe 100%)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <span className="inline-flex items-center gap-2 bg-[#79f4c8] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start">
                  AI INTEGRATED
                </span>
                <div>
                  <h3 className="font-bold text-[#09263F] text-lg leading-snug">Advanced Automation Track</h3>
                  <p className="text-xs text-[#4A6275] font-bold uppercase tracking-widest">What Sets This Course Apart</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* AI Modules */}
                {AI_EXTENDED_MODULES.filter(m => ['05A','05B','05C'].includes(m.num)).map((m) => (
                  <ModuleCard key={m.num} m={m} type="ai" />
                ))}
                {/* Placement Readiness */}
                {AI_EXTENDED_MODULES.filter(m => m.num === '07').map((m) => (
                  <ModuleCard key={m.num} m={m} type="placement" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Assistance */}
        <div className="mt-16 bg-[#09263F] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DE5B5] opacity-5 blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3">Enrollment Assistance</h3>
            <p className="text-[#A5B9C8] max-w-xl text-base leading-relaxed">
              Need help understanding which track is right for you? Our learning advisors are available to guide you based on your career goals.
            </p>
          </div>
          <a
            href="tel:9555525908"
            className="relative z-10 bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-4 rounded-xl text-base transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            Talk to Advisor →
          </a>
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
