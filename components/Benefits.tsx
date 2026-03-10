const BENEFITS = [
  {
    icon: '🏅',
    title: 'NASSCOM-FutureSkills Prime Certified',
    description:
      'Globally recognised certification supported by MeitY, Government of India. The definitive mark of industry trust.',
    accentColor: '#239bf5',
    bgFrom: '#EFF6FF',
    bgTo: '#EEF2FF',
  },
  {
    icon: '🔒',
    title: 'Placement with Fee-Back Guarantee',
    description:
      "Complete the programme and meet the requirements. If you're not placed within 6 months, we refund 50% of your fee. Minimum annual package assured.",
    accentColor: '#29E8A4',
    bgFrom: '#ECFDF5',
    bgTo: '#F0FDFA',
  },
  {
    icon: '🎥',
    title: 'Live + Recorded Classes',
    description:
      'Attend live instructor-led sessions or rewatch anytime via your personal LMS. 1 year of access included.',
    accentColor: '#8b5cf6',
    bgFrom: '#F5F3FF',
    bgTo: '#FDF4FF',
  },
  {
    icon: '🏛️',
    title: 'Real Classroom + Flexible Learning',
    description:
      'Learn in-person in Noida, Gurgaon, or Bangalore. Or join live online sessions with the same faculty. Same syllabus, same certification.',
    accentColor: '#f59e0b',
    bgFrom: '#FFFBEB',
    bgTo: '#FFF7ED',
  },
  {
    icon: '🤖',
    title: 'Generative AI in the Curriculum',
    description:
      'Not an afterthought. Prompt engineering and Gen AI for Excel, SQL, Power BI, and Python are part of the core syllabus.',
    accentColor: '#06b6d4',
    bgFrom: '#ECFEFF',
    bgTo: '#EFF6FF',
  },
  {
    icon: '👥',
    title: 'Mentorship That Continues After Class',
    description:
      "Dedicated mentor support for projects, doubt resolution, and practical guidance between sessions. Regular interactions so you're never stuck.",
    accentColor: '#e11d48',
    bgFrom: '#FFF1F2',
    bgTo: '#FDF2F8',
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">
            Why AnalytixLabs
          </span>
          <h2 className="font-display text-[#09263F] font-black text-3xl sm:text-4xl mt-5 mb-4 leading-tight">
            Everything You Need to Build a<br />
            <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">
              Career in Data Science
            </span>
          </h2>
          <p className="text-[#4A6275] max-w-xl mx-auto leading-relaxed">
            Built for working professionals and fresh graduates. Real accountability,
            real classroom training, and a placement team that delivers. Rated{' '}
            <strong className="text-[#09263F]">9.6/10</strong> by{' '}
            <strong className="text-[#09263F]">20,000+</strong> past students.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className="group relative rounded-2xl p-7 border border-transparent
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${b.bgFrom} 0%, ${b.bgTo} 100%)`,
              }}
            >
              {/* Accent dot top-right */}
              <div
                className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full opacity-40"
                style={{ background: b.accentColor }}
              />

              {/* Icon */}
              <div className="text-3xl mb-5">{b.icon}</div>

              {/* Title */}
              <h3 className="font-display font-bold text-[#09263F] text-[1.05rem] mb-2.5 leading-snug">
                {b.title}
              </h3>

              {/* Description */}
              <p className="text-[#4A6275] text-sm leading-relaxed">{b.description}</p>

              {/* Animated underline */}
              <div
                className="mt-5 h-[3px] rounded-full w-8 group-hover:w-14 transition-all duration-500"
                style={{ background: b.accentColor }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
