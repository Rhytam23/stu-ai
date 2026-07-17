"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, CheckCircle, XCircle, ArrowRight, ArrowLeft,
  Star, DollarSign, Zap, Globe, BarChart2, RefreshCw,
  ChevronRight, Trophy, Lightbulb
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  bestUseCases: string[];
  speed: "fast" | "medium" | "slow";
  supportsImages: boolean;
  supportsIDE: boolean;
  budgetTier: "free" | "low" | "medium";
  useCases: string[];
  website: string;
  studentTip: string;
}

// ─── Student-focused Questions ────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "goal",
    text: "What do you mainly want help with?",
    subtitle: "Select all that apply",
    multi: true,
    options: [
      { label: "Writing & debugging code",    value: "code",         icon: "💻" },
      { label: "Understanding concepts",       value: "learning",     icon: "📚" },
      { label: "Homework & assignments",       value: "homework",     icon: "📝" },
      { label: "Research & reports",           value: "research",     icon: "🔍" },
      { label: "Building projects",            value: "projects",     icon: "🚀" },
      { label: "Interview / exam prep",        value: "interview",    icon: "🎯" },
    ],
  },
  {
    id: "experience",
    text: "How experienced are you with programming?",
    options: [
      { label: "Beginner — learning to code",     value: "beginner",     icon: "🌱" },
      { label: "Student — taking CS courses",     value: "student",      icon: "🎓" },
      { label: "Intermediate — side projects",    value: "intermediate", icon: "🔧" },
      { label: "Advanced — internships / jobs",   value: "advanced",     icon: "💼" },
    ],
  },
  {
    id: "editor",
    text: "Do you want AI directly inside your code editor?",
    subtitle: "IDE integration (VS Code, JetBrains, etc.)",
    options: [
      { label: "Yes! I live in my IDE",                value: "yes",       icon: "⌨️" },
      { label: "Sometimes, but not required",          value: "sometimes", icon: "🤷" },
      { label: "No, I prefer a chat interface",        value: "no",        icon: "💬" },
    ],
  },
  {
    id: "budget",
    text: "What is your monthly budget for AI tools?",
    options: [
      { label: "Free only — I'm a student! 🆓",     value: "free",   icon: "🆓" },
      { label: "Up to ₹800 / $10 per month",        value: "low",    icon: "💰" },
      { label: "₹800–₹2000 / $10–$25 per month",   value: "medium", icon: "💳" },
    ],
  },
  {
    id: "task_type",
    text: "What type of tasks do you work on most?",
    options: [
      { label: "Data structures & algorithms",     value: "dsa",        icon: "🌳" },
      { label: "Web / app development",            value: "webdev",     icon: "🌐" },
      { label: "Machine learning / AI",            value: "ml",         icon: "🤖" },
      { label: "General CS assignments",           value: "general",    icon: "📐" },
      { label: "Theory & concepts",                value: "theory",     icon: "📖" },
    ],
  },
  {
    id: "style",
    text: "Which learning style fits you best?",
    options: [
      { label: "Explain everything step by step",  value: "detailed",  icon: "🪜" },
      { label: "Give me the code, I'll figure it out", value: "code",  icon: "⚡" },
      { label: "I want to discuss ideas & explore", value: "explore",  icon: "🗣️" },
      { label: "Point me to resources & docs",     value: "resources", icon: "📎" },
    ],
  },
];

// ─── AI Tools (5 core student tools) ─────────────────────────────────────────

