"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, ChevronDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassCard from "@/components/ui/GlassCard";
import InteractiveTimeline from "@/components/features/InteractiveTimeline";


// Note: metadata must be in a server component, so we handle it via the layout pattern
export const dynamic = "force-static";

const winterPeriods = [
  {
    title: "First AI Winter (1974–1980)",
    desc: "Early promises of immediate machine translation, self-driving machines, and general reasoning systems failed to materialize. Hardware limitations made large-scale computation impossible, and the tasks proved far more complex than anyone anticipated. The US Lighthill Report (1974) and UK government reviews cut research funding significantly.",
    stat: "$0 Funding",
    metric: "Government budgets frozen",
    icon: "❄️",
  },
  {
    title: "Collapse of Expert Systems (1987–1993)",
    desc: "The first commercial AI wave — expert systems — failed because they were brittle rule-based networks. Maintaining thousands of IF-THEN conditions proved unsustainable. The cost of 'LISP machines' collapsed as cheaper general-purpose computers proved more efficient. Corporate AI investments were cut dramatically.",
    stat: "100k+ Rules",
    metric: "Unsustainable complexity",
    icon: "💀",
  },
  {
    title: "The Shift to Statistical Realism",
    desc: "Rather than attempting to code human logical rules manually, researchers realized AI must parse data statistically first. This pivot — from symbolic manipulation to machine learning — was the key insight that eventually led to modern AI. Neural networks, previously dismissed, were revisited with new training algorithms.",
    stat: "Data First",
    metric: "Paradigm pivot",
    icon: "🔄",
  },
  {
    title: "Why AI Winters Matter",
    desc: "AI winters are not failures — they are corrections. Each winter forced researchers to confront unrealistic expectations, refocus on engineering constraints, and discover more robust approaches. Today's deep learning renaissance emerged directly because of the lessons learned during these difficult periods.",
    stat: "Valuable Lessons",
    metric: "Progress through failure",
    icon: "💡",
  },
];

const fundingData = [
  { year: "1965", level: 90, label: "Peak Optimism" },
  { year: "1974", level: 15, label: "Winter Begins" },
  { year: "1980", level: 70, label: "Expert Systems Boom" },
  { year: "1987", level: 20, label: "Second Winter" },
  { year: "1993", level: 35, label: "ML Revival" },
  { year: "2006", level: 65, label: "Deep Learning" },
  { year: "2012", level: 82, label: "AlexNet Moment" },
  { year: "2017", level: 95, label: "Transformer Era" },
  { year: "2023", level: 100, label: "GPT-4 & Beyond" },
];

export default function HistoryPage() {
  const [activeWinter, setActiveWinter] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-125 bg-linear-to-b from-accent-secondary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="The Full Story"
        title="History of"
        highlight="Artificial Intelligence"
        subtitle="From Alan Turing's foundational thought experiment in 1950 to the generative AI explosion of the 2020s — explore the complete journey."
        icon={Snowflake}
      />

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            Interactive Timeline
          </h2>
          <p className="text-text-muted mt-2">Click any milestone to explore deeper</p>
        </motion.div>

        <InteractiveTimeline />
      </section>

      {/* AI Funding Chart */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
            AI Research Funding Over Time
          </h2>
          <p className="text-text-muted">The boom-bust cycles that shaped modern AI</p>
        </motion.div>

        <GlassCard className="p-8">
          <div className="flex items-end gap-2 h-48 relative">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pr-2">
              {[100, 75, 50, 25, 0].map((v) => (
                <span key={v} className="text-xs text-text-muted">{v}%</span>
              ))}
            </div>
            <div className="flex-1 flex items-end gap-1 md:gap-2 pl-8">
              {fundingData.map((d, i) => (
                <motion.div
                  key={d.year}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${d.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  className="flex-1 relative group"
                >
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                    style={{
                      height: "100%",
                      background: `linear-gradient(to top, rgba(139,92,246,0.6), rgba(110,231,255,0.6))`,
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 border border-white/10 rounded px-2 py-1 text-xs text-white whitespace-nowrap z-10">
                    {d.label}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-text-muted whitespace-nowrap">
                    {d.year}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-text-muted mt-10">
            Relative AI research funding & interest index (conceptual visualization)
          </p>
        </GlassCard>
      </section>

      {/* AI Winter Deep Dive */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
            The AI Winters
          </h2>
          <p className="text-text-muted max-w-2xl">
            Periods of funding collapse and disillusionment that paradoxically accelerated the eventual breakthroughs.
          </p>
        </motion.div>

        <div className="space-y-4">
          {winterPeriods.map((period, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer"
                onClick={() => setActiveWinter(activeWinter === i ? null : i)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{period.icon}</span>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-white">{period.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-accent-primary font-bold text-sm">{period.stat}</span>
                        <span className="text-text-muted text-xs">· {period.metric}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-300 ${activeWinter === i ? "rotate-180" : ""}`}
                  />
                </div>
                <AnimatePresence>
                  {activeWinter === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-text-muted text-sm leading-relaxed mt-4 pt-4 border-t border-white/10 overflow-hidden"
                    >
                      {period.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
