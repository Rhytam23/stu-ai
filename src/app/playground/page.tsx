"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ChevronDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ChatInterface from "@/components/ChatInterface";

const modes = [
  {
    id: "general",
    label: "General AI",
    icon: "🧠",
    system: `You are an expert AI educator and assistant specializing in artificial intelligence, machine learning, programming, and software engineering. 
Provide clear, accurate, educational responses. Format code with proper markdown syntax highlighting.
Be thorough but accessible to students learning these concepts.`,
    placeholder: "Ask anything about AI, machine learning, or technology…",
  },
  {
    id: "programming",
    label: "Programming",
    icon: "💻",
    system: `You are an expert software engineer and programming tutor. Help users with:
- Debugging code and finding errors  
- Explaining programming concepts
- Choosing the right data structures and algorithms
- Best practices for clean, maintainable code
Always provide code examples when relevant. Use proper markdown with syntax-highlighted code blocks.`,
    placeholder: "Ask a programming question or paste code to debug…",
  },
  {
    id: "concepts",
    label: "Concepts",
    icon: "📚",
    system: `You are a computer science professor who excels at explaining complex AI and CS concepts clearly.
Use analogies, visual descriptions, and step-by-step breakdowns. 
Target explanations to someone learning these topics for the first time.
Connect abstract theory to real-world applications.`,
    placeholder: "Ask about any AI or CS concept to get a clear explanation…",
  },
];

const starterPrompts = [
  "Explain how transformer attention works",
  "What is the difference between AI and ML?",
  "How does gradient descent work?",
  "Write a Python function to reverse a linked list",
  "What makes GPT-4 different from GPT-3?",
  "Explain overfitting vs underfitting",
];

export default function PlaygroundPage() {
  const [activeMode, setActiveMode] = useState(modes[0]);

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-primary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="Live AI"
        title="AI"
        highlight="Playground"
        subtitle="Chat directly with Google Gemini. Ask questions, get code explanations, explore ideas, and continue multi-turn conversations."
        icon={MessageSquare}
      />

      <div className="max-w-5xl mx-auto px-6 pb-32 space-y-6">
        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-text-muted mb-3 font-medium">Choose a mode:</p>
          <div className="flex flex-wrap gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeMode.id === mode.id
                    ? "bg-accent-primary/20 border border-accent-primary/40 text-accent-primary"
                    : "bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ChatInterface
            key={activeMode.id}
            systemPrompt={activeMode.system}
            placeholder={activeMode.placeholder}
            title={`${activeMode.icon} ${activeMode.label} Mode`}
          />
        </motion.div>

        {/* Starter Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-sm text-text-muted mb-3 font-medium">Try these prompts:</p>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-colors duration-200"
                onClick={() => {
                  // Copy to clipboard as a hint
                  navigator.clipboard?.writeText(prompt).catch(() => {});
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted/50 mt-2">
            Click any prompt above to copy it, then paste into the chat.
          </p>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel rounded-2xl p-5 flex items-start gap-4"
        >
          <ChevronDown className="w-5 h-5 text-accent-primary shrink-0 -rotate-90" />
          <div>
            <p className="text-sm text-white font-semibold mb-1">How this works securely</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Your messages are sent to a secure Next.js API route on the server, which calls Google&apos;s Gemini API using a private key stored in environment variables. 
              The API key is <strong className="text-white">never exposed</strong> to your browser or included in any client-side code.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