const AI_TOOLS: AITool[] = [
  {
    name: "ChatGPT (GPT-4o)",
    logo: "🤖",
    tagline: "OpenAI's flagship — most popular and versatile AI assistant",
    pricing: "Free / $20/mo Plus",
    pricingDetail: "Free tier with GPT-4o mini; $20/mo for full GPT-4o + plugins",
    contextWindow: "128K tokens",
    strengths: [
      "Best overall versatility for any task",
      "Excellent code explanation for beginners",
      "Strong at DSA problems and walkthroughs",
      "Image upload — analyze diagrams and screenshots",
      "Huge community with study tips",
      "Web browsing to find latest docs",
    ],
    weaknesses: [
      "Free tier has rate limits and slower model",
      "Can hallucinate confident wrong answers",
      "No native IDE integration",
      "Data privacy concerns (default training)",
    ],
    bestUseCases: [
      "Learning new programming concepts with clear explanations",
      "Debugging code with step-by-step analysis",
      "Solving DSA problems with time/space complexity breakdown",
      "Writing essays, research summaries, and lab reports",
      "Interview preparation — mock interviews and problem solving",
    ],
    speed: "fast",
    supportsImages: true,
    supportsIDE: false,
    budgetTier: "free",
    useCases: ["code", "learning", "homework", "research", "interview", "dsa"],
    website: "https://chat.openai.com",
    studentTip: "Use the 'Explain it to me like I'm a beginner' prompt for any concept you don't understand.",
  },
  {
    name: "Claude (Sonnet 4)",
    logo: "🧠",
    tagline: "Anthropic's thoughtful AI — best for detailed reasoning",
    pricing: "Free / $20/mo Pro",
    pricingDetail: "Free tier with Claude 3.5 Haiku; $20/mo for Sonnet and Opus",
    contextWindow: "200K tokens",
    strengths: [
      "Best reasoning and code explanation depth",
      "200K context — analyze entire project files",
      "Very low hallucination rate — trustworthy answers",
      "Excellent for understanding complex theory",
      "Great for reviewing and improving your code",
      "No excessive safety refusals on academic topics",
    ],
    weaknesses: [
      "Slightly slower response than ChatGPT",
      "No image generation (only image reading)",
      "Fewer integrations than OpenAI",
      "Free tier limits usage",
    ],
    bestUseCases: [
      "Understanding complex algorithms and data structures",
      "Long document analysis — paste entire textbooks chapters",
      "Code review and detailed improvement suggestions",
      "Research papers and theory-heavy assignments",
      "Architecture planning for semester projects",
    ],
    speed: "medium",
    supportsImages: true,
    supportsIDE: false,
    budgetTier: "free",
    useCases: ["code", "learning", "research", "projects", "theory"],
    website: "https://claude.ai",
    studentTip: "Paste your entire assignment brief + your current attempt for the most targeted help.",
  },
  {
    name: "Gemini (1.5 Pro)",
    logo: "✨",
    tagline: "Google's multimodal AI — great for students in Google ecosystem",
    pricing: "Free / $20/mo Advanced",
    pricingDetail: "Free with 1.5 Flash; Gemini Advanced $20/mo for 1.5 Pro and 1M context",
    contextWindow: "1M tokens (Advanced)",
    strengths: [
      "1 million token context — entire codebases",
      "Integrated with Google Docs, Sheets, and Gmail",
      "Analyze images, diagrams, and YouTube videos",
      "Free tier is very capable for students",
      "Great for multimodal tasks (photos of handwritten notes)",
      "Powers this AI portal you're using right now!",
    ],
    weaknesses: [
      "Code quality sometimes less consistent than rivals",
      "Smaller plugin/integration ecosystem",
      "Less popular — fewer community resources",
    ],
    bestUseCases: [
      "Analyzing handwritten notes or textbook photos",
      "Working within Google Workspace (Docs, Sheets)",
      "Processing very large documents or datasets",
      "Multimodal projects (text + image analysis)",
      "Fast, free chat for daily study questions",
    ],
    speed: "fast",
    supportsImages: true,
    supportsIDE: false,
    budgetTier: "free",
    useCases: ["code", "learning", "homework", "research", "ml"],
    website: "https://gemini.google.com",
    studentTip: "Use Gemini's NotebookLM (free) to summarize and quiz yourself on uploaded course materials.",
  },
  {
    name: "GitHub Copilot",
    logo: "🐙",
    tagline: "AI pair programmer built into your IDE — free for students",
    pricing: "Free for students via GitHub Education",
    pricingDetail: "FREE for verified students via GitHub Education Pack; $10/mo otherwise",
    contextWindow: "~8K tokens",
    strengths: [
      "FREE for students with GitHub Education Pack",
      "Works inside VS Code, JetBrains, Vim, Neovim",
      "Autocompletes code as you type in real-time",
      "Understands your open files for context",
      "Copilot Chat for asking questions in-editor",
      "Great for boilerplate and repetitive code",
    ],
    weaknesses: [
      "Requires GitHub Education verification",
      "Smaller context than Claude or ChatGPT",
      "Best in IDE, less useful as standalone chat",
      "Code sent to cloud (privacy consideration)",
    ],
    bestUseCases: [
      "Inline autocomplete while writing assignments",
      "Generating boilerplate and repetitive code",
      "Quick in-editor explanations without switching tabs",
      "Test generation while coding",
      "Learning by seeing AI complete your code",
    ],
    speed: "fast",
    supportsImages: false,
    supportsIDE: true,
    budgetTier: "free",
    useCases: ["code", "projects", "webdev", "dsa"],
    website: "https://github.com/features/copilot",
    studentTip: "Apply for GitHub Education Pack at education.github.com for free Copilot access!",
  },
  {
    name: "Cursor",
    logo: "🖱️",
    tagline: "AI-first code editor — understands your entire project",
    pricing: "Free (limited) / $20/mo Pro",
    pricingDetail: "Free: 2000 completions, 50 chats/mo; Pro $20/mo unlimited",
    contextWindow: "~200K (with codebase indexing)",
    strengths: [
      "Indexes your entire codebase for full context",
      "Agent mode: implements features across multiple files",
      "Based on VSCode — works with all extensions",
      "Natural language code edits ('make this faster')",
      "Best for complex semester project development",
      "Privacy mode available for sensitive projects",
    ],
    weaknesses: [
      "Free tier is limited (2000 completions/month)",
      "Separate editor from VS Code (migration effort)",
      "Resource-intensive on older machines",
      "$20/mo is steep for students without GitHub EDU",
    ],
    bestUseCases: [
      "Building full-stack semester or capstone projects",
      "Multi-file code refactoring and feature implementation",
      "Understanding large legacy codebases",
      "Debugging complex, interconnected systems",
      "Learning professional development workflows",
    ],
    speed: "medium",
    supportsImages: false,
    supportsIDE: true,
    budgetTier: "free",
    useCases: ["code", "projects", "webdev"],
    website: "https://cursor.com",
    studentTip: "Use Cursor's free tier for project assignments, then fall back to ChatGPT for concept explanations.",
  },
];

