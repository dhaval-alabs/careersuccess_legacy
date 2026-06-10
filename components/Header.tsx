'use client';

import Image from "next/image";

interface Props {
  onOpenForm: () => void;
}

export default function Header({ onOpenForm }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#D6ECEB] py-3 px-4 sm:px-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/lp/images/analytixlabs-logo.webp"
            alt="AnalytixLabs"
            width={160} height={36}
            className="w-auto h-8 sm:h-9"
          />
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="tel:9555525908" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#09263F]">
            <span className="text-[#1DE5B5]">📞</span> 95555 25908
          </a>
          <button
            onClick={onOpenForm}
            className="bg-[#09263F] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#1A2E3B] transition-all shadow-lg active:scale-95"
          >
            Download Syllabus
          </button>
        </div>
      </div>
    </header>
  );
}
