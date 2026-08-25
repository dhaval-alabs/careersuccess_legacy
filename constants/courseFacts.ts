/**
 * courseFacts.ts — single source of truth for course facts across all landing pages and components.
 */

export interface FeeMode {
  mode: string;
  nasscomPrice: string;
  tihPrice: string;
  duration: string;
  emi: string;
  desc: string;
  bullets: string[];
  featured?: boolean;
}

export interface CourseProductFacts {
  name: string;
  subject: string;
  duration: string;
  hours: string;
  hoursNumber: number;
  moduleCount: number;
  candidatesTrained: string;
  candidatesTrainedNumber: number;
  companiesHired: string;
  companiesHiredNumber: number;
  avgRating: string;
  yearsOfExcellence: string;
  yearsOfExcellenceNumber: number;
  fees: FeeMode[];
  tihNote: string;
  placementGuarantee: {
    commitment: string;
    refundPercent: string;
    windowMonths: number;
    minimumPackage: string;
    mentorSupport: string;
  };
}

const COMMON_FEES: FeeMode[] = [
  {
    mode: "Blended eLearning",
    nasscomPrice: "₹53,100",
    tihPrice: "₹70,800",
    duration: "6–8 months",
    emi: "0% interest, up to 3 instalments",
    desc: "Self-paced learning with recorded sessions and select live components. Maximum scheduling flexibility. Same syllabus and NASSCOM certification. Ideal for working professionals.",
    bullets: ["Best of both worlds", "Switch modes anytime", "Same curriculum & faculty"],
    featured: false,
  },
  {
    mode: "Interactive Live Online",
    nasscomPrice: "₹59,000",
    tihPrice: "₹80,240",
    duration: "6–8 months",
    emi: "0% interest, up to 3 instalments",
    desc: "Real-time, instructor-led sessions from anywhere in India. Same faculty as classroom. Full LMS access with recordings for 1 year. Weekday and weekend batches available.",
    bullets: ["Real-time Q&A with faculty", "Flexible batch timings", "1-year recording access"],
    featured: true,
  },
  {
    mode: "Classroom & Bootcamp",
    nasscomPrice: "₹68,440",
    tihPrice: "₹87,320",
    duration: "6–8 months",
    emi: "0% interest, up to 3 instalments",
    desc: "In-person training at our centres in Noida (Sector 2), Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, hands-on labs, direct faculty access, and on-campus placement activities.",
    bullets: ["Hands-on lab sessions", "Peer collaboration", "On-campus placement drives"],
    featured: false,
  },
];

export const COURSE_FACTS: Record<'data-science' | 'data-analytics', CourseProductFacts> = {
  'data-science': {
    name: "Data Science & Generative AI Specialization Course",
    subject: "Data Science & AI",
    duration: "6–8 Months",
    hours: "700+ Hours",
    hoursNumber: 700,
    moduleCount: 11,
    candidatesTrained: "20,000+",
    candidatesTrainedNumber: 20000,
    companiesHired: "50+", // Disputed: 50+ in stats / 700+ in some copies
    companiesHiredNumber: 50,
    avgRating: "9.6/10",
    yearsOfExcellence: "12+",
    yearsOfExcellenceNumber: 12,
    fees: COMMON_FEES,
    tihNote: "Candidates choose one TIH partner — IIT Bombay or IIT Patna — at enrolment.",
    placementGuarantee: {
      commitment: "Get Placed or Get 50% Fee Back",
      refundPercent: "50%",
      windowMonths: 6,
      minimumPackage: "Minimum annual package assured",
      mentorSupport: "Dedicated placement relationship manager & 8-week Career Readiness Programme",
    },
  },
  'data-analytics': {
    name: "Data Analytics & Generative AI Course",
    subject: "Data Analytics & AI",
    duration: "6–8 Months",
    hours: "594 Hours",
    hoursNumber: 594,
    moduleCount: 11,
    candidatesTrained: "20,000+",
    candidatesTrainedNumber: 20000,
    companiesHired: "50+",
    companiesHiredNumber: 50,
    avgRating: "9.6/10",
    yearsOfExcellence: "12+",
    yearsOfExcellenceNumber: 12,
    fees: COMMON_FEES,
    tihNote: "Candidates choose one TIH partner — IIT Bombay or IIT Patna — at enrolment.",
    placementGuarantee: {
      commitment: "Get Placed or Get 50% Fee Back",
      refundPercent: "50%",
      windowMonths: 6,
      minimumPackage: "Minimum annual package assured",
      mentorSupport: "Dedicated placement relationship manager & 8-week Career Readiness Programme",
    },
  },
};
