import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Data Analytics + AI Course in Noida | Sector 15 centre | AnalytixLabs",
  description: "Best data analytics course in Noida with placement support. Master Excel, SQL, Power BI, Python, and Generative AI. NASSCOM-FutureSkills Prime certified. Classroom training at Sector 15 centre. 0% EMI available.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-analyst-ai-course-noida',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
