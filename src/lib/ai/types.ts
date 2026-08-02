export type AIProviderId = "gemini" | "openai" | "claude";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
}

export interface GeneratePayload {
  messages: AIMessage[];
  options?: GenerateOptions;
}

export interface GenerateResponse {
  content: string;
}

export interface AIProvider {
  id: AIProviderId;
  generate(payload: GeneratePayload): Promise<GenerateResponse>;
  generateStream(payload: GeneratePayload): Promise<ReadableStream<Uint8Array>>;
}
