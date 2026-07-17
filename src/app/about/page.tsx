"use client";

import { motion } from "framer-motion";
import { Users, GitBranch, ExternalLink, Mail } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassCard from "@/components/ui/GlassCard";

const teamMembers = [
  {
    initials: "AK",
    name: "Arjun Kumar",
    role: "Lead Developer & AI Researcher",
    bio: "Specializes in large language model architectures and AI-driven developer tools. Built the backend security layer and Gemini API integration for this project.",
    skills: ["Next.js", "Python", "Machine Learning", "API Design"],
    gradient: "from-accent-primary to-cyan-600",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "UI/UX Designer & Frontend Engineer",
    bio: "Expert in creating premium, accessible web interfaces. Designed the dark futuristic theme, component system, and interactive timeline used throughout this portal.",
    skills: ["React", "Framer Motion", "Tailwind CSS", "Design Systems"],
    gradient: "from-accent-secondary to-purple-700",
  },
  {
    initials: "RV",
    name: "Rahul Verma",
    role: "ML Engineer & Content Researcher",
    bio: "Machine learning practitioner with deep knowledge of neural network architectures. Authored the AI Foundations content and quiz question bank.",
    skills: ["TensorFlow", "PyTorch", "NLP", "Research Writing"],
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    initials: "NK",
    name: "Neha Kapoor",
    role: "Backend Developer & Security Specialist",
    bio: "Focuses on secure API design and server-side architecture. Designed the rate limiting, input validation, and environment security model for this project.",
    skills: ["Node.js", "API Security", "TypeScript", "DevOps"],
    gradient: "from-pink-500 to-rose-600",
  },
];

const projectInfo = [
  { label: "Project Type", value: "Educational AI Portal" },
  { label: "Tech Stack", value: "Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion" },
  { label: "AI Integration", value: "Google Gemini 1.5 Flash (Server-side only)" },
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
        title="Meet the"
        highlight="Team"
        subtitle="A college project built with passion — combining a genuine interest in AI education with real engineering practices."
        icon={Users}
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

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
        >
          The Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, i) => (
            <GlassCard key={i} delay={i * 0.1}>
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${member.gradient} flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <span className="font-display font-bold text-2xl text-white">{member.initials}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg text-white">{member.name}</h3>
                  <p className="text-accent-primary text-xs font-semibold mb-2">{member.role}</p>
                  <p className="text-text-muted text-sm leading-relaxed mb-3">{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-white/8 border border-white/10 text-text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social links (placeholder) */}
                  <div className="flex gap-2 mt-3">
                    <a href="#" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all" aria-label="GitHub">
                      <GitBranch className="w-3.5 h-3.5" />
                    </a>
                    <a href="#" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all" aria-label="LinkedIn">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a href="#" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all" aria-label="Email">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
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