// ─── Scoring Engine ───────────────────────────────────────────────────────────

function scoreTool(tool: AITool, answers: Record<string, string | string[]>): number {
  let score = 40;

  const goals = (answers.goal as string[]) || [];
  const budget = answers.budget as string;
  const editor = answers.editor as string;
  const taskType = answers.task_type as string;
  const style = answers.style as string;
  const experience = answers.experience as string;

  // Goal matching
  for (const goal of goals) {
    if (tool.useCases.includes(goal)) score += 8;
  }

  // Task type match
  if (tool.useCases.includes(taskType)) score += 10;

  // Budget
  if (budget === "free" && tool.budgetTier === "free") score += 15;
  else if (budget === "low" && tool.budgetTier !== "medium") score += 8;
  else if (budget === "free" && tool.budgetTier !== "free") score -= 20;

  // IDE preference
  if (editor === "yes" && tool.supportsIDE) score += 20;
  if (editor === "yes" && !tool.supportsIDE) score -= 10;
  if (editor === "no" && tool.supportsIDE) score -= 5;

  // Style match
  if (style === "detailed" && (tool.name.includes("Claude") || tool.name.includes("ChatGPT"))) score += 10;
  if (style === "code" && (tool.name.includes("Copilot") || tool.name.includes("Cursor"))) score += 10;
  if (style === "explore" && (tool.name.includes("ChatGPT") || tool.name.includes("Claude"))) score += 8;

  // Experience level
  if (experience === "beginner" && tool.name.includes("ChatGPT")) score += 10;
  if (experience === "beginner" && (tool.name.includes("Cursor"))) score -= 5;
  if ((experience === "intermediate" || experience === "advanced") && tool.name.includes("Cursor")) score += 8;
  if (experience === "advanced" && tool.name.includes("Copilot")) score += 8;

  return Math.max(0, Math.min(100, score));
}

