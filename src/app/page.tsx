"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles, ArrowRight, Brain, History, Cpu, MessageSquare,
  Code2, Wand2, BarChart2, Trophy, Rocket, ChevronRight
} from "lucide-react";
import CursorGlow from "@/components/CursorGlow";

const stats = [
  { value: "90%", label: "Developer Productivity Gain" },
  { value: "10x", label: "Faster Prototype Cycles" },
  { value: "40%+", label: "Boilerplate Automated" },
  { value: "1T+", label: "Parameters in Modern LLMs" },
];

const learnCards = [
  {
    href: "/history",
    icon: History,
    title: "History of AI",
    desc: "From Turing's test in 1950 to GPT-4o — explore the full timeline of artificial intelligence.",
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20",
  },
  {
    href: "/foundations",
    icon: Brain,
    title: "AI Foundations",
    desc: "Understand Machine Learning, Deep Learning, and Large Language Models from first principles.",
    color: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/20",
  },
  {
    href: "/coding-assistants",
    icon: Cpu,
    title: "Coding Assistants",
    desc: "How AI became your pair programmer — from autocomplete to autonomous code generation.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
  },
];

const toolCards = [
  {
    href: "/playground",
    icon: MessageSquare,
    title: "AI Playground",
    desc: "Chat with Gemini AI. Ask questions, get explanations, and explore ideas interactively.",
    badge: "Live AI",
    color: "from-accent-primary/20 to-cyan-500/5",
    border: "border-accent-primary/30",
  },
  {
    href: "/code-tools",
    icon: Code2,
    title: "Code Tools",
    desc: "Paste code for AI analysis, or describe what you need and generate production-quality code.",
    badge: "Powered by Gemini",
    color: "from-accent-secondary/20 to-purple-500/5",
    border: "border-accent-secondary/30",
  },
  {
    href: "/prompt-lab",
    icon: Wand2,
    title: "Prompt Lab",
    desc: "Learn prompt engineering by seeing how weak prompts transform into excellent ones.",
    badge: "Interactive",
    color: "from-pink-500/20 to-rose-500/5",
    border: "border-pink-500/30",
  },
  {
    href: "/comparison",
    icon: BarChart2,
    title: "AI Comparison",
    desc: "Compare ChatGPT, Claude, Gemini, Copilot, and more across key dimensions.",
    badge: "7 Tools",
    color: "from-emerald-500/20 to-teal-500/5",
    border: "border-emerald-500/30",
  },
  {
    href: "/quiz",
    icon: Trophy,
    title: "AI Quiz",
    desc: "Test your knowledge with 20+ questions covering AI history, ML, and modern tools.",
    badge: "20+ Questions",
    color: "from-amber-500/20 to-orange-500/5",
    border: "border-amber-500/30",
  },
  {
    href: "/future",
    icon: Rocket,
    title: "The Future",
    desc: "Autonomous agents, swarm systems, and what human-AI collaboration looks like tomorrow.",
    badge: "Explore",
    color: "from-indigo-500/20 to-blue-500/5",
    border: "border-indigo-500/30",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 right-0 h-[1000px] bg-linear-to-b from-accent-secondary/10 via-background/0 to-background pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-secondary/5 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <CursorGlow />

      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 flex items-center justify-center min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">
              Interactive Educational AI Portal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl md:text-8xl tracking-tight leading-[1.05] max-w-5xl mx-auto bg-clip-text text-transparent bg-linear-to-b from-white via-white to-text-muted/50"
          >
            Learn AI.{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-accent-primary via-accent-secondary to-accent-primary bg-size-[200%] animate-pulse-slow">
              Use AI.
            </span>
            <br className="hidden md:inline" />
            Understand the Future.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Explore the complete story of artificial intelligence — from the 1950s to today — and interact with live AI tools powered by Google Gemini.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold bg-linear-to-r from-accent-primary/80 to-accent-secondary/80 hover:from-accent-primary hover:to-accent-secondary text-white transition-all duration-300 shadow-[0_0_30px_rgba(110,231,255,0.2)] hover:shadow-[0_0_40px_rgba(110,231,255,0.35)]"
            >
              Try AI Playground <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold bg-white/8 border border-white/15 hover:bg-white/12 text-white transition-all duration-300"
            >
              Start Learning <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-panel glass-panel-hover rounded-2xl p-6 text-center"
          >
            <p className="font-display font-bold text-3xl md:text-4xl text-white">{stat.value}</p>
            <p className="text-text-muted text-xs mt-2 leading-tight">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Learn section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-xs font-semibold tracking-widest text-accent-primary uppercase">Educational Content</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-2">
            Learn the Fundamentals
          </h2>
          <p className="text-text-muted mt-2 max-w-xl">
            Deep-dive into AI concepts — from history to the cutting-edge models powering today's tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {learnCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={card.href}
                  className={`group block h-full glass-panel rounded-2xl p-6 border ${card.border} hover:border-opacity-60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(110,231,255,0.08)]`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${card.color} border ${card.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{card.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs text-accent-primary group-hover:gap-2 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI Tools section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-xs font-semibold tracking-widest text-accent-secondary uppercase">Live AI Tools</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-2">
            Interact with AI
          </h2>
          <p className="text-text-muted mt-2 max-w-xl">
            Hands-on tools powered by Google Gemini. No configuration needed — just start exploring.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={card.href}
                  className={`group block h-full glass-panel rounded-2xl p-6 border ${card.border} hover:border-opacity-60 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${card.color} border ${card.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-text-muted">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-base text-white mb-1.5">{card.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs text-accent-primary group-hover:gap-2 transition-all duration-300">
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
