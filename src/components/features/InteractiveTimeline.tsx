"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, ChevronRight, Cpu, Sparkles, Snowflake,
  Brain, Layers, Terminal, X, Zap, Globe, TrendingUp, Star
} from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  shortDesc: string;
  longDesc: string;
  whyImportant: string;
  impact: string[];
  illustration: string;
  color: string;
  highlight: string;
  tag: string;
}

const milestones: Milestone[] = [
  {
    year: "1950",
    title: "Alan Turing & The Turing Test",
    icon: Calendar,
    shortDesc: "Turing publishes 'Computing Machinery and Intelligence', asking: can machines think?",
    longDesc:
      "Alan Turing proposed the imitation game — a test of machine intelligence where a computer must convince a human interrogator that it is human. This thought experiment birthed the entire philosophy of AI, establishing the first scientific framework for measuring machine cognition. Turing argued that if a machine behaves as intelligently as a human, it is, by definition, intelligent.",
    whyImportant:
      "The Turing Test remains philosophically relevant today. Every LLM, from GPT to Gemini, is effectively being evaluated on Turing's framework — can it produce language indistinguishable from a human? Turing's paper is the philosophical seed of the entire AI industry.",
    impact: [
      "Established the first framework for machine intelligence measurement",
      "Created the philosophical foundation that motivated 70+ years of AI research",
      "Introduced the concept of natural language as the benchmark of intelligence",
      "His 1950 paper is still cited in modern AI research",
    ],
    illustration: "🧠",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    highlight: "Inception of AI Philosophy",
    tag: "Philosophy",
  },
  {
    year: "1956",
    title: "Dartmouth Conference",
    icon: Cpu,
    shortDesc: "The Dartmouth Conference officially names and launches the field of Artificial Intelligence.",
    longDesc:
      "John McCarthy, Marvin Minsky, Claude Shannon, and Nathaniel Rochester organized a summer workshop at Dartmouth College with the bold premise that 'every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it.' This event coined the term 'Artificial Intelligence' and attracted the founders of the field.",
    whyImportant:
      "The Dartmouth Conference is considered the birth of AI as an academic discipline. It transformed Turing's philosophical question into an engineering research agenda. The attendees went on to create the first AI labs, programs, and funding infrastructure at MIT, Carnegie Mellon, and Stanford.",
    impact: [
      "Coined the term 'Artificial Intelligence'",
      "Established AI as a formal academic research discipline",
      "Attracted foundational researchers who shaped the next 20 years",
      "Created the first research agenda: logic, language, and problem-solving",
    ],
    illustration: "🎓",
    color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    highlight: "AI Named as a Field",
    tag: "History",
  },
  {
    year: "1974",
    title: "Perceptron & Neural Networks",
    icon: Brain,
    shortDesc: "Frank Rosenblatt's Perceptron proves machines can learn from data — not just rules.",
    longDesc:
      "The Perceptron — introduced by Frank Rosenblatt in 1958 and mathematically formalized through the 1970s — was the first algorithm that could learn from examples by adjusting weights. Although limited to linearly separable problems, it demonstrated that machines could adapt their behavior through experience. This was the conceptual prototype of every neural network today.",
    whyImportant:
      "The Perceptron is the great-great-grandparent of ChatGPT and Gemini. The weight update rule it introduced (gradient descent) is still the fundamental learning algorithm used in all modern deep learning. Understanding the Perceptron is understanding the mathematical core of AI.",
    impact: [
      "Introduced the concept of machine learning through weight adjustment",
      "Pioneered the idea of a neuron-inspired computational unit",
      "Led directly to the backpropagation algorithm (1986)",
      "Mathematical ancestor of every modern neural network",
    ],
    illustration: "⚡",
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    highlight: "Learning from Data",
    tag: "Machine Learning",
  },
  {
    year: "1980s",
    title: "The AI Winters",
    icon: Snowflake,
    shortDesc: "Funding collapses as early AI hype fails to meet practical real-world expectations.",
    longDesc:
      "Twice in AI's history — first in 1974 and again in 1987 — funding dried up as over-promised AI systems failed to deliver. Expert systems, despite early commercial success, proved brittle and impossible to maintain at scale. The US and UK governments cut funding, forcing the discipline to confront its engineering limitations, discard unrealistic timelines, and discover more principled approaches.",
    whyImportant:
      "AI winters were not failures — they were corrections. Each winter forced researchers to confront the true complexity of intelligence, discard shortcuts, and build more principled foundations. The lessons learned in the winters directly enabled the deep learning renaissance of the 2010s. Winters created the culture of rigorous evaluation that makes modern AI trustworthy.",
    impact: [
      "Forced the field to abandon unrealistic symbolic reasoning timelines",
      "Eliminated brittle rule-based systems, clearing the path for ML",
      "Created a culture of empirical evaluation over theoretical speculation",
      "Led researchers to statistical approaches that eventually produced DL",
    ],
    illustration: "❄️",
    color: "from-sky-500/20 to-blue-400/20 border-sky-500/30",
    highlight: "Lessons from Failure",
    tag: "History",
  },
  {
    year: "1997",
    title: "Deep Blue Beats Kasparov",
    icon: Star,
    shortDesc: "IBM's Deep Blue defeats world chess champion Garry Kasparov — AI beats human at a complex cognitive task.",
    longDesc:
      "IBM's Deep Blue used specialized hardware and sophisticated search algorithms to evaluate 200 million chess positions per second. Its 1997 match victory over Garry Kasparov — then world chess champion — was a watershed cultural moment: for the first time, a machine had outperformed the best human mind at a complex, strategic cognitive task. It proved that computation could substitute for intelligence in specific domains.",
    whyImportant:
      "Deep Blue demonstrated that AI systems, though narrow, could exceed human performance at cognitive tasks. This proof of concept renewed industrial and academic investment in AI after the winter, and established the pattern of AI progress: superhuman performance at narrow tasks before general intelligence.",
    impact: [
      "Proved machines can exceed human performance at complex cognitive tasks",
      "Reignited public and corporate interest in AI after the winters",
      "Established 'narrow AI' as a viable and commercially relevant path",
      "Paved the way for game-playing AI milestones (AlphaGo, AlphaCode)",
    ],
    illustration: "♟️",
    color: "from-red-500/20 to-rose-500/20 border-red-500/30",
    highlight: "AI Defeats World Champion",
    tag: "Milestone",
  },
  {
    year: "2012",
    title: "AlexNet & Deep Learning",
    icon: Layers,
    shortDesc: "AlexNet wins ImageNet by a massive margin, triggering the deep learning revolution.",
    longDesc:
      "In 2012, Geoffrey Hinton's team at the University of Toronto submitted AlexNet to the ImageNet Large Scale Visual Recognition Challenge. It won by a historic 10% margin over the second-place entry — a gap so massive it convinced the world that deep convolutional neural networks were the future. Running on two NVIDIA GTX 580 GPUs, AlexNet demonstrated that GPU computing and large datasets could unlock the power of deep architectures.",
    whyImportant:
      "AlexNet is the single most important moment in modern AI history. It triggered an explosion of research, investment, and talent into deep learning. Every AI company today — Google, OpenAI, Anthropic, Meta — traces its core technology back to the insights demonstrated by AlexNet in 2012.",
    impact: [
      "Triggered the GPU-powered deep learning revolution",
      "Established convolutional neural networks as the standard for vision",
      "Led major tech companies to pivot entirely to deep learning",
      "Created the modern AI talent market and research funding ecosystem",
    ],
    illustration: "🔥",
    color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    highlight: "The Deep Learning Moment",
    tag: "Deep Learning",
  },
  {
    year: "2017",
    title: "The Transformer Architecture",
    icon: Zap,
    shortDesc: "'Attention Is All You Need' introduces the Transformer — the engine behind every modern LLM.",
    longDesc:
      "Google researchers published 'Attention Is All You Need' in 2017, introducing the Transformer architecture. Unlike RNNs which processed sequences step-by-step, Transformers use self-attention to relate every part of a sequence to every other part in parallel. This allowed massive parallelization on GPUs, unlocking the ability to train on previously impossible scales of data. Every major LLM — GPT, Claude, Gemini, Llama — is a Transformer.",
    whyImportant:
      "The Transformer is the most important architectural innovation in AI history since the Perceptron. It's the universal engine of modern intelligence: it powers text, code, images (ViT), audio, and video. Understanding transformers means understanding how every modern AI thinks.",
    impact: [
      "Introduced self-attention, enabling parallelized sequence modeling",
      "Made it possible to train on trillion-token datasets",
      "Is the architecture behind GPT, Claude, Gemini, Llama, and all major LLMs",
      "Extended to images (ViT), audio (Whisper), and video (Sora)",
    ],
    illustration: "⚙️",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    highlight: "Architecture of Intelligence",
    tag: "Transformers",
  },
  {
    year: "2020",
    title: "GPT-3 — Scale Changes Everything",
    icon: Globe,
    shortDesc: "OpenAI's GPT-3 with 175B parameters demonstrates emergent intelligence from scale alone.",
    longDesc:
      "GPT-3 stunned the world with 175 billion parameters trained on 45TB of internet text. But what shocked researchers was not its size — it was its emergent capabilities: few-shot learning, code generation, creative writing, and chain-of-thought reasoning that no one had explicitly trained it to do. GPT-3 demonstrated that scale itself was a path to intelligence — a finding that drove the race to build larger and larger models.",
    whyImportant:
      "GPT-3 fundamentally changed the AI research paradigm. Before it, AI capabilities were built feature by feature. After GPT-3, researchers discovered that intelligence emerges from scale. This insight led directly to GPT-4, Claude, Gemini, and the entire LLM industry that is now reshaping technology.",
    impact: [
      "Demonstrated emergent capabilities from scale alone",
      "Created the modern LLM-as-API business model",
      "Triggered a $100B+ race among Google, Microsoft, and Meta",
      "Made few-shot learning the new paradigm for AI applications",
    ],
    illustration: "🌐",
    color: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30",
    highlight: "Scale Unlocks Intelligence",
    tag: "LLMs",
  },
  {
    year: "2022",
    title: "ChatGPT & The Public AI Moment",
    icon: Sparkles,
    shortDesc: "ChatGPT reaches 100M users in 60 days — AI becomes a household technology.",
    longDesc:
      "When OpenAI launched ChatGPT in November 2022, it reached 1 million users in 5 days and 100 million in 60 days — faster than any product in history. For the first time, a general-purpose AI capable of coding, writing, reasoning, and conversation was freely accessible to everyone. ChatGPT's launch triggered the current AI gold rush, with Google, Microsoft, Meta, Amazon, and Apple all racing to deploy AI products.",
    whyImportant:
      "ChatGPT is the moment AI became a technology for everyone, not just researchers. It created the multi-trillion dollar LLM industry, transformed developer workflows, and proved that conversational AI interfaces are the future of software. Every AI coding assistant — Copilot, Cursor, Claude — exists in the world ChatGPT created.",
    impact: [
      "Fastest product to 100M users in history",
      "Triggered $10B+ Microsoft investment and Google's AI emergency",
      "Created the modern AI assistant market worth trillions",
      "Permanently changed software development workflows globally",
    ],
    illustration: "💬",
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    highlight: "AI for Everyone",
    tag: "Generative AI",
  },
  {
    year: "Today",
    title: "Gemini, Claude & AI Coding Assistants",
    icon: Terminal,
    shortDesc: "AI integrates directly into IDEs and development workflows, changing software engineering permanently.",
    longDesc:
      "Today's AI landscape is defined by fierce competition between frontier models — Google's Gemini with 1M token context, Anthropic's Claude with top-tier reasoning, and OpenAI's GPT-4o with multimodal capabilities. In IDEs, tools like Cursor, GitHub Copilot, and Tabnine act as pair programmers, writing boilerplate, debugging, explaining code, and suggesting architectures. Developers are evolving from line-of-code writers to high-level system architects directing AI agents.",
    whyImportant:
      "We are at the inflection point where AI transitions from a tool that helps developers to an agent that does much of the development autonomously. The question is no longer whether AI can code — it demonstrably can — but how humans and AI will divide cognitive labor in software engineering.",
    impact: [
      "AI coding assistants now write 30-50% of code at companies using them",
      "Multi-modal AI (Gemini) processes text, code, images, video, and audio",
      "Context windows of 1M+ tokens enable full-codebase understanding",
      "AI agents autonomously execute multi-step programming tasks",
    ],
    illustration: "🚀",
    color: "from-accent-primary/20 to-accent-secondary/20 border-accent-primary/30",
    highlight: "The Present & Future",
    tag: "Present",
  },
];

