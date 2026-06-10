'use client';

import Image from "next/image";

interface Props {
  title: string;
  subtitle: string;
  location: string;
  onOpenForm: () => void;
  ctaText: string;
  stats: string[];
}

export default function HeroSection({ title, subtitle, location, onOpenForm, ctaText, stats }: Props) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-[#D6ECEB]">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1DE5B5]/5 -translate-y-1/3 translate-x-1/3 blur-[80px]" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#9BE9FF]/8 blur-[70px]" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(#1DE5B5 1px,transparent 1px),linear-gradient(90deg,#1DE5B5 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1fr_450px] gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-[#e8f4fd] text-[#00AEEF] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#b8ddf7]">
              Now in {location}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#1DE5B5] animate-pulse"></span>
              <span className="text-[10px] text-[#4A6275] font-bold uppercase tracking-widest">Batches starting soon</span>
            </div>
          </div>

          <h1 className="text-[#09263F] text-4xl sm:text-5xl lg:text-[3.8rem] font-black leading-[1.05] mb-6 tracking-tight">
            {title.split(' + ').map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-[#1DE5B5]"> + </span>}
                {part}
              </span>
            ))}
          </h1>

          <p className="text-[#4A6275] text-lg leading-relaxed mb-10 max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={onOpenForm}
              className="bg-[#1DE5B5] text-[#09263F] font-extrabold px-8 py-4 rounded-2xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] hover:bg-[#19cf9e] active:scale-95"
            >
              {ctaText} →
            </button>
            <div className="flex items-center gap-4 px-6 border-l border-[#D6ECEB]">
              <Image 
                src="/lp/images/logo-nasscom-ministry.webp" 
                alt="NASSCOM" 
                width={120} height={40} 
                className="h-10 w-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#D6ECEB] max-w-md">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-[#09263F] font-black text-xl leading-none mb-1">{s.split(' ')[0]}</p>
                <p className="text-[#4A6275] text-[10px] font-bold uppercase tracking-widest">{s.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards / Image side */}
        <div className="relative hidden lg:block">
           <div className="bg-white rounded-[2rem] border border-[#D6ECEB] p-2 shadow-[0_32px_64px_rgba(9,38,63,0.1)] overflow-hidden">
              <div className="aspect-[4/5] bg-[#F4FAFA] rounded-[1.8rem] relative overflow-hidden">
                 <Image 
                   src="https://images.unsplash.com/photo-1551288049-bbda48658a7d?auto=format&fit=crop&q=80&w=800"
                   alt="Data Analytics"
                   fill
                   className="object-cover opacity-80"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#09263F]/40 to-transparent" />
              </div>
           </div>
           
           {/* Floating elements */}
           <div className="absolute -left-10 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-[#D6ECEB] animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E6F7F6] flex items-center justify-center text-xl">📊</div>
                <div>
                  <p className="text-[#09263F] font-bold text-sm">Real Projects</p>
                  <p className="text-[#4A6275] text-[10px]">10+ Industry Cases</p>
                </div>
              </div>
           </div>

           <div className="absolute -right-6 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-[#D6ECEB] animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFFBE6] flex items-center justify-center text-xl">🚀</div>
                <div>
                  <p className="text-[#09263F] font-bold text-sm">Placement</p>
                  <p className="text-[#4A6275] text-[10px]">80% Salary Hike</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
