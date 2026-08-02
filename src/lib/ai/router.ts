import { AIProvider, AIProviderId, GeneratePayload, GenerateResponse } from "./types";
import { GeminiProvider } from "./providers/gemini";
import { OpenAIProvider } from "./providers/openai";
import { ClaudeProvider } from "./providers/claude";

export class AIRouter {
  private providers: Record<AIProviderId, AIProvider>;

  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      openai: new OpenAIProvider(),
      claude: new ClaudeProvider(),
    };
  }

  getProvider(providerId?: AIProviderId): AIProvider {
    const targetId = providerId || this.resolveActiveProvider();
    const provider = this.providers[targetId];
    if (!provider) {
      throw new Error(`Unsupported AI provider: '${targetId}'`);
    }
    return provider;
  }

  resolveActiveProvider(): AIProviderId {
    // 1. Check DEFAULT_AI_PROVIDER env variable
    const defaultProvider = process.env.DEFAULT_AI_PROVIDER as AIProviderId;
    if (defaultProvider && ["gemini", "openai", "claude"].includes(defaultProvider)) {
      return defaultProvider;
    }

    // 2. Check key existence priorities (Gemini -> OpenAI -> Claude)
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      return "gemini";
    }
    if (process.env.OPENAI_API_KEY) {
      return "openai";
    }
    if (process.env.ANTHROPIC_API_KEY) {
      return "claude";
    }

    return "gemini"; // fallback default
  }

  async generate(payload: GeneratePayload, providerId?: AIProviderId): Promise<GenerateResponse> {
    const provider = this.getProvider(providerId);
    return provider.generate(payload);
  }

  async generateStream(
    payload: GeneratePayload,
    providerId?: AIProviderId
  ): Promise<ReadableStream<Uint8Array>> {
    const provider = this.getProvider(providerId);
    return provider.generateStream(payload);
  }
}

export const aiRouter = new AIRouter();
export default aiRouter;
