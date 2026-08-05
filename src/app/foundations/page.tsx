"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Layers, Cpu } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import GlassCard from "@/components/ui/GlassCard";
import WorkflowDiagram from "@/components/features/WorkflowDiagram";

const tabs = ["Machine Learning", "Deep Learning", "Large Language Models"] as const;
type Tab = typeof tabs[number];

const mlConcepts = [
  {
    tag: "Supervised",
    title: "Supervised Learning",
    desc: "The model learns from labeled training data — input-output pairs. It builds a function that maps inputs to the correct outputs. Used for classification (spam detection) and regression (price prediction).",
    example: "Training an email spam classifier on 10,000 labeled emails.",
  },
  {
    tag: "Unsupervised",
    title: "Unsupervised Learning",
    desc: "The model finds hidden patterns in data without labels. Clustering algorithms group similar data points. Used for customer segmentation, anomaly detection, and data compression.",
    example: "Grouping customers by purchasing behavior without predefined categories.",
  },
  {
    tag: "Reinforcement",
    title: "Reinforcement Learning",
    desc: "An agent learns by interacting with an environment and receiving rewards or penalties. The agent optimizes a policy to maximize cumulative reward. Used in game playing (AlphaGo), robotics, and autonomous vehicles.",
    example: "Training a game-playing agent that learns chess through millions of self-play games.",
  },
];

const dlConcepts = [
  {
    title: "Artificial Neural Networks",
    desc: "Layers of interconnected 'neurons' that transform input data. Each neuron applies a weighted sum and an activation function. Multiple layers learn hierarchical feature representations.",
    visual: "Input → Hidden Layers → Output",
  },
  {
    title: "Convolutional Neural Networks (CNN)",
    desc: "Specialized for grid-like data (images, audio). Convolutional filters scan for local features like edges and textures. Pooling layers reduce spatial dimensions. The backbone of computer vision.",
    visual: "Image → Conv → Pool → FC → Class",
  },
  {
    title: "Recurrent Neural Networks (RNN)",
    desc: "Process sequential data with internal memory. Each step passes a hidden state to the next. LSTMs and GRUs solve the vanishing gradient problem for long sequences.",
    visual: "Token₁ → Token₂ → Token₃ → Output",
  },
  {
    title: "Transformers",
    desc: "The self-attention mechanism weighs each token's importance relative to all others simultaneously. Unlike RNNs, transformers process sequences in parallel, enabling massive scale. Powers all modern LLMs.",
    visual: "All Tokens ↔ Self-Attention → Output",
  },
];

const llmConcepts = [
  {
    title: "Tokenization",
    desc: "Text is split into tokens (words or subword units). Each token maps to a high-dimensional vector embedding. GPT-4 uses ~100,000 token vocabulary; Gemini supports even more.",
  },
  {
    title: "Pre-training",
    desc: "Models train on internet-scale text corpora (trillions of tokens) to predict the next token. This unsupervised process gives the model vast world knowledge and language fluency.",
  },
  {
    title: "Instruction Tuning (RLHF)",
    desc: "Reinforcement Learning from Human Feedback fine-tunes the model to follow instructions helpfully and safely. Human raters rank outputs; the model is trained to produce higher-ranked responses.",
  },
  {
    title: "Context Window",
    desc: "The maximum tokens a model can process at once. GPT-4 supports up to 128K tokens; Gemini 1.5 Pro handles 1M tokens. Larger context = more code, documents, or conversation history.",
  },
  {
    title: "Temperature & Sampling",
    desc: "Temperature controls randomness. Low values (0.1) produce deterministic, factual outputs ideal for code. High values (0.9) produce creative, diverse text ideal for brainstorming.",
  },
  {
    title: "Fine-tuning & RAG",
    desc: "Fine-tuning adapts a pre-trained model to a specific domain with small labeled datasets. Retrieval-Augmented Generation (RAG) grounds model outputs in retrieved real-time documents.",
  },
];

