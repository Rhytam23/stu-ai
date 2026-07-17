"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, CheckCircle, XCircle, Minus, ArrowRight,
  ArrowLeft, Star, DollarSign, Zap, Globe, BarChart2,
  RefreshCw, ChevronRight
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  subtitle?: string;
  options: { label: string; value: string; icon?: string }[];
  multi?: boolean;
}

interface AITool {
  name: string;
  logo: string;
  tagline: string;
  pricing: string;
  pricingDetail: string;
  contextWindow: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  supportsLocal: boolean;
  supportsImages: boolean;
  supportsLongContext: boolean;
  speed: "fast" | "medium" | "slow";
  categories: string[];
  languages: string[];
  budgetTier: "free" | "low" | "medium" | "high";
  useCases: string[];
  website: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "goal",
    text: "What are you primarily trying to do?",
    subtitle: "Select all that apply",
    multi: true,
    options: [
      { label: "Write & generate code", value: "code", icon: "💻" },
      { label: "Research & analysis", value: "research", icon: "🔍" },
      { label: "Writing & content", value: "writing", icon: "✍️" },
      { label: "Learning & studying", value: "learning", icon: "📚" },
      { label: "Debugging & fixing bugs", value: "debugging", icon: "🐛" },
      { label: "Presentations & documents", value: "presentation", icon: "📊" },
    ],
  },
  {
    id: "language",
    text: "Which programming language do you use most?",
    options: [
      { label: "Python", value: "python", icon: "🐍" },
      { label: "JavaScript / TypeScript", value: "javascript", icon: "🟨" },
      { label: "Java / Kotlin", value: "java", icon: "☕" },
      { label: "C / C++", value: "cpp", icon: "⚙️" },
      { label: "Go / Rust", value: "systems", icon: "🦀" },
      { label: "Multiple / Other", value: "multiple", icon: "🌐" },
    ],
  },
  {
    id: "experience",
    text: "What is your experience level?",
    options: [
      { label: "Beginner — still learning", value: "beginner", icon: "🌱" },
      { label: "Intermediate — comfortable with basics", value: "intermediate", icon: "🔧" },
      { label: "Advanced — professional developer", value: "advanced", icon: "🚀" },
      { label: "Expert — senior engineer / researcher", value: "expert", icon: "🎯" },
    ],
  },
  {
    id: "budget",
    text: "What is your monthly budget for AI tools?",
    options: [
      { label: "Free only", value: "free", icon: "🆓" },
      { label: "Up to $10/mo", value: "low", icon: "💰" },
      { label: "$10–$25/mo", value: "medium", icon: "💳" },
      { label: "$25+/mo or enterprise", value: "high", icon: "🏢" },
    ],
  },
  {
    id: "local",
    text: "Do you need a local / offline AI?",
    subtitle: "Important for privacy-sensitive environments",
    options: [
      { label: "Yes, local is required", value: "yes", icon: "🔒" },
      { label: "Preferred but not required", value: "preferred", icon: "🤔" },
      { label: "No, cloud is fine", value: "no", icon: "☁️" },
    ],
  },
  {
    id: "context",
    text: "Do you need long context windows?",
    subtitle: "For analyzing large codebases, long documents, etc.",
    options: [
      { label: "Yes, I work with large files", value: "yes", icon: "📄" },
      { label: "Sometimes", value: "sometimes", icon: "📋" },
      { label: "No, short conversations only", value: "no", icon: "💬" },
    ],
  },
  {
    id: "images",
    text: "Do you need image or multimodal support?",
    subtitle: "Sharing screenshots, diagrams, UI mockups with AI",
    options: [
      { label: "Yes, I share images often", value: "yes", icon: "🖼️" },
      { label: "Occasionally", value: "sometimes", icon: "📷" },
      { label: "No, text only", value: "no", icon: "💬" },
    ],
  },
  {
    id: "speed",
    text: "How important is response speed?",
    options: [
      { label: "Critical — I need instant responses", value: "critical", icon: "⚡" },
      { label: "Important but quality matters more", value: "balanced", icon: "⚖️" },
      { label: "Quality over speed always", value: "quality", icon: "🎯" },
    ],
  },
];

