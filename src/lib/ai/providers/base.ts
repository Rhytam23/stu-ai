import { AIProvider, AIProviderId, GeneratePayload, GenerateResponse } from "../types";

export abstract class BaseProvider implements AIProvider {
  abstract id: AIProviderId;
  protected apiKeyName: string;

  constructor(apiKeyName: string) {
    this.apiKeyName = apiKeyName;
  }

  protected getApiKey(): string {
    if (this.id === "gemini") {
      const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!key) {
        throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is not configured.");
      }
      if (key.length < 10) {
        throw new Error("Gemini API key appears to be invalid (too short).");
      }
      return key;
    }

    const key = process.env[this.apiKeyName];
    if (!key) {
      throw new Error(`API key for provider '${this.id}' (${this.apiKeyName}) is not set.`);
    }
    if (key.length < 10) {
      throw new Error(`API key for provider '${this.id}' (${this.apiKeyName}) appears to be invalid (too short).`);
    }
    return key;
  }

  abstract generate(payload: GeneratePayload): Promise<GenerateResponse>;
  abstract generateStream(payload: GeneratePayload): Promise<ReadableStream<Uint8Array>>;
}
