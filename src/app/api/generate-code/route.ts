import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const SUPPORTED_LANGUAGES = [
  "python", "javascript", "typescript", "java", "c", "cpp",
  "go", "rust", "html", "css", "sql", "bash",
] as const;

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
    if (!checkRateLimit(`generate:${ip}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { prompt, language } = body as { prompt: string; language?: string };

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt is too long. Please limit to 2,000 characters." },
        { status: 400 }
      );
    }

    const lang = (language ?? "javascript").toLowerCase();
    if (!SUPPORTED_LANGUAGES.includes(lang as typeof SUPPORTED_LANGUAGES[number])) {
      return NextResponse.json(
        { error: `Unsupported language. Supported: ${SUPPORTED_LANGUAGES.join(", ")}` },
        { status: 400 }
      );
    }

    const model = getModel();

    const systemPrompt = `You are an expert software engineer. Generate production-quality ${lang} code based on the user's description.

Rules:
- Write complete, working code
- Add helpful comments explaining key parts
- Follow modern best practices and conventions for ${lang}
- Handle edge cases appropriately
- Do NOT include explanations outside the code — put all explanations as code comments
- Return ONLY the code block, no markdown fences, no extra text
- The code should be ready to use immediately`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nTask: ${prompt}` }] }],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.3,
      },
    });

    const response = await result.response;
    let code = response.text().trim();

    // Strip markdown code fences if model added them
    const fenceMatch = code.match(/^```(?:\w+)?\n?([\s\S]*?)```$/);
    if (fenceMatch) {
      code = fenceMatch[1].trim();
    }

    return NextResponse.json({ code, language: lang });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[/api/generate-code]", message);

    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 503 });
    }

    return NextResponse.json(
      { error: "Failed to generate code. Please try again." },
      { status: 500 }
    );
  }
}
