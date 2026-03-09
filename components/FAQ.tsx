'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

const faqData = [
    {
        question: "How much does the data science course cost?",
        answer: "Fees depend on your learning mode. Classroom: ₹68,440. Live Online: ₹59,000. Blended eLearning: ₹53,100 (all inclusive of taxes). The syllabus, faculty, and NASSCOM certification are identical across all three. 0% interest EMI is available, and you can pay in up to 3 instalments. The full programme runs 700+ hours over 8 months."
    },
    {
        question: "Does this course come with a placement guarantee?",
        answer: "Yes. For NASSCOM-certified courses, we offer a placement commitment with a 50% fee-back guarantee. Complete the programme, meet the stipulated requirements, and if you're not placed in a qualifying role with the assured minimum annual package within 6 months of certification, 50% of your fee is refunded. Every student also goes through an 8-week Placement Readiness Programme with mock interviews, resume reviews, and simulated recruitment drives."
    },
    {
        question: "What is the eligibility for this data science course?",
        answer: "There is no strict eligibility barrier. The course is designed for absolute beginners with no prior coding or technical background. Graduates from any stream (engineering, commerce, arts, science) can enrol. Working professionals looking to transition into data science are equally welcome. Our learning advisors can help you evaluate your profile before you commit."
    },
    {
        question: "What subjects are covered in the syllabus?",
        answer: "11 modules across 700+ hours: Excel, SQL, Power BI, Python, R (optional), Applied Statistics, Predictive Modelling, Machine Learning, NLP, Model Deployment/MLOps, and Generative AI. You also complete 6 capstone projects and 20+ graded assignments using real business datasets. Download the brochure for the full topic-wise breakdown."
    },
    {
        question: "What certification do I receive?",
        answer: "Two certifications: an Advanced Certification from AnalytixLabs and a certification from NASSCOM FutureSkills Prime (a Government of India initiative backed by MeitY). Both are widely recognised by employers. Certification is awarded after completing all assessments (case studies, MCQs, and viva) within the course timeline. Two attempts per assessment."
    },
    {
        question: "Do you offer classroom training near me?",
        answer: "Yes. Classroom batches run at our centres in Noida, Gurgaon (Sector 44), and Bangalore (HSR Layout). Small batch sizes, instructor-led, hands-on. Most institutes have gone fully online. We haven't, because face-to-face mentorship produces noticeably better outcomes. If you're not near a centre, the Interactive Live Online mode gives you the same faculty and real-time interaction."
    },
    {
        question: "Can I do this course while working full-time?",
        answer: "Absolutely. Most of our students are working professionals. Live online batches run on weekday evenings and weekends. Classroom sessions have weekend options too. Blended eLearning gives maximum flexibility. Plan for about 8-10 hours per week for self-study alongside classes. All sessions are recorded and available on your LMS for a full year."
    },
    {
        question: "What salary can I expect after completing this?",
        answer: "Entry-level data science roles in India typically pay ₹6-10 LPA. Mid-level: ₹12-20 LPA. Senior roles go beyond ₹25 LPA. Common titles include Data Scientist, ML Engineer, BI Analyst, and Analytics Consultant. Our alumni work at companies like Amazon, Flipkart, HDFC Bank, Accenture, Deloitte, and many others."
    },
    {
        question: "Does this course cover AI and machine learning?",
        answer: "Yes. Machine learning is a core part of the curriculum: supervised/unsupervised learning, ensemble methods, time series, and NLP. The programme also includes a dedicated Generative AI module covering prompt engineering and Gen AI for Excel, SQL, Power BI, and Python."
    },
    {
        question: "Why should I choose AnalytixLabs over other institutes?",
        answer: "We've been training professionals in data science, AI, and analytics since 2011. 20,000+ candidates trained, 100,000+ training hours delivered, and a 9.6 average student rating. Unlike most institutes that operate purely online, we run genuine classroom batches in three cities. Curriculum co-developed with NASSCOM FutureSkills Prime."
    },
    {
        question: "How does this compare to a PG or master's degree in data science?",
        answer: "A PG or master's typically runs 1-2 years and costs ₹2-5 lakhs or more. Our programme covers the same core skill set in 8 months at a fraction of the cost. The key difference: our curriculum is industry-designed, not academic. You work on real business projects and get dedicated placement support."
    },
    {
        question: "What if I miss a class?",
        answer: "Every live session is recorded and available on your LMS within 24 hours. Review the recording and raise questions with faculty during office hours or at the start of the next class. You can also repeat any class with a subsequent batch within one year of enrolment."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className={styles.faqSection}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Frequently Asked Questions</h2>
                    <p className={styles.subtitle}>Find answers to the most common questions about our program and services.</p>
                </div>

                <div className={styles.accordion}>
                    {faqData.map((item, idx) => {
                        const colorType = idx % 3; // 0: Green, 1: Yellow, 2: Blue
                        const itemClass = colorType === 1 ? styles.itemYellow : colorType === 2 ? styles.itemBlue : '';
                        const activeClass = colorType === 1 ? styles.activeYellow : colorType === 2 ? styles.activeBlue : styles.active;
                        const iconVariantClass = colorType === 1 ? styles.iconYellow : colorType === 2 ? styles.iconBlue : '';

                        return (
                            <div
                                key={idx}
                                className={`${styles.item} ${itemClass} ${activeIndex === idx ? activeClass : ''}`}
                            >
                                <button
                                    className={styles.question}
                                    onClick={() => toggleAccordion(idx)}
                                    aria-expanded={activeIndex === idx}
                                >
                                    <span>{item.question}</span>
                                    <span className={`${styles.icon} ${iconVariantClass}`}>{activeIndex === idx ? '−' : '+'}</span>
                                </button>
                                <div className={styles.answerWrapper}>
                                    <div className={styles.answer}>
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
