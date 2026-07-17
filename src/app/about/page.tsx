"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassCard from "@/components/ui/GlassCard";

const projectInfo = [
  { label: "Project Type", value: "Educational AI Portal" },
  { label: "Tech Stack", value: "Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion" },
  { label: "AI Integration", value: "Google Gemini 3.5 Flash (Server-side only)" },
  { label: "Pages", value: "11 multi-page application" },
  { label: "AI Features", value: "Playground, Code Explainer, Code Generator, Prompt Lab" },
  { label: "Security", value: "Backend API routes, env vars, rate limiting" },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-secondary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="About This Portal"
        title="About The"
        highlight="Project"
        subtitle="Exploring the frontiers of artificial intelligence education with secure, interactive, server-side tools."
        icon={BookOpen}
      />

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 border border-accent-primary/10"
        >
          <h2 className="font-display font-bold text-3xl text-white mb-6">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-text-muted leading-relaxed">
                <strong className="text-white">Synapse</strong> was created as an educational AI portal with a dual purpose: to teach the history, science, and future of artificial intelligence, while simultaneously demonstrating those concepts through live, interactive AI tools.
              </p>
              <p className="text-text-muted leading-relaxed">
                We believe the best way to understand AI is to <strong className="text-white">use it</strong>. Every page in this portal not only explains a concept — the AI Playground lets you explore it in real-time, the Code Explainer shows AI analyzing code, and the Prompt Lab demonstrates how language affects AI behavior.
              </p>
            </div>
            <div className="space-y-3">
              {projectInfo.map((item) => (
                <div key={item.label} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                  <span className="text-xs font-semibold text-accent-primary w-28 shrink-0">{item.label}</span>
                  <span className="text-xs text-text-muted leading-relaxed">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Security Architecture Note */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <GlassCard animate={false} className="border border-accent-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="font-display font-bold text-xl text-white mb-2">Security Architecture</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                This project implements real backend security. API keys never reach the browser.
              </p>
            </div>
            <div className="md:col-span-2 font-mono text-xs text-text-muted bg-[#0d1117] rounded-xl p-4 border border-white/8 leading-loose">
              <span className="text-accent-primary">Browser</span> (no API keys)<br />
              {'  '}↓ fetch(&apos;/api/chat&apos;, {'{'}messages{'}'}) <br />
              <span className="text-accent-secondary">Next.js API Route</span> (server-only)<br />
              {'  '}↓ process.env.GEMINI_API_KEY<br />
              <span className="text-green-400">Gemini API</span> (external)<br />
              {'  '}↓ response<br />
              <span className="text-accent-primary">Browser</span> receives text only
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
