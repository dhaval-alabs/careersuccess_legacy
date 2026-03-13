"use client";
import { useEffect, useRef, useState } from "react";

const navy = "#09263F";
const teal = "#29E8A4";

function useVisible(threshold = 0.25) {
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

export default function BottomCTA({ onOpenEligibility }: { onOpenEligibility?: () => void }) {
  const [ref, visible] = useVisible();
  const [hovered, setHovered] = useState(false);

  return (
    <section className="px-6 py-6 pb-20" style={{ background: "#f0faf8" }}>
      <div
        ref={ref}
        className="max-w-5xl mx-auto relative overflow-hidden text-center"
        style={{
          background: navy,
          borderRadius: 28,
          padding: "72px 48px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Ambient glow blobs */}
        <div style={{
          position: "absolute", top: -80, left: -80, width: 320, height: 320,
          background: `radial-gradient(circle, ${teal}28 0%, transparent 65%)`,
          animation: "blobFloat 6s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -100, right: -60, width: 380, height: 380,
          background: `radial-gradient(circle, ${teal}1e 0%, transparent 65%)`,
          animation: "blobFloat 8s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          width: 500, height: 200,
          transform: "translate(-50%,-50%)",
          background: `radial-gradient(ellipse, ${teal}12 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        {/* Pill */}
        <span
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] px-4 py-1.5 rounded-full mb-7 relative"
          style={{ background: `${teal}18`, border: `1px solid ${teal}44`, color: teal }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: teal, display: "inline-block" }} />
          LIMITED SEATS PER BATCH
        </span>

        {/* Heading */}
        <h2
          className="font-black text-white relative mb-5 leading-tight"
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(2rem,5vw,3.6rem)",
            letterSpacing: "-0.04em",
          }}
        >
          Ready to Join India&apos;s Most<br />
          <span style={{ color: teal }}>Trusted</span> Data Science Institute?
        </h2>

        {/* Sub */}
        <p className="relative mb-10 max-w-lg mx-auto" style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
          Join 20,000+ graduates. Get NASSCOM certified. Land your dream role with our fee-back guarantee.
        </p>

        {/* CTA */}
        <button
          onClick={onOpenEligibility}
          className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-4.5 rounded-xl text-lg transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] flex items-center gap-3 active:scale-95 group"
        >
          Check Your Eligibility
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* Stats row */}
        <div className="flex justify-center gap-12 mt-12 relative">
          {[["20,000+", "TRAINED"], ["9.6/10", "AVG RATING"], ["12+ Yrs", "EXCELLENCE"]].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="font-extrabold leading-none mb-1" style={{ fontFamily: "var(--font-outfit)", fontSize: "1.5rem", color: teal, letterSpacing: "-0.03em" }}>{val}</div>
              <div className="text-[10px] font-semibold tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.35)" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Bottom gradient line */}
        <div style={{
          position: "absolute", bottom: 0, left: "10%", right: "10%", height: 2,
          background: `linear-gradient(90deg, transparent, ${teal}44, transparent)`,
        }} />

        <style>{`
          @keyframes blobFloat {
            0%, 100% { transform: translate(0,0) scale(1); }
            50% { transform: translate(20px,-20px) scale(1.06); }
          }
        `}</style>
      </div>
    </section>
  );
}
