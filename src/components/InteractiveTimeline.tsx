"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Cpu, Sparkles, BookOpen, Snowflake, HelpCircle, Layers, Terminal } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  shortDesc: string;
  longDesc: string;
  highlight: string;
}

export default function InteractiveTimeline() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  const milestones: Milestone[] = [
    {
      year: "1950",
      title: "Alan Turing & Turing Test",
      icon: Calendar,
      shortDesc: "Turing publishes 'Computing Machinery and Intelligence', introducing the Turing Test.",
      longDesc: "Alan Turing proposed a standard of machine intelligence: can a computer mimic human speech well enough to fool an interrogator? This conceptual foundation birthed the entire philosophy of AI, asking whether machines could calculate logic in ways that mimic conscious thought.",
      highlight: "Inception of AI Philosophy",
    },
    {
      year: "1956",
      title: "Symbolic AI (GOFAI)",
      icon: Cpu,
      shortDesc: "The Dartmouth Conference officially names and launches the field of Artificial Intelligence.",
      longDesc: "Early researchers believed intelligence was primarily symbolic manipulation. They created algorithms that processed symbols according to explicit formal logic, laying the groundwork for basic algebra solvers and game-playing machines.",
      highlight: "Rule-based reasoning foundations",
    },
    {
      year: "1970s",
      title: "Expert Systems",
      icon: BookOpen,
      shortDesc: "The rise of systems that mimic the decision-making ability of human experts.",
      longDesc: "Expert Systems like MYCIN and DENDRAL encoded domain-specific knowledge as thousands of 'IF-THEN' rules. While highly effective inside narrow specialties, these systems were brittle, expensive to maintain, and lacked the capacity to generalize or learn autonomously.",
      highlight: "First commercial enterprise AI wave",
    },
    {
      year: "1980s",
      title: "AI Winter",
      icon: Snowflake,
      shortDesc: "Funding collapses as early AI hype fails to meet practical real-world expectations.",
      longDesc: "Underestimating the complexity of natural language, sensory processing, and logic caused a severe funding collapse. The US and UK governments cut funding for undirected AI research, forcing the discipline to reform, restructure, and focus on practical engineering constraints.",
      highlight: "Lessons in hyper-inflated expectations",
    },
    {
      year: "1990s",
      title: "Machine Learning (ML)",
      icon: HelpCircle,
      shortDesc: "A paradigm shift from hand-coded rules to data-driven statistical learning.",
      longDesc: "Instead of writing rigid logic, engineers designed algorithms that statistical analyzed data to identify patterns. Algorithms like Support Vector Machines and Decision Trees allowed applications to improve their predictions with more experience.",
      highlight: "Data-driven paradigm shift",
    },
    {
      year: "2010s",
      title: "Deep Learning (DL)",
      icon: Layers,
      shortDesc: "Multi-layered artificial neural networks harness massive compute and big data.",
      longDesc: "With GPUs scaling mathematical operations and the internet providing massive datasets (ImageNet), Deep Neural Networks triumphed. Backpropagation allowed networks to automatically extract hierarchical features, solving computer vision, speech, and early translation tasks.",
      highlight: "The GPU and Big Data era",
    },
    {
      year: "2020",
      title: "Generative AI",
      icon: Sparkles,
      shortDesc: "Transformers scale up to generate original, context-aware content and text.",
      longDesc: "The Transformer architecture, utilizing self-attention, enabled Large Language Models (LLMs) to capture deep contextual relationships. Instead of classification, these models generate human-like sentences, creative prose, and highly complex computer programs.",
      highlight: "The Transformer paradigm",
    },
    {
      year: "Present",
      title: "Modern Coding Assistants",
      icon: Terminal,
      shortDesc: "AI integrates directly into IDEs, changing software engineering permanently.",
      longDesc: "Tools like Copilot, Cursor, and ChatGPT act as pair programmers. They write code boilerplate, draft algorithms, explain complex code, diagnose exceptions, and refactor existing systems on the fly, transforming developers from lines-of-code writers to high-level system architects.",
      highlight: "Autopilot to Co-pilot collaboration",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="relative border-l border-white/10 ml-4 md:ml-48 pl-8 md:pl-12 space-y-12">
        {milestones.map((milestone, idx) => {
          const Icon = milestone.icon;
          const isActive = activeMilestone === idx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => setActiveMilestone(isActive ? null : idx)}
            >
              {/* Year Badge on the Left */}
              <div className="hidden md:flex absolute right-full mr-8 top-1 text-right flex-col items-end w-36">
                <span className="font-display font-bold text-2xl text-accent-primary group-hover:text-white transition-colors duration-300">
                  {milestone.year}
                </span>
                <span className="text-xs text-text-muted mt-1 uppercase tracking-widest">
                  {milestone.highlight}
                </span>
              </div>

              {/* Icon Dot */}
              <div className="absolute -left-12 md:-left-20 top-1.5 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-bg-secondary group-hover:border-accent-primary/50 group-hover:bg-[#1a1b35] transition-all duration-300">
                <Icon className="w-4 h-4 text-accent-primary" />
              </div>

              {/* Card content */}
              <div className="glass-panel glass-panel-hover p-6 rounded-xl relative overflow-hidden transition-all duration-300">
                <div className="flex md:hidden items-center gap-3 mb-2">
                  <span className="font-display font-bold text-xl text-accent-primary">
                    {milestone.year}
                  </span>
                  <span className="text-xs text-text-muted uppercase tracking-widest">
                    • {milestone.highlight}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg md:text-xl text-white mb-2 flex items-center gap-2">
                  {milestone.title}
                  <ChevronRight
                    className={`w-4 h-4 text-accent-primary transition-transform duration-300 ${
                      isActive ? "rotate-90" : ""
                    }`}
                  />
                </h3>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  {milestone.shortDesc}
                </p>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-white/5 text-sm text-text-muted leading-relaxed space-y-2">
                        <p>{milestone.longDesc}</p>
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
  );
}
