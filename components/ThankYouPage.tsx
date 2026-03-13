// components/ThankYouPage.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface ThankYouProps {
  heading: string;
  subCopy: string;
  conversionId: string;
  isBrochureDownload?: boolean;
}

const WEBINAR_URL = 'https://us06web.zoom.us/webinar/register/1117706174998/WN_6E7nUME2RlKyG0a8N0qXEQ#/registration';
const BROCHURE_PDF_URL = 'https://www.analytixlabs.co.in/pdf/Nasscom_(ACDS)_Advanced_Certification_in_Data_Science_Alabs280126.pdf';
const PHONE_NUMBER = '919555525908';
const WA_MESSAGE = encodeURIComponent(
  'Hello, I just submitted my details on the AnalytixLabs website. Can you help me?'
);

const navy = "#09263F";
const teal = "#1DE5B5";
const blue = "#239bf5";

export default function ThankYouPage({ heading, subCopy, conversionId, isBrochureDownload }: ThankYouProps) {
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get('email') || '';
  const rawName = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';

  const email = decodeURIComponent(rawEmail);
  const name = decodeURIComponent(rawName);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    const firstName = name.split(' ')[0] || '';
    const e164Phone = phone ? `+91${phone.replace(/\D/g, '')}` : '';
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      user_data: {
        email,
        phone_number: e164Phone,
        address: { first_name: firstName },
      },
    });
  }, [conversionId, email, name, phone]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0faf8', paddingBottom: '40px' }}>
      {/* ── HEADER ── */}
      <header style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'center' }}>
          <Image
            src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp"
            alt="AnalytixLabs"
            width={180}
            height={40}
            style={{ objectFit: 'contain' }}
          />
          <div style={{ width: '1px', height: '30px', background: '#D6ECEB' }} />
          <Image
            src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Nasscom-Certification-1024x724-1-300x212.jpg"
            alt="NASSCOM"
            width={60}
            height={42}
            style={{ objectFit: 'contain', borderRadius: '4px' }}
          />
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          border: '1.5px solid #e0eeeb',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(9,38,63,0.05)',
          marginBottom: '40px',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: navy,
            marginBottom: '16px',
            fontFamily: 'var(--font-outfit)',
            letterSpacing: '-0.02em'
          }}>
            {heading}
          </h1>

          <p style={{ fontSize: '18px', color: '#4A6275', lineHeight: 1.6, marginBottom: '28px', maxWidth: '800px', margin: '0 auto 28px' }}>
            {subCopy}
          </p>

          {/* User details pill */}
          {email && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#e8f4fd',
              border: '1px solid #b8ddf7',
              borderRadius: '999px',
              padding: '8px 24px',
              fontSize: '15px',
              color: navy,
              fontWeight: 600,
              marginBottom: isBrochureDownload ? '32px' : '0'
            }}>
              {name && <span style={{ marginRight: '8px' }}>{name} ·</span>}
              <span>Confirmation sent to: {email}</span>
            </div>
          )}

          {/* Brochure Download Button */}
          {isBrochureDownload && (
            <div style={{ marginTop: '20px' }}>
              <a href={BROCHURE_PDF_URL} target="_blank" rel="noopener noreferrer"
                style={{
                  background: teal,
                  color: navy,
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '16px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 8px 30px rgba(29,229,181,0.3)',
                  transition: 'all 0.2s'
                }}>
                Download File now
              </a>
            </div>
          )}
        </div>

        {/* ── ACTION CARDS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {/* Card 1 — Webinar */}
          <div style={cardStyle}>
            <div style={iconStyle}>🎥</div>
            <h3 style={cardTitle}>Upcoming Webinar</h3>
            <p style={cardBody}>Expert guidance on building a career in Data Science. Free access.</p>
            <a href={WEBINAR_URL} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
              Save My Spot →
            </a>
          </div>

          {/* Card 2 — Phone */}
          <div style={cardStyle}>
            <div style={iconStyle}>📞</div>
            <h3 style={cardTitle}>Need Help? Talk to Us</h3>
            <p style={cardBody}>Advisors available Mon–Sat, 9 AM to 7 PM.</p>
            <a href={`tel:${PHONE_NUMBER}`} style={btnOutline}>
              Call 95555 25908
            </a>
          </div>

          {/* Card 3 — WhatsApp */}
          <div style={cardStyle}>
            <div style={iconStyle}>💬</div>
            <h3 style={cardTitle}>Chat on WhatsApp</h3>
            <p style={cardBody}>Connect with our counsellor instantly on WhatsApp.</p>
            <a href={`https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${WA_MESSAGE}`}
               target="_blank" rel="noopener noreferrer" style={btnWhatsapp}>
              Chat Now
            </a>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 24px 0', fontSize: '12px', color: '#4A6275' }}>
        © {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.
      </footer>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '20px',
  padding: '32px 24px',
  border: '1.5px solid #e0eeeb',
  boxShadow: '0 4px 24px rgba(9,38,63,0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '16px',
};
const iconStyle: React.CSSProperties = { fontSize: '42px' };
const cardTitle: React.CSSProperties = { fontSize: '18px', fontWeight: 800, color: navy, margin: 0, fontFamily: 'var(--font-outfit)' };
const cardBody: React.CSSProperties = { fontSize: '14px', color: '#4A6275', lineHeight: 1.5, margin: 0, flexGrow: 1 };
const btnBase: React.CSSProperties = {
  width: '100%', borderRadius: '12px', padding: '12px 24px',
  fontSize: '15px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s'
};
const btnPrimary: React.CSSProperties = { ...btnBase, background: teal, color: navy, boxShadow: '0 4px 14px rgba(29,229,181,0.2)' };
const btnOutline: React.CSSProperties = { ...btnBase, border: '1.5px solid #D6ECEB', color: navy, background: 'white' };
const btnWhatsapp: React.CSSProperties = { ...btnBase, background: '#25D366', color: '#fff', boxShadow: '0 4px 14px rgba(37,211,102,0.2)' };