export default function FoundationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Machine Learning");

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-125 bg-linear-to-b from-accent-secondary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="Core Concepts"
        title="AI"
        highlight="Foundations"
        subtitle="Understand the building blocks of modern AI — from statistical learning to the transformer architecture powering today's large language models."
        icon={Brain}
      />

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl w-fit max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-accent-secondary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  : "text-text-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ML Tab */}
      {activeTab === "Machine Learning" && (
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mlConcepts.map((concept, i) => (
              <GlassCard key={i} delay={i * 0.1}>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent-primary/15 border border-accent-primary/25 text-accent-primary">
                  {concept.tag}
                </span>
                <h3 className="font-display font-semibold text-lg text-white mt-3 mb-2">
                  {concept.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">{concept.desc}</p>
                <div className="p-3 rounded-lg bg-white/5 border border-white/8">
                  <p className="text-xs text-accent-primary font-semibold mb-1">Example</p>
                  <p className="text-xs text-text-muted">{concept.example}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Workflow Diagram */}
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-6">
              The ML Training Pipeline
            </h2>
            <WorkflowDiagram />
          </div>
        </div>
      )}

      {/* Deep Learning Tab */}
      {activeTab === "Deep Learning" && (
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dlConcepts.map((concept, i) => (
              <GlassCard key={i} delay={i * 0.1}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-secondary/20 border border-accent-secondary/30 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-accent-secondary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">{concept.title}</h3>
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-3">{concept.desc}</p>
                <div className="px-3 py-2 rounded-lg bg-accent-primary/10 border border-accent-primary/20 font-mono text-xs text-accent-primary">
                  {concept.visual}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Backpropagation explainer */}
          <GlassCard>
            <h3 className="font-display font-semibold text-xl text-white mb-4">
              How Training Works: Backpropagation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Forward Pass", desc: "Input flows through the network, layer by layer, producing a prediction." },
                { step: "02", title: "Compute Loss", desc: "The difference between the prediction and the correct answer is calculated as a loss value." },
                { step: "03", title: "Backward Pass", desc: "Gradients flow backward through the network, identifying how each weight contributed to the error." },
                { step: "04", title: "Update Weights", desc: "Gradient descent adjusts each weight slightly in the direction that reduces future loss." },
              ].map((s) => (
                <div key={s.step} className="space-y-2">
                  <span className="font-display font-bold text-3xl text-accent-primary/30">{s.step}</span>
                  <h4 className="font-semibold text-white">{s.title}</h4>
                  <p className="text-text-muted text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* LLM Tab */}
      {activeTab === "Large Language Models" && (
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {llmConcepts.map((concept, i) => (
              <GlassCard key={i} delay={i * 0.08}>
                <div className="w-8 h-8 rounded-lg bg-accent-primary/15 border border-accent-primary/25 flex items-center justify-center mb-3">
                  <Cpu className="w-4 h-4 text-accent-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{concept.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{concept.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Scale comparison */}
          <GlassCard>
            <h3 className="font-display font-semibold text-xl text-white mb-6">
              The Scale of Modern LLMs
            </h3>
            <div className="space-y-4">
              {[
                { model: "GPT-2 (2019)", params: "1.5B", bar: 5 },
                { model: "GPT-3 (2020)", params: "175B", bar: 25 },
                { model: "PaLM (2022)", params: "540B", bar: 55 },
                { model: "GPT-4 (2023)", params: "~1.8T*", bar: 80 },
                { model: "Gemini Ultra (2024)", params: "~1T+*", bar: 90 },
                { model: "Claude 3 Opus (2024)", params: "~1T+*", bar: 95 },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-text-muted shrink-0">{m.model}</div>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full bg-linear-to-r from-accent-secondary to-accent-primary"
                    />
                  </div>
                  <span className="text-xs font-mono text-accent-primary w-16 text-right">{m.params}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-4">* Estimated parameters. Actual sizes not publicly disclosed. Bar shows relative scale.</p>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
