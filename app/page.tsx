"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const lifeChapters = [
  { id: "new-mum", label: "New Mum", emoji: "👶", desc: "0-12 months postpartum" },
  { id: "toddler", label: "Toddler Years", emoji: "🧸", desc: "Managing chaos beautifully" },
  { id: "career", label: "Career Returner", emoji: "💼", desc: "Ready to rebuild" },
  { id: "working", label: "Working Mum", emoji: "⚡", desc: "Balancing it all" },
];

const lifeOSModules = [
  { title: "Health Tracker", desc: "AI monitors your sleep, hydration, and burnout levels — giving daily micro-actions.", icon: "💊", link: "/health", color: "#E8B4B8" },
  { title: "Mind & Journal", desc: "Write freely. IBM watsonx reflects back patterns you can't see yourself.", icon: "🧠", link: "/mind", color: "#C9A0DC" },
  { title: "Career Comeback", desc: "AI rebuilds your resume, coaches interviews, reframes your gap as strength.", icon: "🚀", link: "/work", color: "#DEB887" },
  { title: "Kitchen AI", desc: "Tell it what's in your fridge. Get a nutritionist-approved meal in seconds.", icon: "🥗", link: "/nourish", color: "#A8C5A0" },
  { title: "Relationships", desc: "AI rewrites your frustrated messages into healthy communication.", icon: "💜", link: "/relationships", color: "#B8A9D4" },
  { title: "Community", desc: "Connect with mothers on the exact same path. AI moderates with empathy.", icon: "👩‍👩‍👧", link: "/community", color: "#7BA7CC" },
];