function getMatchReason(tool: AITool, answers: Record<string, string | string[]>): string {
  const goals = (answers.goal as string[]) || [];
  const editor = answers.editor as string;
  const style = answers.style as string;

  const reasons: string[] = [];
  if (tool.supportsIDE && editor === "yes") reasons.push("works inside your IDE");
  if (goals.includes("learning") && (tool.name.includes("Claude") || tool.name.includes("ChatGPT")))
    reasons.push("great for learning and concept explanation");
  if (goals.includes("code") && tool.useCases.includes("code")) reasons.push("strong code generation");
  if (goals.includes("research") && !tool.supportsIDE) reasons.push("excellent for research tasks");
  if (style === "detailed" && tool.name.includes("Claude")) reasons.push("provides deep, thorough explanations");
  if (tool.budgetTier === "free") reasons.push("free tier works well for students");

  return reasons.length > 0 ? reasons.join(", ") + "." : "matches your overall requirements.";
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "from-green-500 to-emerald-400"
    : score >= 50 ? "from-accent-primary to-blue-400"
    : "from-yellow-500 to-orange-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
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

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({
  tool, score, reason, isBest, isAlternative
}: {
  tool: AITool;
  score: number;
  reason: string;
  isBest: boolean;
  isAlternative: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel rounded-2xl overflow-hidden border ${
        isBest ? "border-accent-primary/40 shadow-[0_0_30px_rgba(110,231,255,0.08)]"
          : isAlternative ? "border-yellow-500/30"
          : "border-white/10"
      }`}
    >
      {/* Badge */}
      {isBest && (
        <div className="flex items-center gap-2 px-5 py-2 bg-accent-primary/10 border-b border-accent-primary/20">
          <Trophy className="w-4 h-4 text-accent-primary" />
          <span className="text-xs font-bold text-accent-primary">Best Recommendation</span>
        </div>
      )}
      {isAlternative && (
        <div className="flex items-center gap-2 px-5 py-2 bg-yellow-500/8 border-b border-yellow-500/20">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">Alternative Recommendation</span>
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
            {tool.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-white">{tool.name}</h3>
            <p className="text-xs text-text-muted leading-tight mt-0.5">{tool.tagline}</p>
          </div>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-xs font-semibold hover:bg-accent-primary/20 transition-colors"
          >
            Visit <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Score */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-muted">Match Score</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.round(score / 20) ? "text-yellow-400 fill-yellow-400" : "text-white/10"}`} />
              ))}
            </div>
          </div>
          <ScoreBar score={score} />
        </div>

        {/* Why */}
        <div className="p-3 rounded-xl bg-accent-primary/5 border border-accent-primary/15 flex items-start gap-2">
          <ChevronRight className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="text-accent-primary font-medium">Why this fits you: </span>{reason}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: DollarSign, color: "text-green-400", val: tool.pricing },
            { icon: Globe, color: "text-blue-400", val: tool.contextWindow },
            { icon: Zap, color: tool.speed === "fast" ? "text-yellow-400" : "text-blue-400", val: tool.speed + " speed" },
            { icon: BarChart2, color: "text-purple-400", val: tool.supportsIDE ? "IDE ✓" : "Chat only" },
          ].map(({ icon: Icon, color, val }, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/8">
              <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
              <span className="text-xs text-text-muted capitalize truncate">{val}</span>
            </div>
          ))}
        </div>

        {/* Student Tip */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
          <span className="text-base shrink-0">💡</span>
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="text-yellow-400 font-semibold">Student tip: </span>{tool.studentTip}
          </p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          {expanded ? "Show less" : "Strengths, weaknesses & use cases"}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                {/* Strengths */}
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

                {/* Weaknesses */}
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

                {/* Best Use Cases */}
                <div>
                  <p className="text-xs font-semibold text-accent-primary mb-2">🎯 Best Use Cases</p>
                  <ul className="space-y-1.5">
                    {tool.bestUseCases.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <ChevronRight className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing detail */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-white mb-1">💰 Pricing Detail</p>
                  <p className="text-xs text-text-muted">{tool.pricingDetail}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FindAIPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = (currentQ / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    if (question.multi) {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers((prev) => ({ ...prev, [question.id]: updated }));
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
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
  };

  const rankedTools = AI_TOOLS.map((tool) => ({
    tool,
    score: scoreTool(tool, answers),
    reason: getMatchReason(tool, answers),
  })).sort((a, b) => b.score - a.score);

  const bestTool = rankedTools[0];
  const altTool = rankedTools[1];
  const restTools = rankedTools.slice(2);

  if (showResults) {
    return (
      <div className="relative min-h-screen bg-background text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-secondary/8 to-transparent pointer-events-none" />

        <PageHero
          badge="Your AI Recommendation"
          title="Your Perfect"
          highlight="AI Study Partner"
          subtitle="Based on your goals and experience, here are the best AI tools ranked for your needs as a student."
          icon={Compass}
        />

        <div className="max-w-3xl mx-auto px-6 pb-32 space-y-6">
          {/* Retake */}
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-text-muted hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retake Quiz
            </button>
          </div>

          {/* Best recommendation */}
          <RecommendationCard
            tool={bestTool.tool}
            score={bestTool.score}
            reason={bestTool.reason}
            isBest={true}
            isAlternative={false}
          />

          {/* Alternative recommendation */}
          <div>
            <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-3">
              Alternative Recommendation
            </p>
            <RecommendationCard
              tool={altTool.tool}
              score={altTool.score}
              reason={altTool.reason}
              isBest={false}
              isAlternative={true}
            />
          </div>

          {/* Other tools */}
          {restTools.length > 0 && (
            <div>
              <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-3">
                Other Options to Explore
              </p>
              <div className="space-y-4">
                {restTools.map(({ tool, score, reason }) => (
                  <RecommendationCard
                    key={tool.name}
                    tool={tool}
                    score={score}
                    reason={reason}
                    isBest={false}
                    isAlternative={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pro tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-2xl p-5 border border-accent-primary/20"
          >
            <p className="text-sm font-semibold text-white mb-2">🎓 Student Pro Tip</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Most successful students use <strong className="text-white">2 AI tools together</strong>: 
              a chat AI (ChatGPT/Claude/Gemini) for understanding concepts and explanations, 
              plus a code AI (Copilot/Cursor) for writing and debugging in their IDE. Start with 
              free tiers and upgrade only if you hit limits.
            </p>
          </motion.div>
        </div>
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
        badge="AI Study Partner Finder"
        title="Find Your"
        highlight="AI Assistant"
        subtitle="Answer 6 quick questions and get a personalized AI tool recommendation — plus strengths, weaknesses, and student tips."
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
                    {option.icon && <span className="text-xl shrink-0">{option.icon}</span>}
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
                  {currentQ === QUESTIONS.length - 1 ? "See My Recommendation" : "Next"}
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
