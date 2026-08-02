import { BaseProvider } from "./base";
import { AIProviderId, GeneratePayload, GenerateResponse } from "../types";
import type { Anthropic } from "@anthropic-ai/sdk";

export class ClaudeProvider extends BaseProvider {
  id: AIProviderId = "claude";
  private client: Anthropic | null = null;

  constructor() {
    super("ANTHROPIC_API_KEY");
  }

  private async getClient() {
    if (!this.client) {
      const key = this.getApiKey();
      const { Anthropic } = await import("@anthropic-ai/sdk");
      this.client = new Anthropic({ apiKey: key });
    }
    return this.client;
  }

  private getModelName(): string {
    return "claude-3-5-haiku-20241022";
  }

  async generate(payload: GeneratePayload): Promise<GenerateResponse> {
    try {
      const client = await this.getClient();

      const messages = [...payload.messages];
      const systemMessages = messages.filter((m) => m.role === "system");
      const systemPrompt =
        systemMessages.map((m) => m.content).join("\n") || payload.options?.systemInstruction;

      const filteredMessages = messages.filter((m) => m.role !== "system");
      if (filteredMessages.length === 0) {
        throw new Error("Cannot generate content: empty messages list.");
      }

      const anthropicMessages = filteredMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const modelName = this.getModelName();

      const completion = await client.messages.create({
        model: modelName,
        max_tokens: payload.options?.maxTokens ?? 4096,
        system: systemPrompt || undefined,
        messages: anthropicMessages,
        temperature: payload.options?.temperature ?? 0.7,
      });

      const content =
        completion.content[0]?.type === "text" ? completion.content[0].text : "";
      return { content };
    } catch (error) {
      console.error("[ClaudeProvider.generate]", error);
      throw error;
    }
  }

  async generateStream(payload: GeneratePayload): Promise<ReadableStream<Uint8Array>> {
    try {
      const client = await this.getClient();

      const messages = [...payload.messages];
      const systemMessages = messages.filter((m) => m.role === "system");
      const systemPrompt =
        systemMessages.map((m) => m.content).join("\n") || payload.options?.systemInstruction;

      const filteredMessages = messages.filter((m) => m.role !== "system");
      if (filteredMessages.length === 0) {
        throw new Error("Cannot generate stream: empty messages list.");
      }

      const anthropicMessages = filteredMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const modelName = this.getModelName();

      const stream = await client.messages.create({
        model: modelName,
        max_tokens: payload.options?.maxTokens ?? 4096,
        system: systemPrompt || undefined,
        messages: anthropicMessages,
        temperature: payload.options?.temperature ?? 0.7,
        stream: true,
      });

      const encoder = new TextEncoder();
      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (event.type === "content_block_delta" && event.delta && "text" in event.delta) {
                controller.enqueue(encoder.encode(event.delta.text));
              }
            }
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
          }
        },
      });
    } catch (error) {
      console.error("[ClaudeProvider.generateStream]", error);
      throw error;
    }
  }
}
