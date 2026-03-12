// components/ThankYouPage.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface ThankYouProps {
  heading:      string;
  subCopy:      string;
  conversionId: string; // full send_to string e.g. 'AW-783236209/wuuEC...'
}

const WEBINAR_URL  = 'https://us06web.zoom.us/webinar/register/1117706174998/WN_6E7nUME2RlKyG0a8N0qXEQ#/registration';
const PHONE_NUMBER = '919555525908';
const WA_MESSAGE   = encodeURIComponent(
  'Hello, I just submitted my details on the AnalytixLabs website. Can you help me?'
);

export default function ThankYouPage({ heading, subCopy, conversionId }: ThankYouProps) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';

  // ── Fire Google Ads conversion on page load ──────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;

    const firstName = name.split(' ')[0] || '';
    const e164Phone = phone ? `+91${phone.replace(/\D/g, '')}` : '';

    window.gtag('event', 'conversion', {
      send_to: conversionId,
      user_data: {
        email,
        phone_number: e164Phone,
        address: {
          first_name: firstName,
        },
      },
    });
  }, [conversionId, email, name, phone]);
  // ── End conversion fire ──────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>

      {/* ── HEADER ── */}
      <header style={{ background: '#00A99D', padding: '16px 24px' }}>
        <Image
          src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp"
          alt="AnalytixLabs"
          width={180}
          height={40}
          style={{ objectFit: 'contain' }}
        />
      </header>

      {/* ── CONFIRMATION BLOCK ── */}
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '40px 36px',
          textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: '32px',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>

          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A2E44', marginBottom: '12px' }}>
            {heading}
          </h1>

          <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.6, marginBottom: '20px' }}>
            {subCopy}
          </p>

          {/* Lead data pill — only shown if email is present in URL */}
          {email && (
            <div style={{
              display: 'inline-block', background: '#EBF8F7',
              border: '1px solid #00A99D', borderRadius: '999px',
              padding: '6px 18px', fontSize: '14px', color: '#007A74',
            }}>
              {name && <strong>{name} · </strong>}
              Confirmation sent to: <strong>{email}</strong>
            </div>
          )}
        </div>

        {/* ── THREE BOXES ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>

          {/* Box 1 — Webinar */}
          <div style={cardStyle}>
            <div style={iconStyle}>🎥</div>
            <h3 style={cardTitle}>Join Our Upcoming Webinar</h3>
            <p style={cardBody}>Get live expert guidance on building a career in Data Science. Free to attend.</p>
            <a href={WEBINAR_URL} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
              Save My Spot
            </a>
          </div>

          {/* Box 2 — Call */}
          <div style={cardStyle}>
            <div style={iconStyle}>📞</div>
            <h3 style={cardTitle}>Need Help? Talk to Us.</h3>
            <p style={cardBody}>Learning advisors available Mon–Sat, 9 AM to 7 PM.</p>
            <a href={`tel:${PHONE_NUMBER}`} style={btnOutline}>
              Call +91 95555 25908
            </a>
          </div>

          {/* Box 3 — WhatsApp */}
          <div style={cardStyle}>
            <div style={iconStyle}>💬</div>
            <h3 style={cardTitle}>Chat on WhatsApp</h3>
            <p style={cardBody}>Prefer to chat? Connect with our counsellor instantly on WhatsApp.</p>
            <a href={`https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${WA_MESSAGE}`}
               target="_blank" rel="noopener noreferrer" style={btnWhatsapp}>
              Chat Now
            </a>
          </div>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: 'center', padding: '24px', fontSize: '13px', color: '#888' }}>
        © {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.
      </footer>
    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', padding: '28px 20px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex',
  flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px',
};
const iconStyle:   React.CSSProperties = { fontSize: '36px' };
const cardTitle:   React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: '#1A2E44', margin: 0 };
const cardBody:    React.CSSProperties = { fontSize: '14px', color: '#555', lineHeight: 1.5, margin: 0, flexGrow: 1 };
const btnBase:     React.CSSProperties = {
  display: 'inline-block', borderRadius: '8px', padding: '10px 20px',
  fontSize: '14px', fontWeight: 600, textDecoration: 'none', marginTop: 'auto', width: '100%', textAlign: 'center',
};
const btnPrimary:  React.CSSProperties = { ...btnBase, background: '#00A99D', color: '#fff' };
const btnOutline:  React.CSSProperties = { ...btnBase, border: '2px solid #00A99D', color: '#00A99D', background: 'transparent' };
const btnWhatsapp: React.CSSProperties = { ...btnBase, background: '#25D366', color: '#fff' };
