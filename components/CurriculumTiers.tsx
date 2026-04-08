'use client';

interface Props {
  onOpenBrochure: () => void;
}

export default function CurriculumTiers({ onOpenBrochure }: Props) {
  return (
    <div className="space-y-6">

      {/* Tier 1: Foundation and Analytics */}
      <div className="bg-white border border-[#D6ECEB] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <span className="inline-flex items-center gap-2 bg-[#E6F7F6] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start">
            Tier 1
          </span>
          <div>
            <h3 className="font-bold text-[#09263F] text-base leading-snug">Foundation and Analytics</h3>
            <p className="text-[10px] text-[#4A6275] font-medium uppercase tracking-widest">Modules 01–04</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { num: "01", title: "Building Blocks", tags: ["Analytics", "Excel", "Stats", "Foundations"] },
            { num: "02", title: "Excel, SQL & Power BI", tags: ["SQL", "Power BI", "DAX", "Excel Advanced"] },
            { num: "03", title: "Python for Data Science", tags: ["Python", "Pandas", "NumPy", "EDA"] },
            { num: "04", title: "R for Data Science", tags: ["R", "Optional", "Predictive Modelling"] },
          ].map((m) => (
            <div key={m.num} className="rounded-xl border border-[#D6ECEB] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A6275]">Module {m.num}</p>
              <h4 className="text-[13px] font-bold text-[#09263F] mt-1 mb-2 leading-snug">{m.title}</h4>
              <div className="flex flex-wrap gap-1">
                {m.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-[#E6F7F6] text-[#09263F] px-2 py-0.5 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 2: Data Science and Machine Learning */}
      <div className="bg-white border border-[#D6ECEB] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <span className="inline-flex items-center gap-2 bg-[#E6FAFF] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start">
            Tier 2
          </span>
          <div>
            <h3 className="font-bold text-[#09263F] text-base leading-snug">Data Science and Machine Learning</h3>
            <p className="text-[10px] text-[#4A6275] font-medium uppercase tracking-widest">Modules 05–08</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { num: "05", title: "Statistics and Predictive Modelling", tags: ["Stats", "Regression", "Hypothesis Testing"] },
            { num: "06", title: "Machine Learning", tags: ["scikit-learn", "SVM", "Ensemble", "Clustering"] },
            { num: "07", title: "Text Mining and NLP", tags: ["spaCy", "NLTK", "Sentiment Analysis"] },
            { num: "08", title: "Deployment and MLOps", tags: ["Flask", "Git", "Cloud", "ML Lifecycle"] },
          ].map((m) => (
            <div key={m.num} className="rounded-xl border border-[#D6ECEB] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A6275]">Module {m.num}</p>
              <h4 className="text-[13px] font-bold text-[#09263F] mt-1 mb-2 leading-snug">{m.title}</h4>
              <div className="flex flex-wrap gap-1">
                {m.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-[#E6FAFF] text-[#09263F] px-2 py-0.5 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 3: AI and Career Readiness — HIGHLIGHTED */}
      <div
        className="border border-[#1DE5B5] rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, #fefbe5 0%, #e6fbf1 50%, #ecfafe 100%)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <span className="inline-flex items-center gap-2 bg-[#79f4c8] text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start">
            Tier 3
          </span>
          <div>
            <h3 className="font-bold text-[#09263F] text-base leading-snug">AI and Career Readiness</h3>
            <p className="text-[10px] text-[#4A6275] font-medium uppercase tracking-widest">What Sets This Course Apart</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Module 09 — Generative AI (most prominent) */}
          <div className="bg-[#E6F7F6] border-l-[3px] border-l-[#1DE5B5] border border-[#D6ECEB] rounded-xl p-4">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#1DE5B5] text-[#09263F] px-2 py-0.5 rounded-full mb-2">Module 09</span>
            <h4 className="text-[13px] font-bold text-[#09263F] leading-snug">Generative AI</h4>
            <p className="text-[11px] text-[#4A6275] mt-1 mb-2 leading-relaxed">Prompt engineering, GenAI for Python/SQL/Power BI, AI-assisted model evaluation</p>
            <div className="flex flex-wrap gap-1">
              {["ChatGPT", "Claude", "Prompt Eng.", "GenAI for Python/SQL/BI"].map((tag) => (
                <span key={tag} className="text-[10px] bg-[#E6F7F6] text-[#09263F] px-2 py-0.5 rounded-full font-medium border border-[#D6ECEB]">{tag}</span>
              ))}
            </div>
          </div>

          {/* Module 10 — Capstone Projects */}
          <div className="bg-[#E6F7F6] border border-[#D6ECEB] rounded-xl p-4">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#4A6275] bg-[#E6F7F6] px-2 py-0.5 rounded-full mb-2">Module 10</span>
            <h4 className="text-[13px] font-bold text-[#09263F] mt-1 mb-2 leading-snug">Capstone Projects</h4>
            <div className="flex flex-wrap gap-1">
              {["6 Projects", "Banking", "E-commerce", "Portfolio"].map((tag) => (
                <span key={tag} className="text-[10px] bg-[#E6F7F6] text-[#09263F] px-2 py-0.5 rounded-full font-medium border border-[#D6ECEB]">{tag}</span>
              ))}
            </div>
          </div>

          {/* Module 11 — Career Readiness (yellow) */}
          <div className="bg-[#FFFBE6] border border-[#FFB800] rounded-xl p-4">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#FFFBE6] text-[#09263F] border border-[#FFB800] px-2 py-0.5 rounded-full mb-2">Module 11</span>
            <h4 className="text-[13px] font-bold text-[#09263F] mt-1 mb-2 leading-snug">Career Readiness</h4>
            <div className="flex flex-wrap gap-1">
              {["Resume", "Mock Interviews", "8 Weeks", "Simulated Drives"].map((tag) => (
                <span key={tag} className="text-[10px] bg-[#FFFBE6] text-[#09263F] border border-[#FFB800] px-2 py-0.5 rounded-full font-medium">{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Download CTA */}
      <div className="text-center pt-2">
        <button
          onClick={onOpenBrochure}
          className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.25)] active:scale-95"
        >
          Download Full Syllabus →
        </button>
      </div>

    </div>
  );
}
