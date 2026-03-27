'use client';

import { useState, useEffect } from "react";

const CalendarIcon = () => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="4" y="8" width="44" height="40" rx="5" stroke="#1a2b4a" strokeWidth="2.5" fill="none" />
        <rect x="4" y="8" width="44" height="13" rx="5" fill="#e8f4fd" stroke="#1a2b4a" strokeWidth="2.5" />
        <line x1="16" y1="4" x2="16" y2="14" stroke="#1a2b4a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="4" x2="36" y2="14" stroke="#1a2b4a" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="12" y="28" width="8" height="7" rx="1.5" fill="#00AEEF" />
        <rect x="22" y="28" width="8" height="7" rx="1.5" fill="#00AEEF" opacity="0.4" />
        <rect x="32" y="28" width="8" height="7" rx="1.5" fill="#00AEEF" opacity="0.2" />
    </svg>
);

const CodeIcon = () => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="4" y="8" width="44" height="36" rx="5" stroke="#1a2b4a" strokeWidth="2.5" fill="none" />
        <rect x="4" y="8" width="44" height="10" rx="5" fill="#e8f4fd" stroke="#1a2b4a" strokeWidth="2.5" />
        <circle cx="11" cy="13" r="2" fill="#1a2b4a" />
        <circle cx="18" cy="13" r="2" fill="#1a2b4a" />
        <polyline points="16,28 10,33 16,38" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polyline points="28,28 34,33 28,38" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="23" y1="26" x2="19" y2="40" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
);

const PeopleIcon = () => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="16" r="8" stroke="#1a2b4a" strokeWidth="2.5" fill="#e8f4fd" />
        <circle cx="26" cy="16" r="4" fill="#00AEEF" />
        <path d="M10 44c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="#1a2b4a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="12" cy="22" r="5" stroke="#1a2b4a" strokeWidth="2" fill="white" />
        <circle cx="40" cy="22" r="5" stroke="#1a2b4a" strokeWidth="2" fill="white" />
        <path d="M4 40c0-5 3.6-9 8-9" stroke="#1a2b4a" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M48 40c0-5-3.6-9-8-9" stroke="#1a2b4a" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="26" cy="8" r="3" fill="#00AEEF" opacity="0.6" />
        <line x1="26" y1="5" x2="26" y2="2" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" />
        <line x1="29" y1="6" x2="31" y2="4" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" />
        <line x1="23" y1="6" x2="21" y2="4" stroke="#00AEEF" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const PinIcon = ({ color = "#1a2b4a" }: { color?: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.8" />
        <circle cx="12" cy="9" r="2.5" fill={color} />
    </svg>
);

const FeeIcon = () => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M8 40 L8 18 L26 8 L44 18 L44 40" stroke="#1a2b4a" strokeWidth="2.5" fill="#e8f4fd" strokeLinejoin="round" />
        <rect x="16" y="28" width="20" height="16" rx="2" fill="white" stroke="#1a2b4a" strokeWidth="2" />
        <circle cx="26" cy="22" r="6" fill="#00AEEF" opacity="0.2" stroke="#00AEEF" strokeWidth="2" />
        <text x="26" y="27" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#00AEEF">₹</text>
        <line x1="20" y1="33" x2="32" y2="33" stroke="#1a2b4a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="37" x2="28" y2="37" stroke="#1a2b4a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

function StatCard({ icon, label, primary, secondary, delay }: { icon: React.ReactNode, label: string, primary: string, secondary?: string, delay: number }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            padding: "24px 24px", flex: 1, minWidth: 140,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
            position: "relative"
        }}>
            <div style={{ marginBottom: 18 }}>{icon}</div>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#6b7a96", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>{label}</p>
            <p style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#00AEEF", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 }} dangerouslySetInnerHTML={{ __html: primary }} />
            {secondary && <p style={{ margin: 0, fontSize: 14, color: "#1a2b4a", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, opacity: 0.7 }} dangerouslySetInnerHTML={{ __html: secondary }} />}
        </div>
    );
}

function BatchCard({ date, month, city, color, textColor, pinColor }: { date: string, month: string, city: string, color: string, textColor: string, pinColor: string }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: color, borderRadius: 14, padding: "16px 22px",
            minWidth: 150, flex: 1
        }}>
            <div>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 900, color: textColor, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>{date}</p>
                <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 600, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.85 }}>{month}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <PinIcon color={pinColor} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.9 }}>{city}</p>
            </div>
        </div>
    );
}

