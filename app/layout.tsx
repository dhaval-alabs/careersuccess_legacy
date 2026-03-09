import './globals.css';
import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'AnalytixLabs | Data Science Specialization',
  description: 'Launch your career with India\'s top-rated Data Science certification program — NASSCOM certified, with Job Guarantee.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    brand: {
                      teal: "#29E8A4",
                      navy: "#09263F",
                    }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
