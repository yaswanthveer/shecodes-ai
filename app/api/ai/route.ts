import { generateText, generateLifeAssessment, rebuildResume, generateRecipe, analyzeSentiment } from "@/lib/gemini/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;

    switch (action) {
      // ─── ASSESSMENT ───
      case "assess":
        const assessment = await generateLifeAssessment(data);
        return NextResponse.json({ result: assessment });

      // ─── GENERAL CHAT / JOURNAL REFLECTION ───
      case "chat":
        const reply = await generateText(
          `You are SheCodes.AI — a warm, empathetic companion for mothers. User says: "${data.message}". Previous context: ${data.context || "none"}. Respond with care, validation, and gentle guidance. Maximum 3 sentences.`,
          { maxTokens: 200, temperature: 0.85 }
        );
        return NextResponse.json({ result: reply });

      // ─── RESUME REBUILD ───
      case "rebuild_resume":
        const resume = await rebuildResume(data.resumeData || "Career break mother seeking to return to work");
        return NextResponse.json({ result: resume });

      // ─── RECIPE GENERATION ───
      case "generate_recipe":
        const recipePrompt = `You are a nutritionist AI for busy mothers. Create a quick, healthy recipe using: ${data.ingredients}. They have ${data.time} minutes. Respond in valid JSON with keys: title (string), time (string like "15 mins"), ingredients (array of strings), instructions (array of step strings), nutrition (one sentence). Only output the JSON, nothing else.`;
        const recipeRaw = await generateText(recipePrompt, { maxTokens: 500, temperature: 0.6 });
        try {
          const jsonMatch = recipeRaw.match(/\{[\s\S]*\}/);
          if (jsonMatch) return NextResponse.json({ result: JSON.parse(jsonMatch[0]) });
        } catch {}
        return NextResponse.json({ result: { title: `Quick ${data.ingredients?.split(",")[0]?.trim()} Bowl`, time: `${data.time} mins`, ingredients: data.ingredients?.split(",").map((s: string) => s.trim()), instructions: ["Prepare all ingredients.", "Cook on medium heat.", "Season and serve warm."], nutrition: "A nourishing, balanced meal." } });

      // ─── SENTIMENT ANALYSIS ───
      case "sentiment":
        const sentiment = await analyzeSentiment(data.text || "");
        return NextResponse.json({ result: sentiment });

      // ─── HEALTH INSIGHT (AI analyzes sleep/water/burnout) ───
      case "health_insight":
        const healthInsight = await generateText(
          `You are an empathetic health AI for mothers. A mother reports: Sleep: ${data.sleep}h, Water: ${data.water} glasses, Burnout: ${data.burnout}/10. Give a brief, caring 3-sentence health insight. First validate how she's doing, then give one specific actionable tip for today, then end with encouragement. Be warm, not clinical.`,
          { maxTokens: 200, temperature: 0.8 }
        );
        return NextResponse.json({ result: healthInsight });

      // ─── RELATIONSHIP REFRAME (AI rewrites emotional messages) ───
      case "reframe_message":
        const reframed = await generateText(
          `You are an empathetic relationship coach AI for mothers. A mother wants to communicate this to her partner but it came out emotionally: "${data.message}". Rewrite it as a constructive, non-confrontational message using "I feel" statements. Keep the core emotion but make it healthy communication. Output only the reframed message, nothing else. Max 4 sentences.`,
          { maxTokens: 200, temperature: 0.7 }
        );
        return NextResponse.json({ result: reframed });

      // ─── RELATIONSHIP AI ANALYSIS ───
      case "relationship_insight":
        const relInsight = await generateText(
          `You are an empathetic relationship AI for mothers. A mother rates her partner connection as ${data.partner}/10 and patience with kids as ${data.kids}/10. Give a brief 3-sentence relationship insight: validate her experience, identify one pattern, suggest one micro-action she can try today. Be warm and practical, not preachy.`,
          { maxTokens: 200, temperature: 0.8 }
        );
        return NextResponse.json({ result: relInsight });

      // ─── COMMUNITY AI RESPONSE (supportive reply to another mother) ───
      case "community_support":
        const supportReply = await generateText(
          `You are SheCodes.AI, an empathetic community assistant for mothers. Another mother posted: "${data.postText}". Write a brief, warm, supportive response from the community AI. Validate her experience, share a relevant insight, and end with encouragement. Max 3 sentences. Do NOT be generic or preachy.`,
          { maxTokens: 150, temperature: 0.85 }
        );
        return NextResponse.json({ result: supportReply });

      // ─── DAILY DASHBOARD INSIGHT ───
      case "daily_insight":
        const dailyPrompt = data.hasAssessment
          ? `You are SheCodes.AI. A mother named ${data.name || "there"} has assessment scores: ${JSON.stringify(data.scores || {})}. She has written ${data.journalCount || 0} journal entries. Generate a personalized, warm 2-sentence daily insight. Reference her specific scores to make it feel personal. End with one specific thing she should focus on today.`
          : `You are SheCodes.AI. A new mother just joined the platform. Write a warm 2-sentence welcome message encouraging her to take the assessment. Make it feel personal and exciting, not generic.`;
        const dailyInsight = await generateText(dailyPrompt, { maxTokens: 150, temperature: 0.85 });
        return NextResponse.json({ result: dailyInsight });

      // ─── AI AFFIRMATION (used across pages) ───
      case "affirmation":
        const affirmation = await generateText(
          `Generate one brief, powerful daily affirmation for a mother who is rebuilding her identity. Context: ${data.context || "general empowerment"}. The affirmation should feel specific, not generic. One sentence only. Do not start with "I am". Be creative.`,
          { maxTokens: 60, temperature: 0.9 }
        );
        return NextResponse.json({ result: affirmation });

      // ─── AI INTERVIEW PREP ───
      case "interview_prep":
        const interviewAnswer = await generateText(
          `You are a career coach AI for mothers returning to work. A mother is asked this interview question: "${data.question}". Her background: ${data.background || "returning after a career break for motherhood"}. Write a confident, professional answer that reframes her career gap as a strength. Max 4 sentences.`,
          { maxTokens: 250, temperature: 0.7 }
        );
        return NextResponse.json({ result: interviewAnswer });

      // ─── AI NEWS EXPLAINER ───
      case "explain_ai":
        const explanation = await generateText(
          `You are a friendly AI educator. Explain this AI/tech concept to a non-technical mother in 3 simple sentences: "${data.topic}". Use a real-world analogy from everyday life. No jargon. Make it feel empowering, not intimidating.`,
          { maxTokens: 150, temperature: 0.7 }
        );
        return NextResponse.json({ result: explanation });

      // ─── FALLBACK ───
      default:
        const text = await generateText(data.prompt || "Hello", data.params);
        return NextResponse.json({ result: text });
    }
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI service temporarily unavailable", result: "SheCodes.AI is warming up. Please try again in a moment." },
      { status: 200 }
    );
  }
}
