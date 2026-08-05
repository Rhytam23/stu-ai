import { NextRequest, NextResponse } from "next/server";
import { aiRouter } from "@/lib/ai/router";
import { AIProviderId } from "@/lib/ai/types";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
    if (!checkRateLimit(`chat:${ip}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages, systemPrompt, provider } = body as {
      messages: Message[];
      systemPrompt?: string;
      provider?: AIProviderId;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required." },
        { status: 400 }
      );
    }

    if (messages.length > 50) {
      return NextResponse.json(
        { error: "Conversation too long. Please start a new conversation." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content || lastMessage.content.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    if (lastMessage.content.length > 8000) {
      return NextResponse.json(
        { error: "Message is too long. Please keep messages under 8000 characters." },
        { status: 400 }
      );
    }

    const defaultSystem = `You are an expert AI assistant specializing in artificial intelligence, machine learning, programming, and software engineering. 
Provide clear, accurate, and educational responses. Format code blocks with proper markdown syntax highlighting.
When explaining concepts, be thorough but accessible. When writing code, ensure it is production-quality, well-commented, and follows best practices.`;

    const aiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await aiRouter.generate(
      {
        messages: aiMessages,
        options: {
          systemInstruction: systemPrompt ?? defaultSystem,
          temperature: 0.7,
          maxTokens: 4096,
        },
      },
      provider
    );

    return NextResponse.json({ content: response.content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[/api/chat]", message);

    const isKeyOrQuotaError =
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("api_key") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("credit") ||
      message.toLowerCase().includes("billing") ||
      message.toLowerCase().includes("balance");

    if (isKeyOrQuotaError) {
      return NextResponse.json(
        { error: message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
