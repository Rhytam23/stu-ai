import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`prompt-lab:${ip}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { prompt } = body as { prompt: string };

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt is too long. Please limit to 1,000 characters." },
        { status: 400 }
      );
    }

    const model = getModel();

    const analysisPrompt = `You are an expert prompt engineer. Analyze this user prompt and rewrite it in three quality tiers.

User's prompt: "${prompt}"

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "weak": {
    "text": "The original weak/vague version of the prompt (similar to what user provided, possibly slightly simplified to show weakness)",
    "issues": ["Issue 1 with this prompt", "Issue 2", "Issue 3"]
  },
  "better": {
    "text": "An improved version with more context and specificity",
    "improvements": ["What was improved 1", "What was improved 2", "What was improved 3"]
  },
  "excellent": {
    "text": "An excellent, highly specific, structured prompt with role, context, constraints, and expected format",
    "whyExcellent": ["Why this is excellent 1", "Why this is excellent 2", "Why this is excellent 3"]
  },
  "keyLessons": ["General lesson about prompt engineering 1", "Lesson 2", "Lesson 3"]
}`;

    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const text = response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from model.");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[/api/improve-prompt]", message);

    if (message.includes("API_KEY")) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 503 });
    }

    return NextResponse.json(
      { error: "Failed to analyze prompt. Please try again." },
      { status: 500 }
    );
  }
}
