'use client';

import { useState } from "react";

const DATA_ANALYTICS_FAQS = [
  { q: "What are the job roles I can apply for after this course?", a: "You can apply for roles like Data Analyst, Business Analyst, BI Developer, Marketing Analyst, and Operations Analyst." },
  { q: "Do I need coding experience?", a: "No. The course starts from absolute basics including Excel and SQL before moving to Python." },
  { q: "What is the NASSCOM certification?", a: "It's a government-backed certification validated by the Ministry of Electronics & IT (MeitY)." },
  { q: "Is there a placement guarantee?", a: "Yes, we offer a 50% fee-back guarantee if you meet the eligibility and aren't placed within 6 months." },
  { q: "Are there weekend batches?", a: "Yes, we have specialized weekend batches for working professionals in Noida, Gurgaon, and Bangalore." }
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#D6ECEB] rounded-2xl overflow-hidden bg-white mb-4">
      <button
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F4FAFA] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-bold text-[#09263F] text-sm leading-snug">{q}</span>
        <svg className={`w-5 h-5 text-[#1DE5B5] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm text-[#4A6275] leading-relaxed border-t border-[#D6ECEB] pt-4 animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQSection({ category }: { category: string }) {
  const faqs = category === 'data-analytics' ? DATA_ANALYTICS_FAQS : [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#09263F] text-3xl font-black mb-4">Frequently Asked Questions</h2>
          <p className="text-[#4A6275] text-sm">Everything you need to know about the Data Analyst + AI programme.</p>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
