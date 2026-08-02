import { BaseProvider } from "./base";
import { AIProviderId, GeneratePayload, GenerateResponse } from "../types";
import type { OpenAI } from "openai";

export class OpenAIProvider extends BaseProvider {
  id: AIProviderId = "openai";
  private client: OpenAI | null = null;

  constructor() {
    super("OPENAI_API_KEY");
  }

  private async getClient() {
    if (!this.client) {
      const key = this.getApiKey();
      const { OpenAI } = await import("openai");
      this.client = new OpenAI({ apiKey: key });
    }
    return this.client;
  }

  private getModelName(): string {
    return "gpt-4o-mini";
  }

  async generate(payload: GeneratePayload): Promise<GenerateResponse> {
    try {
      const client = await this.getClient();
      
      const messages = [...payload.messages];
      const systemMessage = messages.find((m) => m.role === "system");
      if (!systemMessage && payload.options?.systemInstruction) {
        messages.unshift({ role: "system", content: payload.options.systemInstruction });
      }

      const openAIMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const modelName = this.getModelName();
      const isJson = payload.options?.responseFormat === "json";

      const completion = await client.chat.completions.create({
        model: modelName,
        messages: openAIMessages,
        temperature: payload.options?.temperature ?? 0.7,
        max_tokens: payload.options?.maxTokens ?? 4096,
        response_format: isJson ? { type: "json_object" } : undefined,
      });

      const content = completion.choices[0]?.message?.content || "";
      return { content };
    } catch (error) {
      console.error("[OpenAIProvider.generate]", error);
      throw error;
    }
  }

  async generateStream(payload: GeneratePayload): Promise<ReadableStream<Uint8Array>> {
    try {
      const client = await this.getClient();

      const messages = [...payload.messages];
      const systemMessage = messages.find((m) => m.role === "system");
      if (!systemMessage && payload.options?.systemInstruction) {
        messages.unshift({ role: "system", content: payload.options.systemInstruction });
      }

      const openAIMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const modelName = this.getModelName();

      const stream = await client.chat.completions.create({
        model: modelName,
        messages: openAIMessages,
        temperature: payload.options?.temperature ?? 0.7,
        max_tokens: payload.options?.maxTokens ?? 4096,
        stream: true,
      });

      const encoder = new TextEncoder();
      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
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
      console.error("[OpenAIProvider.generateStream]", error);
      throw error;
    }
  }
}
