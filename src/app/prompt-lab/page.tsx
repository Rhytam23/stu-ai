"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, ArrowDown, AlertCircle, CheckCircle, ChevronRight,
  Copy, Check, BarChart2, BookOpen, AlertTriangle
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import LoadingDots from "@/components/ui/LoadingDots";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PromptTier {
  text: string;
  issues?: string[];
  improvements?: string[];
  whyProfessional?: string[];
  quality?: string;
  mistakes?: string[];
  bestPractices?: string[];
}

interface PromptResult {
  weak: PromptTier;
  better: PromptTier;
  professional?: PromptTier;
  excellent?: PromptTier;  // backward compat with old API response
  keyLessons: string[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TIER_CONFIG = [
  {
    key: "weak" as const,
    label: "Weak Prompt",
    emoji: "❌",
    color: "border-red-500/30 bg-red-500/5",
    headerColor: "text-red-400",
    badgeColor: "bg-red-500/15 border-red-500/30 text-red-400",
    reasonsLabel: "Issues",
    reasonsKey: "issues" as const,
    reasonsColor: "text-red-400",
    mistakesKey: "mistakes" as const,
    qualityColor: "text-red-400",
  },
  {
    key: "better" as const,
    label: "Better Prompt",
    emoji: "⚡",
    color: "border-yellow-500/30 bg-yellow-500/5",
    headerColor: "text-yellow-400",
    badgeColor: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
    reasonsLabel: "Improvements",
    reasonsKey: "improvements" as const,
    reasonsColor: "text-yellow-400",
    bestPracticesKey: "bestPractices" as const,
    qualityColor: "text-yellow-400",
  },
  {
    key: "professional" as const,
    label: "Professional Prompt",
    emoji: "✅",
    color: "border-green-500/30 bg-green-500/5",
    headerColor: "text-green-400",
    badgeColor: "bg-green-500/15 border-green-500/30 text-green-400",
    reasonsLabel: "Why Professional",
    reasonsKey: "whyProfessional" as const,
    reasonsColor: "text-green-400",
    bestPracticesKey: "bestPractices" as const,
    qualityColor: "text-green-400",
  },
];

const EXAMPLE_PROMPTS = [
  "Write code to sort a list",
  "Make a website",
  "Help with Python",
  "Explain neural networks",
  "Debug my function",
  "Create a REST API",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-text-muted hover:text-white hover:bg-white/10 transition-colors"
      title="Copy prompt"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PromptLabPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<PromptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improve = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        let errMsg = "Failed to analyze prompt.";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await res.json();
            errMsg = errData.error || errMsg;
          } else {
            const text = await res.text();
            errMsg = text || errMsg;
          }
        } catch { /* ignore */ }
        throw new Error(errMsg);
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-pink-500/5 to-transparent pointer-events-none" />

      <PageHero
        badge="Prompt Engineering"
        title="Prompt"
        highlight="Lab"
        subtitle="Enter any prompt and watch Gemini AI transform it through three quality tiers — learning what makes an excellent prompt along the way."
        icon={Wand2}
      />

