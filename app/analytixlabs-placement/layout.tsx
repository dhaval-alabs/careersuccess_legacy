import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Placement Guarantee | AnalytixLabs Career Assurance',
  description:
    'AnalytixLabs offers a Job Guarantee with 50% Fee Refund on NASSCOM-FutureSkills Prime certified programmes. Read the full eligibility criteria and Placement Readiness Program details.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
