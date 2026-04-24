import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Data Analytics + AI Course in Gurgaon (Sector 44) | Placement Support | AnalytixLabs",
  description: "Premier data analytics course in Gurgaon Sector 44. Master SQL, Power BI, Python, and AI. NASSCOM-FutureSkills Prime certified. Classroom training & 100% placement support. 0% EMI available.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-analyst-ai-course-gurgaon',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
