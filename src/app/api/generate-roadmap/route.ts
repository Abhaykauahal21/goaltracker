import { NextRequest, NextResponse } from "next/server";
import { aiClient, AI_MODEL } from "@/lib/gemini";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { isRateLimited } from "@/lib/rate-limit";

const roadmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  milestones: z.array(z.object({
    title: z.string(),
    tasks: z.array(z.object({
      title: z.string(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      links: z.array(z.string()).optional()
    }))
  }))
});

export async function POST(req: NextRequest) {
  try {
    console.log("[GENERATE_ROADMAP] Starting request...");

    if (!process.env.OPENROUTER_API_KEY) {
      console.log("[GENERATE_ROADMAP] Missing OPENROUTER_API_KEY");
      return NextResponse.json({ 
        error: "Configuration Error", 
        details: "Missing OPENROUTER_API_KEY in environment variables. Please add it to your .env file." 
      }, { status: 500 });
    }
    
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.error("[GENERATE_ROADMAP] Auth Error:", authError);
      return NextResponse.json({ error: "Authentication failed", details: authError instanceof Error ? authError.message : "Unknown auth error" }, { status: 401 });
    }

    if (!userId) {
      console.log("[GENERATE_ROADMAP] Unauthorized: No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limiting: 5 requests per 10 minutes
    if (isRateLimited(userId, 5, 600000)) {
      console.log(`[GENERATE_ROADMAP] Rate limit exceeded for user: ${userId}`);
      return NextResponse.json({ 
        error: "Too many requests", 
        details: "You have exceeded the limit of 5 roadmap generations per 10 minutes. Please try again later." 
      }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
      console.log("[GENERATE_ROADMAP] Request body:", body);
    } catch (bodyError) {
      console.error("[GENERATE_ROADMAP] Body Parse Error:", bodyError);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    
    const { topic, duration, level, goal } = body;

    if (!topic || !duration || !level) {
      console.log("[GENERATE_ROADMAP] Missing fields");
      return new NextResponse("Missing required fields", { status: 400 });
    }

    console.log("[GENERATE_ROADMAP] Calling Gemini API...");
    const systemPrompt = `
      You are an expert roadmap planner.
      Generate a detailed, structured learning or productivity roadmap based on the user's input.
      
      CRITICAL: You must return the response in STRICT JSON format only.
      DO NOT include any markdown formatting (like \`\`\`json), no explanation text, and no extra characters.
      Just the raw JSON object.

      The JSON structure MUST be:
      {
        "title": "Roadmap Title",
        "description": "Comprehensive description of the journey",
        "milestones": [
          {
            "title": "Milestone Title",
            "tasks": [
              {
                "title": "Task Title",
                "priority": "LOW" | "MEDIUM" | "HIGH",
                "links": ["https://resource-link.com"]
              }
            ]
          }
        ]
      }

      Guidelines:
      - Milestones should be logical phases of the journey.
      - Tasks should be actionable and specific.
      - Include 1-3 useful learning/resource links per task if applicable.
      - Ensure the roadmap fits the specified duration and level.
    `;

    const userPrompt = `
      Topic: ${topic}
      Duration: ${duration}
      Level: ${level}
      Goal/Focus: ${goal || "General mastery"}
    `;

    let text = "";
    let lastError: any = null;
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        console.log(`[GENERATE_ROADMAP] Calling OpenRouter API (${AI_MODEL}) (Attempt ${attempt + 1}/${MAX_RETRIES})...`);
        
        const completion = await aiClient.chat.completions.create({
          model: AI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          max_tokens: 2000
        });

        text = completion.choices[0].message.content || "";
        console.log("[GENERATE_ROADMAP] AI Response text length:", text.length);
        break; // Success, exit loop
      } catch (aiError) {
        lastError = aiError;
        attempt++;
        
        const errorMessage = aiError instanceof Error ? aiError.message : "Unknown AI error";
        
        if (attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`[GENERATE_ROADMAP] Attempt ${attempt} failed. Retrying in ${delay}ms...`, errorMessage);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error("[GENERATE_ROADMAP] All attempts failed:", aiError);
          return NextResponse.json({ 
            error: `AI Generation failed after ${MAX_RETRIES} attempts: ${errorMessage}`,
            details: errorMessage
          }, { status: 500 });
        }
      }
    }

    // Clean potential markdown or extra text if any
    const cleanJson = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const roadmapData = JSON.parse(cleanJson);
      const validatedData = roadmapSchema.parse(roadmapData);
      
      return NextResponse.json(validatedData);
    } catch (parseError) {
      console.error("AI Response Parsing Error:", parseError);
      console.error("Raw Text received from AI:", text);
      console.error("Cleaned JSON attempted to parse:", cleanJson);
      
      return NextResponse.json({ 
        error: "Failed to parse AI response", 
        details: parseError instanceof Error ? parseError.message : "Unknown error",
        raw: text 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("[GENERATE_ROADMAP_ERROR]", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
