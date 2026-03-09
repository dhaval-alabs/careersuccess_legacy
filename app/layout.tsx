import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AnalytixLabs | Data Science Specialization',
  description: 'Launch your career with India\'s top-rated Data Science certification program.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    brand: {
                      teal: "#00A99D",
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
