"use client";

import React, { useState } from "react";
import styles from "./PreviewPane.module.css";
import { OutputModal } from "./OutputModal";
import { useDesign } from "@/context/DesignContext";

export const PreviewPane: React.FC = () => {
    const { state } = useDesign();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const placeholderHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Design</title>
    <style>
        body {
            background-color: #050505;
            color: white;
            font-family: 'Instrument Serif', serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
        }
        h1 {
            color: ${state.accentColor};
            font-size: 3rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>${state.intent || 'Project'}</h1>
        <p>Accent Color: ${state.accentColor}</p>
        <p>Navbar: ${state.navbarStyle}</p>
    </div>
</body>
</html>`;

    return (
        <div className={styles.previewContainer}>
            <header className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>Preview</h2>
                <button
                    className={styles.generateBtn}
                    onClick={() => setIsModalOpen(true)}
                >
                    Deploy
                </button>
            </header>

            <div className={styles.previewArea}>
                <div className={styles.canvasWrapper}>
                    <div className={styles.placeholderDesign}>
                        <h3 className={styles.placeholderTitle} style={{ color: state.accentColor }}>
                            {state.intent ? state.intent.charAt(0).toUpperCase() + state.intent.slice(1) : 'Concept'}
                        </h3>
                        <p className={styles.placeholderText}>
                            Automated layout generation using <strong>{state.navbarStyle || 'default'}</strong> logic.
                        </p>
                    </div>
                </div>

                <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Intent</span>
                        <span className={styles.metaValue}>{state.intent || 'Not set'}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Accent</span>
                        <span className={styles.metaValue} style={{ color: state.accentColor }}>{state.accentColor}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Navigation</span>
                        <span className={styles.metaValue}>{state.navbarStyle || 'Not set'}</span>
                    </div>
                </div>
            </div>

            <OutputModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                htmlContent={placeholderHtml}
            />
        </div>
    );
};
