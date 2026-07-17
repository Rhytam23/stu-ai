"use client";

import { motion } from "framer-motion";
import { Rocket, AlertTriangle, Users, Zap, ShieldAlert, Copyright, Brain } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassCard from "@/components/ui/GlassCard";

const challenges = [
  {
    title: "Hallucinations",
    icon: Brain,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    desc: "AI generating syntactically valid code that is logically incorrect, references non-existent libraries, or has subtle logic bugs that pass review.",
    mitigation: "Rigid unit test frameworks, systematic human compiler review, and using AI-generated code only as a starting point — not the final product.",
  },
  {
    title: "Data Privacy",
    icon: ShieldAlert,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    desc: "Proprietary or sensitive code being uploaded to external API endpoints for model processing, risking intellectual property leaks and compliance violations.",
    mitigation: "Self-hosted local models (like Ollama), strict enterprise telemetry opt-outs, and reviewing terms of service for data usage.",
  },
  {
    title: "Security Vulnerabilities",
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    desc: "Generative models recommending legacy, deprecated, or vulnerable syntax patterns they learned during training on old open-source repositories.",
    mitigation: "Integrated static analysis (Snyk, SonarQube), vulnerability scanners, and strict peer review of all AI-generated code.",
  },
  {
    title: "Code Quality & Bloat",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    desc: "Easy generation of large codebases leading to technical debt when developers merge AI-generated code without fully understanding its implications.",
    mitigation: "Strict architectural guidelines, mandatory code density constraints, and requiring developers to explain any AI-generated code they commit.",
  },
  {
    title: "Bias & Stereotyping",
    icon: Users,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    desc: "Models reinforcing poor coding paradigms or default assumptions found in legacy repositories used for training data.",
    mitigation: "Fine-tuning models on curated modern repositories using clean paradigms, and diverse training data evaluation.",
  },
  {
    title: "Copyright & Licensing",
    icon: Copyright,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    desc: "Models potentially generating code snippets that match copyleft-licensed code without proper attribution, creating legal risks.",
    mitigation: "Attribution check filters, license filtering layers (like GitHub Copilot's duplicate detection), and legal review of AI usage policies.",
  },
];

const futurePoints = [
  {
    number: "01",
    title: "Autonomous Software Agents",
    desc: "AI systems that can read GitHub issues, design solutions, write tests, create pull requests, and deploy updates independently. Tools like Devin and various LLM agents already demonstrate early versions of this.",
    timeline: "2025–2027",
    color: "from-accent-primary/20 to-cyan-500/5",
  },
  {
    number: "02",
    title: "AI-Augmented Education",
    desc: "Interactive textbooks that adapt to individual learning pace, explain compiler warnings in real-time, generate custom coding exercises, and provide personalized mentorship at scale.",
    timeline: "2024–2026",
    color: "from-accent-secondary/20 to-purple-500/5",
  },
  {
    number: "03",
    title: "Human-AI Swarm Systems",
    desc: "One product manager orchestrating fleets of specialist AI agents (developer, QA, SecOps, DevOps, Designer) to launch enterprise-grade systems. Each agent has specialized training and tools.",
    timeline: "2026–2028",
    color: "from-emerald-500/20 to-teal-500/5",
  },
  {
    number: "04",
    title: "Universal Code Understanding",
    desc: "AI that understands intent from high-level descriptions, translates between any languages, refactors legacy COBOL systems, and explains code behavior in any human language.",
    timeline: "2025–2026",
    color: "from-pink-500/20 to-rose-500/5",
  },
];

const collaborationModels = [
  { role: "Product Manager", task: "Defines requirements in natural language", ai: "AI translates to user stories and acceptance criteria" },
  { role: "Architect", task: "Designs system boundaries and APIs", ai: "AI generates scaffolding, boilerplate, and documentation" },
  { role: "Developer", task: "Reviews, tests, and refines AI output", ai: "AI generates 70%+ of implementation code" },
  { role: "QA Engineer", task: "Validates edge cases and system behavior", ai: "AI generates test suites and identifies failure modes" },
  { role: "DevOps", task: "Monitors and approves deployments", ai: "AI generates CI/CD pipelines and infrastructure configs" },
];

