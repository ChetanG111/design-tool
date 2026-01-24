'use client';

import React from 'react';
import styles from './steps.module.css';
import { useDesign } from '@/context/DesignContext';

const OPTIONS = [
    { id: 'floating', label: 'Floating', description: 'Island style layout with high spatial depth.', class: styles.floatingNav },
    { id: 'sticky', label: 'Sticky', description: 'Persistent full-width navigation at the viewport top.', class: styles.stickyNav },
    { id: 'centered', label: 'Centered', description: 'Minimalist orb-based menu for focused exploration.', class: styles.centeredNav },
];

export default function NavbarPreferenceStep() {
    const { state, updateState } = useDesign();
    const selected = state.navbarStyle;
    const setSelected = (id: string) => updateState({ navbarStyle: id });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.label}>Phase 03</div>
                <h2 className={styles.title}>
                    <span className="word-animate" style={{ animationDelay: '0.3s' }}>Spatial</span><span className={`${styles.titleItalic} word-animate`} style={{ animationDelay: '0.4s' }}>Flow.</span>
                </h2>
                <p className={styles.subtitle}>
                    Choose a navigational metaphor. This affects the overall hierarchy and information density.
                </p>
            </div>

            <div className={styles.grid}>
                {OPTIONS.map((opt) => (
                    <button
                        key={opt.id}
                        className={`${styles.card} ${selected === opt.id ? styles.cardSelected : ''}`}
                        onClick={() => setSelected(opt.id)}
                    >
                        <div className={styles.navbarPreview}>
                            <div className={opt.class} />
                        </div>
                        <div className={styles.cardContent}>
                            <span className={styles.cardTitle}>{opt.label}</span>
                            <span className={styles.cardDescription}>{opt.description}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
