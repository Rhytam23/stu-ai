"use client";

import { useState } from "react";
import { Lightbulb, FileText, Cpu, Code, Play, CheckCircle, RotateCw } from "lucide-react";

interface Step {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  codeSnippet: string;
  visualLabel: string;
}

export default function WorkflowDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      title: "1. Conceptual Idea",
      icon: Lightbulb,
      desc: "Define the application logic, target user flow, or architectural requirements in human terms.",
      codeSnippet: "// Product Requirement:\n// Create a real-time system that monitors API response latency\n// and triggers an alert if the average exceeds 500ms over 5 minutes.",
      visualLabel: "Brainstorming Requirements",
    },
    {
      title: "2. Prompt Engineering",
      icon: FileText,
      desc: "Formulate precise specifications, design patterns, and constraints into a prompt for the model.",
      codeSnippet: "Write a high-performance Node.js service that tracks response metrics.\nUse sliding window average. Integrate with Slack API hooks.\nInclude comprehensive unit tests using Vitest.",
      visualLabel: "Context & System Prompts",
    },
    {
      title: "3. LLM Inference",
      icon: Cpu,
      desc: "The Large Language Model processes the tokenized prompt and predicts the code syntax sequence.",
      codeSnippet: "[Neural Network Processing]\nTokens embedded -> Multi-head attention maps structure ->\nTop-p sampling code generation begins...",
      visualLabel: "Token Prediction Core",
    },
    {
      title: "4. Generated Code",
      icon: Code,
      desc: "The model outputs clean, syntactic source files containing structural, logic, and style specifications.",
      codeSnippet: "export class LatencyMonitor {\n  private window: number[] = [];\n  track(ms: number) {\n    this.window.push(ms);\n    if (this.average() > 500) this.alert();\n  }\n}",
      visualLabel: "Synthesized Output",
    },
    {
      title: "5. Automated Testing",
      icon: Play,
      desc: "Unit, integration, and syntax verifications execute inside isolated test environments to check correctness.",
      codeSnippet: "✓ monitor.test.ts > latency average within limits (12ms)\n✓ monitor.test.ts > alert triggers on high latency (504ms)\n\nTest Suites: 1 passed, 1 total",
      visualLabel: "Test runner logs",
    },
    {
      title: "6. Production Deployment",
      icon: CheckCircle,
      desc: "CI/CD pipelines build, package, and deploy the working service onto serverless nodes or containers.",
      codeSnippet: "Build success. Vercel deployment: https://latency-tracker.vercel.app/\nRouting traffic to edge servers...\nDeployment status: ACTIVE",
      visualLabel: "Deployment Pipeline",
    },
    {
      title: "7. Iteration Loop",
      icon: RotateCw,
      desc: "Collect runtime logs, performance metrics, and user feedback to repeat and refine the system logic.",
      codeSnippet: "// Production feedback:\n// Alert triggers are working but need throttling to avoid spam.\n// Let's modify the requirement...",
      visualLabel: "Feedback Loop Active",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto px-4">
      {/* Steps List */}
      <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;

          return (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                isActive
                  ? "bg-accent-secondary/10 border border-accent-secondary/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                  : "bg-transparent border border-transparent hover:bg-white/5"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
                  isActive
                    ? "bg-accent-secondary border-accent-secondary text-white"
                    : "bg-white/5 border-white/10 text-text-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className={`font-display font-semibold text-sm transition-colors ${
                    isActive ? "text-accent-primary" : "text-white"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-text-muted text-xs leading-relaxed mt-1">
                  {step.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Terminal & Sandbox Simulation */}
      <div className="lg:col-span-7 flex flex-col h-[400px] rounded-2xl bg-bg-secondary border border-white/5 overflow-hidden shadow-2xl relative">
        {/* Terminal Header */}
        <div className="bg-background/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="w-3 h-3 rounded-full bg-[#eab308]" />
            <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
          </div>
          <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase">
            {steps[activeStep].visualLabel}
          </span>
          <span className="w-4" />
        </div>

        {/* Terminal Output */}
        <div className="flex-1 p-6 font-mono text-xs overflow-auto bg-background/40 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-text-muted">{"// Current Step State:"}</div>
            <pre className="text-accent-primary leading-relaxed whitespace-pre-wrap">
              {steps[activeStep].codeSnippet}
            </pre>
          </div>

          {/* Active status indicator */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              <span>Agent sandboxed environment ready</span>
            </div>
            <span>Step {activeStep + 1} of 7</span>
          </div>
        </div>

        {/* Accent Glow Background */}
        <div className="absolute inset-0 bg-radial from-accent-secondary/5 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
