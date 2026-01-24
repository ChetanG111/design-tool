'use client';

import React from 'react';
import styles from './steps.module.css';
import { useDesign } from '@/context/DesignContext';

const COLORS = [
    { id: 'white', value: '#ffffff', label: 'Pure White' },
    { id: 'blue', value: '#00ccff', label: 'Electric Blue' },
    { id: 'pink', value: '#ff007a', label: 'Hot Pink' },
    { id: 'purple', value: '#9d00ff', label: 'Vivid Purple' },
    { id: 'orange', value: '#ff5c00', label: 'Cyber Orange' },
];

export default function AccentColorStep() {
    const { state, updateState } = useDesign();
    const selected = COLORS.find(c => c.value === state.accentColor)?.id || 'white';
    const setSelected = (id: string) => {
        const color = COLORS.find(c => c.id === id);
        if (color) updateState({ accentColor: color.value });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.label}>Phase 02</div>
                <h2 className={styles.title}>
                    <span className="word-animate" style={{ animationDelay: '0.3s' }}>Visual</span><span className={`${styles.titleItalic} word-animate`} style={{ animationDelay: '0.4s' }}>Tone.</span>
                </h2>
                <p className={styles.subtitle}>
                    Determine the chromatic signature of your interface. High-contrast pairings recommended for SaaS.
                </p>
            </div>

            <div className={styles.colorGrid}>
                {COLORS.map((color) => (
                    <div
                        key={color.id}
                        className={`${styles.colorItem} ${selected === color.id ? styles.colorSelected : ''}`}
                        onClick={() => setSelected(color.id)}
                    >
                        <div
                            className={styles.colorCircle}
                            style={{ backgroundColor: color.value }}
                        />
                        <span className={styles.colorName}>{color.id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
