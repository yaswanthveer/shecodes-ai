"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState("");
  const [affirmation, setAffirmation] = useState("");
  const [loadingAi, setLoadingAi] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const uRes = await fetch("/api/data", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_user" })
        });
        const uData = await uRes.json();
        setUser(uData.user || { name: "Guest" });

        const aRes = await fetch("/api/data", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_assessment" })
        });
        const aData = await aRes.json();
        setAssessment(aData.assessment);

        const insightRes = await fetch("/api/ai", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "daily_insight", hasAssessment: !!aData.assessment, name: uData.user?.name || "there", scores: aData.assessment?.scores, journalCount: 0 })
        });
        const insightData = await insightRes.json();
        setAiInsight(insightData.result);

        const affRes = await fetch("/api/ai", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "affirmation", context: aData.assessment ? `scores: ${JSON.stringify(aData.assessment.scores)}` : "new user onboarding" })
        });
        const affData = await affRes.json();
        setAffirmation(affData.result);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
        setLoadingAi(false);
      }
    }
    loadData();
  }, []);

  const score = assessment ? Math.round(Object.values(assessment.scores as Record<string, number>).reduce((a,b)=>a+b,0) / Object.keys(assessment.scores).length * 10) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppLayout>
      <div style={{ paddingBottom: 40 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
            {greeting()}, {user?.name || "Priya"}.
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>Here is your daily summary.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div className="typing-indicator" style={{ justifyContent: "center", marginBottom: 16 }}><span /><span /><span /></div>
            <p style={{ color: "var(--text-tertiary)" }}>Loading from IBM Cloudant...</p>
          </div>
        ) : (
          <>
            {/* AI DAILY COMPANION */}
            <InlineAIChat
              title={`SheCodes.AI — ${greeting()}, ${user?.name || "Priya"}!`}
              subtitle="Your daily AI companion — ask anything"
              systemAction="chat"
              placeholder="How are you feeling today?"
              initialMessage={`${greeting()}! I'm your personal AI companion. How are you feeling today? I can help with anything — health check, journaling, career prep, or just talk. What's on your mind? ✦`}
              extraPayload={{ context: `dashboard, user: ${user?.name}` }}
            />

            {/* AFFIRMATION BANNER */}
            <div style={{ background: "var(--gradient-rose)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16, color: "white" }}>
              <div style={{ fontSize: 28 }}>✦</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, opacity: 0.8 }}>AI Affirmation</div>
                <p style={{ fontSize: 15, fontWeight: 500, fontStyle: "italic" }}>
                  {loadingAi ? "Generating your personal affirmation..." : affirmation}
                </p>
              </div>
            </div>

            {/* SCORE CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Comeback Score", value: assessment ? score : "--", color: "var(--accent-rose)", pct: assessment ? score : 0 },
                { label: "Emotional Health", value: assessment?.scores?.mind ? assessment.scores.mind * 10 : "--", color: "var(--accent-lavender)", pct: assessment?.scores?.mind ? assessment.scores.mind * 10 : 0 },
                { label: "Career Readiness", value: assessment?.scores?.work ? assessment.scores.work * 10 : "--", color: "var(--accent-sage)", pct: assessment?.scores?.work ? assessment.scores.work * 10 : 0 },
              ].map(s => (
                <div key={s.label} className="card">
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", background: `linear-gradient(135deg, ${s.color}, var(--accent-gold))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
                  <div style={{ height: 4, background: "var(--bg-tertiary)", borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, transition: "width 1s ease", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* WATSONX INSIGHT */}
            <div className="card" style={{ marginBottom: 32, borderLeft: "4px solid var(--accent-rose)" }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(201,160,220,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✦</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>IBM watsonx — Personalized Insight</div>
                  <p style={{ fontSize: 15, lineHeight: 1.65 }}>
                    {loadingAi ? "Analyzing your data..." : aiInsight}
                  </p>
                  {!assessment && (
                    <Link href="/assessment" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, marginTop: 12, display: "inline-flex" }}>✦ Take Assessment</Link>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { title: "Journal Entry", desc: "AI-powered emotional reflection.", link: "/mind", icon: "🧠", color: "var(--accent-rose)" },
                { title: "Upload Resume", desc: "IBM Granite reframes your gap.", link: "/work", icon: "🚀", color: "var(--accent-gold)" },
                { title: "Kitchen AI", desc: "Generate a recipe from your fridge.", link: "/nourish", icon: "🥗", color: "var(--accent-sage)" },
                { title: "Health Check", desc: "AI analyzes your sleep and burnout.", link: "/health", icon: "💊", color: "var(--accent-pink)" },
              ].map(a => (
                <Link key={a.title} href={a.link} className="card" style={{ textDecoration: "none", color: "inherit", borderTop: `3px solid ${a.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{a.desc}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
