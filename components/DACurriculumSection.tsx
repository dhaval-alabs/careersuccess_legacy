'use client';

import { useState } from "react";

interface Props {
  onOpenBrochure: () => void;
}

const TIER_1 = {
  title: "Foundation and Analytics",
  subtitle: "MODULES 01-04",
  modules: [
    { num: "01", title: "Building Blocks", tags: ["Analytics", "Excel", "Stats", "Foundations"] },
    { num: "02", title: "Excel, SQL & Power BI", tags: ["SQL", "Power BI", "DAX", "Excel Advanced"] },
    { num: "03", title: "Python for Data Science", tags: ["Python", "Pandas", "NumPy", "EDA"] },
    { num: "04", title: "R for Data Science", tags: ["R", "Optional", "Predictive Modelling"] },
  ]
};

const TIER_2 = {
  title: "Data Science and Machine Learning",
  subtitle: "MODULES 05-08",
  modules: [
    { num: "05", title: "Statistics and Predictive Modelling", tags: ["Stats", "Regression", "Hypothesis Testing"] },
    { num: "06", title: "Machine Learning", tags: ["scikit-learn", "SVM", "Ensemble", "Clustering"] },
    { num: "07", title: "Text Mining and NLP", tags: ["spaCy", "NLTK", "Sentiment Analysis"] },
    { num: "08", title: "Deployment and MLOps", tags: ["Flask", "Git", "Cloud", "ML Lifecycle"] },
  ]
};

const TIER_3 = {
  title: "AI and Career Readiness",
  subtitle: "WHAT SETS THIS COURSE APART",
  modules: [
    { 
      num: "09", 
      title: "Generative AI", 
      desc: "Prompt engineering, GenAI for Python/SQL/Power BI, AI-assisted model evaluation",
      tags: ["ChatGPT", "Claude", "Prompt Eng.", "GenAI for Python/SQL/BI"],
      highlight: true
    },
    { 
      num: "10", 
      title: "Capstone Projects", 
      desc: "6 Projects",
      tags: ["Banking", "E-commerce", "Portfolio"]
    },
    { 
      num: "11", 
      title: "Career Readiness", 
      tags: ["Resume", "Mock Interviews", "8 Weeks", "Simulated Drives"],
      special: true
    },
  ]
};

export default function DACurriculumSection({ onOpenBrochure }: Props) {
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Comprehensive Curriculum · 500+ Hours</span>
          </span>
          <h2 className="text-[#09263F] font-bold text-3xl sm:text-5xl leading-tight mb-4">
            Data Science + AI —{' '}
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">What You Will Learn</span>
          </h2>
          <p className="text-[#4A6275] text-base leading-relaxed max-w-3xl mx-auto">
            From analytics foundations to advanced machine learning and Generative AI, master the tools used by world-class data scientists.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* TIER 1 */}
          <div className="bg-white border border-[#D6ECEB] rounded-[32px] p-6 sm:p-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[#f0f9f9] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[#D6ECEB]">
                TIER 1
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#09263F]">{TIER_1.title}</h3>
                <p className="text-[11px] text-[#4A6275] font-bold tracking-widest uppercase mt-0.5">{TIER_1.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TIER_1.modules.map((m) => (
                <div key={m.num} className="bg-white border border-[#D6ECEB] rounded-2xl p-6 hover:border-[#1DE5B5] transition-all group">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6275] mb-2 block opacity-60">MODULE {m.num}</span>
                  <h4 className="text-[15px] font-bold text-[#09263F] mb-4 h-10 flex items-center">{m.title}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-[#F4FAFA] text-[#09263F] px-2 py-0.5 rounded-full font-semibold border border-[#D6ECEB]">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TIER 2 */}
          <div className="bg-white border border-[#D6ECEB] rounded-[32px] p-6 sm:p-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[#f0f9f9] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[#D6ECEB]">
                TIER 2
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#09263F]">{TIER_2.title}</h3>
                <p className="text-[11px] text-[#4A6275] font-bold tracking-widest uppercase mt-0.5">{TIER_2.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TIER_2.modules.map((m) => (
                <div key={m.num} className="bg-white border border-[#D6ECEB] rounded-2xl p-6 hover:border-[#1DE5B5] transition-all group">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6275] mb-2 block opacity-60">MODULE {m.num}</span>
                  <h4 className="text-[15px] font-bold text-[#09263F] mb-4 h-10 flex items-center">{m.title}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-[#F4FAFA] text-[#09263F] px-2 py-0.5 rounded-full font-semibold border border-[#D6ECEB]">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TIER 3 */}
          <div className="bg-[#f0faf8] border border-[#1DE5B5]/30 rounded-[32px] p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DE5B5]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <span className="bg-[#1DE5B5] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                TIER 3
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#09263F]">{TIER_3.title}</h3>
                <p className="text-[11px] text-[#4A6275] font-bold tracking-widest uppercase mt-0.5">{TIER_3.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              {TIER_3.modules.map((m) => (
                <div 
                  key={m.num} 
                  className={`rounded-2xl p-6 transition-all group ${
                    m.highlight ? 'bg-white border-2 border-[#1DE5B5] shadow-lg' : 
                    m.special ? 'bg-[#fffbeb] border border-[#fcd34d] shadow-sm' : 
                    'bg-white/60 border border-[#D6ECEB] backdrop-blur-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#09263F]/60">MODULE {m.num}</span>
                    {m.highlight && (
                      <span className="bg-[#1DE5B5] text-[#09263F] text-[8px] font-black px-2 py-0.5 rounded-full uppercase">NEW</span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#09263F] mb-2">{m.title}</h4>
                  {m.desc && <p className="text-[12px] text-[#4A6275] leading-relaxed mb-4">{m.desc}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        m.special ? 'bg-white text-[#854f0b] border-[#fcd34d]' : 'bg-white text-[#09263F] border-[#D6ECEB]'
                      }`}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Download CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#4A6275] text-sm mb-6 font-medium">Want the complete day-wise breakdown?</p>
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
