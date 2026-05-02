import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Advanced Certification in Data Science & AI in Noida | AnalytixLabs",
  description: "Join AnalytixLabs' Advanced Certification in Data Science & AI in Noida. NASSCOM-FutureSkills Prime certified. Placement with Fee-Back Guarantee. Classroom at Sector 2.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-science-ai-course-noida',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