const AI_TOOLS: AITool[] = [
  {
    name: "ChatGPT (GPT-4o)",
    logo: "🤖",
    tagline: "OpenAI's flagship — most versatile general-purpose AI",
    pricing: "Free / $20/mo Plus",
    pricingDetail: "Free tier with GPT-4o mini; $20/mo for GPT-4o",
    contextWindow: "128K tokens",
    strengths: ["Extremely versatile across all tasks", "Strong reasoning & analysis", "DALL-E image generation", "Web browsing", "Plugin ecosystem", "Excellent for writing"],
    weaknesses: ["Rate limits on free tier", "Can hallucinate confidently", "No native IDE integration", "Privacy: data used for training (default)"],
    bestFor: ["General coding help", "Writing & content creation", "Research & analysis", "Brainstorming", "Image generation"],
    supportsLocal: false,
    supportsImages: true,
    supportsLongContext: true,
    speed: "fast",
    categories: ["general", "code", "writing", "research", "images"],
    languages: ["python", "javascript", "java", "cpp", "systems", "multiple"],
    budgetTier: "free",
    useCases: ["code", "writing", "research", "learning", "presentation"],
    website: "https://chat.openai.com",
  },
  {
    name: "Claude (Sonnet 4)",
    logo: "🧠",
    tagline: "Anthropic's safety-focused AI — best for complex reasoning",
    pricing: "Free / $20/mo Pro",
    pricingDetail: "Free with Claude 3 Haiku; $20/mo for Sonnet & Opus",
    contextWindow: "200K tokens",
    strengths: ["Best-in-class reasoning", "Very long 200K context", "Thoughtful & nuanced responses", "Strong code generation", "Low hallucination rate", "Excellent for senior engineers"],
    weaknesses: ["Occasional over-caution on edge cases", "No image generation", "Less tool integrations", "Slower than GPT-4o"],
    bestFor: ["Complex multi-file code analysis", "Long document review", "High-stakes code generation", "Research papers", "Architecture design"],
    supportsLocal: false,
    supportsImages: true,
    supportsLongContext: true,
    speed: "medium",
    categories: ["general", "code", "research"],
    languages: ["python", "javascript", "java", "cpp", "systems", "multiple"],
    budgetTier: "free",
    useCases: ["code", "research", "debugging", "learning"],
    website: "https://claude.ai",
  },
  {
    name: "Gemini (1.5 Pro)",
    logo: "✨",
    tagline: "Google's multimodal AI — biggest context window",
    pricing: "Free / $20/mo Advanced",
    pricingDetail: "Free with Gemini 1.5 Flash; $20/mo for 1.5 Pro",
    contextWindow: "1M tokens",
    strengths: ["1M token context window", "Multimodal (text/image/video/audio)", "Google Workspace integration", "Fast inference", "Free tier very capable", "Powers this portal!"],
    weaknesses: ["Less community adoption vs OpenAI", "Code generation can be inconsistent", "Less plugin ecosystem"],
    bestFor: ["Multimodal tasks", "Very long document analysis", "Google Workspace", "Fast responses", "Educational content"],
    supportsLocal: false,
    supportsImages: true,
    supportsLongContext: true,
    speed: "fast",
    categories: ["general", "code", "research", "images"],
    languages: ["python", "javascript", "java", "cpp", "multiple"],
    budgetTier: "free",
    useCases: ["code", "research", "writing", "learning", "presentation"],
    website: "https://gemini.google.com",
  },
  {
    name: "GitHub Copilot",
    logo: "🐙",
    tagline: "AI pair programmer built into your IDE",
    pricing: "$10/mo Individual",
    pricingDetail: "$10/mo Individual; $19/mo Business; $39/mo Enterprise",
    contextWindow: "~8K tokens",
    strengths: ["Deep IDE integration (VS Code, JetBrains, vim)", "Context-aware inline completions", "GitHub PR summaries", "Multi-IDE support", "Copilot Chat for questions"],
    weaknesses: ["Subscription required (no free tier)", "Privacy: code sent to cloud", "Limited context window", "Best in IDE, weak standalone"],
    bestFor: ["Inline code autocomplete", "Boilerplate generation", "Refactoring suggestions", "Test generation in IDE"],
    supportsLocal: false,
    supportsImages: false,
    supportsLongContext: false,
    speed: "fast",
    categories: ["code", "ide"],
    languages: ["python", "javascript", "java", "cpp", "systems", "multiple"],
    budgetTier: "low",
    useCases: ["code", "debugging"],
    website: "https://github.com/features/copilot",
  },
  {
    name: "Cursor",
    logo: "🖱️",
    tagline: "AI-first code editor — full codebase context",
    pricing: "Free / $20/mo Pro",
    pricingDetail: "Free: 2000 completions/mo; $20/mo Pro: unlimited",
    contextWindow: "~200K (with indexing)",
    strengths: ["Full codebase context via indexing", "Agent mode for multi-file edits", "Natural language code edits", "Privacy mode (local processing)", "VSCode-compatible extension marketplace"],
    weaknesses: ["Separate app from existing IDE", "Learning curve for new users", "Higher cost than Copilot", "Resource intensive"],
    bestFor: ["Codebase-wide refactoring", "Feature implementation across files", "Complex bug fixes", "Legacy code understanding"],
    supportsLocal: true,
    supportsImages: false,
    supportsLongContext: true,
    speed: "medium",
    categories: ["code", "ide"],
    languages: ["python", "javascript", "java", "cpp", "systems", "multiple"],
    budgetTier: "free",
    useCases: ["code", "debugging"],
    website: "https://cursor.com",
  },
  {
    name: "Amazon CodeWhisperer",
    logo: "☁️",
    tagline: "AWS-integrated coding AI with security scanning",
    pricing: "Free / $19/mo Professional",
    pricingDetail: "Individual tier free; Professional $19/mo/user",
    contextWindow: "~8K tokens",
    strengths: ["Free tier with no limits", "Deep AWS service awareness", "Real-time security vulnerability scanning", "Enterprise compliance (SOC 2)", "Reference tracker for open-source licensing"],
    weaknesses: ["Best only in AWS ecosystem", "Less powerful than cloud rivals", "Smaller community", "Limited languages compared to rivals"],
    bestFor: ["AWS cloud development", "Cloud-native code", "Enterprise security compliance", "Serverless & Lambda development"],
    supportsLocal: false,
    supportsImages: false,
    supportsLongContext: false,
    speed: "fast",
    categories: ["code", "cloud"],
    languages: ["python", "javascript", "java", "multiple"],
    budgetTier: "free",
    useCases: ["code", "debugging"],
    website: "https://aws.amazon.com/codewhisperer",
  },
  {
    name: "Tabnine",
    logo: "🔮",
    tagline: "Privacy-first AI — local models for sensitive codebases",
    pricing: "Free / $12/mo Pro",
    pricingDetail: "Free limited; $12/mo Pro; $39/mo Enterprise",
    contextWindow: "~2K tokens",
    strengths: ["Local / offline model available", "Privacy-first — code never leaves machine", "Team training on private codebase", "Fast completions", "GDPR compliant"],
    weaknesses: ["Less powerful than cloud rivals", "Chat features limited on free tier", "Smaller model capacity", "No web browsing or image support"],
    bestFor: ["Privacy-sensitive codebases", "Regulated industries", "Offline / airgapped environments", "Enterprise with strict data rules"],
    supportsLocal: true,
    supportsImages: false,
    supportsLongContext: false,
    speed: "fast",
    categories: ["code", "ide", "local"],
    languages: ["python", "javascript", "java", "cpp", "multiple"],
    budgetTier: "free",
    useCases: ["code", "debugging"],
    website: "https://tabnine.com",
  },
];

