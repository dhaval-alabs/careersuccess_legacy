import styles from './Hero.module.css';
import Image from 'next/image';
import LeadCaptureForm from './forms/LeadCaptureForm';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={`${styles.content} reveal`}>
                        <div className="badge-news">
                            <span>New</span> Batch Starting Next Week!
                        </div>

                        <h1 className={styles.title}>
                            Certification <br /> Course In <br />
                            <span className={styles.highlight}>Data Science</span>
                        </h1>

                        <div className={styles.socialProof}>
                            <div className={styles.avatarGroup}>
                                <div className={styles.avatar}>👤</div>
                                <div className={styles.avatar}>👤</div>
                                <div className={styles.avatar}>👤</div>
                                <div className={styles.avatarMore}>+50k</div>
                            </div>
                            <p>Joined by 50,000+ Students Worldwide</p>
                        </div>

                        <p className={styles.subtitle}>
                            An extensive industry-relevant Data Science course with
                            <strong> Placement Assistance!</strong> Master the skills that position you correctly in the modern workspace.
                        </p>

                        <div className={styles.features}>
                            {[
                                '180+ Hours of Live Training',
                                '43+ Real-world Projects',
                                'NASSCOM Recognized Certification'
                            ].map((feature, i) => (
                                <div key={i} className={styles.featureItem}>
                                    <div className={styles.featureIcon}>✓</div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <button className="btn-primary">Talk to our Learning Advisor</button>
                        </div>
                    </div>

                    <div className={`${styles.visual} reveal`}>
                        <div className={styles.formContainer}>
                            <LeadCaptureForm />
                        </div>

                        <div className={`${styles.floatingCard} animate-float`}>
                            <div className={styles.cardIcon}>📊</div>
                            <div className={styles.cardContent}>
                                <h4>50,000+</h4>
                                <p>Successful Alumni</p>
                            </div>
                        </div>

                        <div className={`${styles.statusCard} animate-float`} style={{ animationDelay: '1s' }}>
                            <div className={styles.statusDot}></div>
                            <div className={styles.statusContent}>
                                <h4>Placement Active</h4>
                                <p>150+ Openings Today</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
