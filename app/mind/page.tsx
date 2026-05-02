"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function MindPage() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState(5);
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    async function loadJournals() {
      try {
        const res = await fetch("/api/data", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_journals" })
        });
        const data = await res.json();
        setJournals(data.journals || []);
      } catch (e) {
        console.error("Failed to load journals");
      } finally {
        setLoading(false);
      }
    }
    loadJournals();
  }, []);

  const submitJournal = async () => {
    if (!entry.trim()) return;
    setAnalyzing(true);
    try {
      const aiRes = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", message: entry })
      });
      const aiData = await aiRes.json();
      const reflection = aiData.result;

      await fetch("/api/data", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_journal", data: { entry, mood, aiReflection: reflection } })
      });

      const loadRes = await fetch("/api/data", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_journals" })
      });
      const loadData = await loadRes.json();
      setJournals(loadData.journals || []);
      setEntry("");
      setMood(5);
    } catch (e) {
      console.error("Error saving journal", e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div className="badge" style={{ marginBottom: 12 }}>🧠 Mind Module</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Her Mind</h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>
            A secure space to unpack the invisible load. Processed by IBM watsonx.
          </p>
        </div>

        {/* AI JOURNAL COMPANION */}
        <InlineAIChat
          title="AI Journal Companion"
          subtitle="Guided journaling with AI reflection"
          systemAction="chat"
          placeholder="Tell me what's on your mind today..."
          initialMessage="I'm your journal companion. You can write freely here, or log an entry below. I'll help you see patterns in your emotions and offer gentle insights. What's weighing on you today? 🧠"
        />

        {/* JOURNAL COMPOSER */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>How are you feeling right now?</h2>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
              <span>Overwhelmed</span>
              <span style={{ color: "var(--accent-rose)", fontWeight: 600 }}>Energy: {mood}/10</span>
              <span>Centered</span>
            </div>
            <input
              type="range" min={1} max={10} value={mood}
              onChange={e => setMood(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-rose)", cursor: "pointer" }}
            />
          </div>

          <textarea
            className="input-field"
            placeholder="Write exactly what's on your mind. No judgment here..."
            rows={5}
            value={entry}
            onChange={e => setEntry(e.target.value)}
            style={{ marginBottom: 16, resize: "vertical" }}
            disabled={analyzing}
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn-primary"
              onClick={submitJournal}
              disabled={!entry.trim() || analyzing}
              style={{ opacity: (!entry.trim() || analyzing) ? 0.5 : 1 }}
            >
              {analyzing ? "✦ AI is reflecting..." : "✦ Save Entry"}
            </button>
          </div>
        </div>

        {/* PREVIOUS ENTRIES */}
        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 16 }}>Recent Reflections</h2>

        {loading ? (
          <div style={{ color: "var(--text-tertiary)", textAlign: "center", padding: 40 }}>Loading from IBM Cloudant...</div>
        ) : journals.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
            You haven&apos;t written any entries yet. Your reflections will appear here securely.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {journals.map((j, i) => (
              <div key={i} style={{ borderLeft: "2px solid var(--border-color)", paddingLeft: 24, position: "relative" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent-rose)", position: "absolute", left: -6, top: 4 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                    {new Date(j.createdAt).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="badge">Energy: {j.mood}/10</div>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{j.entry}</p>

                {j.aiReflection && (
                  <div style={{ background: "rgba(201,160,220,0.06)", borderRadius: "var(--radius-md)", padding: 16, borderLeft: "3px solid var(--accent-rose)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>✦ IBM watsonx</div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>{j.aiReflection}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
