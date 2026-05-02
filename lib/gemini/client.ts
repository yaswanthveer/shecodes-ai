// Google Gemini AI Client
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyADw0_AYZiCbzo2HgnpGOC9mL1Zh4EmlP0";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateText(prompt: string, params?: {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: params?.model || "gemini-flash-latest",
      generationConfig: {
        maxOutputTokens: params?.maxTokens || 500,
        temperature: params?.temperature || 0.7,
      }
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return getMockResponse(prompt);
  }
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  emotions: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `Analyze the sentiment of this text and respond ONLY with valid JSON in this exact format: {"sentiment": "positive|negative|neutral", "confidence": 0.0-1.0, "emotions": ["emotion1", "emotion2"]}. Text: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Sentiment analysis error:", error);
  }

  // Fallback to simple sentiment analysis
  const lowerText = text.toLowerCase();
  const positiveWords = ["happy", "great", "amazing", "love", "wonderful", "excited", "grateful", "proud"];
  const negativeWords = ["sad", "overwhelmed", "exhausted", "struggling", "anxious", "lost", "tired", "frustrated"];

  const posCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negCount = negativeWords.filter(w => lowerText.includes(w)).length;

  const sentiment = posCount > negCount ? "positive" : negCount > posCount ? "negative" : "neutral";
  const confidence = Math.min(0.95, 0.5 + Math.abs(posCount - negCount) * 0.15);
  const emotions = sentiment === "negative" ? ["concern", "empathy_needed"] : sentiment === "positive" ? ["encouragement", "celebration"] : ["reflection"];

  return { sentiment, confidence, emotions };
}

export async function generateLifeAssessment(data: {
  mumType: string;
  scores: Record<string, number>;
  name: string;
}): Promise<string> {
  const prompt = `You are an empathetic AI companion for mothers named SheCodes.AI. A ${data.mumType} named ${data.name} has completed their life assessment with these scores (out of 10): ${JSON.stringify(data.scores)}. Write a warm, encouraging 3-sentence assessment that: 1) validates her current state, 2) identifies her top strength, 3) gives one gentle next step. Do not use clinical language. Sound like a wise, caring friend.`;

  return generateText(prompt, { maxTokens: 200, temperature: 0.8 });
}

export async function rebuildResume(originalCV: string): Promise<string> {
  const prompt = `You are a career comeback specialist AI. Transform this resume/CV for a mother returning from a career break. Reframe any gaps as "Family Leadership & Strategic Management." Add skills like crisis management, resource optimization, multi-stakeholder communication. Make it compelling and confident. Original CV context: ${originalCV.substring(0, 500)}. Write a powerful professional summary (max 100 words).`;

  return generateText(prompt, { maxTokens: 300, temperature: 0.7 });
}

export async function generateRecipe(ingredients: string[]): Promise<{
  name: string;
  time: string;
  steps: string[];
  nutrition: string;
}> {
  const prompt = `You are a nutritionist AI for busy mothers. Create a simple, nourishing recipe using only these ingredients: ${ingredients.join(", ")}. Format as JSON with: name, time (prep + cook), steps (array of 5 steps), nutrition (one sentence about key benefits). Keep it practical and under 20 minutes.`;

  const response = await generateText(prompt, { maxTokens: 400, temperature: 0.6 });

  // Try to parse JSON, fallback to mock
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch { /* use mock */ }

  return {
    name: `Nourishing ${ingredients[0] || "Power"} Bowl`,
    time: "15 minutes",
    steps: [
      `Prepare ${ingredients[0] || "main ingredient"} by washing and cutting as needed`,
      `Heat a pan with olive oil over medium heat`,
      `Add your ingredients in order of cooking time needed`,
      `Season with salt, pepper, and your favourite herbs`,
      `Plate beautifully and serve warm`,
    ],
    nutrition: `Rich in essential nutrients to support your energy and wellbeing throughout the day`,
  };
}

function getMockResponse(prompt: string): string {
  // Intelligent mock responses based on prompt content
  const lower = prompt.toLowerCase();

  if (lower.includes("assess") || lower.includes("life state")) {
    return "You are doing so much more than you realise. The fact that you're here, seeking support and growth, already shows tremendous strength. Your journey of becoming again starts with this exact moment of courage — and SheCodes.AI is with you every step of the way.";
  }

  if (lower.includes("resume") || lower.includes("cv") || lower.includes("career")) {
    return "Accomplished professional with 5+ years of strategic experience and demonstrated excellence in family leadership, crisis management, and resource optimisation. Career break equipped me with advanced multi-stakeholder communication, adaptive decision-making, and the ability to perform under pressure — directly translating to executive leadership capability.";
  }

  if (lower.includes("recipe") || lower.includes("ingredient")) {
    return "Here's a quick nourishing meal you can make with what you have. Your health matters too — not just your family's.";
  }

  if (lower.includes("journal") || lower.includes("feel") || lower.includes("emotion")) {
    return "Thank you for sharing that with me. What you're feeling is completely valid. You are not alone in this, and what you're carrying deserves to be acknowledged. Would you like to explore what's underneath this feeling together?";
  }

  return "SheCodes.AI is ready to help. Your fully personalised, intelligent AI companion is here to support your unique journey.";
}

// Made with Bob