// ─── Scoring Engine ───────────────────────────────────────────────────────────

function scoreTool(tool: AITool, answers: Record<string, string | string[]>): number {
  let score = 50; // base score

  const goals = (answers.goal as string[]) || [];
  const budget = answers.budget as string;
  const local = answers.local as string;
  const context = answers.context as string;
  const images = answers.images as string;
  const speed = answers.speed as string;
  const experience = answers.experience as string;

  // Goal matching
  for (const goal of goals) {
    if (tool.useCases.includes(goal)) score += 8;
  }

  // Budget
  const budgetOrder = { free: 0, low: 1, medium: 2, high: 3 };
  const toolBudget = budgetOrder[tool.budgetTier];
  const userBudget = budgetOrder[budget as keyof typeof budgetOrder] ?? 0;
  if (toolBudget <= userBudget) score += 10;
  else score -= 15;

  // Local requirement
  if (local === "yes" && !tool.supportsLocal) score -= 30;
  if (local === "yes" && tool.supportsLocal) score += 20;
  if (local === "preferred" && tool.supportsLocal) score += 10;

  // Context window
  if (context === "yes" && !tool.supportsLongContext) score -= 20;
  if (context === "yes" && tool.supportsLongContext) score += 15;

  // Image support
  if (images === "yes" && !tool.supportsImages) score -= 20;
  if (images === "yes" && tool.supportsImages) score += 15;

  // Speed
  if (speed === "critical" && tool.speed === "fast") score += 10;
  if (speed === "critical" && tool.speed === "slow") score -= 10;
  if (speed === "quality" && tool.speed === "fast") score += 3; // still good

  // Experience level
  if (experience === "beginner" && (tool.name.includes("ChatGPT") || tool.name.includes("Gemini"))) score += 10;
  if ((experience === "advanced" || experience === "expert") && tool.name.includes("Cursor")) score += 8;
  if ((experience === "advanced" || experience === "expert") && tool.name.includes("Claude")) score += 8;

  return Math.max(0, Math.min(100, score));
}

