"use client";

import React from "react";
import styles from "./page.module.css";
import { PreviewPane } from "@/preview/PreviewPane";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.backgroundGlow} />

      <nav className={`${styles.nav} animate-fade-in`}>
        <div className={styles.logo}>DESIGN<span>TOOL</span></div>
        <div className={styles.navLinks}>
          <button className={styles.navLink}>Features</button>
          <button className={styles.navLink}>Gallery</button>
          <button className={styles.contactBtn}>Get Started</button>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className="word-animate" style={{ animationDelay: "0.1s" }}>Crafting</span>{" "}
            <span className="word-animate" style={{ animationDelay: "0.2s" }}>the</span>{" "}
            <span className={`${styles.gradientText} word-animate`} style={{ animationDelay: "0.3s" }}>Digital</span><br />
            <span className="word-animate" style={{ animationDelay: "0.4s" }}>Canvas</span>{" "}
            <span className="word-animate" style={{ animationDelay: "0.5s" }}>of</span>{" "}
            <span className="word-animate" style={{ animationDelay: "0.6s" }}>Tomorrow</span>
          </h1>
          <p className={`${styles.subtitle} animate-fade-in`} style={{ animationDelay: "0.8s" }}>
            Empower your creativity with a high-performance design suite built for the next generation of digital artists.
          </p>
          <div className={`${styles.ctaGroup} animate-fade-in`} style={{ animationDelay: "1s" }}>
            <Link href="/workspace">
              <button className={styles.primaryBtn}>Enter Workspace</button>
            </Link>
            <button className={styles.secondaryBtn}>Watch Demo</button>
          </div>
        </div>

        <div className={`${styles.heroVisual} animate-fade-in`} style={{ animationDelay: "1.2s" }}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.dot} style={{ borderColor: "#ef4444" }} />
              <div className={styles.dot} style={{ borderColor: "#eab308" }} />
              <div className={styles.dot} style={{ borderColor: "#22c55e" }} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.skeletonLine} style={{ width: "60%" }} />
              <div className={styles.skeletonLine} style={{ width: "90%" }} />
              <div className={styles.skeletonLine} style={{ width: "40%" }} />
              <div className={styles.visualGrid}>
                <div className={styles.gridItem} />
                <div className={styles.gridItem} />
                <div className={styles.gridItem} />
                <div className={styles.gridItem} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
      <section id="preview-section" className={styles.previewSection}>
        <PreviewPane />
      </section> 
      */}

      <footer className={styles.footer}>
        <p>© 2026 DesignTool. All Rights Reserved.</p>
        <p>Built with Bun & Next.js</p>
      </footer>
    </main>
  );
}
