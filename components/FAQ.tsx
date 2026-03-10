'use client';

import { useState } from "react";

const FAQ_DATA = [
    {
        question: "How much does the data science course cost?",
        answer: "Fees depend on your learning mode. Classroom: ₹68,440. Live Online: ₹59,000. Blended eLearning: ₹53,100 (all inclusive of taxes). The syllabus, faculty, and NASSCOM-FutureSkills Prime certification are identical across all three. 0% interest EMI is available, and you can pay in up to 3 instalments. The full programme runs 700+ hours over 8 months."
    },
    {
        question: "Does this course come with a placement guarantee?",
        answer: "Yes. For NASSCOM-FutureSkills Prime certified courses, we offer a placement commitment with a 50% fee-back guarantee. Complete the programme, meet the stipulated requirements, and if you're not placed in a qualifying role with the assured minimum annual package within 6 months of certification, 50% of your fee is refunded. Every student also goes through an 8-week Placement Readiness Programme."
    },
    {
        question: "What is the eligibility for this data science course?",
        answer: "There is no strict eligibility barrier. The course is designed for absolute beginners with no prior coding or technical background. Graduates from any stream (engineering, commerce, arts, science) can enrol. Working professionals looking to transition into data science are equally welcome. Our learning advisors can help you evaluate your profile before you commit."
    },
    {
        question: "What subjects are covered in the syllabus?",
        answer: "11 modules across 700+ hours: Excel, SQL, Power BI, Python, R (optional), Applied Statistics, Predictive Modelling, Machine Learning, NLP, Model Deployment/MLOps, and Generative AI. You also complete 6 capstone projects and 20+ graded assignments using real business datasets."
    },
    {
        question: "What certification do I receive?",
        answer: "Two certifications: an Advanced Certification from AnalytixLabs and a certification from NASSCOM-FutureSkills Prime (a Government of India initiative backed by MeitY). Both are widely recognised by employers. Certification is awarded after completing all assessments within the course timeline."
    },
    {
        question: "Do you offer classroom training near me?",
        answer: "Yes. Classroom batches run at our centres in Noida, Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, instructor-led, hands-on. If you're not near a centre, the Interactive Live Online mode gives you the same faculty and real-time interaction."
    },
    {
        question: "Can I do this course while working full-time?",
        answer: "Absolutely. Most of our students are working professionals. Live online batches run on weekday evenings and weekends. Classroom sessions have weekend options too. Blended eLearning gives maximum flexibility. All sessions are recorded and available on your LMS for a full year."
    },
    {
        question: "What salary can I expect after completing this?",
        answer: "Entry-level data science roles in India typically pay ₹6–10 LPA. Mid-level: ₹12–20 LPA. Senior roles go beyond ₹25 LPA. Common titles include Data Scientist, ML Engineer, BI Analyst, and Analytics Consultant. Our alumni work at companies like Amazon, Flipkart, HDFC Bank, Accenture, and Deloitte."
    },
    {
        question: "Does this course cover AI and machine learning?",
        answer: "Yes. Machine learning is a core part of the curriculum: supervised/unsupervised learning, ensemble methods, time series, and NLP. The programme also includes a dedicated Generative AI module covering prompt engineering and Gen AI for business tools."
    },
    {
        question: "Why should I choose AnalytixLabs over other institutes?",
        answer: "Since 2011, we've trained 20,000+ candidates with a 9.6/10 average student rating. Unlike purely online institutes, we run genuine classroom batches in three cities. Curriculum co-developed with NASSCOM-FutureSkills Prime. 50+ companies have hired our alumni directly."
    },
    {
        question: "How does this compare to a PG or master's degree in data science?",
        answer: "A PG or master's typically runs 1–2 years and costs ₹2–5 lakhs+. Our programme covers the same core skill set in 8 months at a fraction of the cost. Our curriculum is industry-designed and practical, focusing on deployment and MLOps rather than just academic theory."
    },
    {
        question: "What if I miss a class?",
        answer: "Every live session is recorded and available on your LMS within 24 hours. Review the recording and raise questions with faculty during office hours. You can also repeat any class with a subsequent batch within one year of enrolment."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <span className="text-[#239bf5] text-xs font-black uppercase tracking-widest bg-[#E6F7F6] px-4 py-1.5 rounded-full">Support</span>
                    <h2 className="text-[#09263F] font-black text-3xl sm:text-4xl mt-4 mb-2">Frequently <span className="bg-gradient-to-r from-[#29E8A4] to-[#45c8f1] bg-clip-text text-transparent">Asked</span> Questions</h2>
                    <p className="text-[#4A6275] max-w-md mx-auto">Common Questions</p>
                </div>

                <div className="space-y-4">
                    {FAQ_DATA.map((faq, i) => (
                        <div key={i} className={`border rounded-2xl transition-all duration-300 ${openIndex === i ? 'border-[#29E8A4] bg-[#F4FBFA]' : 'border-[#E6F0F7] bg-white hover:border-[#239bf5]/30'}`}>
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                            >
                                <h4 className="font-bold text-[#09263F] text-sm sm:text-base leading-snug">{faq.question}</h4>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === i ? 'bg-[#29E8A4] text-[#09263F]' : 'bg-[#F0F7FF] text-[#239bf5]'}`}>
                                    <svg className={`w-3 h-3 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            {openIndex === i && (
                                <div className="px-6 pb-6 text-sm text-[#4A6275] leading-relaxed animate-fadeIn">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
