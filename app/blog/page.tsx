"use client";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* MINIMAL NAVBAR */}
      <nav style={{ padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
        <Link href="/" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.04em", textDecoration: "none", color: "var(--text-primary)" }}>SheCodes.AI</Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
          <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</Link>
          <Link href="/blog" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 600 }}>Stories</Link>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>Sign In</Link>
        </div>
      </nav>

      <section style={{ paddingTop: 80, paddingBottom: 100, maxWidth: 1000, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 16 }}>Stories & Guides</h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 48 }}>Insights on motherhood, career, and mental health.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {[
            { tag: "Career", title: "Translating Motherhood into Leadership Skills", desc: "How to use IBM watsonx to reframe your career gap into a powerful asset." },
            { tag: "Mental Health", title: "The Invisible Mental Load", desc: "Why tracking less might actually help you feel more in control." },
            { tag: "Technology", title: "Why We Chose IBM Cloudant", desc: "Building a secure platform for mothers means taking data privacy seriously." }
          ].map(post => (
            <div key={post.title} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: 40 }}>
              <div className="badge" style={{ marginBottom: 16 }}>{post.tag}</div>
              <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, letterSpacing: "-0.02em" }}>{post.title}</h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>{post.desc}</p>
              <button className="btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>Read Article</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
