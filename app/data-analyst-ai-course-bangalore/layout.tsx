import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Data Analytics + AI Course in Bangalore (HSR Layout) | Placement Support | AnalytixLabs",
  description: "Best data analytics course in Bangalore HSR Layout. Master SQL, Power BI, Python, and AI. NASSCOM-FutureSkills Prime certified. Classroom training & 100% placement support. 0% EMI available.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-analyst-ai-course-bangalore',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
