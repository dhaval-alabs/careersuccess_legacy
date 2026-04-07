'use client';

interface Props {
  onOpenBrochure: () => void;
}

// ─── Reusable module block ────────────────────────────────────────────────────

function ModuleBlock({
  num, title, tags, tagBg, tagBorder, blockBg, blockBorder, leftAccent, description, numBadgeBg, numBadgeBorder,
}: {
  num: string;
  title: string;
  tags: string[];
  tagBg: string;
  tagBorder?: string;
  blockBg: string;
  blockBorder: string;
  leftAccent?: boolean;
  description?: string;
  numBadgeBg?: string;
  numBadgeBorder?: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${blockBg} ${blockBorder} ${leftAccent ? 'border-l-[3px] border-l-[#1DE5B5]' : ''}`}>
      <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 ${numBadgeBg || tagBg} text-[#09263F] ${numBadgeBorder || ''}`}>
        Module {num}
      </span>
      <h4 className="text-[13px] font-bold text-[#09263F] leading-snug">{title}</h4>
      {description && (
        <p className="text-[11px] text-[#4A6275] mt-1 mb-2 leading-relaxed">{description}</p>
      )}
      {!description && <div className="mb-2" />}
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagBg} text-[#09263F] ${tagBorder || ''}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Tier header ──────────────────────────────────────────────────────────────

function TierHeader({ badge, badgeBg, title, subtitle }: { badge: string; badgeBg: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <span className={`inline-flex items-center ${badgeBg} text-[#09263F] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start`}>
        {badge}
      </span>
      <div>
        <h3 className="font-bold text-[#09263F] text-base leading-snug">{title}</h3>
        <p className="text-[10px] text-[#4A6275] font-medium uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CurriculumTiersV2({ onOpenBrochure }: Props) {
  return (
    <div>
      {/* 2-col layout: 70% left (Tier 1 + Tier 2) | 30% right (Tier 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-stretch">

        {/* ── LEFT COLUMN: Tier 1 + Tier 2 ── */}
        <div className="flex flex-col gap-5">

          {/* Tier 1 */}
          <div className="bg-white border border-[#D6ECEB] rounded-2xl p-6 flex-1">
            <TierHeader
              badge="Tier 1"
              badgeBg="bg-[#E6F7F6]"
              title="Foundation and Analytics"
              subtitle="Modules 01–04"
            />
            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: "01", title: "Building Blocks",          tags: ["Analytics", "Excel", "Stats", "Foundations"] },
                { num: "02", title: "Excel, SQL & Power BI",    tags: ["SQL", "Power BI", "DAX", "Excel Advanced"] },
                { num: "03", title: "Python for Data Science",  tags: ["Python", "Pandas", "NumPy", "EDA"] },
                { num: "04", title: "R for Data Science",       tags: ["R", "Optional", "Predictive Modelling"] },
              ].map((m) => (
                <ModuleBlock
                  key={m.num}
                  num={m.num}
                  title={m.title}
                  tags={m.tags}
                  tagBg="bg-[#E6F7F6]"
                  blockBg="bg-white"
                  blockBorder="border border-[#D6ECEB]"
                />
              ))}
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white border border-[#D6ECEB] rounded-2xl p-6 flex-1">
            <TierHeader
              badge="Tier 2"
              badgeBg="bg-[#E6FAFF]"
              title="Data Science and Machine Learning"
              subtitle="Modules 05–08"
            />
            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: "05", title: "Statistics and Predictive Modelling", tags: ["Stats", "Regression", "Hypothesis Testing"] },
                { num: "06", title: "Machine Learning",                    tags: ["scikit-learn", "SVM", "Ensemble", "Clustering"] },
                { num: "07", title: "Text Mining and NLP",                 tags: ["spaCy", "NLTK", "Sentiment Analysis"] },
                { num: "08", title: "Deployment and MLOps",                tags: ["Flask", "Git", "Cloud", "ML Lifecycle"] },
              ].map((m) => (
                <ModuleBlock
                  key={m.num}
                  num={m.num}
                  title={m.title}
                  tags={m.tags}
                  tagBg="bg-[#E6FAFF]"
                  blockBg="bg-white"
                  blockBorder="border border-[#D6ECEB]"
                />
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Tier 3 (full height, modules stacked) ── */}
        <div
          className="border border-[#1DE5B5] rounded-2xl p-6 flex flex-col"
          style={{ background: 'linear-gradient(135deg, #fefbe5 0%, #e6fbf1 50%, #ecfafe 100%)' }}
        >
          <TierHeader
            badge="Tier 3"
            badgeBg="bg-[#79f4c8]"
            title="AI and Career Readiness"
            subtitle="What Sets This Course Apart"
          />

          <div className="flex flex-col gap-4 flex-1">

            {/* Module 09 — Generative AI (most prominent) */}
            <div className="bg-[#E6F7F6] border-l-[3px] border-l-[#1DE5B5] border border-[#D6ECEB] rounded-xl p-4 flex-[2]">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#1DE5B5] text-[#09263F] px-2 py-0.5 rounded-full mb-2">
                Module 09
              </span>
              <h4 className="text-[13px] font-bold text-[#09263F] leading-snug">Generative AI</h4>
              <p className="text-[11px] text-[#4A6275] mt-1.5 mb-3 leading-relaxed">
                Prompt engineering, GenAI for Python/SQL/Power BI, AI-assisted model evaluation
              </p>
              <div className="flex flex-wrap gap-1">
                {["ChatGPT", "Claude", "Prompt Eng.", "GenAI for Python/SQL/BI"].map((tag) => (
                  <span key={tag} className="text-[10px] bg-[#E6F7F6] text-[#09263F] px-2 py-0.5 rounded-full font-medium border border-[#D6ECEB]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Module 10 — Capstone Projects */}
            <div className="bg-[#E6F7F6] border border-[#D6ECEB] rounded-xl p-4 flex-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#4A6275] bg-[#E6F7F6] px-2 py-0.5 rounded-full mb-2">
                Module 10
              </span>
              <h4 className="text-[13px] font-bold text-[#09263F] mt-1 mb-2 leading-snug">Capstone Projects</h4>
              <div className="flex flex-wrap gap-1">
                {["6 Projects", "Banking", "E-commerce", "Portfolio"].map((tag) => (
                  <span key={tag} className="text-[10px] bg-[#E6F7F6] text-[#09263F] px-2 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Module 11 — Placement Readiness (yellow) */}
            <div className="bg-[#FFFBE6] border border-[#FFB800] rounded-xl p-4 flex-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#FFFBE6] text-[#09263F] border border-[#FFB800] px-2 py-0.5 rounded-full mb-2">
                Module 11
              </span>
              <h4 className="text-[13px] font-bold text-[#09263F] mt-1 mb-2 leading-snug">Placement Readiness</h4>
              <div className="flex flex-wrap gap-1">
                {["Resume", "Mock Interviews", "8 Weeks", "Simulated Drives"].map((tag) => (
                  <span key={tag} className="text-[10px] bg-[#FFFBE6] text-[#09263F] border border-[#FFB800] px-2 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Download CTA */}
      <div className="text-center pt-6">
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
