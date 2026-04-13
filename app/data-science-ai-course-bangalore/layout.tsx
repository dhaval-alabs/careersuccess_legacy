import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Advanced Certification in Data Science & AI in Bangalore | AnalytixLabs",
  description: "Join AnalytixLabs' Advanced Certification in Data Science & AI in Bangalore. NASSCOM-FutureSkills Prime certified. Placement with Fee-Back Guarantee. Classroom at HSR Layout.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-science-ai-course-bangalore',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
