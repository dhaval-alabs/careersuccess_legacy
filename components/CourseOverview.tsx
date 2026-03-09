import styles from './CourseOverview.module.css';

const overviewStats = [
    {
        icon: '📈',
        title: 'Predictive Modeling',
        description: 'Master advanced statistics and forecasting techniques.'
    },
    {
        icon: '🤖',
        title: 'Machine Learning',
        description: 'Deep dive into supervised and unsupervised learning algorithms.'
    },
    {
        icon: '🏗️',
        title: 'Industry Projects',
        description: 'Work on 43+ real-world assignments curated by experts.'
    },
    {
        icon: '📜',
        title: 'NASSCOM Certified',
        description: 'Get industry-recognized certification backed by MeitY.'
    }
];

interface CourseOverviewProps {
    onOpenEligibility: () => void;
}

export default function CourseOverview({ onOpenEligibility }: CourseOverviewProps) {
    return (
        <section className={styles.overview}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>
                        Move Beyond Traditional Learning With <br />
                        <span className={styles.accentText}>Advanced Data Science</span>
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Our program is designed to bridge the gap between academic theory and high-demand industry skills.
                    </p>
                </div>

                <div className={styles.statsGrid}>
                    {overviewStats.map((stat, idx) => (
                        <div key={idx} className={styles.statCard}>
                            <div className={styles.icon}>{stat.icon}</div>
                            <h3 className={styles.statTitle}>{stat.title}</h3>
                            <p className={styles.statDescription}>{stat.description}</p>
                            <div className={styles.arrow}>→</div>
                        </div>
                    ))}
                </div>

                <div className={styles.content}>
                    <p>
                        Data Science is one of the fastest-growing domains among digital technologies. Companies are ramping up to leverage data-driven decisions with a huge shift towards digital transformation. For this, they are always looking for skilled data scientists to join this new demanding workspace. Master data science skills by learning the theory, and practice with our Data Science Certification program.
                    </p>
                    <p>
                        We bring to you a powerful pedagogy of world-class experts to help you learn and adapt to the ever-evolving world of data science. We combine learning tools alongside a hands-on approach to make you industry-ready. This data science course in India helps you furnish your knowledge from basics to advanced techniques. Learn the vital skills that will help you position yourself as a Data Scientist. Enroll in this Data Science Certificate course to develop comprehensive data science skills on data visualization descriptive analytics and predictive modeling along with Machine learning for driving smart business decisions.
                    </p>
                    <div className={styles.locationInfo}>
                        <p>
                            In addition to online, you can also choose classroom or bootcamp training options if you're seeking a <span className={styles.locationLink}>Data Science Course in Gurgaon, Bangalore, or Noida</span>.
                        </p>
                        <p>
                            This top-rated program, recognized by leading publications, offers prestigious certifications from the <strong>NASSCOM FutureSkills Prime</strong>—further strengthening your job prospects.
                        </p>
                        <p>
                            Also, our data science course fees and duration are aligned with the top industry standards, ensuring both quality and value for your investment.
                        </p>
                    </div>
                    <p>
                        Data Science course online modules of learning ensure that you learn at a pace that is comfortable for you. You can opt for blended learning which is a hybrid of classroom and online study.
                    </p>
                </div>
                <div className={styles.ctaWrapper} style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button
                        className="btn-primary"
                        onClick={onOpenEligibility}
                        style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}
                    >
                        Check Your Eligibility ↗
                    </button>
                    <p style={{ marginTop: '1.5rem', color: '#718096', fontWeight: 600 }}>* No prior coding experience required.</p>
                </div>
            </div>
        </section>
    );
}
