import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Advanced Certification in Data Science & AI in Delhi | AnalytixLabs",
  description: "Join AnalytixLabs' Advanced Certification in Data Science & AI in Delhi. NASSCOM-FutureSkills Prime certified. Placement with Fee-Back Guarantee. Classroom in Delhi NCR.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-science-ai-course-delhi',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
