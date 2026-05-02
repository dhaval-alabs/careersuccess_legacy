'use client';

export default function Footer() {
  return (
    <footer className="bg-[#06192b] pt-12 pb-32 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">AnalytixLabs</h3>
            <p className="text-[#4A6275] text-sm leading-relaxed max-w-sm">
              India's top-ranked institute for Data Science, AI, and Analytics. Providing industry-ready skills since 2011. NASSCOM-FutureSkills Prime accredited.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Connect</h4>
            <ul className="text-[#4A6275] text-sm space-y-2">
              <li>Gurgaon: Sector 44</li>
              <li>Noida: Sector 2</li>
              <li>Bangalore: HSR Layout</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Support</h4>
            <ul className="text-[#4A6275] text-sm space-y-2">
              <li>Email: info@analytixlabs.co.in</li>
              <li>Phone: +91 95555 25908</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-[#4A6275] text-xs">
            &copy; {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.
          </p>
        </div>
      </div>
    </footer>
  );
}
