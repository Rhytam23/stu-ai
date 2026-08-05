import { NextRequest, NextResponse } from "next/server";
import { aiRouter } from "@/lib/ai/router";
import { AIProviderId } from "@/lib/ai/types";
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
    const { prompt, provider } = body as { prompt: string; provider?: AIProviderId };

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt is too long. Please limit to 1,000 characters." },
        { status: 400 }
      );
    }

    const analysisPrompt = `You are an expert prompt engineer teaching students how to write better AI prompts. Analyze this user prompt and rewrite it in three quality tiers.

User's prompt: "${prompt}"

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "weak": {
    "text": "The original weak/vague version of the prompt (similar to what user provided, possibly slightly simplified to show weakness)",
    "issues": ["Issue 1 with this prompt", "Issue 2", "Issue 3"],
    "quality": "Low — Unpredictable results",
    "mistakes": ["Common mistake made here 1", "Common mistake 2"]
  },
  "better": {
    "text": "An improved version with more context and specificity",
    "improvements": ["What was improved 1", "What was improved 2", "What was improved 3"],
    "quality": "Medium — Consistent but improvable",
    "bestPractices": ["Best practice used 1", "Best practice 2"]
  },
  "professional": {
    "text": "A professional, highly specific, structured prompt with role, context, constraints, format, and examples",
    "whyProfessional": ["Why this is professional 1", "Why 2", "Why 3"],
    "quality": "High — Expert-level output guaranteed",
    "bestPractices": ["Advanced technique used 1", "Technique 2", "Technique 3"]
  },
  "keyLessons": ["General lesson about prompt engineering 1", "Lesson 2", "Lesson 3"]
}`;

    const response = await aiRouter.generate(
      {
        messages: [{ role: "user", content: analysisPrompt }],
        options: {
          temperature: 0.3,
          maxTokens: 4096,
          responseFormat: "json",
        },
      },
      provider
    );

    const text = response.content.trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from model.");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[/api/improve-prompt]", message);

    const isKeyOrQuotaError =
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("api_key") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("credit") ||
      message.toLowerCase().includes("billing") ||
      message.toLowerCase().includes("balance");

    if (isKeyOrQuotaError) {
      return NextResponse.json({ error: message }, { status: 503 });
    }

    return NextResponse.json(
      { error: "Failed to analyze prompt. Please try again." },
      { status: 500 }
    );
  }
}
