import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Advanced Certification in Data Science & AI in Gurgaon | AnalytixLabs",
  description: "Join AnalytixLabs' Advanced Certification in Data Science & AI in Gurgaon. NASSCOM-FutureSkills Prime certified. Placement with Fee-Back Guarantee. Classroom at Sector 44.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
