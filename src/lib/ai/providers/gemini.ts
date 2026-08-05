import { BaseProvider } from "./base";
import { AIProviderId, GeneratePayload, GenerateResponse } from "../types";
import type { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider extends BaseProvider {
  id: AIProviderId = "gemini";
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    super("GEMINI_API_KEY");
  }

  private async getClient() {
    if (!this.client) {
      const key = this.getApiKey();
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      this.client = new GoogleGenerativeAI(key);
    }
    return this.client;
  }

  private async executeWithFallback<T>(
    fn: (modelName: string) => Promise<T>
  ): Promise<T> {
    const models = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let lastError: any = null;

    for (const model of models) {
      try {
        return await fn(model);
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(`[GeminiProvider] Failed with model '${model}', trying next... Error:`, msg);
        // Only fallback on network/quota/temp errors
        if (
          msg.includes("503") || 
          msg.includes("429") || 
          msg.includes("404") || 
          msg.toLowerCase().includes("not found") || 
          msg.toLowerCase().includes("overloaded") || 
          msg.toLowerCase().includes("limit")
        ) {
          continue;
        }
        // If it's a structural error (e.g. empty messages), throw immediately
        throw err;
      }
    }
    throw lastError;
  }

  async generate(payload: GeneratePayload): Promise<GenerateResponse> {
    try {
      const client = await this.getClient();
      
      const systemMessage = payload.messages.find((m) => m.role === "system");
      const systemInstruction = systemMessage?.content || payload.options?.systemInstruction;
      
      const chatMessages = payload.messages.filter((m) => m.role !== "system");
      if (chatMessages.length === 0) {
        throw new Error("Cannot generate content: empty messages list.");
      }

      const isJson = payload.options?.responseFormat === "json";
      const lastMessage = chatMessages[chatMessages.length - 1];
      const history = chatMessages.slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const config = {
        temperature: payload.options?.temperature ?? 0.7,
        maxOutputTokens: payload.options?.maxTokens ?? 4096,
      };

      return await this.executeWithFallback(async (modelName) => {
        const modelInstance = client.getGenerativeModel({
          model: modelName,
          systemInstruction,
          generationConfig: isJson ? { responseMimeType: "application/json" } : undefined,
        });

        if (history.length > 0) {
          const chat = modelInstance.startChat({
            history,
            generationConfig: config,
          });
          const result = await chat.sendMessage(lastMessage.content);
          const response = await result.response;
          return { content: response.text() };
        } else {
          const result = await modelInstance.generateContent({
            contents: [{ role: "user", parts: [{ text: lastMessage.content }] }],
            generationConfig: config,
          });
          const response = await result.response;
          return { content: response.text() };
        }
      });
    } catch (error) {
      console.error("[GeminiProvider.generate]", error);
      throw error;
    }
  }

  async generateStream(payload: GeneratePayload): Promise<ReadableStream<Uint8Array>> {
    try {
      const client = await this.getClient();
      
      const systemMessage = payload.messages.find((m) => m.role === "system");
      const systemInstruction = systemMessage?.content || payload.options?.systemInstruction;
      
      const chatMessages = payload.messages.filter((m) => m.role !== "system");
      if (chatMessages.length === 0) {
        throw new Error("Cannot generate stream: empty messages list.");
      }

      const lastMessage = chatMessages[chatMessages.length - 1];
      const history = chatMessages.slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const config = {
        temperature: payload.options?.temperature ?? 0.7,
        maxOutputTokens: payload.options?.maxTokens ?? 4096,
      };

      return await this.executeWithFallback(async (modelName) => {
        const modelInstance = client.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });

        let resultStream: { stream: AsyncIterable<{ text(): string }> };
        if (history.length > 0) {
          const chat = modelInstance.startChat({
            history,
            generationConfig: config,
          });
          resultStream = await chat.sendMessageStream(lastMessage.content);
        } else {
          resultStream = await modelInstance.generateContentStream({
            contents: [{ role: "user", parts: [{ text: lastMessage.content }] }],
            generationConfig: config,
          });
        }

        const encoder = new TextEncoder();
        return new ReadableStream<Uint8Array>({
          async start(controller) {
            try {
              for await (const chunk of resultStream.stream) {
                const text = chunk.text();
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
      });
    } catch (error) {
      console.error("[GeminiProvider.generateStream]", error);
      throw error;
    }
  }
}
