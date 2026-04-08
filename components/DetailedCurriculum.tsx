'use client';
import { useState } from 'react';

interface Module {
  num: string;
  title: string;
  topics: string[];
  tag?: string;
}

const MODULES: Module[] = [
  {
    num: '01',
    title: 'Building Blocks',
    topics: [
      'Analytics & data science intro',
      'Business problem solving',
      'Excel fundamentals',
      'Foundational statistics',
    ],
  },
  {
    num: '02',
    title: 'Data Analytics: Excel, SQL & Power BI',
    topics: [
      'Advanced Excel',
      'SQL — joins, window functions, CTEs',
      'Power BI — DAX, dashboards, data modelling',
    ],
  },
  {
    num: '03',
    title: 'Python for Data Science',
    topics: [
      'Core Python, NumPy, Pandas',
      'Data cleaning & EDA',
      'Data visualisation with Python libraries',
    ],
  },
  {
    num: '04',
    title: 'R for Data Science',
    tag: 'Optional eLearning',
    topics: [
      'Data import/export & manipulation',
      'Analysis & visualisation in R',
      'Intro to predictive modelling in R',
    ],
  },
  {
    num: '05',
    title: 'Applied Statistics & Predictive Modelling',
    topics: [
      'Descriptive & inferential statistics',
      'Hypothesis testing',
      'Linear & logistic regression',
      'Model evaluation',
    ],
  },
  {
    num: '06',
    title: 'Machine Learning',
    topics: [
      'Supervised — KNN, SVM, decision trees, ensemble',
      'Unsupervised — clustering, recommendations',
      'Time series forecasting',
    ],
  },
  {
    num: '07',
    title: 'Text Mining & NLP',
    topics: [
      'Regex & text vectorisation',
      'Word2Vec, sentiment analysis',
      'Text classification & topic modelling',
      'spaCy / NLTK',
    ],
  },
  {
    num: '08',
    title: 'Model Deployment & MLOps',
    topics: [
      'Git & Flask',
      'Cloud deployment',
      'End-to-end MLOps pipeline',
      'Model monitoring in production',
    ],
  },
  {
    num: '09',
    title: 'Generative AI',
    topics: [
      'Prompt engineering',
      'Gen AI for Excel, SQL, Power BI & Python',
      'Generative AI for ML workflows',
    ],
  },
  {
    num: '10',
    title: 'Capstone Projects',
    topics: [
      '6 real-world projects',
      'Banking, e-commerce, telecom, retail domains',
      'Portfolio you can show recruiters',
    ],
  },
  {
    num: '11',
    title: 'Career Readiness (8 Weeks)',
    topics: [
      'Resume building & LinkedIn optimisation',
      'Mock interviews with industry experts',
      'Case study practice',
      'Simulated recruitment drives',
    ],
  },
];

// Colour cycles for module number badges
const ACCENT_COLORS = [
  { bg: '#EFF6FF', text: '#2563EB' },
  { bg: '#ECFDF5', text: '#059669' },
  { bg: '#F5F3FF', text: '#7C3AED' },
  { bg: '#FFFBEB', text: '#D97706' },
  { bg: '#FFF1F2', text: '#E11D48' },
  { bg: '#ECFEFF', text: '#0891B2' },
];

interface DetailedCurriculumProps {
  onOpenBrochure?: () => void;
}

export default function DetailedCurriculum({ onOpenBrochure }: DetailedCurriculumProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">
            Curriculum
          </span>
          <h2 className="font-display text-[#09263F] font-black text-3xl sm:text-4xl mt-5 mb-4 leading-tight">
            What You'll Learn Across{' '}
            <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">
              700+ Hours
            </span>
          </h2>
          <p className="text-[#4A6275] max-w-xl mx-auto leading-relaxed">
            11 modules covering analytics, data science, machine learning, and generative AI.
            Curriculum designed with NASSCOM-FutureSkills Prime to match what the industry
            actually hires for.
          </p>
        </div>

        {/* ── Module grid ── */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
          {MODULES.map((mod, i) => {
            const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
            const isOpen = expanded === i;

            return (
              <button
                key={i}
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`group text-left rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isOpen
                    ? 'border-[#29E8A4]/50 shadow-md bg-[#F0FDF9]'
                    : 'border-[#E6F0F7] bg-white hover:border-[#239bf5]/30 hover:shadow-md'
                  }`}
              >
                {/* Card header — always visible */}
                <div className="flex items-start gap-4 p-5">
                  {/* Module number badge */}
                  <span
                    className="font-display font-black text-sm px-2.5 py-1.5 rounded-lg flex-shrink-0 mt-0.5"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {mod.num}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-[#09263F] text-[0.95rem] leading-snug">
                        {mod.title}
                      </h3>
                      <svg
                        className={`w-4 h-4 text-[#4A6275] flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {mod.tag && (
                      <span className="inline-block mt-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                        {mod.tag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expandable topics */}
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="h-px bg-[#29E8A4]/30 mb-4" />
                    <ul className="space-y-2">
                      {mod.topics.map((t, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-[#4A6275]">
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-px"
                            style={{ background: color.bg }}
                          >
                            <svg
                              className="w-2.5 h-2.5"
                              style={{ color: color.text }}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Bottom CTA row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            className="btn-primary px-8 py-3.5 text-[0.95rem]"
            onClick={onOpenBrochure}
          >
            Download Full Brochure 📥
          </button>
          <p className="text-[#4A6275] text-sm">
            Includes topic-wise breakdown, project details & batch schedule.
          </p>
        </div>

      </div>
    </section>
  );
}
