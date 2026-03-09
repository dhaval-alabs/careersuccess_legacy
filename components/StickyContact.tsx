"use client";

import { useState, useEffect } from 'react';
import styles from './StickyContact.module.css';

export default function StickyContact() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={styles.stickyBar}>
            <div className={styles.container}>
                <div className={styles.contactItem}>
                    <span className={styles.icon}>📞</span>
                    <a href="tel:+919555525908" className={styles.link}>+91 9555525908</a>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.contactItem}>
                    <span className={styles.icon}>💬</span>
                    <a href="https://wa.me/919555525908" className={styles.link}>Chat on WhatsApp</a>
                </div>
                <button className={styles.ctaBtn}>Request a Call Back</button>
            </div>
        </div>
    );
}

