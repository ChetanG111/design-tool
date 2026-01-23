"use client";

import React from "react";
import styles from "./page.module.css";

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
        <div className={`${styles.heroContent} animate-fade-in`}>
          <h1 className={styles.title}>
            Crafting the <span className={styles.gradientText}>Digital</span><br />
            Canvas of Tomorrow
          </h1>
          <p className={styles.subtitle}>
            Empower your creativity with a high-performance design suite built for the next generation of digital artists.
          </p>
          <div className={styles.ctaGroup}>
            <button className={styles.primaryBtn}>Enter Workspace</button>
            <button className={styles.secondaryBtn}>Watch Demo</button>
          </div>
        </div>

        <div className={`${styles.heroVisual} animate-float animate-fade-in`}>
          <div className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
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

      <footer className={styles.footer}>
        <p>© 2026 DesignTool. Powered by Bun & Next.js</p>
      </footer>
    </main>
  );
}
