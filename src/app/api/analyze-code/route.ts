import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

type Action =
  | "explain"
  | "debug"
  | "optimize"
  | "comments"
  | "bugs"
  | "readability"
  | "best-practices"
  | "tests"
  | "convert";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function buildPrompt(
  action: Action,
  code: string,
  language: string,
  targetLanguage?: string
): string {
  const ctx = `Language: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;

  switch (action) {
    case "explain":
      return `${ctx}Explain this code clearly. Describe what it does, how it works step by step, its purpose, and any notable patterns or algorithms used. Use markdown with code examples where helpful.`;

    case "debug":
      return `${ctx}Debug this code. Identify all bugs, logic errors, potential runtime exceptions, and edge cases. For each issue, explain the problem and show the fix with corrected code. Use markdown with syntax-highlighted code blocks.`;

    case "optimize":
      return `${ctx}Optimize this code for performance and efficiency. Identify bottlenecks, suggest algorithmic improvements, and provide an optimized version with explanations for each change. Use markdown with before/after code comparisons.`;

    case "comments":
      return `${ctx}Add comprehensive, professional inline comments to this code. Explain the purpose of each function, important logic blocks, and non-obvious operations. Return ONLY the commented code in a single code block.`;

    case "bugs":
      return `${ctx}Perform a thorough bug analysis. List every potential bug, security vulnerability, null pointer risk, off-by-one error, and edge case. For each bug, provide severity (Critical/High/Medium/Low), description, and the corrected code. Use markdown formatting.`;

    case "readability":
      return `${ctx}Improve the readability of this code. Suggest better variable names, restructure complex expressions, add appropriate whitespace, and show a refactored version that is cleaner and more maintainable. Use markdown with the refactored code.`;

    case "best-practices":
      return `${ctx}Review this code against industry best practices for ${language}. Identify violations of SOLID principles, common anti-patterns, error handling issues, and style guide violations. Provide actionable recommendations with code examples. Use markdown.`;

    case "tests":
      return `${ctx}Generate comprehensive unit tests for this code using the most popular testing framework for ${language} (e.g. pytest for Python, Jest for JavaScript/TypeScript, JUnit for Java). Cover happy path, edge cases, error scenarios, and boundary conditions. Return well-structured test code.`;

    case "convert":
      return `${ctx}Convert this ${language} code to ${targetLanguage || "Python"} while preserving all functionality, logic, and behavior. Use idiomatic ${targetLanguage || "Python"} patterns and conventions. Return the complete converted code in a single code block.`;

    default:
      return `${ctx}Analyze this code and provide useful feedback.`;
  }
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
    const { code, language, action, targetLanguage } = body as {
      code: string;
      language: string;
      action: Action;
      targetLanguage?: string;
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

    const validActions: Action[] = [
      "explain", "debug", "optimize", "comments", "bugs",
      "readability", "best-practices", "tests", "convert",
    ];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const model = getModel();
    const prompt = buildPrompt(action, code, language, targetLanguage);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.3 },
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text, action, language });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[/api/analyze-code]", message);

    if (message.includes("API_KEY")) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 503 });
    }

    return NextResponse.json(
      { error: "Failed to analyze code. Please try again." },
      { status: 500 }
    );
  }
}
