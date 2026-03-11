"use client";
import { useEffect, useRef, useState } from "react";

const navy  = "#09263F";
const teal  = "#1DE5B5"; // New primary
const blue  = "#239bf5";
const yellow = "#F5C842";

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

/* ── SVG Icons ── */
const ClassroomIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <polygon points="4,14 22,4 40,14" fill="#e8f7fd" stroke={navy} strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="6" y="14" width="32" height="24" rx="1" fill="#e8f7fd" stroke={navy} strokeWidth="1.8"/>
    <rect x="10" y="16" width="4" height="20" rx="1.5" fill="#c7e8f7" stroke={navy} strokeWidth="1.5"/>
    <rect x="20" y="16" width="4" height="20" rx="1.5" fill="#c7e8f7" stroke={navy} strokeWidth="1.5"/>
    <rect x="30" y="16" width="4" height="20" rx="1.5" fill="#c7e8f7" stroke={navy} strokeWidth="1.5"/>
    <rect x="13" y="20" width="8" height="6" rx="1" fill={navy} stroke={navy} strokeWidth="1.2"/>
    <line x1="14.5" y1="22.5" x2="19.5" y2="22.5" stroke={teal} strokeWidth="1" strokeLinecap="round"/>
    <line x1="14.5" y1="24.5" x2="18" y2="24.5" stroke={teal} strokeWidth="1" strokeLinecap="round"/>
    <rect x="2" y="38" width="40" height="3" rx="1" fill={teal} opacity="0.35"/>
    <circle cx="22" cy="7" r="2.2" fill={teal}/>
  </svg>
);

const LiveOnlineIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path d="M10 10 Q22 2 34 10" stroke={teal} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M14 14 Q22 8 30 14" stroke={teal} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65"/>
    <circle cx="22" cy="17" r="1.8" fill={teal}/>
    <rect x="5" y="20" width="34" height="20" rx="2.5" fill="#e8f7fd" stroke={navy} strokeWidth="1.8"/>
    <rect x="8" y="22.5" width="28" height="14" rx="1.5" fill={navy} stroke={navy} strokeWidth="1.2"/>
    <polygon points="18,26 18,33 28,29.5" fill={teal}/>
    <rect x="9" y="23.5" width="10" height="4" rx="1" fill="#e83a3a"/>
    <text x="14" y="26.8" textAnchor="middle" fontSize="3.2" fill="white" fontWeight="800" fontFamily="system-ui">LIVE</text>
    <rect x="2" y="40" width="40" height="2.5" rx="1.2" fill={navy} opacity="0.2"/>
    <rect x="16" y="39.5" width="12" height="1.5" rx="0.8" fill={navy} opacity="0.3"/>
  </svg>
);

const BlendedIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="3" y="10" width="18" height="28" rx="2" fill="#e8f7fd" stroke={navy} strokeWidth="1.8"/>
    <rect x="7" y="13" width="5" height="22" rx="1.5" fill="#c7e8f7" stroke={navy} strokeWidth="1.2"/>
    <polygon points="3,10 12,4 21,10" fill="#e8f7fd" stroke={navy} strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="23" y="14" width="18" height="16" rx="2" fill={navy} stroke={navy} strokeWidth="1.8"/>
    <line x1="26" y1="18.5" x2="36" y2="18.5" stroke={blue} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="26" y1="21.5" x2="33" y2="21.5" stroke={teal} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="26" y1="24.5" x2="35" y2="24.5" stroke={blue} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    <rect x="20" y="30" width="24" height="2.5" rx="1.2" fill={navy} opacity="0.2"/>
    <path d="M20 22 Q22 19 24 22" stroke={teal} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M20 26 Q22 29 24 26" stroke={yellow} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <rect x="2" y="38" width="40" height="2.5" rx="1" fill={teal} opacity="0.25"/>
  </svg>
);

