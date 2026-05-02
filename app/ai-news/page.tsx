"use client";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function AINewsPage() {
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);

  const explainTopic = async (t?: string) => {
    const topicToExplain = t || topic;
    if (!topicToExplain.trim()) return;
    setExplaining(true);
    if (t) setTopic(t);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "explain_ai", topic: topicToExplain })
      });
      const data = await res.json();
      setExplanation(data.result);
    } catch (e) {
      setExplanation("Unable to connect to IBM watsonx.");
    } finally {
      setExplaining(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div className="badge" style={{ marginBottom: 12 }}>✦ AI Learning Hub</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>AI Guide</h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>Ask anything about AI. IBM watsonx explains it in simple, human terms.</p>
        </div>

        {/* AI LEARNING CHAT */}
        <InlineAIChat
          title="AI Explainer"
          subtitle="Ask any AI/tech question — explained like you're a mum"
          systemAction="explain_ai"
          placeholder="What is machine learning? How does ChatGPT work?"
          initialMessage="I'm here to make AI simple! Ask me anything about AI, technology, or how SheCodes.AI works. I'll explain it using everyday language — no jargon, no confusion. What would you like to understand? ✦"
          extraPayload={{ context: "AI education for non-technical mothers" }}
        />

        {/* QUICK EXPLAINER */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Quick Explainer</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              className="ai-chat-input"
              placeholder='e.g. "What is IBM Granite?"'
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && explainTopic()}
              disabled={explaining}
              style={{ flex: 1, borderRadius: "var(--radius-full)", padding: "12px 20px" }}
            />
            <button className="btn-primary" onClick={() => explainTopic()} disabled={!topic.trim() || explaining} style={{ opacity: (!topic.trim() || explaining) ? 0.5 : 1, whiteSpace: "nowrap" }}>
              {explaining ? "✦ Thinking..." : "✦ Explain"}
            </button>
          </div>

          {explanation && (
            <div className="animate-fade-in" style={{ marginTop: 20, padding: 16, background: "rgba(201,160,220,0.06)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--accent-rose)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>✦ IBM watsonx Explanation</div>
              <p style={{ fontSize: 15, lineHeight: 1.65 }}>{explanation}</p>
            </div>
          )}
        </div>

        {/* POPULAR TOPICS */}
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Popular Topics</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { label: "What is IBM Granite?", desc: "The AI model powering this platform." },
            { label: "What is a Large Language Model?", desc: "The technology behind modern AI." },
            { label: "How does AI understand my journal?", desc: "Natural Language Processing explained." },
            { label: "Is my data safe with IBM Cloud?", desc: "Enterprise security and privacy." },
            { label: "What is IBM Cloudant?", desc: "The database storing your data." },
          ].map(t => (
            <button key={t.label} onClick={() => explainTopic(t.label)} className="card" style={{ textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2, fontSize: 15 }}>{t.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{t.desc}</div>
              </div>
              <div style={{ fontSize: 18, color: "var(--accent-rose)" }}>→</div>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
