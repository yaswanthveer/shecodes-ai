"use client";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function RelationshipsPage() {
  const [partnerScore, setPartnerScore] = useState(7);
  const [kidsScore, setKidsScore] = useState(8);
  const [draftMessage, setDraftMessage] = useState("");
  const [reframedMessage, setReframedMessage] = useState("");
  const [reframing, setReframing] = useState(false);
  const [relInsight, setRelInsight] = useState("");
  const [analyzingRel, setAnalyzingRel] = useState(false);

  const reframeMessage = async () => {
    if (!draftMessage.trim()) return;
    setReframing(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reframe_message", message: draftMessage })
      });
      const data = await res.json();
      setReframedMessage(data.result);
    } catch (e) {
      setReframedMessage("Unable to connect to IBM watsonx. Please try again.");
    } finally {
      setReframing(false);
    }
  };

  const getRelationshipInsight = async () => {
    setAnalyzingRel(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "relationship_insight", partner: partnerScore, kids: kidsScore })
      });
      const data = await res.json();
      setRelInsight(data.result);
    } catch (e) {
      setRelInsight("Unable to connect to IBM watsonx. Please try again.");
    } finally {
      setAnalyzingRel(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div className="badge" style={{ marginBottom: 12, background: "rgba(184,169,212,0.15)", color: "var(--accent-lavender)", borderColor: "rgba(184,169,212,0.3)" }}>💜 Relationships Module</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Relationships</h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>Monitor and improve your connections with AI guidance.</p>
        </div>

        {/* AI RELATIONSHIP COACH */}
        <InlineAIChat
          title="AI Relationship Coach"
          subtitle="Communication tips, conflict resolution, self-care"
          systemAction="chat"
          placeholder="Tell me about a conversation you're struggling with..."
          accentColor="var(--accent-lavender)"
          initialMessage="I'm your relationship coach. I can help reframe difficult conversations, improve communication with your partner, or help you be more patient with your kids. What relationship challenge are you facing? 💜"
          extraPayload={{ context: "relationship coaching for mothers" }}
        />

        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>❤️ Partner Connection</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--text-secondary)" }}>
            <span>Disconnected</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{partnerScore}/10</span>
            <span>Aligned</span>
          </div>
          <input type="range" min={1} max={10} value={partnerScore} onChange={e => setPartnerScore(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-rose)" }} />
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>👶 Patience with Kids</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--text-secondary)" }}>
            <span>Short-fused</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{kidsScore}/10</span>
            <span>Present</span>
          </div>
          <input type="range" min={1} max={10} value={kidsScore} onChange={e => setKidsScore(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-lavender)" }} />
        </div>

        <button className="btn-primary" onClick={getRelationshipInsight} disabled={analyzingRel} style={{ width: "100%", marginBottom: 20, opacity: analyzingRel ? 0.6 : 1 }}>
          {analyzingRel ? "✦ Analyzing..." : "✦ Get AI Relationship Insight"}
        </button>

        {relInsight && (
          <div className="card animate-fade-in" style={{ marginBottom: 24, borderLeft: "4px solid var(--accent-lavender)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(184,169,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-lavender)", textTransform: "uppercase", letterSpacing: "0.05em", alignSelf: "center" }}>Relationship Analysis</div>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.65 }}>{relInsight}</p>
          </div>
        )}

        {/* COMMUNICATION COACH */}
        <div className="card" style={{ background: "var(--bg-secondary)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>💬 AI Communication Coach</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Type what you want to say. AI rewrites it into healthy communication.</p>
          <textarea className="input-field" placeholder="I'm so exhausted, you never help with bedtime..." rows={3} value={draftMessage} onChange={e => setDraftMessage(e.target.value)} style={{ marginBottom: 16, resize: "none" }} disabled={reframing} />
          <button className="btn-primary" onClick={reframeMessage} disabled={!draftMessage.trim() || reframing} style={{ width: "100%", opacity: (!draftMessage.trim() || reframing) ? 0.5 : 1 }}>
            {reframing ? "✦ Rewriting..." : "✦ Reframe with AI"}
          </button>

          {reframedMessage && (
            <div className="animate-fade-in" style={{ marginTop: 20, padding: 16, background: "rgba(168,197,160,0.08)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--accent-sage)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-sage)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>✦ Reframed Message</div>
              <p style={{ fontSize: 15, lineHeight: 1.65, fontStyle: "italic" }}>{reframedMessage}</p>
              <button onClick={() => navigator.clipboard.writeText(reframedMessage)} style={{ marginTop: 12, background: "none", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "6px 12px", fontSize: 12, cursor: "pointer", color: "var(--text-secondary)" }}>Copy to clipboard</button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
