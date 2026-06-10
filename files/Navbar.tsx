import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#D6ECEB]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/lp/images/analytixlabs-logo.webp"
            alt="AnalytixLabs"
            width={160}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Right: phone + CTA */}
        <div className="flex items-center gap-3">
          <a
            href="tel:9555525908"
            className="hidden sm:flex items-center gap-2 text-[#09263F] text-sm font-semibold
                       hover:text-[#239bf5] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            9555525908
          </a>
          <a
            href="#enroll"
            className="bg-[#29E8A4] hover:bg-[#24d193] text-[#09263F] font-bold
                       text-sm px-5 py-2.5 rounded-xl transition-all
                       shadow-[0_4px_14px_rgba(41,232,164,0.3)]"
          >
            Enrol Now →
          </a>
        </div>

      </div>
    </nav>
  );
}
