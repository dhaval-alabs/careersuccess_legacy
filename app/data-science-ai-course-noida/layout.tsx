import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Advanced Certification in Data Science & AI in Noida | AnalytixLabs",
  description: "Join AnalytixLabs' Advanced Certification in Data Science & AI in Noida. NASSCOM-FutureSkills Prime certified. Placement with Fee-Back Guarantee. Classroom at Sector 62.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