export default function InteractiveTimeline() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [modalMilestone, setModalMilestone] = useState<number | null>(null);

  const openModal = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMilestone(idx);
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="relative border-l border-white/10 ml-4 md:ml-48 space-y-12">
          {milestones.map((milestone, idx) => {
            const Icon = milestone.icon;
            const isActive = activeMilestone === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="relative group cursor-pointer pl-8 md:pl-12"
                onClick={() => setActiveMilestone(isActive ? null : idx)}
              >
                {/* Year Badge on the Left */}
                <div className="hidden md:flex absolute right-full mr-6 top-1 text-right flex-col items-end w-36">
                  <span className="font-display font-bold text-2xl text-accent-primary group-hover:text-white transition-colors duration-300">
                    {milestone.year}
                  </span>
                  <span className="text-xs text-text-muted mt-1 uppercase tracking-widest leading-tight">
                    {milestone.highlight}
                  </span>
                </div>

                {/* Icon Dot */}
                <div className="absolute left-0 -translate-x-1/2 top-1.5 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-bg-secondary group-hover:border-accent-primary/50 group-hover:bg-[#1a1b35] transition-all duration-300">
                  <Icon className="w-4 h-4 text-accent-primary" />
                </div>

                {/* Card content */}
                <div className={`glass-panel glass-panel-hover p-6 rounded-xl relative overflow-hidden transition-all duration-300 ${isActive ? "border-accent-primary/30" : ""}`}>
                  {/* Mobile year */}
                  <div className="flex md:hidden items-center gap-3 mb-2">
                    <span className="font-display font-bold text-xl text-accent-primary">{milestone.year}</span>
                    <span className="text-xs text-text-muted uppercase tracking-widest">• {milestone.highlight}</span>
                  </div>

                  {/* Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary">
                      {milestone.tag}
                    </span>
                    <span className="text-xl">{milestone.illustration}</span>
                  </div>

                  <h3 className="font-display font-semibold text-lg md:text-xl text-white mb-2 flex items-center gap-2">
                    {milestone.title}
                    <ChevronRight
                      className={`w-4 h-4 text-accent-primary transition-transform duration-300 ${isActive ? "rotate-90" : ""}`}
                    />
                  </h3>
                  <p className="text-text-muted text-sm md:text-base leading-relaxed">
                    {milestone.shortDesc}
                  </p>

                  {/* Expanded preview */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                          <p className="text-sm text-text-muted leading-relaxed">{milestone.longDesc}</p>

                          {/* Impact bullets */}
                          <div>
                            <p className="text-xs font-semibold text-accent-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5" /> Impact
                            </p>
                            <ul className="space-y-1.5">
                              {milestone.impact.slice(0, 2).map((imp, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                                  <span className="text-accent-primary mt-0.5">→</span>
                                  {imp}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Learn more */}
                          <button
                            onClick={(e) => openModal(idx, e)}
                            className="flex items-center gap-1.5 text-xs text-accent-primary hover:text-white transition-colors font-semibold"
                          >
                            Full deep-dive <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Full-panel Modal ── */}
      <AnimatePresence>
        {modalMilestone !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setModalMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass-panel rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const m = milestones[modalMilestone];
                const Icon = m.icon;
                return (
                  <div>
                    {/* Modal header */}
                    <div className={`p-6 bg-linear-to-br ${m.color} border-b border-white/10 rounded-t-2xl`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">{m.illustration}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white">
                                {m.tag}
                              </span>
                              <span className="text-xs text-text-muted">{m.year}</span>
                            </div>
                            <h2 className="font-display font-bold text-xl md:text-2xl text-white leading-tight">
                              {m.title}
                            </h2>
                          </div>
                        </div>
                        <button
                          onClick={() => setModalMilestone(null)}
                          className="shrink-0 p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Modal body */}
                    <div className="p-6 space-y-6">
                      {/* Short desc */}
                      <p className="text-text-muted text-sm leading-relaxed italic border-l-2 border-accent-primary/50 pl-4">
                        {m.shortDesc}
                      </p>

                      {/* Full description */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-4 h-4 text-accent-primary" />
                          <h3 className="font-display font-semibold text-white">What Happened</h3>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">{m.longDesc}</p>
                      </div>

                      {/* Why Important */}
                      <div className="p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-accent-primary" />
                          <h3 className="font-display font-semibold text-white">Why It Matters</h3>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">{m.whyImportant}</p>
                      </div>

                      {/* Impact */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-accent-primary" />
                          <h3 className="font-display font-semibold text-white">Impact on AI</h3>
                        </div>
                        <ul className="space-y-2.5">
                          {m.impact.map((imp, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                              <span className="font-bold text-accent-primary mt-0.5 shrink-0">{i + 1}.</span>
                              {imp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Timeline navigation */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <button
                          onClick={() => setModalMilestone((p) => (p !== null && p > 0 ? p - 1 : p))}
                          disabled={modalMilestone === 0}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-text-muted hover:text-white transition-colors disabled:opacity-30"
                        >
                          ← Previous
                        </button>
                        <span className="text-xs text-text-muted">
                          {modalMilestone + 1} / {milestones.length}
                        </span>
                        <button
                          onClick={() => setModalMilestone((p) => (p !== null && p < milestones.length - 1 ? p + 1 : p))}
                          disabled={modalMilestone === milestones.length - 1}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-text-muted hover:text-white transition-colors disabled:opacity-30"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
