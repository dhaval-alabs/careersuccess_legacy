import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Data Analytics + AI Course in Noida (Sector 15) | Placement Support | AnalytixLabs",
  description: "Top-rated data analytics course in Noida Sector 15. Master Excel, SQL, Power BI, Python, and AI. NASSCOM-FutureSkills Prime certified. Classroom training & 100% placement support. 0% EMI available.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-analyst-ai-course-noida',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
