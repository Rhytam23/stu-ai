"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Wand2, AlertCircle, CheckCircle, Clock, Zap, Bug, Star } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CodeBlock from "@/components/ui/CodeBlock";
import LoadingDots from "@/components/ui/LoadingDots";

const LANGUAGES = ["python", "javascript", "typescript", "java", "c", "cpp"] as const;
type Language = typeof LANGUAGES[number];

const GEN_LANGUAGES = ["python", "javascript", "typescript", "java", "c", "cpp", "go", "rust", "sql", "bash"] as const;
type GenLanguage = typeof GEN_LANGUAGES[number];

interface ExplainResult {
  summary: string;
  breakdown: { section: string; explanation: string }[];
  timeComplexity: string;
  spaceComplexity: string;
  bugs: string[];
  improvements: string[];
  bestPractices: string[];
  improvedCode: string;
}

const EXAMPLE_CODES: Record<Language, string> = {
  python: `def find_duplicates(arr):
    seen = set()
    duplicates = []
    for item in arr:
        if item in seen:
            duplicates.append(item)
        else:
            seen.add(item)
    return duplicates

result = find_duplicates([1, 2, 3, 2, 4, 3, 5])
print(result)`,
  javascript: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}`,
  typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User | null> {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}`,
  java: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
  c: `#include <stdio.h>
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
int main() {
    for (int i = 0; i < 10; i++)
        printf("%d ", fibonacci(i));
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) return {map[complement], i};
        map[nums[i]] = i;
    }
    return {};
}`,
};

// ─── Code Explainer ─────────────────────────────────────────────────────────

function CodeExplainer() {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(EXAMPLE_CODES.python);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(EXAMPLE_CODES[lang]);
    setResult(null);
    setError(null);
  };

  const explain = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/explain-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all duration-200 ${
              language === lang
                ? "bg-accent-primary/20 border border-accent-primary/40 text-accent-primary"
                : "bg-white/5 border border-white/10 text-text-muted hover:text-white"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Code Input */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-white/90 leading-relaxed resize-y focus:outline-none focus:border-accent-primary/40 transition-colors"
          placeholder="Paste your code here…"
          spellCheck={false}
        />
      </div>

      <button
        onClick={explain}
        disabled={!code.trim() || loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-primary/20 border border-accent-primary/40 hover:bg-accent-primary/30 text-accent-primary font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <LoadingDots label="Analyzing" /> : <><Zap className="w-4 h-4" /> Analyze Code</>}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm glass-panel rounded-xl p-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Summary */}
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="font-display font-semibold text-white mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-accent-primary" /> Summary
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Complexity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-accent-primary" />
                  <h3 className="font-semibold text-white text-sm">Time Complexity</h3>
                </div>
                <p className="text-text-muted text-sm">{result.timeComplexity}</p>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-accent-secondary" />
                  <h3 className="font-semibold text-white text-sm">Space Complexity</h3>
                </div>
                <p className="text-text-muted text-sm">{result.spaceComplexity}</p>
              </div>
            </div>

            {/* Bugs */}
            {result.bugs.length > 0 && (
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bug className="w-4 h-4 text-red-400" />
                  <h3 className="font-semibold text-white text-sm">Potential Issues</h3>
                </div>
                <ul className="space-y-2">
                  {result.bugs.map((bug, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-red-400 mt-0.5">•</span> {bug}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {result.improvements.length > 0 && (
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <h3 className="font-semibold text-white text-sm">Improvements</h3>
                </div>
                <ul className="space-y-2">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-green-400 mt-0.5">→</span> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improved Code */}
            {result.improvedCode && (
              <div>
                <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accent-primary" /> Improved Version
                </h3>
                <CodeBlock code={result.improvedCode} language={language} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Code Generator ──────────────────────────────────────────────────────────

function CodeGenerator() {
  const [language, setLanguage] = useState<GenLanguage>("python");
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const res = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate code.");
      setGeneratedCode(data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "Create a REST API endpoint that validates user registration data",
    "Build a binary search tree with insert, search, and in-order traversal",
    "Write a function to debounce API calls with TypeScript types",
    "Create a login page with email/password validation",
    "Implement a simple LRU cache with get and put operations",
  ];

  return (
    <div className="space-y-6">
      {/* Language */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-2 block">Target Language</label>
        <div className="flex flex-wrap gap-2">
          {GEN_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all duration-200 ${
                language === lang
                  ? "bg-accent-secondary/20 border border-accent-secondary/40 text-accent-secondary"
                  : "bg-white/5 border border-white/10 text-text-muted hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div>
        <label className="text-sm text-text-muted font-medium mb-2 block">Describe what to build</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm text-white leading-relaxed resize-y focus:outline-none focus:border-accent-secondary/40 transition-colors placeholder-text-muted/50"
          placeholder="e.g. Create a function that validates email addresses and returns detailed error messages…"
        />
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs text-text-muted mb-2">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setPrompt(ex)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              {ex.substring(0, 40)}…
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!prompt.trim() || loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-secondary/20 border border-accent-secondary/40 hover:bg-accent-secondary/30 text-accent-secondary font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <LoadingDots label="Generating" /> : <><Wand2 className="w-4 h-4" /> Generate Code</>}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm glass-panel rounded-xl p-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <AnimatePresence>
        {generatedCode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> Generated Code
            </h3>
            <CodeBlock code={generatedCode} language={language} maxHeight="500px" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type ActiveTab = "explainer" | "generator";

export default function CodeToolsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("explainer");

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-secondary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="AI Tools"
        title="Code"
        highlight="Tools"
        subtitle="Powered by Gemini — explain existing code or generate new production-quality code from a description."
        icon={Code2}
      />

      <div className="max-w-5xl mx-auto px-6 pb-32 space-y-6">
        {/* Tab selector */}
        <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("explainer")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "explainer"
                ? "bg-accent-primary text-white shadow-[0_0_20px_rgba(110,231,255,0.25)]"
                : "text-text-muted hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" /> Code Explainer
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "generator"
                ? "bg-accent-secondary text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                : "text-text-muted hover:text-white"
            }`}
          >
            <Wand2 className="w-4 h-4" /> Code Generator
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-panel rounded-2xl p-6"
          >
            {activeTab === "explainer" ? <CodeExplainer /> : <CodeGenerator />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
