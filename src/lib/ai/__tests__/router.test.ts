import { describe, it, expect, beforeEach } from "vitest";
import { AIRouter } from "../router";

describe("AIRouter Resolution & Fallbacks", () => {
  let router: AIRouter;

  beforeEach(() => {
    router = new AIRouter();
    // Clear relevant environment variables to prevent test cross-contamination
    delete process.env.DEFAULT_AI_PROVIDER;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("should default to gemini if GEMINI_API_KEY is configured", () => {
    process.env.GEMINI_API_KEY = "mock-gemini-key-value-long-enough-to-pass-validation";
    expect(router.resolveActiveProvider()).toBe("gemini");
  });

  it("should respect DEFAULT_AI_PROVIDER environment variable", () => {
    process.env.DEFAULT_AI_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "mock-openai-key-value-long-enough-to-pass-validation";
    expect(router.resolveActiveProvider()).toBe("openai");
  });

  it("should automatically fall back to openai if gemini keys are missing but openai is configured", () => {
    process.env.OPENAI_API_KEY = "mock-openai-key-value-long-enough-to-pass-validation";
    expect(router.resolveActiveProvider()).toBe("openai");
  });

  it("should automatically fall back to claude if gemini/openai keys are missing but anthropic is configured", () => {
    process.env.ANTHROPIC_API_KEY = "mock-anthropic-key-value-long-enough-to-pass-validation";
    expect(router.resolveActiveProvider()).toBe("claude");
  });

  it("should use manual provider override instead of active default", () => {
    process.env.GEMINI_API_KEY = "mock-gemini-key-value-long-enough-to-pass-validation";
    process.env.OPENAI_API_KEY = "mock-openai-key-value-long-enough-to-pass-validation";

    // Default resolves to gemini
    expect(router.resolveActiveProvider()).toBe("gemini");

    // Requesting override
    const provider = router.getProvider("openai");
    expect(provider.id).toBe("openai");
  });

  it("should throw error if unsupported provider override is passed", () => {
    expect(() => router.getProvider("grok" as unknown as "gemini")).toThrow();
  });
});
