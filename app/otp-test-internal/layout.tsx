import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internal OTP Test | AnalytixLabs',
  description: 'Hidden test page for verifying WhatsApp OTP integration.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OtpTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
