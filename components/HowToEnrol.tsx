"use client";
import { useEffect, useRef, useState } from "react";

const navy = "#09263F";
const teal = "#29E8A4";
const yellow = "#F5C842";
const blue = "#239bf5";

function useVisible(threshold = 0.2) {
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

const TalkIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path d="M4 8 Q4 4 8 4 L36 4 Q40 4 40 8 L40 26 Q40 30 36 30 L20 30 L12 38 L14 30 L8 30 Q4 30 4 26 Z"
      fill="#e8f7fd" stroke={navy} strokeWidth="1.8" strokeLinejoin="round"/>
    <line x1="12" y1="13" x2="12" y2="21" stroke={blue} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="17" y1="10" x2="17" y2="24" stroke={teal} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="22" y1="14" x2="22" y2="20" stroke={blue} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="27" y1="11" x2="27" y2="23" stroke={teal} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="14" x2="32" y2="20" stroke={blue} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="37" cy="6" r="3" fill={teal}/>
  </svg>
);

const ReserveIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="4" y="8" width="36" height="32" rx="3" fill="#e8f7fd" stroke={navy} strokeWidth="1.8"/>
    <rect x="4" y="8" width="36" height="10" rx="3" fill={navy}/>
    <rect x="4" y="14" width="36" height="4" rx="0" fill={navy}/>
    <line x1="13" y1="4" x2="13" y2="13" stroke={navy} strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="31" y1="4" x2="31" y2="13" stroke={navy} strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="14" cy="22" r="2" fill="#c7e8f7"/>
    <circle cx="22" cy="22" r="2" fill="#c7e8f7"/>
    <circle cx="30" cy="22" r="2" fill="#c7e8f7"/>
    <circle cx="14" cy="30" r="2" fill="#c7e8f7"/>
    <circle cx="28" cy="30" r="7" fill={teal} opacity="0.2"/>
    <circle cx="28" cy="30" r="7" stroke={teal} strokeWidth="1.5" fill="none"/>
    <polyline points="24,30 27,33 33,26" stroke={teal} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="22" y="14.5" textAnchor="middle" fontSize="5" fill={teal} fontWeight="700" fontFamily="system-ui" letterSpacing="0.5">BATCH</text>
  </svg>
);

const LaunchIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path d="M22 4 Q26 4 30 10 L30 26 Q30 28 28 28 L16 28 Q14 28 14 26 L14 10 Q18 4 22 4Z"
      fill="#e8f7fd" stroke={navy} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M14 10 Q22 2 30 10" fill={navy} stroke={navy} strokeWidth="1" strokeLinejoin="round"/>
    <circle cx="22" cy="16" r="4" fill={blue} opacity="0.25" stroke={blue} strokeWidth="1.5"/>
    <circle cx="22" cy="16" r="2" fill={blue} opacity="0.6"/>
    <path d="M14 22 L8 30 L14 28Z" fill={teal} stroke={navy} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M30 22 L36 30 L30 28Z" fill={teal} stroke={navy} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M18 28 Q20 36 22 32 Q24 36 26 28" fill={yellow} stroke={yellow} strokeWidth="1" strokeLinejoin="round" opacity="0.9"/>
    <path d="M20 28 Q22 34 22 30 Q22 34 24 28" fill="#ff9f1c" opacity="0.6"/>
    <circle cx="8" cy="10" r="1.5" fill={teal}/>
    <circle cx="6" cy="18" r="1" fill={blue} opacity="0.7"/>
    <circle cx="36" cy="8" r="1.5" fill={teal}/>
    <circle cx="38" cy="16" r="1" fill={blue} opacity="0.7"/>
    <circle cx="10" cy="6" r="1" fill={yellow} opacity="0.8"/>
    <circle cx="34" cy="4" r="1" fill={yellow} opacity="0.8"/>
  </svg>
);

