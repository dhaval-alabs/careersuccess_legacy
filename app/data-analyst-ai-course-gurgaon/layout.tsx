import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Data Analytics + AI Course in Gurgaon | Sector 44 centre | AnalytixLabs",
  description: "Best data analytics course in Gurgaon with placement support. Master Excel, SQL, Power BI, Python, and Generative AI. NASSCOM-FutureSkills Prime certified. Classroom training at Sector 44 centre. 0% EMI available.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-analyst-ai-course-gurgaon',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