function getRecommendationReason(tool: AITool, answers: Record<string, string | string[]>): string {
  const goals = (answers.goal as string[]) || [];
  const local = answers.local as string;
  const context = answers.context as string;
  const images = answers.images as string;

  const reasons: string[] = [];

  if (tool.supportsLocal && local === "yes") reasons.push("supports local/offline mode");
  if (tool.supportsLongContext && context === "yes") reasons.push("has a large context window");
  if (tool.supportsImages && images === "yes") reasons.push("supports image analysis");
  if (goals.includes("code") && tool.categories.includes("code")) reasons.push("excels at code generation");
  if (goals.includes("research") && tool.categories.includes("general")) reasons.push("great for research tasks");
  if (goals.includes("debugging") && tool.categories.includes("code")) reasons.push("strong debugging capabilities");

  if (reasons.length === 0) return "matches your overall requirements well.";
  return reasons.join(", ") + ".";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? "from-green-500 to-emerald-400"
    : score >= 50 ? "from-accent-primary to-blue-400"
    : "from-yellow-500 to-orange-400";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-linear-to-r ${color}`}
        />
      </div>
      <span className="text-sm font-bold text-white w-10 text-right">{score}%</span>
    </div>
  );
}

function ToolCard({ tool, score, reason, rank, comparing, onToggleCompare }: {
  tool: AITool;
  score: number;
  reason: string;
  rank: number;
  comparing: boolean;
  onToggleCompare: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const rankColors = ["from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    "from-slate-400/10 to-slate-300/10 border-slate-400/20",
    "from-orange-700/15 to-orange-600/15 border-orange-700/30",
  ];
  const rankLabels = ["🥇 Best Match", "🥈 Great Choice", "🥉 Good Option"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`glass-panel rounded-2xl overflow-hidden border ${
        comparing ? "border-accent-primary/50 shadow-[0_0_20px_rgba(110,231,255,0.1)]" : "border-white/10"
      }`}
    >
      {/* Rank banner */}
      {rank < 3 && (
        <div className={`px-5 py-2 bg-linear-to-r ${rankColors[rank]} border-b border-white/5 text-xs font-bold`}>
          {rankLabels[rank]}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              {tool.logo}
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">{tool.name}</h3>
              <p className="text-xs text-text-muted">{tool.tagline}</p>
            </div>
          </div>
          <button
            onClick={onToggleCompare}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              comparing
                ? "bg-accent-primary/20 border-accent-primary/40 text-accent-primary"
                : "bg-white/5 border-white/10 text-text-muted hover:text-white"
            }`}
          >
            {comparing ? "✓ Comparing" : "Compare"}
          </button>
        </div>

        {/* Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-muted font-medium">Match Score</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(score / 20) ? "text-yellow-400 fill-yellow-400" : "text-white/10"}`}
                />
              ))}
            </div>
          </div>
          <ScoreBar score={score} />
        </div>

        {/* Why recommended */}
        <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-accent-primary/5 border border-accent-primary/15">
          <ChevronRight className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="text-accent-primary font-medium">Why this fits you: </span>
            {reason}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/8">
            <DollarSign className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span className="text-xs text-text-muted">{tool.pricing}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/8">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs text-text-muted">{tool.contextWindow}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/8">
            <Zap className={`w-3.5 h-3.5 shrink-0 ${tool.speed === "fast" ? "text-yellow-400" : tool.speed === "medium" ? "text-blue-400" : "text-gray-400"}`} />
            <span className="text-xs text-text-muted capitalize">{tool.speed} speed</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/8">
            <span className="text-xs">{tool.supportsLocal ? "🔒" : "☁️"}</span>
            <span className="text-xs text-text-muted">{tool.supportsLocal ? "Local available" : "Cloud only"}</span>
          </div>
        </div>

        {/* Expand / Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          {expanded ? "Show less" : "Show strengths & weaknesses"}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-green-400 mb-2">✅ Strengths</p>
                  <ul className="space-y-1.5">
                    {tool.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-400 mb-2">❌ Weaknesses</p>
                  <ul className="space-y-1.5">
                    {tool.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /> {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent-primary mb-2">🎯 Best For</p>
                  <ul className="space-y-1.5">
                    {tool.bestFor.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <Minus className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-xs font-semibold hover:bg-accent-primary/20 transition-colors"
                >
                  Visit {tool.name.split(" ")[0]} <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CompareModal({ tools, onClose }: { tools: AITool[]; onClose: () => void }) {
  const dims = [
    { key: "pricing", label: "Pricing", icon: DollarSign },
    { key: "contextWindow", label: "Context Window", icon: Globe },
    { key: "supportsLocal", label: "Local AI", icon: Zap },
    { key: "supportsImages", label: "Image Support", icon: Star },
    { key: "speed", label: "Speed", icon: BarChart2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel rounded-2xl p-6 max-w-3xl w-full overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-white text-xl">Comparison</h3>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">✕</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-text-muted text-xs uppercase tracking-wider w-32">Feature</th>
              {tools.map((t) => (
                <th key={t.name} className="text-center py-3 px-3 text-white text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{t.logo}</span>
                    <span>{t.name.split(" ")[0]}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dims.map((dim, i) => (
              <tr key={dim.key} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                <td className="py-3 pr-4 text-xs text-text-muted font-medium">{dim.label}</td>
                {tools.map((t) => {
                  const val = t[dim.key as keyof AITool];
                  return (
                    <td key={t.name} className="py-3 px-3 text-center text-xs">
                      {typeof val === "boolean"
                        ? val ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                        : <span className="text-text-muted">{String(val)}</span>
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function FindAIPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [comparing, setComparing] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    if (question.multi) {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers((prev) => ({ ...prev, [question.id]: updated }));
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
      // Auto-advance for single select
      if (currentQ < QUESTIONS.length - 1) {
        setTimeout(() => setCurrentQ((prev) => prev + 1), 300);
      } else {
        setTimeout(() => setShowResults(true), 300);
      }
    }
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) setCurrentQ((prev) => prev + 1);
    else setShowResults(true);
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ((prev) => prev - 1);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQ(0);
    setShowResults(false);
    setComparing(new Set());
  };

  const toggleCompare = (name: string) => {
    setComparing((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else if (next.size < 3) next.add(name);
      return next;
    });
  };

  // Compute ranked results
  const rankedTools = AI_TOOLS.map((tool) => ({
    tool,
    score: scoreTool(tool, answers),
    reason: getRecommendationReason(tool, answers),
  })).sort((a, b) => b.score - a.score);

  const compareTools = AI_TOOLS.filter((t) => comparing.has(t.name));

  if (showResults) {
    return (
      <div className="relative min-h-screen bg-background text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-secondary/8 to-transparent pointer-events-none" />

        <PageHero
          badge="Your Results"
          title="Your AI"
          highlight="Recommendations"
          subtitle="Based on your answers, here are the best AI tools ranked specifically for your needs."
          icon={Compass}
        />

        <div className="max-w-5xl mx-auto px-6 pb-32 space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-text-muted hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retake Quiz
            </button>
            {comparing.size >= 2 && (
              <button
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary/20 border border-accent-primary/40 text-accent-primary text-sm font-semibold hover:bg-accent-primary/30 transition-colors"
              >
                <BarChart2 className="w-4 h-4" /> Compare {comparing.size} Tools
              </button>
            )}
            {comparing.size > 0 && comparing.size < 2 && (
              <p className="text-xs text-text-muted">Select {2 - comparing.size} more to compare</p>
            )}
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rankedTools.map(({ tool, score, reason }, idx) => (
              <ToolCard
                key={tool.name}
                tool={tool}
                score={score}
                reason={reason}
                rank={idx}
                comparing={comparing.has(tool.name)}
                onToggleCompare={() => toggleCompare(tool.name)}
              />
            ))}
          </div>
        </div>

        {/* Compare Modal */}
        <AnimatePresence>
          {showCompare && compareTools.length >= 2 && (
            <CompareModal tools={compareTools} onClose={() => setShowCompare(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  const currentAnswer = answers[question.id];
  const isMultiAnswered = question.multi && Array.isArray(currentAnswer) && currentAnswer.length > 0;

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-secondary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="AI Recommender"
        title="Find Your"
        highlight="AI Assistant"
        subtitle="Answer 8 quick questions and get a personalized AI tool recommendation with strengths, weaknesses, and pricing."
        icon={Compass}
      />

      <div className="max-w-2xl mx-auto px-6 pb-32">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span className="text-xs text-text-muted">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-linear-to-r from-accent-primary to-accent-secondary rounded-full"
            />
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">
                {question.text}
              </h2>
              {question.subtitle && (
                <p className="text-text-muted text-sm">{question.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((option) => {
                const isSelected = question.multi
                  ? Array.isArray(currentAnswer) && (currentAnswer as string[]).includes(option.value)
                  : currentAnswer === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-accent-primary/15 border-accent-primary/50 text-white shadow-[0_0_20px_rgba(110,231,255,0.1)]"
                        : "glass-panel glass-panel-hover text-text-muted hover:text-white"
                    }`}
                  >
                    {option.icon && (
                      <span className="text-xl shrink-0">{option.icon}</span>
                    )}
                    <span className="font-medium text-sm">{option.label}</span>
                    {isSelected && question.multi && (
                      <CheckCircle className="w-4 h-4 text-accent-primary ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handleBack}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-text-muted hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {question.multi && (
                <button
                  onClick={handleNext}
                  disabled={!isMultiAnswered}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-primary/20 border border-accent-primary/40 text-accent-primary font-semibold text-sm hover:bg-accent-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentQ === QUESTIONS.length - 1 ? "See Results" : "Next"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
