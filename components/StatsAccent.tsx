import styles from './StatsAccent.module.css';

const stats = [
    { value: '50K+', label: 'Learning Community' },
    { value: '43+', label: 'Industry Case Studies' },
    { value: '180+', label: 'Live Training Hours' },
    { value: '100%', label: 'Placement Support' }
];

export default function StatsAccent() {
    return (
        <section className={styles.statsAccent}>
            <div className="container">
                <div className={styles.grid}>
                    {stats.map((stat, idx) => (
                        <div key={idx} className={styles.statItem}>
                            <h3 className={styles.value}>{stat.value}</h3>
                            <p className={styles.label}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="squiggly-bg" style={{ height: '20px', opacity: 0.1, marginTop: '2rem' }}></div>
        </section>
    );
}
