import { NextRequest, NextResponse } from "next/server";
import { aiRouter } from "@/lib/ai/router";
import { AIProviderId } from "@/lib/ai/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildPrompt, VALID_ACTIONS, type Action } from "@/lib/code-analysis";

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
    if (!checkRateLimit(`analyze-code:${ip}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, language, action, targetLanguage, provider } = body as {
      code: string;
      language: string;
      action: Action;
      targetLanguage?: string;
      provider?: AIProviderId;
    };

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ error: "Code is required." }, { status: 400 });
    }

    if (code.length > 10000) {
      return NextResponse.json(
        { error: "Code is too long. Please limit to 10,000 characters." },
        { status: 400 }
      );
    }

    if (!language) {
      return NextResponse.json({ error: "Language is required." }, { status: 400 });
    }

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const prompt = buildPrompt(action, code, language, targetLanguage);

    const response = await aiRouter.generate(
      {
        messages: [{ role: "user", content: prompt }],
        options: {
          temperature: 0.3,
          maxTokens: 4096,
        },
      },
      provider
    );

    const text = response.content;

    return NextResponse.json({ result: text, action, language });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[/api/analyze-code]", message);

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
      { error: "Failed to analyze code. Please try again." },
      { status: 500 }
    );
  }
}
