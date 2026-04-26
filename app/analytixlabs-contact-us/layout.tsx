import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact AnalytixLabs | Gurgaon, Bangalore, Noida',
  description:
    'Get in touch with AnalytixLabs. Call, WhatsApp, or visit our centres in Gurgaon, Bangalore, and Noida. We are here Monday to Saturday, 10 AM to 7 PM.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
