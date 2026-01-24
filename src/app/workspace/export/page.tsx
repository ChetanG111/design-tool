import React from 'react';
import styles from '@/steps/steps.module.css';

export default function ExportPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.label}>Phase 05</div>
                <h2 className={styles.title}>
                    <span className="word-animate" style={{ animationDelay: '0.3s' }}>Final</span><span className={`${styles.titleItalic} word-animate`} style={{ animationDelay: '0.4s' }}>Deployment.</span>
                </h2>
                <p className={styles.subtitle}>
                    Consolidate architectural assets and compile the final interface for production delivery.
                </p>
            </div>

            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <p className={styles.cardDescription}>
                        Ready to generate the final source code. All assets and configurations are validated.
                    </p>
                </div>
            </div>
        </div>
    );
}
