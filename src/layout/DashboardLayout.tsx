"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { PreviewPane } from '@/preview/PreviewPane';
import styles from './DashboardLayout.module.css';
import { usePathname } from 'next/navigation';
import { STEPS } from '@/routes/config';

interface DashboardLayoutProps {
    children: React.ReactNode;
}


export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const currentStepId = pathname.split('/').pop();
    const currentStep = STEPS.find(s => s.id === currentStepId);

    return (
        <div className={styles.container}>
            <div className={styles.decoration} />
            <Sidebar />

            <div className={styles.mainWrapper}>
                <header className={styles.topBar}>
                    <div className={styles.breadcrumbs}>
                        <span>Workspace</span>
                        <iconify-icon icon="solar:alt-arrow-right-linear" width="12" />
                        <span className={styles.breadcrumbActive}>{currentStep?.label || 'Project'}</span>
                    </div>

                    <div className={styles.topBarActions}>
                        <div className={styles.searchWrapper}>
                            <iconify-icon icon="solar:magnifer-linear" class={styles.searchIcon} width="16" />
                            <input
                                type="text"
                                placeholder="Search workspace..."
                                className={styles.searchInput}
                            />
                        </div>
                        <button className="text-zinc-500 hover:text-white transition-colors">
                            <iconify-icon icon="solar:bell-linear" width="20" />
                        </button>
                    </div>
                </header>

                <div className={styles.contentArea}>
                    <main className={styles.mainContent}>
                        <div className={styles.contentInner}>
                            {children}
                        </div>
                    </main>

                    <aside className={styles.previewSidebar}>
                        <PreviewPane />
                    </aside>
                </div>

                <footer className={styles.statusBar}>
                    <div className={styles.statusOnline}>
                        <span className={styles.statusIndicator} />
                        <span>System Online</span>
                    </div>
                    <div>
                        <span>v1.0.0-archive</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};