const references = [
  { type: "Paper", title: "Attention Is All You Need", author: "Vaswani et al. (2017)", desc: "The original Transformer paper that changed everything.", url: "https://arxiv.org/abs/1706.03762" },
  { type: "Paper", title: "Language Models are Few-Shot Learners (GPT-3)", author: "Brown et al. (2020)", desc: "Demonstrated emergent few-shot capabilities in large models.", url: "https://arxiv.org/abs/2005.14165" },
  { type: "Paper", title: "Training Language Models to Follow Instructions (RLHF)", author: "Ouyang et al. (2022)", desc: "Foundation of modern instruction-following AI systems.", url: "https://arxiv.org/abs/2203.02155" },
  { type: "Book", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", desc: "Essential reading for understanding scalable system architecture.", url: "https://dataintensive.net/" },
  { type: "Video", title: "Neural Networks: Zero to Hero", author: "Andrej Karpathy", desc: "The best free series to understand neural network math from scratch.", url: "https://karpathy.ai/zero-to-hero.html" },
  { type: "Course", title: "Deep Learning Specialization", author: "Andrew Ng / Coursera", desc: "Systematic 5-course curriculum covering all of deep learning fundamentals.", url: "https://www.deeplearning.ai/" },
  { type: "Docs", title: "Next.js Documentation", author: "Vercel", desc: "Official docs for the framework powering this portal.", url: "https://nextjs.org/docs" },
  { type: "Docs", title: "Google AI for Developers", author: "Google", desc: "Official Gemini API documentation and guides.", url: "https://ai.google.dev/" },
];

export default function FuturePage() {
  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-indigo-500/5 to-transparent pointer-events-none" />

      <PageHero
        badge="Looking Ahead"
        title="Challenges, Human+AI &"
        highlight="The Future"
        subtitle="AI is transforming software engineering — but it brings real challenges. Here's how we navigate them and where we're headed."
        icon={Rocket}
      />

      {/* Challenges */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          Current Challenges
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((challenge, i) => {
            const Icon = challenge.icon;
            return (
              <GlassCard key={i} delay={i * 0.08}>
                <div className={`w-10 h-10 rounded-xl ${challenge.bg} border flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${challenge.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{challenge.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">{challenge.desc}</p>
                <div className="p-3 rounded-lg bg-white/5 border border-white/8">
                  <p className="text-xs font-semibold text-accent-primary mb-1">Mitigation</p>
                  <p className="text-xs text-text-muted leading-relaxed">{challenge.mitigation}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Human + AI Collaboration */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          Human + AI Collaboration Models
        </motion.h2>
        <GlassCard animate={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-text-muted text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left p-3 text-white text-xs uppercase tracking-wider">Human Does</th>
                  <th className="text-left p-3 text-accent-primary text-xs uppercase tracking-wider">AI Does</th>
                </tr>
              </thead>
              <tbody>
                {collaborationModels.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="p-3 font-semibold text-accent-secondary text-xs">{row.role}</td>
                    <td className="p-3 text-text-muted text-xs">{row.task}</td>
                    <td className="p-3 text-text-muted text-xs">{row.ai}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* Future Points */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          What&apos;s Coming Next
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {futurePoints.map((point, i) => (
            <GlassCard key={i} delay={i * 0.1} className={`bg-linear-to-br ${point.color}`}>
              <div className="flex items-start gap-4">
                <span className="font-display font-bold text-4xl text-white/10">{point.number}</span>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-lg text-white">{point.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 border border-white/10 text-text-muted">{point.timeline}</span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{point.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* References */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          References & Resources
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {references.map((ref, i) => (
            <GlassCard key={i} delay={i * 0.06}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-primary/15 border border-accent-primary/25 text-accent-primary shrink-0 mt-0.5">
                  {ref.type}
                </span>
                <div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:text-accent-primary transition-colors text-sm"
                  >
                    {ref.title} ↗
                  </a>
                  <p className="text-xs text-accent-secondary mt-0.5">{ref.author}</p>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{ref.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Conclusion */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 md:p-16 text-center border border-accent-primary/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Rocket className="w-4 h-4 text-accent-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">Conclusion</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
              The Future Belongs to Those Who Understand AI
            </h2>
            <p className="text-text-muted text-lg max-w-3xl mx-auto leading-relaxed">
              Artificial intelligence is not replacing developers — it is amplifying them. The engineers who master these tools, understand their limits, and apply them with critical judgment will define the next era of software. AI is not the destination; it is the most powerful tool humanity has ever built for getting there.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a href="/playground" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-accent-primary/80 to-accent-secondary/80 hover:from-accent-primary hover:to-accent-secondary text-white font-semibold transition-all duration-300">
                Try the AI Playground →
              </a>
              <a href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/8 border border-white/15 hover:bg-white/12 text-white font-semibold transition-all duration-300">
                Take the Quiz
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
