"use client";

import { useState } from "react";
import { User, Cpu, Zap, Target, ShieldAlert } from "lucide-react";

export default function CollaborationSplit() {
  const [activeTab, setActiveTab] = useState<"split" | "workflow">("split");

  const humanStrengths = [
    { title: "Strategic Architecture", desc: "Designing system bounds, security scopes, microservices, and component contracts." },
    { title: "Empathetic Design", desc: "Understanding the actual user persona, UX workflows, and psychological needs." },
    { title: "Creative Ideation", desc: "Inventing entirely new paradigms, libraries, and custom optimization algorithms." },
    { title: "Ethical Integrity & Guardrails", desc: "Validating biases, licensing, privacy standards, and copyright regulations." }
  ];

  const aiStrengths = [
    { title: "Code Synthesis", desc: "Writing structural boilerplate, CRUD routes, and common utility libraries instantly." },
    { title: "Multi-Language Fluency", desc: "Translating code logic between languages (e.g. Python to Go) without syntax search." },
    { title: "Algorithmic Optimizations", desc: "Applying standard patterns (e.g. memoization, binary search) from massive public data." },
    { title: "Debugging & Explanations", desc: "Tracing error stacktraces, recommending fixes, and writing unit tests in seconds." }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Switch Tabs */}
      <div className="flex justify-center mb-12 w-full">
        <div className="bg-bg-secondary p-1 rounded-full border border-white/5 flex w-full max-w-md">
          <button
            onClick={() => setActiveTab("split")}
            className={`flex-1 text-center py-2 px-2 md:px-6 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
              activeTab === "split"
                ? "bg-linear-to-r from-accent-secondary to-accent-primary text-white"
                : "text-text-muted hover:text-white"
            }`}
          >
            Capabilities Split
          </button>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`flex-1 text-center py-2 px-2 md:px-6 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
              activeTab === "workflow"
                ? "bg-linear-to-r from-accent-secondary to-accent-primary text-white"
                : "text-text-muted hover:text-white"
            }`}
          >
            Integrated Hybrid Flow
          </button>
        </div>
      </div>

      {activeTab === "split" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Human Strengths */}
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                <User className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Human Developer</h3>
                <p className="text-accent-primary text-[10px] uppercase font-mono tracking-widest mt-0.5">
                  The Systems Pilot
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {humanStrengths.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="w-5 h-5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">{item.title}</h4>
                    <p className="text-text-muted text-xs leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* AI Strengths */}
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center border border-accent-secondary/20">
                <Cpu className="w-5 h-5 text-accent-secondary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">AI Assistant</h3>
                <p className="text-accent-secondary text-[10px] uppercase font-mono tracking-widest mt-0.5">
                  The Synthesizer Engine
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {aiStrengths.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="w-5 h-5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">{item.title}</h4>
                    <p className="text-text-muted text-xs leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-secondary/5 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent-primary">
              Augmentation vs Replacement
            </span>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mt-2">
              Why AI Augments Developers Rather Than Replacing Them
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mt-3">
              Software engineering is not just writing lines of code; it is defining requirements, validating logic, and architecting resilient solutions. The optimal workflow leverages both agents.
            </p>
          </div>

          {/* Workflow Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/5 relative">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-accent-primary" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-accent-primary">
                  Phase 1: Human Control
                </span>
              </div>
              <h4 className="font-display font-semibold text-sm text-white">Define & Scaffold</h4>
              <p className="text-text-muted text-xs leading-relaxed mt-2">
                The developer clarifies scope, structures constraints, provides domain knowledge, and commands the project direction.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/5 relative">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-accent-secondary" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-accent-secondary">
                  Phase 2: AI Execution
                </span>
              </div>
              <h4 className="font-display font-semibold text-sm text-white">Synthesize & Draft</h4>
              <p className="text-text-muted text-xs leading-relaxed mt-2">
                The model parses instructions, accesses files, writes boilerplate syntax, resolves simple logic branches, and adds docs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/5 relative">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-accent-primary" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-accent-primary">
                  Phase 3: Human Audit
                </span>
              </div>
              <h4 className="font-display font-semibold text-sm text-white">Audit & Refine</h4>
              <p className="text-text-muted text-xs leading-relaxed mt-2">
                The human reviews outputs, validates logical flows, conducts security analysis, runs build checks, and fine-tunes details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
