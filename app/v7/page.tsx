'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import CourseOverview from '../../components/CourseOverview';
import TrustBadgeSection from '../../components/TrustBadgeSection';
import DetailedCurriculum from '../../components/DetailedCurriculum';
import SuccessStories from '../../components/SuccessStories';
import StickyContact from '../../components/StickyContact';
import StatsAccent from '../../components/StatsAccent';
import Modal from '../../components/Modal';
import LeadCaptureForm from '../../components/forms/LeadCaptureForm';
import FAQ from '../../components/FAQ';
import styles from './page.module.css';
import Image from 'next/image';

export default function Home() {
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <div id="overview">
        <CourseOverview onOpenEligibility={() => setIsEligibilityOpen(true)} />
      </div>
      <StatsAccent />
      <StickyContact />
      <TrustBadgeSection onOpenBrochure={() => setIsBrochureOpen(true)} />

      <section className={styles.introSection}>
        <div className="container">
          <div className={`${styles.introBox} reveal`}>
            <h2 className={styles.introTitle}>Ready for a Rewarding Career?</h2>
            <p className={styles.introText}>
              Launch your career in Data Science with India's most trusted training partner.
              Our task-oriented approach ensures you aren't just learning—you're building.
            </p>
          </div>
        </div>
      </section>

      <div id="curriculum">
        <DetailedCurriculum />
      </div>
      <SuccessStories />

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={`${styles.ctaBox} reveal`}>
            <h2 className={styles.ctaTitle}>Accelerate Your Career <br /> <span style={{ color: 'var(--brand-green)' }}>With Data Science</span></h2>
            <p className={styles.ctaText}>
              Join 50,000+ alumni who have transformed their careers with our NASSCOM recognized certification.
              Save up to 40% on specialization tracks today.
            </p>
            <div className={styles.ctaActions}>
              <button className="btn-primary">Speak to an Advisor</button>
              <button className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>Check Eligibility</button>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <Image
              src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp"
              alt="AnalytixLabs"
              width={150}
              height={33}
            />
            <p>&copy; 2026 alabs-lp | Powered by AnalytixLabs Content & Design.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal isOpen={isEligibilityOpen} onClose={() => setIsEligibilityOpen(false)}>
        <LeadCaptureForm
          title="Check Your Eligibility"
          sourceName="PPC_CheckEligibility"
          buttonText="Check Eligibility Now"
        />
      </Modal>

      <Modal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)}>
        <LeadCaptureForm
          title="Download Brochure"
          sourceName="PPC_downloadBrochure"
          buttonText="Download Now"
        />
      </Modal>
    </main>
  );
}

