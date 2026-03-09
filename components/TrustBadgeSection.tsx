import styles from './TrustBadgeSection.module.css';
import Image from 'next/image';

interface TrustBadgeSectionProps {
    onOpenBrochure: () => void;
}

export default function TrustBadgeSection({ onOpenBrochure }: TrustBadgeSectionProps) {
    return (
        <section className={styles.trustSection}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.textSide}>
                        <h2 className={styles.title}>Industry Recognized <br /> & Government Backed</h2>
                        <p className={styles.description}>
                            Earn direct certification from NASSCOM FutureSkills Prime and AnalytixLabs.
                            Our program is aligned with the National Occupational Standards to ensure
                            you are ready for global industry requirements.
                        </p>
                        <ul className={styles.benefits}>
                            <li>✓ Job Guarantee (Specific Tracks)</li>
                            <li>✓ 50% Fee Refund Assurance</li>
                            <li>✓ Minimum Package Assurance</li>
                        </ul>
                        <div style={{ marginTop: '3rem' }}>
                            <button className="btn-primary" onClick={onOpenBrochure}>Download Brochure 📥</button>
                        </div>
                    </div>

                    <div className={styles.badgeSide}>
                        <div className={styles.badgeCard}>
                            <Image
                                src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Nasscom-Certification-1024x724-1-300x212.jpg"
                                alt="NASSCOM Certification"
                                width={254}
                                height={180}
                                style={{ height: '180px', width: 'auto' }}
                                className={styles.badgeImg}
                            />
                            <p className={styles.badgeLabel}>NASSCOM FutureSkills Prime</p>
                        </div>
                        <div className={styles.badgeCard}>
                            <Image
                                src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Alabs_DS-Advanced-Certification-in-Data-Science-AI-300x212.jpg"
                                alt="AnalytixLabs Certification"
                                width={254}
                                height={180}
                                style={{ height: '180px', width: 'auto' }}
                                className={styles.badgeImg}
                            />
                            <p className={styles.badgeLabel}>AnalytixLabs Advanced Certificate</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
