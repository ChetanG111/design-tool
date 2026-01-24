"use client";

import React from "react";
import styles from "./OutputModal.module.css";

interface OutputModalProps {
    isOpen: boolean;
    onClose: () => void;
    htmlContent: string;
}

export const OutputModal: React.FC<OutputModalProps> = ({ isOpen, onClose, htmlContent }) => {
    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(htmlContent);
        alert("Copied to clipboard!");
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} glass`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Generated HTML</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <textarea
                    className={styles.outputTextarea}
                    readOnly
                    value={htmlContent}
                />

                <div className={styles.modalActions}>
                    <button className={styles.copyBtn} onClick={copyToClipboard}>
                        Copy Code
                    </button>
                    <button className={styles.copyBtn} style={{ background: 'var(--accent)', color: '#000' }} onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
