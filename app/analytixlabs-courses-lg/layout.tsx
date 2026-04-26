import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI & Data Science Courses | AnalytixLabs',
  description:
    'Browse AnalytixLabs courses in Data Science, Data Analytics, Business Analytics, AI, and Python. NASSCOM-FutureSkills Prime certified programmes with placement support.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
