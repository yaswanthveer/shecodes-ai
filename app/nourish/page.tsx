"use client";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function NourishPage() {
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("15");
  const [generating, setGenerating] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_recipe", ingredients, time })
      });
      const data = await res.json();
      let parsed = data.result;
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch(e) {}
      }
      setRecipe(parsed || data.result);
    } catch (e) {
      console.error("Failed to generate recipe", e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div className="badge" style={{ marginBottom: 12, background: "rgba(168,197,160,0.15)", color: "var(--accent-sage)", borderColor: "rgba(168,197,160,0.3)" }}>🥗 Nourish Module</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Kitchen AI</h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>
            Tell IBM watsonx what&apos;s in your fridge. Get a healthy meal in seconds.
          </p>
        </div>

        {/* AI KITCHEN BUDDY */}
        <InlineAIChat
          title="AI Kitchen Buddy"
          subtitle="Recipe suggestions, dietary advice, meal planning"
          systemAction="chat"
          placeholder="What's in your fridge today?"
          accentColor="var(--accent-sage)"
          initialMessage="Hey! I'm your Kitchen AI. Tell me what ingredients you have, any dietary restrictions, or how much time you've got — I'll create something nutritious and quick. What do you have on hand? 🥗"
          extraPayload={{ context: "nutrition and recipe generation for busy mothers" }}
        />

        <div className="card" style={{ marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>What do you have?</label>
              <input
                className="input-field"
                placeholder="e.g. Chicken breast, broccoli, rice, soy sauce..."
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
                disabled={generating}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Time available</label>
              <select
                className="input-field"
                value={time}
                onChange={e => setTime(e.target.value)}
                disabled={generating}
                style={{ appearance: "none" }}
              >
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={generateRecipe}
            disabled={!ingredients.trim() || generating}
            style={{ width: "100%", opacity: (!ingredients.trim() || generating) ? 0.5 : 1 }}
          >
            {generating ? "✦ IBM Granite is thinking..." : "✦ Generate Recipe"}
          </button>
        </div>

        {generating && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div className="typing-indicator" style={{ justifyContent: "center", marginBottom: 16 }}><span /><span /><span /></div>
            <p style={{ fontWeight: 500, color: "var(--accent-rose)" }}>Analyzing ingredients...</p>
          </div>
        )}

        {recipe && !generating && (
          <div className="card animate-fade-in" style={{ background: "var(--bg-secondary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>{recipe.title || "Quick Fix Meal"}</h2>
              <div className="badge badge-gold">{recipe.time || `${time} mins`}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-tertiary)", marginBottom: 12 }}>Ingredients</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {(recipe.ingredients || ingredients.split(',')).map((ing: string, i: number) => (
                    <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid var(--border-color)", fontSize: 15 }}>
                      • {ing.trim()}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-tertiary)", marginBottom: 12 }}>Instructions</h3>
                <ol style={{ paddingLeft: 16, margin: 0 }}>
                  {(recipe.instructions || ["Chop ingredients.", "Cook thoroughly.", "Serve warm."]).map((step: string, i: number) => (
                    <li key={i} style={{ marginBottom: 12, fontSize: 15, lineHeight: 1.65 }}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
