import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Outfit } from 'next/font/google';
import ClientInit from '../components/ClientInit';

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

export const metadata: Metadata = {
  title: "Data Science Specialization Course | AnalytixLabs",
  description: "Accelerate your career with our Data Science Specialization Course. NASSCOM-FutureSkills Prime Certified program with placement guarantee.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Google Tag Manager (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-783236209"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('set', 'conversion_linker', true);
            gtag('config', 'AW-783236209');
          `}
        </Script>
      </head>
      <body>
        <ClientInit />
        {children}
      </body>
    </html>
  );
}
