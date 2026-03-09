import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.logo}>
                        <Image
                            src="https://careersuccess.analytixlabs.co.in/wp-content/uploads/2025/03/analytixlabs-logo.webp"
                            alt="AnalytixLabs"
                            width={180}
                            height={40}
                            priority
                            style={{ height: '40px', width: 'auto' }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
