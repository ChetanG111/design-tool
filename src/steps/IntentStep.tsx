'use client';

import React from 'react';
import styles from './steps.module.css';
import { useDesign } from '@/context/DesignContext';

const INTENTS = [
    {
        id: 'saas',
        label: 'SaaS Platform',
        icon: 'solar:widget-linear',
        description: 'Scalable interfaces for digital products and services.'
    },
    {
        id: 'portfolio',
        label: 'Portfolio',
        icon: 'solar:palette-linear',
        description: 'Showcasing creative energy and professional depth.'
    },
    {
        id: 'ecommerce',
        label: 'E-commerce',
        icon: 'solar:bag-linear',
        description: 'Conversion-driven layouts for modern retail.'
    },
    {
        id: 'blog',
        label: 'Media & Blog',
        icon: 'solar:pen-new-square-linear',
        description: 'Refined typography for long-form reading experiences.'
    },
];

export default function IntentStep() {
    const { state, updateState } = useDesign();
    const selected = state.intent;
    const setSelected = (id: string) => updateState({ intent: id });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.label}>Phase 01</div>
                <h2 className={styles.title}>
                    <span className="word-animate" style={{ animationDelay: '0.3s' }}>What</span><span className="word-animate" style={{ animationDelay: '0.4s' }}>is</span><span className="word-animate" style={{ animationDelay: '0.5s' }}>the</span><span className={`${styles.titleItalic} word-animate`} style={{ animationDelay: '0.6s' }}>Intent?</span>
                </h2>
                <p className={styles.subtitle}>
                    Define the foundational logic of your interface to determine layout density and motion curves.
                </p>
            </div>

            <div className={styles.grid}>
                {INTENTS.map((intent) => (
                    <button
                        key={intent.id}
                        className={`${styles.card} ${selected === intent.id ? styles.cardSelected : ''}`}
                        onClick={() => setSelected(intent.id)}
                    >
                        <div className={styles.cardIconWrapper}>
                            <iconify-icon icon={intent.icon} width="24" />
                        </div>
                        <div className={styles.cardContent}>
                            <span className={styles.cardTitle}>{intent.label}</span>
                            <span className={styles.cardDescription}>{intent.description}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
