"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const assessmentSteps = [
  { id: 1, title: "Welcome to SheCodes.AI", question: "What is your name?", type: "text", key: "name" },
  { id: 2, title: "Your Season", question: "Which best describes your current season of motherhood?", type: "options", key: "mumType", options: ["New Mother (0-1 yr)", "Toddler Years (1-3 yrs)", "School Age (4+ yrs)", "Career Break", "Working Mother"] },
  { id: 3, title: "Mental Load", question: "How often do you feel overwhelmed by the invisible mental load?", type: "slider", key: "mind", min: 1, max: 10, leftLabel: "Rarely", rightLabel: "Constantly" },
  { id: 4, title: "Identity", question: "Do you feel connected to who you were before motherhood?", type: "slider", key: "identity", min: 1, max: 10, leftLabel: "Lost myself", rightLabel: "Fully connected" },
  { id: 5, title: "Physical Health", question: "How would you rate your sleep and physical energy?", type: "slider", key: "health", min: 1, max: 10, leftLabel: "Exhausted", rightLabel: "Energized" },
  { id: 6, title: "Career Goals", question: "How are you feeling about your career right now?", type: "slider", key: "work", min: 1, max: 10, leftLabel: "Anxious / Paused", rightLabel: "Confident / Growing" },
];

const aiMessages = [
  "Let's start by getting to know you. ✦",
  "Understanding your season helps me personalize everything for you.",
  "This is so common — you're not alone in feeling this way.",
  "Your identity matters. Let's work on reconnecting with who you are.",
  "Physical health is the foundation. Let's be honest about where you are.",
  "Your career feelings are valid. Let's map your comeback together."
];

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, any>>({ scores: {} });
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (step < assessmentSteps.length - 1) {
      setStep(step + 1);
    } else {
      setSaving(true);
      try {
        const aiRes = await fetch("/api/ai", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "assess", ...data })
        });
        const aiData = await aiRes.json();

        await fetch("/api/data", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save_assessment", data: { ...data, aiFeedback: aiData.result } })
        });

        await fetch("/api/data", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save_user", data: { name: data.name, type: data.mumType } })
        });

        router.push("/dashboard");
      } catch (error) {
        console.error("Error saving assessment", error);
        setSaving(false);
      }
    }
  };

  const handleInput = (val: any) => {
    const current = assessmentSteps[step];
    if (current.type === "slider") {
      setData({ ...data, scores: { ...data.scores, [current.key]: val } });
    } else {
      setData({ ...data, [current.key]: val });
    }
  };

  const currentStep = assessmentSteps[step];
  const progress = ((step + 1) / assessmentSteps.length) * 100;

  return (
    <div className="hero-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <header style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-glass-strong)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-color)" }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: "none", color: "var(--accent-rose)" }}>SheCodes.AI</Link>
        <div style={{ width: 200, height: 4, background: "var(--bg-tertiary)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--gradient-rose)", transition: "width 0.4s ease" }} />
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Step {step + 1} of {assessmentSteps.length}</div>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {saving ? (
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div className="typing-indicator" style={{ justifyContent: "center", marginBottom: 24 }}><span /><span /><span /></div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>IBM watsonx is analyzing...</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Securely processing your assessment and saving to IBM Cloudant.</p>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: 650, display: "flex", gap: 24 }}>
            {/* AI Companion Message */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gradient-rose)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18 }}>✦</div>
            </div>

            <div style={{ flex: 1 }}>
              {/* AI says */}
              <div className="ai-msg-bubble animate-fade-in" style={{ marginBottom: 24, maxWidth: "100%" }}>
                {aiMessages[step]}
              </div>

              {/* Question Card */}
              <div className="card" style={{ padding: 40 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                  {currentStep.title}
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 32 }}>
                  {currentStep.question}
                </h1>

                <div style={{ marginBottom: 40, minHeight: 80 }}>
                  {currentStep.type === "text" && (
                    <input type="text" className="input-field" placeholder="Type your answer..." value={data[currentStep.key] || ""} onChange={e => handleInput(e.target.value)} onKeyDown={e => e.key === "Enter" && data[currentStep.key] && handleNext()} autoFocus />
                  )}

                  {currentStep.type === "options" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {currentStep.options?.map(opt => (
                        <button key={opt} onClick={() => { handleInput(opt); setTimeout(handleNext, 150); }}
                          style={{
                            padding: "14px 18px",
                            background: data[currentStep.key] === opt ? "rgba(201,160,220,0.1)" : "transparent",
                            border: `1px solid ${data[currentStep.key] === opt ? "var(--accent-rose)" : "var(--border-color)"}`,
                            borderRadius: "var(--radius-md)", textAlign: "left", fontSize: 15,
                            color: "var(--text-primary)", fontWeight: data[currentStep.key] === opt ? 600 : 400,
                            cursor: "pointer", transition: "all 0.2s ease"
                          }}>{opt}</button>
                      ))}
                    </div>
                  )}

                  {currentStep.type === "slider" && (
                    <div>
                      <input type="range" min={currentStep.min} max={currentStep.max} value={data.scores?.[currentStep.key] || 5} onChange={e => handleInput(Number(e.target.value))} style={{ width: "100%", cursor: "pointer", accentColor: "var(--accent-rose)", marginBottom: 16 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                        <span>{currentStep.leftLabel}</span>
                        <span style={{ color: "var(--accent-rose)", fontWeight: 700 }}>{data.scores?.[currentStep.key] || 5} / 10</span>
                        <span>{currentStep.rightLabel}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={() => setStep(Math.max(0, step - 1))} className="btn-ghost" style={{ opacity: step === 0 ? 0 : 1 }} disabled={step === 0}>← Back</button>
                  <button onClick={handleNext} disabled={(currentStep.type === "text" && !data[currentStep.key]) || (currentStep.type === "options" && !data[currentStep.key])} className="btn-primary"
                    style={{ opacity: ((currentStep.type === "text" && !data[currentStep.key]) || (currentStep.type === "options" && !data[currentStep.key])) ? 0.5 : 1 }}>
                    {step === assessmentSteps.length - 1 ? "✦ Complete Assessment" : "Continue →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
