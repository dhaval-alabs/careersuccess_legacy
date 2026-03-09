import styles from './DetailedCurriculum.module.css';

const tools = [
    { name: 'Python', icon: '🐍' },
    { name: 'SQL', icon: '🗄️' },
    { name: 'NumPy', icon: '🔢' },
    { name: 'Pandas', icon: '🐼' },
    { name: 'Power BI', icon: '📊' },
    { name: 'Excel', icon: '📈' },
    { name: 'Git', icon: '🌿' },
    { name: 'GitHub', icon: '🐙' },
    { name: 'Cloud Computing', icon: '☁️' },
    { name: 'ML Ops', icon: '⚙️' },
];

const modules = [
    { title: 'Data Visualization', desc: 'Master Tableau, PowerBI and advanced Excel reporting.' },
    { title: 'Descriptive Analytics', desc: 'Learn statistical foundations and exploratory data analysis.' },
    { title: 'Predictive Modeling', desc: 'Build regression and classification models from scratch.' },
    { title: 'Machine Learning', desc: 'Deep dive into Supervised and Unsupervised learning algorithms.' },
];

export default function DetailedCurriculum() {
    return (
        <section className={styles.curriculum}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>What You will Master</h2>
                    <p className={styles.subtitle}>A comprehensive task-oriented curriculum designed by industry experts.</p>
                </div>

                <div className={styles.toolGrid}>
                    {tools.map((tool, idx) => (
                        <div key={idx} className={styles.toolItem}>
                            <span className={styles.toolIcon}>{tool.icon}</span>
                            <span className={styles.toolName}>{tool.name}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.moduleGrid}>
                    {modules.map((module, idx) => (
                        <div key={idx} className={`${styles.moduleCard} card`}>
                            <h3 className={styles.moduleTitle}>{module.title}</h3>
                            <p className={styles.moduleDesc}>{module.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
