import { GoogleGenerativeAI } from "@google/generative-ai";

function validateApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Create a .env.local file with GEMINI_API_KEY=your_key_here"
    );
  }
  if (key.length < 10) {
    throw new Error("GEMINI_API_KEY appears to be invalid (too short).");
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

export function getModel(modelName = "gemini-2.5-flash") {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
}
