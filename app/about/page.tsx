"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* MINIMAL NAVBAR */}
      <nav style={{ padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
        <Link href="/" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.04em", textDecoration: "none", color: "var(--text-primary)" }}>SheCodes.AI</Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
          <Link href="/about" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 600 }}>About</Link>
          <Link href="/blog" style={{ textDecoration: "none", color: "inherit" }}>Stories</Link>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>Sign In</Link>
        </div>
      </nav>

      <section style={{ paddingTop: 100, paddingBottom: 100, maxWidth: 800, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <div className="badge" style={{ marginBottom: 24 }}>Our Mission</div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 40 }}>
          Technology should serve mothers, not distract them.
        </h1>
        
        <div style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 24 }}>
          <p>
            When we built SheCodes.AI, we looked at the landscape of tools available to mothers. We found endless trackers that caused anxiety, social feeds that induced guilt, and a total lack of tools to help women rebuild their professional identities.
          </p>
          <p>
            We decided to change that. By integrating IBM watsonx and IBM Cloudant, we built a private, intelligent ecosystem. A place where you can safely brain-dump your exhaustion, where an AI can read your 3-year career gap and write a stunning resume summary, and where your data actually belongs to you.
          </p>
        </div>

        <div style={{ marginTop: 60, paddingTop: 60, borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>The Stack</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card" style={{ background: "var(--bg-secondary)" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>IBM watsonx</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>Enterprise AI for analyzing journals, reframing resumes, and generating recipes securely.</div>
            </div>
            <div className="card" style={{ background: "var(--bg-secondary)" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>IBM Cloudant</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>NoSQL Database for saving all user assessments and journals reliably.</div>
            </div>
            <div className="card" style={{ background: "var(--bg-secondary)" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Next.js 15</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>The React framework powering this minimal, fast user interface.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
