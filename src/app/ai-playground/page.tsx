"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Code2, Zap, Bug, Star, MessageSquare, BookOpen, Wand2,
  Shield, RefreshCw, FlaskConical, ArrowLeftRight, Copy,
  Check, Trash2, AlertCircle, ChevronDown
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import LoadingDots from "@/components/ui/LoadingDots";

// Lazy-load Monaco to reduce initial bundle
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0d1117] rounded-xl">
      <div className="text-text-muted text-sm animate-pulse">Loading editor…</div>
    </div>
  ),
});

// ─── Types ───────────────────────────────────────────────────────────────────

type Action =
  | "explain" | "debug" | "optimize" | "comments" | "bugs"
  | "readability" | "best-practices" | "tests" | "convert";

const LANGUAGES = [
  { id: "python",     label: "Python",     monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "typescript", label: "TypeScript", monaco: "typescript" },
  { id: "java",       label: "Java",       monaco: "java" },
  { id: "c",          label: "C",          monaco: "c" },
  { id: "cpp",        label: "C++",        monaco: "cpp" },
  { id: "html",       label: "HTML/CSS",   monaco: "html" },
];

const TARGET_LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "Go", "Rust",
];

const ACTIONS: {
  id: Action;
  label: string;
  icon: React.ElementType;
  color: string;
  desc: string;
}[] = [
  { id: "explain",        label: "Explain Code",          icon: BookOpen,        color: "text-accent-primary",   desc: "Understand what the code does" },
  { id: "debug",          label: "Debug Code",            icon: Bug,             color: "text-red-400",          desc: "Find and fix errors" },
  { id: "optimize",       label: "Optimize Code",         icon: Zap,             color: "text-yellow-400",       desc: "Improve performance & efficiency" },
  { id: "comments",       label: "Generate Comments",     icon: MessageSquare,   color: "text-blue-400",         desc: "Add inline documentation" },
  { id: "bugs",           label: "Find Bugs",             icon: Shield,          color: "text-orange-400",       desc: "Deep security & bug analysis" },
  { id: "readability",    label: "Improve Readability",   icon: Star,            color: "text-purple-400",       desc: "Cleaner, more maintainable code" },
  { id: "best-practices", label: "Best Practices",        icon: RefreshCw,       color: "text-green-400",        desc: "Industry standards review" },
  { id: "tests",          label: "Generate Test Cases",   icon: FlaskConical,    color: "text-pink-400",         desc: "Unit tests with coverage" },
  { id: "convert",        label: "Convert Language",      icon: ArrowLeftRight,  color: "text-cyan-400",         desc: "Translate to another language" },
];

const STARTER_CODE: Record<string, string> = {
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
}

const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);`,
  typescript: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
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

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11};
        System.out.println(search(arr, 7)); // Output: 3
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
    printf("\\n");
    return 0;
}`,
  cpp: `#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) return {map[complement], i};
        map[nums[i]] = i;
    }
    return {};
}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 20px; }
    .btn { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <button class="btn" onclick="greet()">Click Me</button>
  <script>
    function greet() { alert('Hello from JavaScript!'); }
  </script>
</body>
</html>`,
};