export default function CourseInfoSection() {
    const [sectionVisible, setSectionVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setSectionVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative -mt-8 mb-8 px-4 sm:px-6">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        .divider-line { width: 1px; background: linear-gradient(to bottom, transparent, #d0dae8, transparent); align-self: stretch; margin: 20px 0; }
        @media (max-width: 700px) {
          .stats-row { flex-direction: column !important; }
          .divider-line { width: 60px !important; height: 1px !important; background: linear-gradient(to right, transparent, #d0dae8, transparent) !important; align-self: auto !important; margin: 0 auto !important; }
          .bottom-row { flex-direction: column !important; gap: 24px !important; }
          .batch-row { flex-direction: column !important; }
        }
      `}</style>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "linear-gradient(135deg, #f0f6fd 0%, #ffffff 60%, #f5fbff 100%)",
                border: "1px solid #dde8f4", borderRadius: 20,
                margin: "0 auto", maxWidth: 1600,
                padding: "8px 0 0",
                boxShadow: "0 4px 32px rgba(0,120,200,0.07)",
                overflow: "hidden",
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease"
            }}>

                {/* Top label */}
                <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
                    <span style={{
                        display: "inline-block", background: "#e8f4fd", color: "#00AEEF",
                        fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "5px 18px", borderRadius: 20, border: "1px solid #b8ddf7"
                    }}>Course Overview</span>
                </div>

                {/* 5-Column Single Row Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 items-stretch px-4 sm:px-8 py-6 lg:py-8 gap-8 lg:gap-0">

                    {/* Column 1: Upcoming Batches (Stacked on desktop, Side-by-side on mobile) */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col h-full lg:px-6 lg:border-r border-[#dde8f4]">
                        <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7a96", textAlign: "center" }}>Upcoming Batches</p>
                        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 justify-center flex-grow">
                            <BatchCard date="29th" month="March" city="Gurgaon" color="#fef5c8" textColor="#3d3010" pinColor="#9a7c0a" />
                            <BatchCard date="12th" month="April" city="Noida" color="#d4f5e9" textColor="#1a3d2b" pinColor="#2e7d5e" />
                        </div>
                    </div>

                    {/* Column 2: Classes Info */}
                    <div className="col-span-1 lg:px-6 lg:border-r border-[#dde8f4] flex flex-col justify-center">
                        <StatCard
                            icon={<CalendarIcon />}
                            label="Classes × Hours"
                            primary="65 × 3 = <span style='color:#1a2b4a'>195 hrs</span>"
                            secondary="+ 20 hours e-learning"
                            delay={150}
                        />
                    </div>

                    {/* Column 3: Self-Study Info */}
                    <div className="col-span-1 lg:px-6 lg:border-r border-[#dde8f4] flex flex-col justify-center">
                        <StatCard
                            icon={<CodeIcon />}
                            label="Self-Study Hours"
                            primary="422 <span style='font-size:18px;color:#1a2b4a'>(8–10/wk)</span>"
                            secondary="38 hours of Assessments"
                            delay={280}
                        />
                    </div>

                    {/* Column 4: Placement Info */}
                    <div className="col-span-1 lg:px-6 lg:border-r border-[#dde8f4] flex flex-col justify-center">
                        <StatCard
                            icon={<PeopleIcon />}
                            label="Placement Readiness"
                            primary="8 Weeks"
                            secondary="Post Certification"
                            delay={410}
                        />
                    </div>

                    {/* Column 5: Program Fee */}
                    <div className="col-span-1 lg:px-8 flex flex-col justify-center bg-rgba(0,174,239,0.02)">
                        <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7a96", textAlign: "center" }}>Program Fee</p>
                        <div className="flex flex-col items-center text-center">
                            <FeeIcon />
                            <div className="mt-4">
                                <p style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#00AEEF", lineHeight: 1 }}>
                                    ₹53,100<span style={{ fontSize: 16, fontWeight: 600, color: "#6b7a96" }}>/-*</span>
                                </p>
                                <p style={{ margin: "10px 0 0", fontSize: 13, color: "#6b7a96", fontWeight: 500, lineHeight: 1.4 }}>
                                    0% EMI available<br />Starts ₹6,387/month
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
