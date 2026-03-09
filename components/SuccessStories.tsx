import styles from './SuccessStories.module.css';
import Image from 'next/image';

const stories = [
    {
        name: 'Akshay Mathur',
        role: 'Senior Data Analyst',
        company: 'Microsoft',
        img: 'https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Akshay.webp'
    },
    {
        name: 'Shreya Khullar',
        role: 'Data Scientist',
        company: 'Accenture',
        img: 'https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/shreya_khullar_11zon.webp'
    },
    {
        name: 'Shubhi Agarwal',
        role: 'Business Analyst',
        company: 'Deloitte',
        img: 'https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/10/Shubhi_Agarwal-1-2_11zon-1.webp'
    }
];

export default function SuccessStories() {
    return (
        <section className="section-light">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Join Our Hall of Fame</h2>
                    <p className={styles.subtitle}>50,000+ Alumni have transformed their careers. See their journeys.</p>
                </div>

                <div className={styles.grid}>
                    {stories.map((story, idx) => (
                        <div key={idx} className={styles.storyCard}>
                            <div className={styles.imgWrapper}>
                                <Image
                                    src={story.img}
                                    alt={story.name}
                                    width={400}
                                    height={300}
                                    className={styles.img}
                                />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.name}>{story.name}</h3>
                                <p className={styles.role}>{story.role}</p>
                                <div className={styles.companyBadge}>{story.company}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.ctaWrapper}>
                    <button className="btn-primary">View All Success Stories</button>
                </div>
            </div>
        </section>
    );
}
