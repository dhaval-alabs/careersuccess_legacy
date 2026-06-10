'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '../../components/Modal';
import LeadCaptureForm from '../../components/forms/LeadCaptureForm';

// ─── Accordion Item ────────────────────────────────────────────────────────────

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="border border-[#D6ECEB] rounded-2xl overflow-hidden"
    >
      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none bg-white hover:bg-[#F4FAFA] transition-colors list-none">
        <span className="font-bold text-[#09263F] text-base">{title}</span>
        <span className="text-[#1DE5B5] font-bold text-xl flex-shrink-0 ml-4">
          {open ? '−' : '+'}
        </span>
      </summary>
      <div className="px-6 pb-6 pt-2 bg-white text-[#4A6275] text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </details>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[#1DE5B5] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── PRP Components ────────────────────────────────────────────────────────────

const PRP_CARDS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Internship',
    desc: 'Build essential business communication skills, problem solving, data-driven decision-making, and presentation, while gaining hands-on project experience across different industries and functions.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Interview Preparation',
    desc: 'Structured recaps of key technical topics to reinforce core concepts commonly assessed during interviews.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Practice and Assessment',
    desc: 'Regular practice tests, case studies, and simulated recruitment drives to build confidence and familiarity with real-world hiring processes.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Soft Skills Coaching',
    desc: 'Focused sessions to enhance business communication, problem-solving, and professional behaviour, tailored to workplace expectations.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Mock Interviews',
    desc: 'Interactive mock interview sessions with an industry panel, offering personalised feedback and performance insights to help students improve.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'One-on-One Guidance',
    desc: 'Individual mentorship and feedback from experienced professionals to refine interview techniques and address skill gaps.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlacementPage() {
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-white text-[#1A2E3B] antialiased">
      <main id="main-content">

        {/* ── HERO LOGOS ── */}
        <section className="pt-12 pb-6 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-4 sm:gap-8 mb-12">
              <div className="flex-shrink-0">
                <Image
                  src="/lp/images/alabs-hd.webp"
                  alt="AnalytixLabs Icon"
                  width={48} height={48}
                  className="w-auto h-[4.5rem] sm:hidden max-w-[30vw] object-contain"
                  priority
                />
                <Image
                  src="/lp/images/analytixlabs-logo.webp"
                  alt="AnalytixLabs - Data Analytics Training Institute"
                  width={180} height={40}
                  className="w-auto h-[3.5rem] hidden sm:block"
                  priority
                />
              </div>
              <div className="w-px h-8 bg-[#D6ECEB]" />
              <Image
                src="/lp/images/logo-nasscom-ministry.webp"
                alt="Nasscom Futureskills - Ministry of Electronics and Information Technology"
                width={160} height={40}
                className="w-auto h-[5.25rem] max-w-[55vw] sm:max-w-none object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* ── PLACEMENT HERO CONTENT ── */}
        <section className="pb-16 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-6">
              <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">Career Assurance</span>
            </span>
            <h1 className="text-[#09263F] font-bold text-4xl sm:text-5xl leading-tight mb-6">
              AnalytixLabs Placements
            </h1>
            <p className="text-[#4A6275] text-lg leading-relaxed mb-4">
              AnalytixLabs is a leading Data Science Institute founded in 2011 with the sole mission of imparting industry-relevant and practical skills to make you job-ready. The success of thousands of candidates over the years and the clientele of some of the world&apos;s most prestigious organisations is a testimony of the same.
            </p>
            <p className="text-[#4A6275] text-lg leading-relaxed">
              With the rapid adoption of Analytics across industries, career opportunities in Data Science have grown exponentially. To help our students make the most of this demand, we offer exclusive Job Guarantee Programmes, exclusively through our Nasscom-FutureSkills Prime Certified Courses. These are further strengthened by our comprehensive Placement Readiness Program (PRP), which is included with all our courses.
            </p>
          </div>
        </section>

        {/* ── JOB GUARANTEE ── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            {/* Accent guarantee card */}
            <div className="border-l-4 border-[#1DE5B5] bg-[#f0faf8] rounded-r-2xl p-8 mb-10">
              <h2 className="text-[#09263F] font-bold text-2xl sm:text-3xl mb-2">
                Job Guarantee with 50% Fee Refund
              </h2>
              <p className="text-[#1DE5B5] font-bold text-sm uppercase tracking-wide mb-4">
                Applicable for Nasscom-FutureSkills Prime Certified Courses
              </p>
              <p className="text-[#4A6275] leading-relaxed mb-4">
                At AnalytixLabs, we view your career success as a shared commitment. To reinforce this, we offer a Job Guarantee with 50% Fee Refund, ensuring you have the confidence to invest in your future.
              </p>
              <p className="text-[#4A6275] leading-relaxed">
                If you are unable to secure a Qualifying Position (a role in AI, ML, Data Science, Analytics, or a related field, with at least 30 working hours per week or a full-time contractual role of at least three months) within 6 months of the placement window, after meeting the stipulated requirements, we will refund 50% of your course fee.
              </p>
            </div>

            {/* Accordions */}
            <div className="space-y-3">

              <AccordionItem title="Which Learning Tracks Are Included?">
                <BulletList items={[
                  'Full Stack AI Course',
                  'Advanced Certification in Data Science',
                  'Advanced Certification in Data Analytics with AI',
                  'Executive Certification in Data Science with AI Specialization',
                ]} />
              </AccordionItem>

              <AccordionItem title="Eligibility Criteria">
                <BulletList items={[
                  'Enrolled in an eligible Nasscom-FutureSkills Prime Certified Programme.',
                  'Full fee paid (including GST).',
                  'All academic, conduct, and placement engagement guidelines are followed.',
                  'Hold a valid Graduate degree at the time of completion of PRP.',
                ]} />
              </AccordionItem>

              <AccordionItem title="Academic and Course Completion Requirements">
                <BulletList items={[
                  'All assessments, vivas, and projects must be completed and submitted, including the Placement Readiness Module.',
                  'Minimum 60% marks in evaluations and 70% attendance in live classes.',
                  'The Student must complete the certification within one year of programme commencement (1.5 years in case of Executive Course).',
                  'Extensions only in case of documented medical emergencies or serious personal issues, subject to approval.',
                ]} />
              </AccordionItem>

              <AccordionItem title="Academic Integrity">
                <BulletList items={[
                  'Submissions are AI-proctored; all vivas and presentations are recorded.',
                  'Zero tolerance for plagiarism or copying, disqualification upon detection.',
                  'Additional presentation or viva rounds may be scheduled if any anomalies are found.',
                ]} />
              </AccordionItem>

              <AccordionItem title="Placement Engagement">
                <BulletList items={[
                  'Mandatory completion of CV building, industry expert interview, attendance in regular Placement Readiness Module (PRP) sessions held and submissions that are planned for your preparation.',
                  'Apply to at least 3 relevant roles per week and report activity to the placement team weekly.',
                  'Mandatory appearance for 3 interviews arranged by AnalytixLabs.',
                  'Prompt and professional communication with the placement team (response within 24 hours).',
                ]} />
              </AccordionItem>

              {/* Salary table — shown open by default */}
              <div className="border border-[#D6ECEB] rounded-2xl overflow-hidden">
                <div className="px-6 py-5 bg-white">
                  <h3 className="font-bold text-[#09263F] text-lg mb-4">Minimum Salary Commitment</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="bg-[#09263F] text-white">
                          <th className="px-4 py-3 font-bold rounded-tl-xl">Programme</th>
                          <th className="px-4 py-3 font-bold rounded-tr-xl text-right">Minimum CTC (Annual)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#D6ECEB] hover:bg-[#F4FAFA] transition-colors">
                          <td className="px-4 py-3 text-[#4A6275]">Advanced Certification in Data Analytics with AI</td>
                          <td className="px-4 py-3 font-bold text-[#1DE5B5] text-right">5,00,000</td>
                        </tr>
                        <tr className="border-b border-[#D6ECEB] bg-[#f0faf8]">
                          <td className="px-4 py-3 text-[#4A6275]">Advanced Certification in Data Science / Full Stack AI Course</td>
                          <td className="px-4 py-3 font-bold text-[#1DE5B5] text-right">6,00,000</td>
                        </tr>
                        <tr className="hover:bg-[#F4FAFA] transition-colors">
                          <td className="px-4 py-3 text-[#4A6275]">Executive Certification in Data Science & AI</td>
                          <td className="px-4 py-3 font-bold text-[#1DE5B5] text-right">10,00,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[#4A6275] text-xs mt-4">
                    For working professionals, a minimum 20% salary hike, as long as it meets the above threshold for their course type.
                  </p>
                </div>
              </div>

              <AccordionItem title="For Undergraduate Students">
                <BulletList items={[
                  'Timely Re-engagement for Placement Support: Students should proactively reconnect with the Placement team as soon as they become eligible for internships or full-time opportunities.',
                  'Placement Window for Students: Students must initiate placement support no later than the beginning of their final year. Requests outside this window may not be accommodated.',
                  'Impact of Extended Graduation Timelines: If graduation is delayed due to backlogs, arrears, or other reasons, placement support cannot be extended beyond the originally expected graduation timeline.',
                  'Skill Refresh Requirement: Placement support is aligned with current industry expectations. If skill gaps are identified, students will need to complete assigned revision modules before proceeding. Refresher modules will be provided at no additional cost.',
                ]} />
              </AccordionItem>

              <AccordionItem title="Refund Terms">
                <BulletList items={[
                  'If you meet all requirements and do not secure a Qualifying Position within 6 months, you may apply for a refund of 50% of the course fee.',
                  'Your 6-month placement window starts only after you complete both your certification and the mandatory Placement Readiness Program (PRP) (max. 3 months post-certification).',
                  'Refund requests must be submitted within 21 days after the 6-month period ends.',
                ]} />
              </AccordionItem>

              <AccordionItem title="Disqualification Scenarios">
                <BulletList items={[
                  'Rejecting qualifying offers or ghosting interviews.',
                  'Failure to submit on time or participate in placement efforts.',
                  'Plagiarism or dishonesty during coursework or evaluations.',
                  'Taking jobs in unrelated fields or outside prescribed roles.',
                  'Communication lapses or non-responsiveness.',
                  'Lack of improvement after repeated feedback from AnalytixLabs or hiring companies despite multiple interview opportunities.',
                ]} />
              </AccordionItem>
            </div>

            {/* Note block */}
            <div className="mt-8 bg-[#e8f4fd] border border-[#b8ddf7] rounded-xl px-6 py-4 text-sm text-[#4A6275]">
              <strong className="text-[#09263F]">Note:</strong> This Career Assurance Promise policy document will be officially shared with eligible students via email upon successful enrolment and verification. Please retain a copy for your records.
            </div>
          </div>
        </section>

        {/* ── PRP ── */}
        <section className="py-16 bg-[#f0faf8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-[#09263F] font-bold text-3xl sm:text-4xl mb-4">
              Placement Readiness Program (PRP)
            </h2>
            <p className="text-[#4A6275] leading-relaxed mb-3">
              The Placement Readiness Program (PRP) is a comprehensive, 2-month industry-aligned module aimed at equipping participants with the essential technical and soft skills required for successful employment.
            </p>
            <p className="text-[#4A6275] leading-relaxed mb-10">
              This programme is an integral part of our placement support initiative and includes the following components:
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {PRP_CARDS.map((card) => (
                <div key={card.title} className="card-premium">
                  <div className="text-[#1DE5B5] mb-4">{card.icon}</div>
                  <h3 className="text-[#09263F] font-bold text-lg mb-3">{card.title}</h3>
                  <p className="text-[#4A6275] text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#D6ECEB] rounded-xl px-6 py-4 text-sm text-[#4A6275] mb-4">
              <strong className="text-[#09263F]">Please Note:</strong> Participation in PRP does not guarantee job placement. It is designed to maximise preparedness and improve employability through structured learning and expert-led evaluation.
            </div>
            <p className="text-[#4A6275] text-sm leading-relaxed">
              To earn the certification and begin with PRP, students must successfully complete a series of AI-proctored assessments, including case studies, multiple-choice questions (MCQs), and viva evaluations. Each candidate is allowed two attempts per assessment. These assessments are designed to evaluate your comprehensive understanding. A minimum score of 60% is required in each test and section to pass.
            </p>
          </div>
        </section>

        {/* ── BOTTOM CTA — Standard Block ── */}
        <section className="py-24 bg-[#09263F] text-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1DE5B5_0%,transparent_70%)]" />
          </div>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
            <h2 className="text-white font-bold text-3xl sm:text-5xl mb-4 leading-tight">Ready to Get Started?</h2>
            <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">Talk to our career advisors today and take the first step towards your data career.</p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="tel:9555525908"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-10 py-5 rounded-2xl text-lg transition-all shadow-[0_10px_30px_rgba(29,229,181,0.3)] active:scale-95"
              >
                📞 Call +91 95555 25908
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=919555525908"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-[#F4FAFA] text-[#09263F] font-bold px-10 py-5 rounded-2xl text-lg transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-95"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#06192b] pt-8 pb-32 border-t border-white/5">
          <p className="text-center text-[#4A6275] text-xs">
            © {new Date().getFullYear()} AnalytixLabs. All rights reserved. | NASSCOM-FutureSkills Prime Accredited.
          </p>
        </footer>

        {/* ── UNIVERSAL STICKY BAR ── */}
        <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#D6ECEB] px-4 py-3 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 transform ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <div className="max-w-[1600px] mx-auto w-full flex gap-3">
            <a href="tel:9555525908"
              className="flex-1 flex items-center justify-center py-3 sm:py-4 border border-[#D6ECEB] text-[#09263F] font-bold rounded-xl text-xs sm:text-sm hover:bg-[#F4FAFA] transition-colors bg-white">
              📞 <span className="hidden sm:inline ml-1">Call:</span> 9555525908
            </a>
            <a href="https://api.whatsapp.com/send?phone=919555525908" target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center border border-[#D6ECEB] text-[#09263F] font-bold py-3 sm:py-4 rounded-xl text-xs sm:text-sm hover:bg-[#F4FAFA] transition-colors bg-white">
              💬 <span className="hidden sm:inline ml-1">WhatsApp</span>
            </a>
            <button
              onClick={() => setIsEligibilityOpen(true)}
              className="flex-1 bg-[#1DE5B5] text-[#09263F] font-bold py-3 sm:py-4 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(29,229,181,0.4)]"
            >
              Check Eligibility
            </button>
          </div>
        </div>

        {/* ── MODALS ── */}
        <Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
          <LeadCaptureForm
            title="Check Your Eligibility"
            sourceName="Placement_Page_CheckEligibility"
            typeFilter="PPC_CheckEligibility"
            buttonText="Check Eligibility →"
            thankYouPath="/thankyou-check-your-eligibility"
          />
        </Modal>
      </main>
    </div>
  );
}
