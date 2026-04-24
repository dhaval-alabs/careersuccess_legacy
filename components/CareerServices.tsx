'use client';

const SERVICES = [
  {
    title: "Resume & Portfolio Building",
    desc: "Get your resume optimized for ATS and build a project portfolio that catches recruiters' eyes.",
    icon: "📄"
  },
  {
    title: "Mock Interviews",
    desc: "Domain-specific mock interviews with industry veterans to prepare you for the real pressure.",
    icon: "🤝"
  },
  {
    title: "Dedicated Job Portal",
    desc: "Access 20+ fresh job openings every week from 700+ hiring partners on our internal portal.",
    icon: "💼"
  },
  {
    title: "Soft Skills Training",
    desc: "Master business communication, presentation, and negotiation to ace your final rounds.",
    icon: "🗣️"
  }
];

export default function CareerServices() {
  return (
    <section className="py-20 bg-[#F4FAFA]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#e8f4fd] text-[#00AEEF] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#b8ddf7] mb-4">
            PLACEMENT ASSISTANCE
          </span>
          <h2 className="text-[#09263F] text-3xl sm:text-4xl font-black mb-4">
            Not Just Learning. <span className="text-[#1DE5B5]">A Career Launchpad.</span>
          </h2>
          <p className="text-[#4A6275] text-base max-w-2xl mx-auto">
            Our placement team stays with you until you land your dream role. We offer a 50% fee-back guarantee if you're not placed within 6 months.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-[#D6ECEB] hover:shadow-xl transition-all group">
              <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{s.icon}</div>
              <h3 className="text-[#09263F] font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-[#4A6275] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