const steps = [
  {
    num: "01", Icon: TalkIcon, title: "Talk to Us", accent: teal,
    desc: "Fill the form or call us directly. A learning advisor will understand your goals and recommend the right mode.",
  },
  {
    num: "02", Icon: ReserveIcon, title: "Reserve Your Seat", accent: yellow,
    desc: "Pick your batch and centre. Batches run in Noida, Gurgaon, and Bangalore, or join live online sessions.",
  },
  {
    num: "03", Icon: LaunchIcon, title: "Start Learning", accent: blue,
    desc: "LMS access and batch confirmation within 24 hours. 0% EMI and flexible instalment options available.",
  },
];

export default function HowToEnrol({ onOpenEligibility }: { onOpenEligibility?: () => void }) {
  const [ref, visible] = useVisible();
  const [lineRef, lineVisible] = useVisible(0.3);

  return (
    <section className="py-20 px-6" style={{ background: "#fff" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[10px] font-bold tracking-[0.14em] px-4 py-1.5 rounded-full mb-4"
            style={{ background: `${navy}10`, color: navy }}>
            SIMPLE 3-STEP PROCESS
          </span>
          <h2 className="font-extrabold leading-tight tracking-tight mb-3"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(2rem,4vw,3rem)", color: navy }}>
            Getting <span style={{ color: teal }}>Started</span> is Simple
          </h2>
          <p className="text-sm" style={{ color: "#4A6275" }}>
            Your journey to a data science career in three simple steps.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-0 relative">
          {/* Connector line */}
          <div ref={lineRef} style={{
            position: "absolute", top: 52, left: "17%", right: "17%", height: 2,
            background: `linear-gradient(90deg, ${teal}, ${yellow}, ${blue})`,
            opacity: lineVisible ? 0.35 : 0,
            transition: "opacity 0.9s ease 0.4s",
            display: "none",
          }} className="md:block" />

          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-col items-center px-6"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.55s ease ${i * 0.15}s, transform 0.55s ease ${i * 0.15}s`,
              }}>
              {/* Icon node */}
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: `${s.accent}22`,
                border: `2px solid ${s.accent}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 28,
                filter: `drop-shadow(0 6px 16px ${s.accent}40)`,
                position: "relative", zIndex: 1, flexShrink: 0,
              }}>
                <s.Icon />
              </div>

              {/* Card */}
              <div className="w-full rounded-2xl p-7 relative overflow-hidden"
                style={{ background: "#f0faf8", border: `1.5px solid ${s.accent}33` }}>
                {/* Watermark number */}
                <span style={{
                  position: "absolute", top: -10, right: 12,
                  fontFamily: "var(--font-outfit)", fontWeight: 900,
                  fontSize: "5rem", color: `${s.accent}14`,
                  lineHeight: 1, userSelect: "none", pointerEvents: "none",
                  letterSpacing: "-0.05em",
                }}>{s.num}</span>

                <span className="text-[10px] font-bold tracking-[0.12em] mb-2 block" style={{ color: s.accent }}>
                  STEP {s.num}
                </span>
                <h3 className="font-bold text-lg leading-snug mb-2.5"
                  style={{ fontFamily: "var(--font-outfit)", color: navy }}>
                  {s.title}
                </h3>
                <p className="text-[13px] leading-relaxed m-0" style={{ color: "#4A6275" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom dark CTA */}
        <div className="mt-12 rounded-3xl text-center py-14 px-8 relative overflow-hidden"
          style={{ background: navy }}>
          {/* glows */}
          <div style={{
            position: "absolute", top: -40, left: -40, width: 240, height: 240,
            background: `radial-gradient(circle, ${teal}20 0%, transparent 65%)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -60, right: -40, width: 280, height: 280,
            background: `radial-gradient(circle, ${teal}18 0%, transparent 65%)`,
            pointerEvents: "none",
          }} />

          <h3 className="font-extrabold text-white mb-3 relative"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(1.6rem,3vw,2.4rem)", letterSpacing: "-0.03em" }}>
            Ready to Start?
          </h3>
          <p className="text-sm mb-8 relative max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            Join 20,000+ professionals who trained with AnalytixLabs. Check your eligibility or talk to a learning advisor. No commitment, no pressure.
          </p>
          <button 
            onClick={onOpenEligibility}
            className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-4.5 rounded-xl text-lg transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] inline-block active:scale-95"
          >
            Check Your Eligibility →
          </button>
        </div>
      </div>
    </section>
  );
}
