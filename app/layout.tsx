'use client';

import { useEffect } from 'react';
import { captureUtmParams } from '../utils/captureUtm';
import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-outfit',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Google Tag Manager (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-783236209"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-783236209');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
