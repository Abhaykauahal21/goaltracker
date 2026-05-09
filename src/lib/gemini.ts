import OpenAI from "openai";

export const aiClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "missing",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "GoalTracker",
  }
});

// Using Gemini 2.0 Flash via OpenRouter (Cost effective)
export const AI_MODEL = "google/gemini-2.0-flash-001";
