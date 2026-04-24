'use client';

import Image from "next/image";

export default function CertificationStrip() {
  return (
    <section className="py-16 bg-white border-y border-[#D6ECEB]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="bg-[#09263F] rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1DE5B5]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex-shrink-0 relative z-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl rotate-3">
              <Image 
                src="https://www.analytixlabs.co.in/wp-content/uploads/2026/03/logo-nasscom-ministry.webp"
                alt="NASSCOM"
                width={200} height={80}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <span className="inline-block bg-[#1DE5B5]/20 text-[#1DE5B5] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Industry Standard Certification
            </span>
            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              Earn a Globally Recognized <span className="text-[#1DE5B5]">NASSCOM-FutureSkills Prime</span> Certificate
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-xl">
              Validated by the Ministry of Electronics & IT (MeitY), Government of India. This certification is the gold standard for data analytics roles in India and abroad.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[#1DE5B5] font-bold text-xl">✓</span>
                <span className="text-white/80 text-sm">MeitY Recognized</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#1DE5B5] font-bold text-xl">✓</span>
                <span className="text-white/80 text-sm">Shareable on LinkedIn</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#1DE5B5] font-bold text-xl">✓</span>
                <span className="text-white/80 text-sm">Industry-Aligned Skills</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