const demoChat = [
  { role: "ai" as const, text: "Good morning, Priya! I noticed your sleep has been under 5 hours for 3 days. Let's address that today. 💜" },
  { role: "user" as const, text: "I know... the baby keeps waking up and I can't fall back asleep after." },
  { role: "ai" as const, text: "That's so common and completely valid. Here's what I'd suggest: try a 20-min power nap between 1-3pm when the baby naps. Also, tonight try the 4-7-8 breathing technique before bed. Your body needs this — you deserve rest too." },
  { role: "user" as const, text: "What about my resume? I have an interview next week." },
  { role: "ai" as const, text: "Let's prepare! I've already reframed your 2-year gap as 'Strategic Family Leadership.' Want me to run a mock interview right now? I'll coach you through the tough questions. 🚀" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState("career");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [counter, setCounter] = useState(12400);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        background: scrolled ? "var(--bg-glass-strong)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-color)" : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent-rose)" }}>SheCodes.AI</div>
        <div style={{ display: "flex", gap: 28, alignItems: "center", fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
          {["Home", "Assess", "Dashboard", "Community"].map((item) => (
            <Link key={item} href={item === "Home" ? "/" : item === "Assess" ? "/assessment" : `/${item.toLowerCase()}`} style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }}>{item}</Link>
          ))}
          <Link href="/assessment" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>Start Free</Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero-bg" style={{ paddingTop: 140, paddingBottom: 100, textAlign: "center", position: "relative" }}>
        {/* Particles - using deterministic values to avoid hydration mismatch */}
        {[
          { left: 10, top: 20, delay: 0, size: 4 },
          { left: 25, top: 60, delay: 1, size: 5 },
          { left: 40, top: 15, delay: 2, size: 3 },
          { left: 55, top: 75, delay: 0.5, size: 6 },
          { left: 70, top: 30, delay: 1.5, size: 4 },
          { left: 85, top: 50, delay: 2.5, size: 5 },
          { left: 15, top: 80, delay: 3, size: 3 },
          { left: 30, top: 40, delay: 3.5, size: 7 },
          { left: 45, top: 90, delay: 4, size: 4 },
          { left: 60, top: 10, delay: 4.5, size: 5 },
          { left: 75, top: 65, delay: 0.8, size: 6 },
          { left: 90, top: 25, delay: 1.8, size: 3 },
          { left: 20, top: 55, delay: 2.8, size: 4 },
          { left: 35, top: 85, delay: 3.8, size: 5 },
          { left: 50, top: 35, delay: 1.2, size: 7 },
          { left: 65, top: 70, delay: 2.2, size: 4 },
          { left: 80, top: 45, delay: 3.2, size: 5 },
          { left: 12, top: 95, delay: 4.2, size: 6 },
          { left: 48, top: 5, delay: 0.3, size: 3 },
          { left: 82, top: 88, delay: 1.3, size: 4 },
        ].map((particle, i) => (
          <div key={i} className="particle" style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="badge" style={{ marginBottom: 24, animation: "fadeIn 0.8s ease-out" }}>
            ✦ Powered by IBM watsonx AI
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: 24,
            animation: "fadeInUp 0.8s ease-out"
          }}>
            <span style={{ color: "var(--text-tertiary)" }}>You paused for others.</span>
            <br />
            Now it&apos;s your turn.
          </h1>

          <p style={{
            fontSize: 19,
            color: "var(--text-secondary)",
            maxWidth: 650,
            margin: "0 auto",
            lineHeight: 1.6,
            marginBottom: 40,
            animation: "fadeInUp 0.8s ease-out 0.2s both"
          }}>
            Your AI-powered life companion for health, confidence, career comeback, and personal growth. Built for every woman becoming again.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeInUp 0.8s ease-out 0.4s both" }}>
            <Link href="/assessment" className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>Start Your Comeback</Link>
            <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 16, padding: "16px 36px" }}>Explore Your Journey</Link>
            <Link href="/community" className="btn-secondary" style={{ fontSize: 16, padding: "16px 36px" }}>Join Community</Link>
          </div>

          <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, animation: "fadeIn 1s ease-out 0.6s both" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-gold)", animation: "floatPulse 2s ease infinite" }} />
            <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
              {counter.toLocaleString()} mothers transformed this month
            </span>
          </div>
        </div>
      </section>

      {/* ═══ LIFE CHAPTERS ═══ */}
      <section id="chapters" data-reveal style={{
        padding: "100px 24px",
        opacity: isVisible("chapters") ? 1 : 0,
        transform: isVisible("chapters") ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s ease"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div className="badge" style={{ marginBottom: 16 }}>✦ Personalize</div>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Which chapter are you in?</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 48px" }}>
            SheCodes.AI adapts to your unique season of motherhood.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {lifeChapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChapter(ch.id)}
                style={{
                  padding: 28,
                  borderRadius: "var(--radius-lg)",
                  border: selectedChapter === ch.id ? "2px solid var(--accent-rose)" : "1px solid var(--border-color)",
                  background: selectedChapter === ch.id ? "rgba(201,160,220,0.08)" : "var(--bg-glass-strong)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{ch.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{ch.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{ch.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ YOUR LIFE OS ═══ */}
      <section id="lifeos" data-reveal style={{
        padding: "100px 24px",
        background: "var(--bg-secondary)",
        opacity: isVisible("lifeos") ? 1 : 0,
        transform: isVisible("lifeos") ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s ease"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div className="badge" style={{ marginBottom: 16 }}>✦ Your Life OS</div>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Six AI modules. One you.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 56px" }}>
            Every module is powered by IBM Granite — the AI that understands your context.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {lifeOSModules.map((mod, i) => (
              <Link key={mod.title} href={mod.link} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card" style={{
                  padding: 32,
                  textAlign: "left",
                  borderTop: `3px solid ${mod.color}`,
                  animationDelay: `${i * 0.1}s`,
                  height: "100%"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${mod.color}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24,
                    }}>
                      {mod.icon}
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>{mod.title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{mod.desc}</p>
                  <div style={{ marginTop: 16, fontSize: 13, color: mod.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    Chat with AI → 
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRIYA'S JOURNEY — AI DEMO ═══ */}
      <section id="demo" data-reveal style={{
        padding: "100px 24px",
        opacity: isVisible("demo") ? 1 : 0,
        transform: isVisible("demo") ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s ease"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 16 }}>✦ See it in action</div>
            <h2 className="section-title" style={{ marginBottom: 12 }}>Meet Priya&apos;s comeback.</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Watch how SheCodes.AI guides a real mother through her day — from health to career.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            {/* Journey Roadmap */}
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Priya&apos;s Comeback Roadmap</h3>
              {[
                { step: "Assessment", status: "done", detail: "Identified burnout at 8/10" },
                { step: "Health Recovery", status: "done", detail: "Sleep improved to 6.5 hours" },
                { step: "Mind & Journaling", status: "active", detail: "14 entries, mood trending up" },
                { step: "Resume Rebuild", status: "active", detail: "AI reframed career gap" },
                { step: "Interview Prep", status: "pending", detail: "Mock sessions scheduled" },
                { step: "Career Launch", status: "pending", detail: "Waiting for confidence score" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                    background: item.status === "done" ? "var(--accent-sage)" : item.status === "active" ? "var(--accent-rose)" : "var(--bg-tertiary)",
                    color: item.status === "pending" ? "var(--text-tertiary)" : "white",
                  }}>
                    {item.status === "done" ? "✓" : i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: item.status === "pending" ? "var(--text-tertiary)" : "var(--text-primary)" }}>{item.step}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Chat Demo */}
            <div className="ai-chat-container">
              <div className="ai-chat-header">
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>SheCodes.AI Companion</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Chatting with Priya</div>
                </div>
              </div>
              <div className="ai-chat-messages" style={{ maxHeight: 380 }}>
                {demoChat.map((msg, i) => (
                  <div key={i} className={msg.role === "ai" ? "ai-msg" : ""} style={msg.role === "user" ? { display: "flex", justifyContent: "flex-end" } : undefined}>
                    {msg.role === "ai" && (
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,160,220,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>✦</div>
                    )}
                    <div className={msg.role === "ai" ? "ai-msg-bubble" : "user-msg-bubble"}>{msg.text}</div>
                  </div>
                ))}
              </div>
              <div className="ai-chat-input-area">
                <input className="ai-chat-input" placeholder="Try asking SheCodes.AI..." disabled style={{ opacity: 0.6 }} />
                <button className="ai-chat-send" disabled style={{ opacity: 0.5 }}>↑</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AI LEARNING HUB ═══ */}
      <section id="learn" data-reveal style={{
        padding: "100px 24px",
        background: "var(--bg-secondary)",
        opacity: isVisible("learn") ? 1 : 0,
        transform: isVisible("learn") ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.7s ease"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div className="badge" style={{ marginBottom: 16 }}>✦ Learn</div>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Explain like I&apos;m a mum.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 40px" }}>
            SheCodes.AI breaks down complex AI topics into everyday language. No jargon.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { q: "What is AI?", a: "Think of it as a really smart assistant that learns from patterns — like how you know your toddler is tired before the meltdown." },
              { q: "Is my data safe?", a: "Your data is stored on IBM Cloud — the same security banks use. It's encrypted, private, and never shared." },
              { q: "How does SheCodes.AI help?", a: "It connects the dots across your health, career, and emotions to give you insights you'd miss on your own." },
            ].map((item) => (
              <div key={item.q} className="card" style={{ textAlign: "left", padding: 28 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, color: "var(--accent-rose)" }}>{item.q}</div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
          <Link href="/ai-news" className="btn-secondary" style={{ marginTop: 32, display: "inline-flex" }}>Explore AI Learning Hub →</Link>
        </div>
      </section>



      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "60px 24px 32px",
        background: "var(--bg-tertiary)",
        borderTop: "1px solid var(--border-color)"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent-rose)", marginBottom: 8 }}>SheCodes.AI</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 300 }}>
              Your AI-powered life companion. Built with IBM watsonx AI and Cloudant NoSQL.
            </p>
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 14, color: "var(--text-secondary)" }}>
            <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</Link>
            <Link href="/blog" style={{ textDecoration: "none", color: "inherit" }}>Stories</Link>
            <Link href="/community" style={{ textDecoration: "none", color: "inherit" }}>Community</Link>
            <Link href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</Link>
          </div>
        </div>
        <div style={{ maxWidth: 1000, margin: "32px auto 0", paddingTop: 24, borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>© 2026 SheCodes.AI. All rights reserved.</div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" height={20} style={{ opacity: 0.25 }} />
        </div>
      </footer>
    </div>
  );
}
