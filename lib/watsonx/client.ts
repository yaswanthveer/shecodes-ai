// IBM watsonx AI Client
// Replace these with your actual API keys

const WATSONX_API_KEY = process.env.WATSONX_API_KEY || "";
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID || "";
const WATSONX_URL = process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com";

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${WATSONX_API_KEY}`,
  });

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken!;
}

export async function generateText(prompt: string, params?: {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  // If no API key, return mock response
  if (!WATSONX_API_KEY) {
    return getMockResponse(prompt);
  }

  try {
    const token = await getAccessToken();
    const model = params?.model || "ibm/granite-13b-instruct-v2";

    const res = await fetch(`${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        model_id: model,
        input: prompt,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: params?.maxTokens || 500,
          temperature: params?.temperature || 0.7,
          repetition_penalty: 1.1,
        },
        project_id: WATSONX_PROJECT_ID,
      }),
    });

    const data = await res.json();
    return data.results?.[0]?.generated_text || getMockResponse(prompt);
  } catch (error) {
    console.error("watsonx error:", error);
    return getMockResponse(prompt);
  }
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  emotions: string[];
}> {
  // Mock sentiment analysis — replace with IBM NLP when key provided
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

  return "SheCodes.AI is ready to help. Once you connect your IBM watsonx API key, you'll receive fully personalised, intelligent responses tailored to your unique journey.";
}
