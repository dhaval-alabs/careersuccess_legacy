'use client';

import Image from "next/image";

const LOGOS = [
  { name: "Amazon", url: "/lp/images/alumni/amazon.svg" },
  { name: "Flipkart", url: "/lp/images/alumni/flipkart.svg" },
  { name: "HDFC", url: "/lp/images/alumni/hdfc.svg" },
  { name: "Accenture", url: "/lp/images/alumni/accenture.svg" },
  { name: "TCS", url: "/lp/images/alumni/tcs.svg" },
  { name: "IBM", url: "/lp/images/alumni/ibm.svg" },
  { name: "Deloitte", url: "/lp/images/alumni/deloitte.svg" },
  { name: "Cognizant", url: "/lp/images/alumni/cognizant.svg" },
];

export default function TrustBar() {
  return (
    <section className="py-12 bg-[#F4FAFA] overflow-hidden border-b border-[#D6ECEB]">
      <div className="max-w-[1600px] mx-auto px-4">
        <p className="text-center text-[#4A6275] text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
          Our Alumni Work at Leading Tech Companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="h-8 sm:h-10 w-auto relative">
              <Image
                src={logo.url}
                alt={logo.name}
                width={120} height={40}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