      <div className="max-w-4xl mx-auto px-6 pb-32 space-y-8">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 space-y-4"
        >
          <label className="block text-sm font-medium text-white">
            Enter a prompt to analyze and improve:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm text-white leading-relaxed resize-none focus:outline-none focus:border-pink-500/40 transition-colors placeholder-text-muted/50"
            placeholder="e.g. Write some code for me"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) improve(); }}
          />

          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-xs px-3.5 py-2 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-colors min-h-[38px] md:min-h-[32px]"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={improve}
            disabled={!prompt.trim() || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 hover:border-pink-500/50 text-pink-300 font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingDots label="Analyzing" />
            ) : (
              <><Wand2 className="w-4 h-4" /> Analyze &amp; Improve</>
            )}
          </button>
          <p className="text-xs text-text-muted">Tip: Press Ctrl+Enter to submit</p>
        </motion.div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm glass-panel rounded-xl p-4">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="font-display font-bold text-2xl text-white">Prompt Analysis</h2>

              {TIER_CONFIG.map((tier, idx) => {
                // Handle both old 'excellent' key and new 'professional' key
                const tierData: PromptTier | undefined =
                  result[tier.key as keyof PromptResult] as PromptTier | undefined
                  ?? (result.excellent ?? result.professional);
                if (!tierData) return null;

                const reasons = (tierData[tier.reasonsKey as keyof PromptTier] as string[] | undefined) ?? [];
                const mistakes = (tierData as PromptTier).mistakes ?? [];
                const bestPractices =
                  "bestPracticesKey" in tier
                    ? ((tierData as PromptTier).bestPractices ?? [])
                    : [];
                const quality = tierData.quality;

                return (
                  <motion.div
                    key={tier.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    {idx > 0 && (
                      <div className="flex justify-center my-2">
                        <div className="flex flex-col items-center gap-1">
                          <ArrowDown className="w-5 h-5 text-text-muted" />
                          <span className="text-xs text-text-muted">improved</span>
                        </div>
                      </div>
                    )}

                    <div className={`glass-panel rounded-2xl p-6 border ${tier.color}`}>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tier.emoji}</span>
                          <h3 className={`font-display font-semibold text-lg ${tier.headerColor}`}>
                            {tier.label}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {quality && (
                            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${tier.badgeColor}`}>
                              <BarChart2 className="w-3.5 h-3.5" />
                              {quality}
                            </div>
                          )}
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tier.badgeColor}`}>
                            {tier.key.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Prompt text + Copy */}
                      <div className="relative mb-4">
                        <div className="bg-[#0d1117] rounded-xl p-4 pr-24 font-mono text-sm text-white/90 leading-relaxed border border-white/5">
                          &ldquo;{tierData.text}&rdquo;
                        </div>
                        <div className="absolute top-3 right-3">
                          <CopyButton text={tierData.text} />
                        </div>
                      </div>

                      {/* Reasons (Issues / Improvements / Why Professional) */}
                      {reasons.length > 0 && (
                        <div className="mb-4">
                          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${tier.reasonsColor}`}>
                            <ChevronRight className="w-3.5 h-3.5" /> {tier.reasonsLabel}
                          </p>
                          <ul className="space-y-1.5">
                            {reasons.map((reason: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${tier.reasonsColor}`} />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Common Mistakes (weak tier) */}
                      {mistakes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-orange-400">
                            <AlertTriangle className="w-3.5 h-3.5" /> Common Mistakes
                          </p>
                          <ul className="space-y-1.5">
                            {mistakes.map((m: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-400" />
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Best Practices (better / professional) */}
                      {bestPractices.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-accent-primary">
                            <BookOpen className="w-3.5 h-3.5" /> Best Practices Used
                          </p>
                          <ul className="space-y-1.5">
                            {bestPractices.map((bp: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-primary" />
                                {bp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Key Lessons */}
              {result.keyLessons?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-panel rounded-2xl p-6 border border-accent-primary/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-accent-primary" />
                    <h3 className="font-display font-semibold text-white text-lg">
                      Key Prompt Engineering Lessons
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {result.keyLessons.map((lesson, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                        <span className="text-accent-primary font-bold mt-0.5">{i + 1}.</span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Static intro when no result */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                emoji: "❌",
                title: "Weak Prompt",
                desc: "Vague, missing context, no format guidance. Gets unpredictable results.",
                examples: ["Write code", "Help me", "Fix this"],
              },
              {
                emoji: "⚡",
                title: "Better Prompt",
                desc: "Adds context, specifies requirements. Results are more consistent.",
                examples: ["Add context", "Specify language", "State goal"],
              },
              {
                emoji: "✅",
                title: "Professional Prompt",
                desc: "Role, context, constraints, examples, output format. Gets exactly what you need.",
                examples: ["Define role", "Set constraints", "Specify format"],
              },
            ].map((tier, i) => (
              <div key={i} className="glass-panel rounded-2xl p-5 space-y-3">
                <span className="text-3xl">{tier.emoji}</span>
                <h3 className="font-semibold text-white">{tier.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{tier.desc}</p>
                <div className="flex flex-col gap-1.5 pt-1">
                  {tier.examples.map((ex, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-text-muted">
                      <ChevronRight className="w-3 h-3 text-accent-primary shrink-0" />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
