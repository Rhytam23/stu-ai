import { GoogleGenerativeAI } from "@google/generative-ai";

function validateApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY or GOOGLE_API_KEY is not set. Please configure the environment key."
    );
  }
  if (key.length < 10) {
    throw new Error("API Key appears to be invalid (too short).");
  }
  return key;
}

let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!_client) {
    const key = validateApiKey();
    _client = new GoogleGenerativeAI(key);
  }
  return _client;
}

export function getModel(modelName = "gemini-3.5-flash") {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
}