const cards = [
  {
    tag: "FLEXIBLE",
    Icon: BlendedIcon,
    title: "Blended eLearning",
    price: "₹53,100",
    desc: "Self-paced learning with recorded sessions and select live components. Maximum scheduling flexibility. Same curriculum and NASSCOM certification. Ideal for working professionals.",
    bullets: ["Best of both worlds", "Switch modes anytime", "Same curriculum & faculty"],
    tagColor: blue,
  },
  {
    tag: "MOST POPULAR",
    Icon: LiveOnlineIcon,
    title: "Interactive Live Online",
    price: "₹59,000",
    desc: "Real-time, instructor-led sessions from anywhere in India. Same faculty as classroom. Full LMS access with recordings for 1 year. Weekday evening and weekend batches available.",
    bullets: ["Real-time Q&A with faculty", "Flexible batch timings", "1-year recording access"],
    tagColor: teal,
  },
  {
    tag: "IN-PERSON",
    Icon: ClassroomIcon,
    title: "Classroom & Bootcamp",
    price: "₹68,440",
    desc: "In-person training at our centres in Noida, Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, hands-on labs, direct faculty access, and on-campus placement activities.",
    bullets: ["Hands-on lab sessions", "Peer collaboration", "On-campus placement drives"],
    tagColor: navy,
  },
];

export default function LearningModes({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const [ref, visible] = useVisible();

  return (
    <section className="py-20 px-6" style={{ background: "#f0faf8" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="text-[#239bf5] text-xs font-bold uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full inline-block mb-4"
          >
            FLEXIBILITY FIRST
          </span>
          <h2
            className="font-bold leading-tight tracking-tight mb-3"
            style={{ fontSize: "clamp(2rem,4vw,3rem)", color: navy }}
          >
            Three Ways to Learn.<br />
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent inline-block">Transparent</span> Pricing.
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "#4A6275" }}>
            Same syllabus, same faculty, same NASSCOM certification. Pick what fits your schedule and budget.
          </p>
        </div>

        {/* Cards */}
        <div ref={ref} className="grid md:grid-cols-3 gap-6 items-stretch">
          {cards.map((c, i) => (
            <div
              key={c.title}
              className="group"
              style={{
                background: "rgb(244 250 250 / 1)",
                border: "1.5px solid #e0eeeb",
                borderRadius: 24,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                boxShadow: "0 4px 24px rgba(9,38,63,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Icon + tag row */}
              <div className="flex justify-between items-start mb-6">
                <div style={{ filter: "drop-shadow(0 3px 8px rgba(0,120,200,0.12))" }}>
                  <c.Icon />
                </div>
                <span
                  className="text-[9px] font-bold tracking-[0.14em] px-3 py-1 rounded-full"
                  style={{
                    background: `${c.tagColor}18`,
                    color: c.tagColor,
                    border: `1px solid ${c.tagColor}44`,
                  }}
                >
                  {c.tag}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-bold text-lg leading-snug mb-0"
                style={{ color: navy }}
              >
                {c.title}
              </h3>

              {/* Price */}
              <div className="mt-4 mb-1.5">
                <span
                  className="font-bold tracking-tight leading-none"
                  style={{ fontSize: "2.4rem", color: navy }}
                >
                  {c.price}
                </span>
                <span className="text-xs ml-1.5" style={{ color: "#7aaea6" }}>incl. taxes</span>
              </div>

              {/* EMI line */}
              <p className="text-[11px] font-semibold mb-4 tracking-wide" style={{ color: blue }}>
                0% interest EMI · Starting ₹6,387/month
              </p>

              {/* Description */}
              <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: "#4A6275" }}>
                {c.desc}
              </p>

              {/* Bullets */}
              <ul className="space-y-2 mb-2 list-none p-0 m-0">
                {c.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2 text-[13px]" style={{ color: "#2d5466" }}>
                    <span style={{ color: teal, fontWeight: 700 }}>✓</span>{b}
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center mt-10 text-xs" style={{ color: "#7aaea6" }}>
          All modes share the same curriculum, faculty &amp; NASSCOM-FutureSkills Prime certification.
        </p>

        {/* Demo CTA */}
        <div className="text-center mt-10">
          <button
            onClick={onOpenDemo}
            className="font-bold text-base px-12 py-4 rounded-xl transition-all hover:opacity-90 hover:-translate-y-1 shadow-[0_8px_24px_rgba(29,229,181,0.3)] inline-flex items-center gap-2"
            style={{ background: teal, color: navy, border: "none", cursor: "pointer" }}
          >
            Signup for a Demo →
          </button>
        </div>
      </div>
    </section>
  );
}
