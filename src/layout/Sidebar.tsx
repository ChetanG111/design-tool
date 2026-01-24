"use client";

import React from 'react';
import styles from './Sidebar.module.css';
import { STEPS } from '@/routes/config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ICON_MAP: Record<string, string> = {
    'project': 'solar:folder-with-files-linear',
    'assets': 'solar:gallery-linear',
    'canvas': 'solar:palette-linear',
    'effects': 'solar:magic-stick-3-linear',
    'export': 'solar:cloud-upload-linear',
};

export const Sidebar: React.FC = () => {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span className={styles.logoText}>Design<span className={styles.logoDot}>.</span></span>
            </div>

            <div className={styles.sectionLabel}>Workflow</div>

            <nav className={styles.nav}>
                {STEPS.map((step) => {
                    const href = `/workspace/${step.id}`;
                    const isActive = pathname.startsWith(href);
                    const icon = ICON_MAP[step.id] || 'solar:question-square-linear';

                    return (
                        <Link
                            key={step.id}
                            href={href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <div className={styles.iconWrapper}>
                                <iconify-icon icon={icon} width="22" stroke-width="1.2" />
                            </div>
                            <span className={styles.label}>{step.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>JD</div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>John Doe</p>
                        <p className={styles.userRole}>Pro Archiver</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
