'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import LeadCaptureForm from '../../components/forms/LeadCaptureForm';

// ─── Location Data ────────────────────────────────────────────────────────────

const LOCATIONS = [
  {
    city: 'Gurgaon',
    address: '2nd Floor, Sidhartha House, Building No. 6, Sector 44, Gurugram, Haryana 122003 (600 metres from HUDA City Metro)',
    hours: '10:00 AM - 7:00 PM',
    mapsLink: 'https://maps.app.goo.gl/VhGWFi7xRpDgD2tD9',
    embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.0539893088677!2d77.05844987550266!3d28.453474075756854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e9f3e71cb1%3A0x7df2d3af77dbb1f3!2sAnalytixLabs%20-%20Data%20Science%20Course%20in%20Gurgaon!5e0!3m2!1sen!2sin!4v1700000000000',
  },
  {
    city: 'Bangalore',
    address: 'Bldg 51/2, 1st Floor, 12th Main Rd, Near BDA Complex, Sector 6, HSR Layout, Opp. A2B (Adyar Ananda Bhawan), Bengaluru, Karnataka 560102',
    hours: '10:00 AM - 7:00 PM',
    mapsLink: 'https://maps.app.goo.gl/8bJzz7Boc4N9aEFJ8',
    embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8534893780257!2d77.63706237507455!3d12.916305787385814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1405c0c7e17d%3A0x15b2e45d3fbeec03!2sAnalytixLabs%20-%20Data%20Science%20Course%20in%20Bangalore!5e0!3m2!1sen!2sin!4v1700000000001',
  },
  {
    city: 'Noida',
    address: '1st Floor, A 78, A Block, Sector 2, Metro Gate 3, Noida, Uttar Pradesh 201301',
    hours: '10:00 AM - 7:00 PM',
    mapsLink: 'https://maps.app.goo.gl/eN9mhRSmB7s5k41FA',
    embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3745059505437!2d77.30860957550812!3d28.594296275676704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5b98f2f7da3%3A0x5ddc82e07d7e5d26!2sAnalytixLabs%20-%20Data%20Science%20Course%20in%20Noida!5e0!3m2!1sen!2sin!4v1700000000002',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactUsPage() {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  return (
    <div className="font-sans bg-white text-[#1A2E3B] antialiased">
      <Navbar />
      <main id="main-content">

        {/* ── CONTACT HERO ── */}
        <section className="py-24 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">

              {/* Left — Contact Info */}
              <div>
                <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-6">
                  <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Get In Touch</span>
                </span>
                <h1 className="text-[#09263F] font-bold text-4xl sm:text-5xl leading-tight mb-4">
                  Contact Us
                </h1>
                <p className="text-[#4A6275] text-lg leading-relaxed mb-8">
                  AnalytixLabs is here to support you at every step of your journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <a
                    href="tel:9555525908"
                    className="inline-flex items-center justify-center gap-2 bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-6 py-3.5 rounded-full text-sm transition-all shadow-[0_4px_14px_rgba(29,229,181,0.3)] active:scale-95"
                  >
                    📞 +91 95555 25908
                  </a>
                  <a
                    href="https://api.whatsapp.com/send?phone=919555525908"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b957] text-white font-bold px-6 py-3.5 rounded-full text-sm transition-all shadow-[0_4px_14px_rgba(37,211,102,0.3)] active:scale-95"
                  >
                    💬 WhatsApp
                  </a>
                </div>

                <p className="text-[#4A6275] text-sm italic mb-6">
                  *(10:00 AM to 07:00 PM, Monday to Saturday)
                </p>

                <a
                  href="mailto:info@analytixlabs.co.in"
                  className="inline-flex items-center gap-2 text-[#239bf5] font-semibold text-sm hover:underline"
                >
                  ✉ info@analytixlabs.co.in
                </a>
              </div>

              {/* Right — Brochure Card */}
              <div className="card-premium">
                <div className="text-4xl mb-4">📋</div>
                <h2 className="text-[#09263F] font-bold text-2xl mb-3">Course Brochure</h2>
                <p className="text-[#4A6275] leading-relaxed mb-8">
                  Includes all guidelines, curriculum details, and fee information for our courses.
                </p>
                <button
                  onClick={() => setIsBrochureOpen(true)}
                  className="w-full bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.25)] active:scale-95"
                >
                  Download Brochure →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── MEET US HERE ── */}
        <section className="py-24 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl mb-12">Meet Us Here</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {LOCATIONS.map((loc) => (
                <div key={loc.city} className="card-premium">
                  <h3 className="text-[#09263F] font-bold text-xl mb-4">{loc.city}</h3>

                  <div className="space-y-3 mb-6">
                    <p className="text-[#4A6275] text-sm flex items-start gap-2">
                      <span className="flex-shrink-0">📞</span>
                      <span>+91 9555525908</span>
                    </p>
                    <p className="text-[#4A6275] text-sm flex items-start gap-2">
                      <span className="flex-shrink-0">📍</span>
                      <span>{loc.address}</span>
                    </p>
                    <p className="text-[#4A6275] text-sm flex items-center gap-2">
                      <span>🕐</span>
                      <span>{loc.hours}</span>
                    </p>
                  </div>

                  {/* Maps Embed */}
                  <div className="rounded-xl overflow-hidden mb-3 border border-[#D6ECEB]">
                    <iframe
                      src={loc.embedSrc}
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${loc.city} AnalytixLabs Location`}
                    />
                  </div>

                  <a
                    href={loc.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1DE5B5] font-semibold text-sm hover:underline"
                  >
                    Open in Maps ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#06192b] py-6 border-t border-white/5">
          <p className="text-center text-[#4A6275] text-xs">
            © {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.
          </p>
        </footer>

        {/* ── BROCHURE MODAL ── */}
        <Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
          <LeadCaptureForm
            title="Download Brochure"
            sourceName="lp_blr_download_brochure"
            typeFilter="PPC_DownloadBrochure"
            buttonText="Download Now →"
            thankYouPath="/thankyou-download-brochure"
          />
        </Modal>
      </main>
    </div>
  );
}
