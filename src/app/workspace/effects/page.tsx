import React from 'react';
import styles from '@/steps/steps.module.css';

export default function EffectsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.label}>Phase 04</div>
                <h2 className={styles.title}>
                    <span className="word-animate" style={{ animationDelay: '0.3s' }}>Optical</span><span className={`${styles.titleItalic} word-animate`} style={{ animationDelay: '0.4s' }}>Finesse.</span>
                </h2>
                <p className={styles.subtitle}>
                    Apply microscopic visual logic, shaders, and post-processing to elevate the sensory experience.
                </p>
            </div>

            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <p className={styles.cardDescription}>
                        Advanced effect configurations will be unlocked based on your selected Intent and Tone.
                    </p>
                </div>
            </div>
        </div>
    );
}
