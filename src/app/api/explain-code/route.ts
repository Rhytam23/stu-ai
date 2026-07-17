import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const SUPPORTED_LANGUAGES = ["python", "java", "c", "cpp", "javascript", "typescript"] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

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
    if (!checkRateLimit(`explain:${ip}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, language } = body as { code: string; language: string };

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "Code is required." },
        { status: 400 }
      );
    }

    if (code.length > 10000) {
      return NextResponse.json(
        { error: "Code is too long. Please limit to 10,000 characters." },
        { status: 400 }
      );
    }

    const lang = (language ?? "").toLowerCase() as SupportedLanguage;
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      return NextResponse.json(
        { error: `Unsupported language. Supported: ${SUPPORTED_LANGUAGES.join(", ")}` },
        { status: 400 }
      );
    }

    const model = getModel("gemini-1.5-flash");

    const prompt = `You are an expert ${lang} developer and computer science educator. Analyze the following ${lang} code and provide a structured explanation.

Return your response in this EXACT JSON format (no markdown wrapping, just raw JSON):
{
  "summary": "A clear 2-3 sentence description of what the code does overall",
  "breakdown": [
    { "section": "Section name", "explanation": "What this part does" }
  ],
  "timeComplexity": "Big-O time complexity with brief explanation",
  "spaceComplexity": "Big-O space complexity with brief explanation",
  "bugs": ["Bug or issue 1", "Bug or issue 2"],
  "improvements": ["Improvement suggestion 1", "Improvement suggestion 2"],
  "bestPractices": ["Best practice point 1", "Best practice point 2"],
  "improvedCode": "The improved version of the code (as a string, properly escaped)"
}

If there are no bugs, return an empty array for bugs. Same for improvements and bestPractices if none apply.

Code to analyze:
\`\`\`${lang}
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Extract JSON from response (handle cases where model wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Model returned invalid JSON format.");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[/api/explain-code]", message);

    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze code. Please try again." },
      { status: 500 }
    );
  }
}
