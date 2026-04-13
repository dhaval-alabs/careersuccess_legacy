import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Data Science Specialization Course | AnalytixLabs",
  description: "Accelerate your career with our Data Science Specialization Course. NASSCOM-FutureSkills Prime Certified program with placement guarantee.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://careersuccess.analytixlabs.co.in/lp/data-science-specialization-course-lg',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
