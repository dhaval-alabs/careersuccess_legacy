import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "OTP Verification | AnalytixLabs",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/delhi-otp',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
