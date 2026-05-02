"use client";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function HealthPage() {
  const [sleep, setSleep] = useState(6);
  const [water, setWater] = useState(4);
  const [burnout, setBurnout] = useState(5);
  const [aiInsight, setAiInsight] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const getHealthInsight = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "health_insight", sleep, water, burnout })
      });
      const data = await res.json();
      setAiInsight(data.result);
    } catch (e) {
      setAiInsight("Unable to connect to IBM watsonx right now. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div className="badge" style={{ marginBottom: 12 }}>💊 Health Module</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Physical Health</h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>
            Track the basics. Because you can&apos;t pour from an empty cup.
          </p>
        </div>

        {/* AI HEALTH COMPANION */}
        <InlineAIChat
          title="AI Health Companion"
          subtitle="Ask about sleep, nutrition, energy, or burnout"
          systemAction="health_insight"
          placeholder="e.g. I've been sleeping 4 hours for a week..."
          initialMessage="Hi! I'm your Health AI. I can analyze your sleep patterns, hydration, and burnout. Log your data below, or just chat with me about how you're feeling physically. 💊"
          extraPayload={{ sleep, water, burnout }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span>💤</span> Sleep (Hours)
            </h2>
            <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, background: "var(--gradient-rose)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{sleep}</div>
            <input
              type="range" min={0} max={12} value={sleep}
              onChange={e => setSleep(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-rose)" }}
            />
          </div>

          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span>💧</span> Water (Glasses)
            </h2>
            <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, color: "var(--accent-blue)" }}>{water}</div>
            <input
              type="range" min={0} max={12} value={water}
              onChange={e => setWater(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-blue)" }}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>🔥 Burnout Meter</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--text-secondary)" }}>
            <span>Rested</span>
            <span style={{ color: burnout > 7 ? "var(--accent-coral)" : "var(--text-primary)", fontWeight: 600 }}>{burnout}/10</span>
            <span>Exhausted</span>
          </div>
          <input
            type="range" min={1} max={10} value={burnout}
            onChange={e => setBurnout(Number(e.target.value))}
            style={{ width: "100%", accentColor: burnout > 7 ? "var(--accent-coral)" : "var(--accent-rose)" }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={getHealthInsight}
          disabled={analyzing}
          style={{ width: "100%", marginBottom: 20, opacity: analyzing ? 0.6 : 1 }}
        >
          {analyzing ? "✦ IBM watsonx is analyzing..." : "✦ Get AI Health Insight"}
        </button>

        {aiInsight && (
          <div className="card animate-fade-in" style={{ borderLeft: "4px solid var(--accent-rose)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,160,220,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.05em", alignSelf: "center" }}>IBM watsonx Health Analysis</div>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-primary)" }}>{aiInsight}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
