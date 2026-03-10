'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

const faqData = [
    {
        question: "What if I miss a class?",
        answer: (
            <>
                <p>Don't worry! You will always get a recording for the class in your Learning Management System (LMS) account. Have a look at that and reach out to the faculty in case of doubts. All our live classes are recorded for self-study purpose and future reference, and these can also be accessed through our LMS. Hence, in case you miss a class, you can refer to the video recording and then reach out to the faculty during their doubts clearing time or ask your question at the beginning of the subsequent class.</p>
                <p>You can also repeat any class you want in the next one year after your course completion. Batch change policies will, however, apply in this case.</p>
                <p>Please note that in case you are not able to complete your course within one year of course validity, due to reasons at your end, limited support might be available post the completion of one year.</p>
            </>
        )
    },
    {
        question: "What if I share my learning account details with my friend?",
        answer: "The sharing of LMS login credentials is unauthorized, and as a security measure, if the LMS is accessed by multiple places, it will flag in the system and your access to LMS can be terminated."
    },
    {
        question: "Do this data scientist course with placement assistance come with a placement guarantee?",
        answer: (
            <>
                <p>We provide both placement guarantee programs and placement assistance programs, depending on the course you choose.</p>
                <p><strong>For NASSCOM Certified Courses:</strong> These come with a Job Guarantee, along with a 50% Fee Refund and Minimum Package Assurance. If you are unable to secure a qualifying role with the assured minimum annual package within 6 months of certification (after meeting the stipulated requirements), 50% of your course fee will be refunded.</p>
                <p><strong>For other courses:</strong> While they do not include a placement guarantee, they feature a comprehensive 2-month, industry-focused placement readiness module. This module strengthens both technical and soft skills through interview preparation, practice tests, case studies, simulated recruitment drives, and mock interviews with industry experts—helping you gain the confidence and skills needed to land the right opportunity.</p>
            </>
        )
    },
    {
        question: "Can I download the recordings?",
        answer: (
            <>
                <p>No. Our recordings can be accessed through your account on LMS or stream them live online at any point in time though.</p>
                <p>Recordings are an integral part of AnalytixLabs' intellectual property by Suo Jure. The downloading/distribution of these recordings in anyway is strictly prohibited and illegal as they are protected under the copyright act. In case a student is found doing the same, it will lead to an immediate and permanent suspension in the services, access to all the learning resources will be blocked, the course fee will be forfeited and the institute will have all the rights to take strict legal action against the individual.</p>
            </>
        )
    },
    {
        question: "How do I get the course certificate?",
        answer: (
            <>
                <p>As part of the course, students get weekly assignments and module-wise case studies. Once all your submissions are received and evaluated well (without any plagiarism), the certificate shall be awarded. Without fairly submissions and evaluation of the assignments and projects no certificate shall be issued.</p>
                <p>Please note that in case you are not able to complete the course within the one-year validity, AnalytixLabs might hold a mock interview/viva, apart from your submissions, before issuing the certificate.</p>
            </>
        )
    },
    {
        question: "For how long are class recordings and LMS access available?",
        answer: (
            <>
                <p>LMS and course access are available for one year. If needed, you can also repeat any number of classes you want in the next one year after course completion. Batch change policies will, however, apply in this case.</p>
                <p>This is valid for AnalytixLabs content. In the case of this co-branded global data scientist certification course, the general duration of access to partner content is limited to 6 months.</p>
                <p>In case required because any genuine reasons, the recordings access can be extended further for up to 1 year post the completion of one-year validity. Please note that given the constant changes in the Analytics industry, our courses continue to be upgraded and hence old courses might no longer hold relevance. Hence, we do not promise lifetime access just for marketing purposes.</p>
            </>
        )
    },
    {
        question: "Do you offer Data Science Courses in Bangalore?",
        answer: "Yes, AnalytixLabs offers one of the best Data Science Courses in Bangalore in various learning formats namely, Classroom, Fully interactive live online, and self-paced blended eLearning. Our Data Science Course in Bangalore with placement support will help you receive expert guidance on resume building, interview preparation and how to apply for relevant job roles also."
    },
    {
        question: "Is there a data science course near me?",
        answer: "Our data science courses have online and offline learning modes. If you are looking for a learning center near you, we have learning centers at Noida, Gurgaon and Bangalore. To learn from any other location, enroll for our online or blended learning modes."
    },
    {
        question: "Is this the best institute for data science in India?",
        answer: "AnalytixLabs is voted as one of the top data science institutes in India. Our learning approach and industry-relevant projects included in the course modules has helped us position this course as one of the best data science course with placement guarantee. While the term best maybe relative and subject to opinions, we offer an agile data science training opportunity that helps our students earn certificates in data science specialization. Our data science and business analytics courses are our signature learning modules offering an intuitive learning experience."
    },
    {
        question: "Is this an online data science course?",
        answer: (
            <>
                <p>We have three learning modes:</p>
                <ul>
                    <li>Interactive online data science course program</li>
                    <li>Classroom and Bootcamp course program</li>
                    <li>Blended learning mode where we offer flexibility to mix the above two modes as per your convenience.</li>
                </ul>
            </>
        )
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
                    {faqData.map((item, idx) => (
                        <div
                            key={idx}
                            className={`${styles.item} ${activeIndex === idx ? styles.active : ''}`}
                        >
                            <button
                                className={styles.question}
                                onClick={() => toggleAccordion(idx)}
                                aria-expanded={activeIndex === idx}
                            >
                                <span>{item.question}</span>
                                <span className={styles.icon}>{activeIndex === idx ? '−' : '+'}</span>
                            </button>
                            <div className={styles.answerWrapper}>
                                <div className={styles.answer}>
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
