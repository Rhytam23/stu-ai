"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, CheckCircle, XCircle, Minus } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

interface Tool {
  name: string;
  logo: string;
  tagline: string;
  strengths: string[];
  weaknesses: string[];
  useCases: string[];
  pricing: string;
  contextWindow: string;
  languages: string;
  openSource: boolean;
  category: "General AI" | "IDE Assistant" | "Code Specialist";
}

const tools: Tool[] = [
  {
    name: "ChatGPT (GPT-4o)",
    logo: "🤖",
    tagline: "OpenAI's flagship conversational AI",
    strengths: ["Extremely versatile", "Strong reasoning", "DALL-E image generation", "Browse the web"],
    weaknesses: ["Rate limits on free tier", "Can hallucinate confidently", "No native IDE integration"],
    useCases: ["General coding help", "Writing & content", "Analysis & research", "Brainstorming"],
    pricing: "Free / $20/mo Plus",
    contextWindow: "128K tokens",
    languages: "All major languages",
    openSource: false,
    category: "General AI",
  },
  {
    name: "Claude (Sonnet/Opus)",
    logo: "🧠",
    tagline: "Anthropic's safety-focused AI",
    strengths: ["Excellent reasoning", "Very long context", "Accurate and thoughtful", "Strong code generation"],
    weaknesses: ["Occasional over-caution", "No image generation", "Less tool integrations"],
    useCases: ["Complex analysis", "Long document review", "High-stakes code", "Research"],
    pricing: "Free / $20/mo Pro",
    contextWindow: "200K tokens",
    languages: "All major languages",
    openSource: false,
    category: "General AI",
  },
  {
    name: "Gemini (1.5 Pro)",
    logo: "✨",
    tagline: "Google's multimodal AI",
    strengths: ["1M token context", "Multimodal (text/image/video)", "Google Workspace integration", "Fast inference"],
    weaknesses: ["Less community adoption vs OpenAI", "Code generation inconsistency"],
    useCases: ["Multimodal tasks", "Long document analysis", "Workspace integration", "This portal!"],
    pricing: "Free / $20/mo Advanced",
    contextWindow: "1M tokens",
    languages: "All major languages",
    openSource: false,
    category: "General AI",
  },
  {
    name: "GitHub Copilot",
    logo: "🐙",
    tagline: "AI pair programmer in your IDE",
    strengths: ["Deep IDE integration", "Context-aware completions", "GitHub PR summaries", "Multi-IDE support"],
    weaknesses: ["Requires IDE extension", "Privacy concerns (sends code to cloud)", "Subscription required"],
    useCases: ["Autocomplete", "Boilerplate generation", "Refactoring suggestions", "Test generation"],
    pricing: "$10/mo Individual",
    contextWindow: "~8K tokens",
    languages: "All languages",
    openSource: false,
    category: "IDE Assistant",
  },
  {
    name: "Cursor",
    logo: "🖱️",
    tagline: "AI-first code editor (VSCode fork)",
    strengths: ["Full codebase context", "Agent mode for multi-file edits", "Natural language edits", "Privacy mode"],
    weaknesses: ["Separate app from existing IDE", "Learning curve", "Higher cost"],
    useCases: ["Codebase-wide refactoring", "Feature implementation", "Bug fixing across files"],
    pricing: "Free / $20/mo Pro",
    contextWindow: "~200K (with indexing)",
    languages: "All languages",
    openSource: false,
    category: "IDE Assistant",
  },
  {
    name: "Amazon CodeWhisperer",
    logo: "☁️",
    tagline: "AWS cloud-integrated coding AI",
    strengths: ["Free tier available", "AWS service awareness", "Security scanning", "Enterprise compliance"],
    weaknesses: ["Best for AWS ecosystem", "Less context than rivals", "Smaller community"],
    useCases: ["AWS development", "Cloud-native code", "Enterprise security compliance"],
    pricing: "Free / $19/mo Professional",
    contextWindow: "~8K tokens",
    languages: "15+ languages",
    openSource: false,
    category: "Code Specialist",
  },
  {
    name: "Tabnine",
    logo: "🔮",
    tagline: "Privacy-first local AI code completion",
    strengths: ["Local/offline models available", "Privacy-first", "Team training possible", "Fast completions"],
    weaknesses: ["Less powerful than cloud rivals", "Chat features limited", "Smaller model capacity"],
    useCases: ["Privacy-sensitive codebases", "Offline development", "Enterprise with strict data rules"],
    pricing: "Free / $12/mo Pro",
    contextWindow: "~2K tokens",
    languages: "30+ languages",
    openSource: false,
    category: "Code Specialist",
  },
];

