import styles from './Benefits.module.css';

const benefits = [
    {
        title: 'Industry Immersion',
        description: 'Work on 15+ real-world projects curated by data scientists from top tech firms.',
        icon: '🚀'
    },
    {
        title: 'Placement Support',
        description: 'Dedicated career coaching, resume workshops, and exclusive hiring partner network.',
        icon: '💼'
    },
    {
        title: 'Flexible Learning',
        description: 'Choose between weekend classroom sessions or live online training with lifetime access.',
        icon: '🎓'
    },
    {
        title: 'Mentorship',
        description: 'Get direct feedback and 1-on-1 sessions with seasoned industry experts.',
        icon: '👥'
    },
    {
        title: 'Advanced Curriculum',
        description: 'Master Python, SQL, Machine Learning, and GenAI in one comprehensive track.',
        icon: '📑'
    },
    {
        title: 'Global Certification',
        description: 'NASSCOM recognized and MeitY backed certification respected worldwide.',
        icon: '🌍'
    }
];

export default function Benefits() {
    return (
        <section className={styles.benefits}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Why Choose Our Specialization?</h2>
                    <p className={styles.subtitle}>Designed to bridge the gap between academic knowledge and industry demands.</p>
                </div>

                <div className={styles.grid}>
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className={`${styles.card} glass`}>
                            <div className={styles.icon}>{benefit.icon}</div>
                            <h3 className={styles.cardTitle}>{benefit.title}</h3>
                            <p className={styles.cardDescription}>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
