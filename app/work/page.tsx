"use client";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function WorkPage() {
  const [cvText, setCvText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [interviewQ, setInterviewQ] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [preparingAnswer, setPreparingAnswer] = useState(false);

  const handleAnalyze = async () => {
    if (!cvText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rebuild_resume", resumeData: cvText })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setResult("Failed to connect to IBM watsonx.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleInterviewPrep = async () => {
    if (!interviewQ.trim()) return;
    setPreparingAnswer(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "interview_prep", question: interviewQ, background: cvText || "mother returning from a career break" })
      });
      const data = await res.json();
      setInterviewAnswer(data.result);
    } catch (e) {
      setInterviewAnswer("Unable to connect to IBM watsonx.");
    } finally {
      setPreparingAnswer(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>🚀 Career Module</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Career Comeback</h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>
            IBM Granite reframes your career gap into leadership strength.
          </p>
        </div>

        {/* AI CAREER COACH */}
        <InlineAIChat
          title="AI Career Coach"
          subtitle="Resume tips, interview prep, confidence building"
          systemAction="chat"
          placeholder="Ask about interviews, resume gaps, confidence..."
          accentColor="var(--accent-gold)"
          initialMessage="I'm your Career Comeback Coach! I can help you reframe your career gap, prepare for interviews, or boost your confidence. Paste your resume below, or ask me anything about returning to work. 🚀"
          extraPayload={{ context: "career comeback coaching for mothers" }}
        />

        {/* RESUME SECTION */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Your Old Resume</h2>
              <div className="badge">Paste Text</div>
            </div>
            <textarea
              className="input-field"
              placeholder="Paste your old resume content here. Include your past roles, education, and the length of your career break..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              style={{ flex: 1, minHeight: 220, resize: "none", marginBottom: 16 }}
              disabled={analyzing}
            />
            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={!cvText.trim() || analyzing}
              style={{ width: "100%", opacity: (!cvText.trim() || analyzing) ? 0.5 : 1 }}
            >
              {analyzing ? "✦ IBM Granite is rebuilding..." : "✦ Reframe My Experience"}
            </button>
          </div>

          <div className="card" style={{ background: result ? undefined : "var(--bg-secondary)", border: result ? undefined : "1px dashed var(--border-strong)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Reframed Profile</h2>
              {result && <div className="badge" style={{ background: "var(--gradient-rose)", color: "white", border: "none" }}>✦ AI Generated</div>}
            </div>

            {!result && !analyzing && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, color: "var(--text-tertiary)", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
                <p style={{ maxWidth: 250 }}>Paste your resume to see AI translate your experience into modern leadership skills.</p>
              </div>
            )}

            {analyzing && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, color: "var(--accent-rose)" }}>
                <div className="typing-indicator" style={{ marginBottom: 12 }}><span /><span /><span /></div>
                <p style={{ fontWeight: 500 }}>Translating mothering skills into corporate value...</p>
              </div>
            )}

            {result && !analyzing && (
              <div className="animate-fade-in">
                <p style={{ fontSize: 15, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</p>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-color)" }}>
                  <button onClick={() => navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result))} className="btn-secondary" style={{ width: "100%", fontSize: 14 }}>Copy Reframed Profile</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INTERVIEW PREP */}
        <div className="card" style={{ background: "var(--bg-secondary)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>🎤 AI Interview Prep</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            Type the question and IBM watsonx will coach you with a confident answer.
          </p>
          <input
            className="input-field"
            placeholder='e.g. "Tell me about the gap in your resume"'
            value={interviewQ}
            onChange={e => setInterviewQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleInterviewPrep()}
            disabled={preparingAnswer}
            style={{ marginBottom: 16 }}
          />
          <button
            className="btn-primary"
            onClick={handleInterviewPrep}
            disabled={!interviewQ.trim() || preparingAnswer}
            style={{ width: "100%", opacity: (!interviewQ.trim() || preparingAnswer) ? 0.5 : 1 }}
          >
            {preparingAnswer ? "✦ AI is coaching..." : "✦ Get AI-Coached Answer"}
          </button>

          {interviewAnswer && (
            <div className="animate-fade-in" style={{ marginTop: 20, padding: 16, background: "rgba(168,197,160,0.1)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--accent-sage)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-sage)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>✦ Suggested Answer</div>
              <p style={{ fontSize: 15, lineHeight: 1.65 }}>{interviewAnswer}</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