const DIMENSIONS = [
  { key: "pricing", label: "Pricing" },
  { key: "contextWindow", label: "Context Window" },
  { key: "languages", label: "Languages" },
  { key: "category", label: "Category" },
];

type Category = "All" | "General AI" | "IDE Assistant" | "Code Specialist";

export default function ComparisonPage() {
  const [filterCategory, setFilterCategory] = useState<Category>("All");
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const filteredTools = tools.filter(
    (t) => filterCategory === "All" || t.category === filterCategory
  );



  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-125 bg-linear-to-b from-emerald-500/5 to-transparent pointer-events-none" />

      <PageHero
        badge="AI Tools"
        title="AI Tool"
        highlight="Comparison"
        subtitle="Compare 7 leading AI coding tools across strengths, weaknesses, pricing, context windows, and best use cases."
        icon={BarChart2}
      />

      <div className="max-w-7xl mx-auto px-6 pb-32 space-y-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm text-text-muted font-medium">Filter:</span>
          {(["All", "General AI", "IDE Assistant", "Code Specialist"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterCategory === cat
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                  : "bg-white/5 border border-white/10 text-text-muted hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={`glass-panel rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                  expandedTool === tool.name ? "border-accent-primary/40" : ""
                }`}
                onClick={() => setExpandedTool(expandedTool === tool.name ? null : tool.name)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{tool.logo}</span>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-white leading-tight">{tool.name}</h3>
                    <span className="text-xs text-text-muted">{tool.category}</span>
                  </div>
                </div>
                <p className="text-xs text-text-muted leading-relaxed mb-3">{tool.tagline}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/8 text-text-muted">
                    {tool.pricing}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/8 text-text-muted">
                    {tool.contextWindow}
                  </span>
                </div>

                {expandedTool === tool.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-4 pt-4 border-t border-white/10 space-y-3 overflow-hidden"
                  >
                    <div>
                      <p className="text-xs font-semibold text-green-400 mb-1">✅ Strengths</p>
                      <ul className="space-y-1">
                        {tool.strengths.map((s) => (
                          <li key={s} className="text-xs text-text-muted flex items-start gap-1.5">
                            <CheckCircle className="w-3 h-3 text-green-400 shrink-0 mt-0.5" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-400 mb-1">❌ Weaknesses</p>
                      <ul className="space-y-1">
                        {tool.weaknesses.map((w) => (
                          <li key={w} className="text-xs text-text-muted flex items-start gap-1.5">
                            <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" /> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-accent-primary mb-1">🎯 Best For</p>
                      <ul className="space-y-1">
                        {tool.useCases.map((u) => (
                          <li key={u} className="text-xs text-text-muted flex items-start gap-1.5">
                            <Minus className="w-3 h-3 text-accent-primary shrink-0 mt-0.5" /> {u}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-bold text-2xl text-white mb-6">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left p-2.5 sm:p-4 font-semibold text-text-muted text-[10px] sm:text-xs uppercase tracking-wider w-24 sm:w-32">
                    Dimension
                  </th>
                  {tools.map((tool) => (
                    <th key={tool.name} className="text-left p-2.5 sm:p-4 font-semibold text-white text-[10px] sm:text-xs whitespace-nowrap">
                      <span className="mr-1">{tool.logo}</span>
                      {tool.name.split(" (")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DIMENSIONS.map((dim, i) => (
                  <tr
                    key={dim.key}
                    className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/2"}`}
                  >
                    <td className="p-2.5 sm:p-4 text-[10px] sm:text-xs text-text-muted font-semibold">{dim.label}</td>
                    {tools.map((tool) => (
                      <td key={tool.name} className="p-2.5 sm:p-4 text-[10px] sm:text-xs text-text-muted whitespace-nowrap sm:whitespace-normal">
                        {String(tool[dim.key as keyof Tool])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-muted mt-3">Click any tool card above to expand strengths, weaknesses, and use cases.</p>
        </motion.div>
      </div>
    </div>
  );
}
