import { NextRequest } from "next/server";
import { aiRouter } from "@/lib/ai/router";
import { AIProviderId } from "@/lib/ai/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildPrompt, VALID_ACTIONS, type Action } from "@/lib/code-analysis";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`stream-analyze:${ip}`)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: {
    code?: string;
    language?: string;
    action?: Action;
    targetLanguage?: string;
    provider?: AIProviderId;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { code, language, action, targetLanguage, provider } = body;

  if (!code || code.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Code is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (code.length > 10000) {
    return new Response(
      JSON.stringify({ error: "Code too long. Limit to 10,000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!language || !action || !VALID_ACTIONS.includes(action)) {
    return new Response(JSON.stringify({ error: "Invalid request parameters." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const prompt = buildPrompt(action, code, language, targetLanguage);
    const stream = await aiRouter.generateStream(
      {
        messages: [{ role: "user", content: prompt }],
        options: {
          temperature: 0.3,
          maxTokens: 4096,
        },
      },
      provider
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Accel-Buffering": "no",
        "X-Content-Type-Options": "nosniff",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[/api/stream-analyze]", message);

    const isKeyOrQuotaError =
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("api_key") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("credit") ||
      message.toLowerCase().includes("billing") ||
      message.toLowerCase().includes("balance");

    if (isKeyOrQuotaError) {
      return new Response(JSON.stringify({ error: message }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to stream response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