interface ChatMessage {
  action: Action;
  code: string;
  language: string;
  result: string;
  timestamp: Date;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AIPlaygroundPage() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(STARTER_CODE.python);
  const [activeAction, setActiveAction] = useState<Action>("explain");
  const [targetLanguage, setTargetLanguage] = useState("JavaScript");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResult, setCopiedResult] = useState<number | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: typeof LANGUAGES[0]) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang.id] || "");
    setShowLangDropdown(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch { /* ignore */ }
  };

  const handleCopyResult = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedResult(idx);
      setTimeout(() => setCopiedResult(null), 2000);
    } catch { /* ignore */ }
  };

  const handleClear = () => {
    setCode("");
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: language.id,
          action: activeAction,
          targetLanguage: activeAction === "convert" ? targetLanguage : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze.");

      const msg: ChatMessage = {
        action: activeAction,
        code,
        language: language.id,
        result: data.result,
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, msg]);

      // Scroll to latest result
      setTimeout(() => {
        historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const actionInfo = ACTIONS.find((a) => a.id === activeAction)!;
  const ActionIcon = actionInfo.icon;

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-accent-primary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="AI Code Playground"
        title="Code"
        highlight="Intelligence"
        subtitle="Paste any code. Choose an AI action. Get instant, expert-level analysis powered by Gemini — with full conversation history."
        icon={Code2}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── LEFT: Editor Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Editor Header */}
            <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent-primary" />
                <span className="text-sm font-semibold text-white">Code Editor</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    {language.label}
                    <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showLangDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute top-full left-0 mt-1 z-20 glass-panel rounded-xl overflow-hidden w-40"
                      >
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => handleLanguageChange(lang)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              language.id === lang.id
                                ? "text-accent-primary bg-accent-primary/10"
                                : "text-text-muted hover:text-white hover:bg-white/8"
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedCode ? "Copied!" : "Copy"}</span>
                </button>

                {/* Clear Button */}
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="glass-panel rounded-2xl overflow-hidden" style={{ height: "440px" }}>
              <MonacoEditor
                height="440px"
                language={language.monaco}
                value={code}
                onChange={(val) => setCode(val ?? "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: "gutter",
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  wordWrap: "on",
                  formatOnPaste: true,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Action Selector */}
            <div className="glass-panel rounded-2xl p-4 space-y-3">
              <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Choose AI Action</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => setActiveAction(action.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 text-left ${
                        activeAction === action.id
                          ? "bg-accent-primary/15 border border-accent-primary/40 text-white"
                          : "bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${activeAction === action.id ? "text-accent-primary" : action.color}`} />
                      <span className="leading-tight">{action.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Convert target language */}
              <AnimatePresence>
                {activeAction === "convert" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <p className="text-xs text-text-muted mb-2">Convert to:</p>
                      <div className="flex flex-wrap gap-2">
                        {TARGET_LANGUAGES.map((tl) => (
                          <button
                            key={tl}
                            onClick={() => setTargetLanguage(tl)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              targetLanguage === tl
                                ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
                                : "bg-white/5 border border-white/10 text-text-muted hover:text-white"
                            }`}
                          >
                            {tl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Run Button */}
              <button
                onClick={handleAnalyze}
                disabled={!code.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/40 hover:border-accent-primary/60 text-white font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(110,231,255,0.1)] hover:shadow-[0_0_30px_rgba(110,231,255,0.2)]"
              >
                {loading ? (
                  <LoadingDots label={`Running ${actionInfo.label}`} />
                ) : (
                  <>
                    <ActionIcon className={`w-4 h-4 ${actionInfo.color}`} />
                    {actionInfo.label}
                    {activeAction === "convert" && ` → ${targetLanguage}`}
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT: AI Response Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {/* Response header */}
            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-accent-secondary" />
                <span className="text-sm font-semibold text-white">Gemini AI Response</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-text-muted hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                >
                  Clear History
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400 text-sm glass-panel rounded-xl p-4"
              >
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}

            {/* Chat-style history */}
            <div
              className="glass-panel rounded-2xl overflow-y-auto space-y-0"
              style={{ minHeight: "540px", maxHeight: "640px" }}
            >
              {history.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20 text-center px-6 gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Gemini AI is ready</p>
                    <p className="text-text-muted text-sm leading-relaxed">
                      Write or paste code in the editor, choose an action, and click Run to get instant AI-powered analysis.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-2">
                    {ACTIONS.slice(0, 4).map((a) => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.id}
                          onClick={() => setActiveAction(a.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-xs text-left border transition-all ${
                            activeAction === a.id
                              ? "bg-accent-primary/15 border-accent-primary/40 text-white"
                              : "bg-white/5 border-white/10 text-text-muted hover:text-white"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${a.color}`} />
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {history.map((msg, idx) => {
                const action = ACTIONS.find((a) => a.id === msg.action)!;
                const Icon = action.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-white/5 last:border-b-0"
                  >
                    {/* Message header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-white/3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                          <Icon className={`w-3.5 h-3.5 ${action.color}`} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white">{action.label}</span>
                          <span className="text-xs text-text-muted ml-2">· {msg.language}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <button
                          onClick={() => handleCopyResult(idx, msg.result)}
                          className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedResult === idx ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Response body */}
                    <div className="px-5 py-4">
                      <MarkdownRenderer content={msg.result} />
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading state */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 py-8 flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center">
                    <Wand2 className="w-3.5 h-3.5 text-accent-secondary animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-48 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-64 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-36 bg-white/5 rounded animate-pulse" />
                  </div>
                </motion.div>
              )}

              <div ref={historyEndRef} />
            </div>
          </motion.div>
        </div>

        {/* Info footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 glass-panel rounded-2xl p-5 flex items-start gap-4"
        >
          <Shield className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-semibold mb-1">Secure by design</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Your code is sent to a secure Next.js API route on the server which calls Google&apos;s Gemini API. 
              The API key is <strong className="text-white">never exposed</strong> to your browser. 
              Conversation history is stored only in your browser session and cleared when you close the tab.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
