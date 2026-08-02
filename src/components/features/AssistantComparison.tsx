"use client";

import { useState } from "react";
import { Sparkles, Code, Terminal, Compass, Layers, Zap, Check, AlertCircle } from "lucide-react";

interface Assistant {
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  desc: string;
  strengths: string[];
  weaknesses: string[];
  bestUse: string;
  accent: string;
}

export default function AssistantComparison() {
  const [selectedAssistant, setSelectedAssistant] = useState<number>(0);

  const assistants: Assistant[] = [
    {
      name: "ChatGPT (OpenAI)",
      logo: Sparkles,
      desc: "Conversational flagship model powering versatile software design, logic brainstorming, and multi-language script synthesis.",
      strengths: [
        "Incredible general reasoning and conceptual explanations",
        "Excellent refactoring suggestions for complex architectures",
        "Extensive API integration knowledge"
      ],
      weaknesses: [
        "Lacks native full-project workspace understanding in web interface",
        "Occasionally produces generic boilerplate rather than customized implementations"
      ],
      bestUse: "Architectural planning, brainstorming algorithms, and writing complex standalone scripts.",
      accent: "from-emerald-500 to-green-400"
    },
    {
      name: "Claude (Anthropic)",
      logo: BrainIcon,
      desc: "Leading model known for exceptional code quality, highly precise logic, long-context window capacity, and detailed explanations.",
      strengths: [
        "Extremely reliable and low hallucination rate in coding logic",
        "Huge context window allows reading multiple files simultaneously",
        "Outstanding documentation explanation and SDK consumption"
      ],
      weaknesses: [
        "No official fully native IDE version (mostly accessed via API/Web/Plugins)",
        "Rate limits can restrict heavy workflow runs"
      ],
      bestUse: "Refactoring large modules, debugging complex logical bugs, and understanding foreign codebases.",
      accent: "from-orange-500 to-amber-500"
    },
    {
      name: "GitHub Copilot",
      logo: Code,
      desc: "The industry standard auto-complete companion integrating seamlessly into VS Code and JetBrains editors.",
      strengths: [
        "Instant, lightning-fast inline code suggestions as you type",
        "Learns locally from open tabs to match coding styles",
        "Familiar interface embedded inside editor workflows"
      ],
      weaknesses: [
        "Less effective at multi-file codebase updates",
        "Can suggest outdated API styles based on open-source training data"
      ],
      bestUse: "Accelerating daily boilerplate typing, syntax autocomplete, and simple utility generation.",
      accent: "from-blue-600 to-indigo-500"
    },
    {
      name: "Cursor",
      logo: Terminal,
      desc: "A custom fork of VS Code built entirely around AI capabilities, allowing natural edits across entire files and folders.",
      strengths: [
        "Multi-file edits using advanced agentic workflows",
        "Native chat, inline edits, and automatic terminal debug",
        "Indexing of the entire workspace for precise queries"
      ],
      weaknesses: [
        "Requires migrating from standard VS Code or adapting settings",
        "Relies heavily on cloud API credits for advanced features"
      ],
      bestUse: "Complex full-stack feature generation, multi-file refactoring, and workspace-wide code analysis.",
      accent: "from-cyan-400 to-blue-500"
    },
    {
      name: "Gemini (Google)",
      logo: Zap,
      desc: "Google's flagship multimodal model boasting an industry-leading million-token context window.",
      strengths: [
        "Massive context capacity enables reading entire repos",
        "Native Android Studio integrations and cloud optimizations",
        "Excellent at reasoning across multimedia assets (UI designs, docs)"
      ],
      weaknesses: [
        "Inline completion can be slightly slower compared to Copilot",
        "Varied code style consistency across minor languages"
      ],
      bestUse: "Full-repo code ingestion, consuming design mocks to build UIs, and deep codebase queries.",
      accent: "from-violet-500 to-fuchsia-500"
    },
    {
      name: "Amazon Q / CodeWhisperer",
      logo: Compass,
      desc: "Enterprise-grade assistant deeply optimized for AWS services, security audits, and cloud deployments.",
      strengths: [
        "Excellent integration with AWS libraries and services",
        "Built-in security scanning for vulnerabilities",
        "Free tier options for individual developers"
      ],
      weaknesses: [
        "Suggestions in non-AWS environments can feel basic",
        "Limited autocomplete coverage in lesser-known languages"
      ],
      bestUse: "Building serverless applications on AWS, running security audits, and cloud deployment pipelines.",
      accent: "from-amber-400 to-orange-400"
    },
    {
      name: "Tabnine",
      logo: Layers,
      desc: "One of the pioneers of AI code autocomplete, focusing heavily on fully local, private deployments for enterprises.",
      strengths: [
        "Can run 100% locally on dev machines for total security",
        "Highly customizable for custom team codebases",
        "Low memory usage options"
      ],
      weaknesses: [
        "Reasoning capacity is lower than large cloud models",
        "Generative capability is limited for full-system planning"
      ],
      bestUse: "Enterprise developers with strict security constraints requiring air-gapped offline code completion.",
      accent: "from-rose-500 to-red-400"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Selector Grid */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {assistants.map((ast, idx) => {
          const Icon = ast.logo;
          const isSelected = idx === selectedAssistant;

          return (
            <button
              key={idx}
              onClick={() => setSelectedAssistant(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                isSelected
                  ? "bg-white border-white text-background shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-bg-secondary border-white/5 text-text-muted hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {ast.name.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Feature Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-8 rounded-2xl relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl bg-linear-to-br ${assistants[selectedAssistant].accent} text-white`}>
                {(() => {
                  const Icon = assistants[selectedAssistant].logo;
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {assistants[selectedAssistant].name}
              </h3>
            </div>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              {assistants[selectedAssistant].desc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent-primary">
              Best Use Case
            </span>
            <p className="text-white text-xs font-medium mt-1 leading-relaxed">
              {assistants[selectedAssistant].bestUse}
            </p>
          </div>

          {/* Decorative Backglow */}
          <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-linear-to-br ${assistants[selectedAssistant].accent} opacity-10 blur-3xl`} />
        </div>

        {/* Right Side: Strengths & Weaknesses */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Strengths */}
          <div className="flex-1 glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500">
            <h4 className="font-display font-semibold text-sm text-emerald-400 mb-4 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Core Strengths
            </h4>
            <ul className="space-y-3">
              {assistants[selectedAssistant].strengths.map((str, i) => (
                <li key={i} className="text-white text-xs leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="flex-1 glass-panel p-6 rounded-2xl border-l-4 border-l-rose-500">
            <h4 className="font-display font-semibold text-sm text-rose-400 mb-4 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Key Limitations
            </h4>
            <ul className="space-y-3">
              {assistants[selectedAssistant].weaknesses.map((wk, i) => (
                <li key={i} className="text-text-muted text-xs leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80 mt-1.5 shrink-0" />
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini fallback icon since Lucide Brain doesn't exist
function BrainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v12" />
      <path d="M8 10c0-2 2-2 2-2s2 0 2 2" />
      <path d="M12 14c0 2-2 2-2 2s-2 0-2-2" />
    </svg>
  );
}
