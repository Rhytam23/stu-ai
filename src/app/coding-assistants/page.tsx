"use client";

import { motion } from "framer-motion";
import { Terminal, Code2, Lightbulb, ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassCard from "@/components/ui/GlassCard";
import AssistantComparison from "@/components/AssistantComparison";
import CollaborationSplit from "@/components/CollaborationSplit";

const promptTechniques = [
  {
    name: "Zero-Shot",
    desc: "Asking the model to perform a task with no examples. Works for simple, well-known tasks.",
    example: "\"Summarize this article in 3 bullet points:\"",
    quality: "Basic",
    color: "text-yellow-400",
  },
  {
    name: "Few-Shot",
    desc: "Providing 2–5 examples of the desired format before the actual request. Dramatically improves output quality and format consistency.",
    example: "\"Input: 'cat' → Output: 'animal'\nInput: 'Python' → Output: ?\"",
    quality: "Good",
    color: "text-accent-primary",
  },
  {
    name: "Chain-of-Thought",
    desc: "Instructing the model to reason step-by-step before giving the final answer. Especially powerful for math, logic, and multi-step problems.",
    example: "\"Think step by step: How many seconds in a week?\"",
    quality: "Excellent",
    color: "text-green-400",
  },
  {
    name: "System Prompting",
    desc: "Setting a role or persona via a system instruction. Controls tone, expertise level, and behavior for the entire conversation.",
    example: "\"You are a senior backend engineer. Be concise and technical.\"",
    quality: "Excellent",
    color: "text-green-400",
  },
];

const assistantCards = [
  {
    title: "Artificial Intelligence",
    tag: "AI",
    desc: "The overarching scientific discipline of creating machine systems capable of mimicking or exceeding human cognitive processes.",
    details: "Includes logical problem-solving, semantic language processing, abstract reasoning, and continuous adaptability.",
  },
  {
    title: "Machine Learning",
    tag: "ML",
    desc: "A subfield of AI enabling systems to learn statistical behaviors directly from datasets without explicit program logic.",
    details: "Employs loss functions, parameter optimization, and gradient descent to continuously improve predictions.",
  },
  {
    title: "Deep Learning",
    tag: "DL",
    desc: "Multi-layered artificial neural networks designed to automatically extract features from raw multi-dimensional inputs.",
    details: "Pioneered hierarchical data processing, forming the computational engines behind image recognition and language models.",
  },
  {
    title: "Large Language Models",
    tag: "LLM",
    desc: "Deep Neural Networks utilizing the self-attention mechanism to parse and generate massive sequences of natural language and code.",
    details: "Trained on millions of repositories, mapping semantic links between code logic, APIs, and comments.",
  },
  {
    title: "Coding Assistants",
    tag: "Assistant",
    desc: "AI engines integrated directly into developer workspaces (IDEs) to pair program, debug, refactor, and write boilerplate.",
    details: "Bridges the gap between abstract requirements and synthesized, syntactically correct source files.",
  },
];

export default function CodingAssistantsPage() {
  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-primary/5 to-transparent pointer-events-none" />

      <PageHero
        badge="Tools & Techniques"
        title="Coding Assistants &"
        highlight="Prompt Engineering"
        subtitle="How AI became the modern developer's pair programmer — and how to communicate with it effectively."
        icon={Terminal}
      />

      {/* Concept hierarchy */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          The AI Hierarchy
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {assistantCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-panel glass-panel-hover rounded-2xl p-5"
            >
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-secondary/20 border border-accent-secondary/30 text-accent-secondary">
                {card.tag}
              </span>
              <h3 className="font-display font-semibold text-base text-white mt-3 mb-2">{card.title}</h3>
              <p className="text-text-muted text-xs leading-relaxed mb-3">{card.desc}</p>
              <p className="text-text-muted/70 text-xs leading-relaxed italic border-t border-white/5 pt-2">{card.details}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Assistant Comparison */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          Top Coding Assistants
        </motion.h2>
        <AssistantComparison />
      </section>

      {/* Collaboration model */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          Human-AI Collaboration
        </motion.h2>
        <CollaborationSplit />
      </section>

      {/* Prompt Engineering */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
            Prompt Engineering Techniques
          </h2>
          <p className="text-text-muted max-w-2xl">
            How you phrase your request dramatically affects the quality of AI output. These techniques are the difference between mediocre and excellent results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promptTechniques.map((tech, i) => (
            <GlassCard key={i} delay={i * 0.1}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-accent-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">{tech.name}</h3>
                </div>
                <span className={`text-xs font-semibold ${tech.color}`}>{tech.quality}</span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-3">{tech.desc}</p>
              <div className="p-3 rounded-lg bg-white/5 border border-white/8 font-mono text-xs text-accent-primary/80 italic">
                {tech.example}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Prompt Lab CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 p-6 glass-panel rounded-2xl border border-accent-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-primary/15 border border-accent-primary/25 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white">Try the Prompt Lab</h3>
              <p className="text-text-muted text-sm">See your prompts go from weak → better → excellent with AI feedback.</p>
            </div>
          </div>
          <a
            href="/prompt-lab"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-primary/20 border border-accent-primary/40 hover:bg-accent-primary/30 text-accent-primary font-semibold text-sm transition-all duration-300"
          >
            Open Prompt Lab <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}
