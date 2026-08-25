"use client";
import { useEffect, useRef, useState } from "react";
import { COURSE_FACTS } from "../constants/courseFacts";

const defaultFacts = COURSE_FACTS['data-science'];

const stats = [
  {
    value: defaultFacts.candidatesTrainedNumber,
    suffix: "+",
    label: "Candidates Trained",
    bg: "#87F0D780",
    text: "#09263F",
  },
  {
    value: defaultFacts.companiesHiredNumber,
    suffix: "+",
    label: "Companies Hired From Us",
    bg: "#FFF38580",
    text: "#09263F",
  },
  {
    value: parseFloat(defaultFacts.avgRating),
    suffix: "/10",
    label: "Avg Student Rating",
    bg: "#88E2FF80",
    text: "#09263F",
  },
  {
    value: defaultFacts.yearsOfExcellenceNumber,
    suffix: "+",
    label: "Years of Excellence",
    bg: "#B7F2BA80",
    text: "#09263F",
  },
];

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const isDecimal = target % 1 !== 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      setCount(isDecimal ? Math.round(val * 10) / 10 : Math.floor(val));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [start, target, duration]);
  return count;
}

function StatCard({
  stat,
  index,
  triggered,
}: {
  stat: (typeof stats)[0];
  index: number;
  triggered: boolean;
}) {
  const count = useCountUp(stat.value, 1600, triggered);
  const isDecimal = stat.value % 1 !== 0;
  const displayVal = isDecimal
    ? count.toFixed(1)
    : count.toLocaleString("en-IN");

  return (
    <div
      className="relative flex flex-col items-center justify-center px-8 py-10 rounded-2xl overflow-hidden group cursor-default select-none border border-[#09263F10]"
      style={{
        backgroundColor: stat.bg,
        opacity: triggered ? 1 : 0,
        transform: triggered ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
      }}
    >
      {/* Hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      />

      {/* Number */}
      <span
        className="font-display font-extrabold leading-none tracking-tight"
        style={{
          color: stat.text,
          fontSize: "clamp(2rem, 4vw, 2.5rem)",
          letterSpacing: "-0.03em",
        }}
      >
        {displayVal}
        {stat.suffix}
      </span>

      {/* Label */}
      <span
        className="font-sans font-semibold uppercase tracking-widest text-center mt-2"
        style={{
          color: stat.text,
          fontSize: "0.72rem",
          opacity: 0.72,
          letterSpacing: "0.09em",
        }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full px-4 py-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} triggered={triggered} />
        ))}
      </div>
    </div>
  );
}
