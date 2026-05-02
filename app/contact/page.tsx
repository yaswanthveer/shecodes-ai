"use client";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* MINIMAL NAVBAR */}
      <nav style={{ padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
        <Link href="/" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.04em", textDecoration: "none", color: "var(--text-primary)" }}>Her.</Link>
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
          <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</Link>
          <Link href="/blog" style={{ textDecoration: "none", color: "inherit" }}>Stories</Link>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>Sign In</Link>
        </div>
      </nav>

      <section style={{ paddingTop: 80, paddingBottom: 100, maxWidth: 600, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
        <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 16 }}>Contact Us</h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 48 }}>We&apos;re here to help you navigate your comeback.</p>

        {submitted ? (
          <div className="card" style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>💌</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Message received.</h2>
            <p style={{ color: "var(--text-secondary)" }}>We will get back to you within 24 hours.</p>
          </div>
        ) : (
          <div className="card" style={{ background: "var(--bg-secondary)", border: "none" }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>Email Address</label>
              <input type="email" className="input-field" placeholder="you@example.com" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>Message</label>
              <textarea className="input-field" placeholder="How can we help?" rows={5} style={{ resize: "vertical" }} />
            </div>
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => setSubmitted(true)}>Send Message</button>
          </div>
        )}
      </section>
    </div>
  );
}
