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

  private getModelName(): string {
    // If responseFormat is json, we must use gemini-3.5-pro or 3.5-flash which support it.
    // gemini-3.5-flash is our default.
    return "gemini-3.5-flash";
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

      const modelName = this.getModelName();
      const isJson = payload.options?.responseFormat === "json";

      const modelInstance = client.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: isJson ? { responseMimeType: "application/json" } : undefined,
      });

      const lastMessage = chatMessages[chatMessages.length - 1];
      const history = chatMessages.slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const config = {
        temperature: payload.options?.temperature ?? 0.7,
        maxOutputTokens: payload.options?.maxTokens ?? 4096,
      };

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

      const modelName = this.getModelName();
      const modelInstance = client.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const lastMessage = chatMessages[chatMessages.length - 1];
      const history = chatMessages.slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const config = {
        temperature: payload.options?.temperature ?? 0.7,
        maxOutputTokens: payload.options?.maxTokens ?? 4096,
      };

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
    } catch (error) {
      console.error("[GeminiProvider.generateStream]", error);
      throw error;
    }
  }
}
