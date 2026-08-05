"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Code2, Zap, Bug, Star, MessageSquare, BookOpen, Wand2,
  Shield, RefreshCw, FlaskConical, ArrowLeftRight, Copy,
  Check, Trash2, AlertCircle, ChevronDown, Download, Upload,
  Plus, X, FileText, Clock, Brain, Square, Layers
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import LoadingDots from "@/components/ui/LoadingDots";
import ProviderSelector, { AIProviderId } from "@/components/features/ProviderSelector";

// ─── Lazy-load Monaco ─────────────────────────────────────────────────────────
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0d1117]">
      <div className="text-text-muted text-sm animate-pulse">Loading editor…</div>
    </div>
  ),
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Action =
  | "explain" | "debug" | "optimize" | "comments" | "bugs"
  | "readability" | "best-practices" | "tests" | "convert"
  | "line-by-line" | "time-complexity" | "space-complexity" | "suggest-algorithm";

interface FileTab {
  id: string;
  name: string;
  language: string;
  monacoLang: string;
  content: string;
  saved: boolean;
}

interface ChatMessage {
  action: Action;
  language: string;
  result: string;
  timestamp: Date;
  streaming?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { id: "python",     label: "Python",     monaco: "python",     ext: ".py" },
  { id: "javascript", label: "JavaScript", monaco: "javascript", ext: ".js" },
  { id: "typescript", label: "TypeScript", monaco: "typescript", ext: ".ts" },
  { id: "java",       label: "Java",       monaco: "java",       ext: ".java" },
  { id: "c",          label: "C",          monaco: "c",          ext: ".c" },
  { id: "cpp",        label: "C++",        monaco: "cpp",        ext: ".cpp" },
  { id: "html",       label: "HTML/CSS",   monaco: "html",       ext: ".html" },
];

const TARGET_LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C", "C++", "Go", "Rust"];

const ACTIONS: { id: Action; label: string; icon: React.ElementType; color: string }[] = [
  { id: "explain",           label: "Explain Code",        icon: BookOpen,      color: "text-accent-primary" },
  { id: "debug",             label: "Debug",               icon: Bug,           color: "text-red-400" },
  { id: "optimize",          label: "Optimize",            icon: Zap,           color: "text-yellow-400" },
  { id: "comments",          label: "Add Comments",        icon: MessageSquare, color: "text-blue-400" },
  { id: "bugs",              label: "Find Bugs",           icon: Shield,        color: "text-orange-400" },
  { id: "readability",       label: "Readability",         icon: Star,          color: "text-purple-400" },
  { id: "best-practices",    label: "Best Practices",      icon: RefreshCw,     color: "text-green-400" },
  { id: "tests",             label: "Test Cases",          icon: FlaskConical,  color: "text-pink-400" },
  { id: "convert",           label: "Convert Language",    icon: ArrowLeftRight,color: "text-cyan-400" },
  { id: "line-by-line",      label: "Line by Line",        icon: FileText,      color: "text-indigo-400" },
  { id: "time-complexity",   label: "Time Complexity",     icon: Clock,         color: "text-amber-400" },
  { id: "space-complexity",  label: "Space Complexity",    icon: Layers,        color: "text-teal-400" },
  { id: "suggest-algorithm", label: "Better Algorithm",    icon: Brain,         color: "text-violet-400" },
];

// ─── Starter Templates ────────────────────────────────────────────────────────

const TEMPLATES: Record<string, { name: string; language: string; code: string }[]> = {
  python: [
    { name: "Hello World", language: "python", code: `# Hello World in Python\nprint("Hello, World!")\n\n# With a function\ndef greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("Student"))` },
    { name: "Calculator", language: "python", code: `def calculator():\n    """Simple calculator supporting +, -, *, /"""\n    print("Simple Calculator")\n    num1 = float(input("Enter first number: "))\n    op = input("Enter operator (+, -, *, /): ")\n    num2 = float(input("Enter second number: "))\n    \n    if op == "+":\n        result = num1 + num2\n    elif op == "-":\n        result = num1 - num2\n    elif op == "*":\n        result = num1 * num2\n    elif op == "/" and num2 != 0:\n        result = num1 / num2\n    else:\n        return "Invalid operator or division by zero"\n    \n    return f"{num1} {op} {num2} = {result}"\n\nprint(calculator())` },
    { name: "Bubble Sort", language: "python", code: `def bubble_sort(arr: list) -> list:\n    """Bubble Sort - O(n²) time, O(1) space"""\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break  # Already sorted\n    return arr\n\ntest = [64, 34, 25, 12, 22, 11, 90]\nprint("Sorted:", bubble_sort(test))` },
    { name: "Linked List", language: "python", code: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def append(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new_node\n\n    def display(self):\n        elements = []\n        curr = self.head\n        while curr:\n            elements.append(str(curr.data))\n            curr = curr.next\n        return " -> ".join(elements)\n\nll = LinkedList()\nfor val in [1, 2, 3, 4, 5]:\n    ll.append(val)\nprint(ll.display())` },
    { name: "Stack", language: "python", code: `class Stack:\n    """Stack using a list - LIFO\"\"\"\n    def __init__(self):\n        self._items = []\n\n    def push(self, item):\n        self._items.append(item)\n\n    def pop(self):\n        if self.is_empty():\n            raise IndexError("Pop from empty stack")\n        return self._items.pop()\n\n    def peek(self):\n        if self.is_empty():\n            raise IndexError("Peek from empty stack")\n        return self._items[-1]\n\n    def is_empty(self):\n        return len(self._items) == 0\n\n    def size(self):\n        return len(self._items)\n\ns = Stack()\nfor i in [1, 2, 3]:\n    s.push(i)\nprint("Top:", s.peek())\nprint("Popped:", s.pop())\nprint("Size:", s.size())` },
    { name: "Binary Search", language: "python", code: `def binary_search(arr: list, target: int) -> int:\n    """Binary Search - O(log n) time\"\"\"\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1  # Not found\n\nsorted_arr = [1, 3, 5, 7, 9, 11, 13, 15]\nprint(binary_search(sorted_arr, 7))   # 3\nprint(binary_search(sorted_arr, 6))   # -1` },
    { name: "DP — Fibonacci", language: "python", code: `def fibonacci_dp(n: int) -> int:\n    """Fibonacci with memoization - O(n) time, O(n) space\"\"\"\n    memo = {}\n    \n    def fib(k):\n        if k <= 1:\n            return k\n        if k in memo:\n            return memo[k]\n        memo[k] = fib(k - 1) + fib(k - 2)\n        return memo[k]\n    \n    return fib(n)\n\n# Bottom-up DP - O(n) time, O(1) space\ndef fibonacci_bottom_up(n: int) -> int:\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nfor i in range(10):\n    print(f"fib({i}) = {fibonacci_dp(i)}")` },
  ],
  javascript: [
    { name: "Hello World", language: "javascript", code: `// Hello World in JavaScript\nconsole.log("Hello, World!");\n\n// Arrow function\nconst greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet("Student"));` },
    { name: "Calculator", language: "javascript", code: `function calculator(num1, op, num2) {\n  switch (op) {\n    case "+": return num1 + num2;\n    case "-": return num1 - num2;\n    case "*": return num1 * num2;\n    case "/":\n      if (num2 === 0) throw new Error("Division by zero");\n      return num1 / num2;\n    default:\n      throw new Error("Invalid operator");\n  }\n}\n\nconsole.log(calculator(10, "+", 5)); // 15\nconsole.log(calculator(10, "/", 2)); // 5` },
    { name: "Queue", language: "javascript", code: `class Queue {\n  #items = [];\n\n  enqueue(item) { this.#items.push(item); }\n\n  dequeue() {\n    if (this.isEmpty()) throw new Error("Queue is empty");\n    return this.#items.shift();\n  }\n\n  peek() {\n    if (this.isEmpty()) throw new Error("Queue is empty");\n    return this.#items[0];\n  }\n\n  isEmpty() { return this.#items.length === 0; }\n  size()    { return this.#items.length; }\n\n  toString() { return this.#items.join(" -> "); }\n}\n\nconst q = new Queue();\n[1, 2, 3].forEach(i => q.enqueue(i));\nconsole.log("Front:", q.peek());\nconsole.log("Dequeued:", q.dequeue());\nconsole.log("Queue:", q.toString());` },
    { name: "React Component", language: "javascript", code: `// React Counter Component (JSX)\nimport { useState } from 'react';\n\nfunction Counter({ initialCount = 0, step = 1 }) {\n  const [count, setCount] = useState(initialCount);\n\n  const increment = () => setCount(c => c + step);\n  const decrement = () => setCount(c => c - step);\n  const reset     = () => setCount(initialCount);\n\n  return (\n    <div className="counter">\n      <h2>Count: {count}</h2>\n      <button onClick={decrement}>-</button>\n      <button onClick={reset}>Reset</button>\n      <button onClick={increment}>+</button>\n    </div>\n  );\n}\n\nexport default Counter;` },
  ],
  typescript: [
    { name: "Hello World", language: "typescript", code: `// Hello World in TypeScript\nconst message: string = "Hello, World!";\nconsole.log(message);\n\nfunction greet(name: string, times: number = 1): string {\n  return Array(times).fill(\`Hello, \${name}!\`).join("\\n");\n}\n\nconsole.log(greet("Student", 3));` },
    { name: "React Component", language: "typescript", code: `import { useState, useCallback } from 'react';\n\ninterface CounterProps {\n  initialCount?: number;\n  step?: number;\n  max?: number;\n}\n\nexport function Counter({ initialCount = 0, step = 1, max = Infinity }: CounterProps) {\n  const [count, setCount] = useState<number>(initialCount);\n\n  const increment = useCallback(() =>\n    setCount(c => Math.min(c + step, max)), [step, max]);\n\n  const decrement = useCallback(() =>\n    setCount(c => Math.max(c - step, 0)), [step]);\n\n  const reset = useCallback(() => setCount(initialCount), [initialCount]);\n\n  return (\n    <div>\n      <p>Count: <strong>{count}</strong></p>\n      <button onClick={decrement} disabled={count === 0}>-</button>\n      <button onClick={reset}>Reset</button>\n      <button onClick={increment} disabled={count >= max}>+</button>\n    </div>\n  );\n}` },
  ],
  java: [
    { name: "Hello World", language: "java", code: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println(greet("Student"));\n    }\n\n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n}` },
    { name: "Binary Search", language: "java", code: `public class BinarySearch {\n    public static int search(int[] arr, int target) {\n        int left = 0, right = arr.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 7, 9, 11, 13};\n        System.out.println(search(arr, 7));  // 3\n        System.out.println(search(arr, 6));  // -1\n    }\n}` },
  ],
  c: [
    { name: "Hello World", language: "c", code: `#include <stdio.h>\n\nvoid greet(const char* name) {\n    printf("Hello, %s!\\n", name);\n}\n\nint main() {\n    printf("Hello, World!\\n");\n    greet("Student");\n    return 0;\n}` },
    { name: "Bubble Sort", language: "c", code: `#include <stdio.h>\n\nvoid swap(int* a, int* b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1])\n                swap(&arr[j], &arr[j + 1]);\n        }\n    }\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22, 11, 90};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    bubbleSort(arr, n);\n    for (int i = 0; i < n; i++)\n        printf("%d ", arr[i]);\n    return 0;\n}` },
  ],
  cpp: [
    { name: "Hello World", language: "cpp", code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(const string& name) {\n    return "Hello, " + name + "!";\n}\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << greet("Student") << endl;\n    return 0;\n}` },
    { name: "Stack (STL)", language: "cpp", code: `#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    stack<int> s;\n\n    // Push elements\n    for (int i = 1; i <= 5; i++)\n        s.push(i * 10);\n\n    cout << "Top: " << s.top() << endl;  // 50\n    cout << "Size: " << s.size() << endl; // 5\n\n    while (!s.empty()) {\n        cout << s.top() << " ";\n        s.pop();\n    }\n    cout << endl;\n    return 0;\n}` },
  ],
  html: [
    { name: "Hello World", language: "html", code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Hello World</title>\n  <style>\n    body { font-family: sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }\n    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; text-align: center; }\n    h1 { font-size: 2.5rem; margin: 0 0 8px; }\n    p { color: #94a3b8; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>Hello, World! 👋</h1>\n    <p>Welcome to Synapse AI Portal</p>\n  </div>\n</body>\n</html>` },
  ],
};

function getLangFromExt(ext: string): { id: string; label: string; monaco: string; ext: string } {
  const map: Record<string, string> = {
    ".py": "python", ".js": "javascript", ".ts": "typescript",
    ".java": "java", ".c": "c", ".cpp": "cpp", ".html": "html",
    ".css": "html", ".txt": "javascript",
  };
  const id = map[ext] || "javascript";
  return LANGUAGES.find((l) => l.id === id) || LANGUAGES[1];
}

function makeTab(id: string, lang: typeof LANGUAGES[0], content: string, name?: string): FileTab {
  return {
    id,
    name: name || `file${id}${lang.ext}`,
    language: lang.id,
    monacoLang: lang.monaco,
    content,
    saved: true,
  };
}

const STORAGE_KEY = "synapse_playground_tabs";
const ACTIVE_TAB_KEY = "synapse_playground_active_tab";

function loadTabs(): FileTab[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
}

function saveTabs(tabs: FileTab[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  } catch { /* ignore */ }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIPlaygroundPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [tabs, setTabs] = useState<FileTab[]>(() => {
    const saved = loadTabs();
    if (saved.length > 0) return saved;
    const defaultLang = LANGUAGES[0];
    return [makeTab("1", defaultLang, TEMPLATES.python[0].code, "main.py")];
  });
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(ACTIVE_TAB_KEY) || "1";
    }
    return "1";
  });
  const [tabCounter, setTabCounter] = useState(10);
  const [activeAction, setActiveAction] = useState<Action>("explain");
  const [targetLanguage, setTargetLanguage] = useState("JavaScript");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [provider, setProvider] = useState<AIProviderId>("gemini");
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResult, setCopiedResult] = useState<number | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Auto-save tabs to localStorage whenever they change
  useEffect(() => {
    saveTabs(tabs);
    if (typeof window !== "undefined") {
      localStorage.setItem(ACTIVE_TAB_KEY, activeTabId);
    }
  }, [tabs, activeTabId]);

  const updateActiveCode = useCallback((value: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, content: value, saved: false } : t
      )
    );
    // Mark as saved after 1s debounce
    const timer = setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, saved: true } : t))
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTabId]);

  const addTab = (lang: typeof LANGUAGES[0], content?: string, name?: string) => {
    const id = String(tabCounter);
    setTabCounter((c) => c + 1);
    const tab = makeTab(id, lang, content || TEMPLATES[lang.id]?.[0]?.code || "", name);
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    if (tabs.length <= 1) return;
    const idx = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
    }
  };

  const changeTabLanguage = (langId: string) => {
    const lang = LANGUAGES.find((l) => l.id === langId)!;
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, language: lang.id, monacoLang: lang.monaco, name: t.name.replace(/\.[^.]+$/, lang.ext) }
          : t
      )
    );
    setShowLangDropdown(false);
  };

  const applyTemplate = (tmpl: { name: string; language: string; code: string }) => {
    const lang = LANGUAGES.find((l) => l.id === tmpl.language) || LANGUAGES[0];
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, content: tmpl.code, language: lang.id, monacoLang: lang.monaco }
          : t
      )
    );
    setShowTemplateDropdown(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeTab?.content || "");
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch { /* ignore */ }
  };

  const handleDownload = () => {
    if (!activeTab) return;
    const blob = new Blob([activeTab.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = "." + file.name.split(".").pop();
    const lang = getLangFromExt(ext);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      addTab(lang, content, file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClear = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, content: "" } : t))
    );
    setError(null);
  };

  const handleCopyResult = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedResult(idx);
      setTimeout(() => setCopiedResult(null), 2000);
    } catch { /* ignore */ }
  };

  const handleStopGeneration = () => {
    abortController?.abort();
    setStreaming(false);
    setLoading(false);
    if (streamedText) {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last?.streaming) {
          return [
            ...prev.slice(0, -1),
            { ...last, result: streamedText, streaming: false },
          ];
        }
        return prev;
      });
      setStreamedText("");
    }
  };

  const handleAnalyze = async () => {
    const code = activeTab?.content || "";
    if (!code.trim()) return;
    setLoading(true);
    setStreaming(true);
    setError(null);
    setStreamedText("");

    const ctrl = new AbortController();
    setAbortController(ctrl);

    const pendingMsg: ChatMessage = {
      action: activeAction,
      language: activeTab.language,
      result: "",
      timestamp: new Date(),
      streaming: true,
    };
    setHistory((prev) => [...prev, pendingMsg]);

    try {
      const res = await fetch("/api/stream-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: activeTab.language,
          action: activeAction,
          targetLanguage: activeAction === "convert" ? targetLanguage : undefined,
          provider,
        }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        let errMsg = "Failed to analyze.";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await res.json();
            errMsg = errData.error || errMsg;
          } else {
            const text = await res.text();
            errMsg = text || errMsg;
          }
        } catch { /* ignore */ }
        throw new Error(errMsg);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamedText(accumulated);

        // Update the in-progress message
        setHistory((prev) => {
          const last = prev[prev.length - 1];
          if (last?.streaming) {
            return [...prev.slice(0, -1), { ...last, result: accumulated }];
          }
          return prev;
        });
      }

      // Finalize
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last?.streaming) {
          return [...prev.slice(0, -1), { ...last, result: accumulated, streaming: false }];
        }
        return prev;
      });

      setTimeout(() => historyEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setError(msg);
      // Remove the pending streaming message
      setHistory((prev) => prev.filter((m) => !m.streaming));
    } finally {
      setLoading(false);
      setStreaming(false);
      setStreamedText("");
      setAbortController(null);
    }
  };

  const actionInfo = ACTIONS.find((a) => a.id === activeAction)!;
  const ActionIcon = actionInfo.icon;
  const currentLang = LANGUAGES.find((l) => l.id === activeTab?.language) || LANGUAGES[0];
  const currentTemplates = TEMPLATES[activeTab?.language] || TEMPLATES.python;

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-125 bg-linear-to-b from-accent-primary/8 to-transparent pointer-events-none" />

      <PageHero
        badge="AI Code Playground"
        title="Code"
        highlight="Intelligence"
        subtitle="Multi-tab editor with Monaco, starter templates, auto-save, file upload, and streaming AI analysis."
        icon={Code2}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── LEFT: Editor Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            {/* ── File Tab Bar ── */}
            <div className="glass-panel rounded-2xl px-3 py-2">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer shrink-0 text-xs font-medium transition-all group ${
                      tab.id === activeTabId
                        ? "bg-accent-primary/15 border border-accent-primary/30 text-white"
                        : "text-text-muted hover:text-white hover:bg-white/8"
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="max-w-25 truncate">{tab.name}</span>
                    {!tab.saved && <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0" title="Unsaved" />}
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {/* New Tab */}
                <button
                  onClick={() => addTab(LANGUAGES[0])}
                  className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/8 transition-colors"
                  title="New tab"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Editor Toolbar ── */}
            <div className="glass-panel rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Language */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    {currentLang.label}
                    <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showLangDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute top-full left-0 mt-1 z-30 glass-panel rounded-xl overflow-hidden w-40"
                      >
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => changeTabLanguage(lang.id)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              activeTab?.language === lang.id
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

                {/* Templates */}
                <div className="relative">
                  <button
                    onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Templates
                    <ChevronDown className={`w-3 h-3 transition-transform ${showTemplateDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showTemplateDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute top-full left-0 mt-1 z-30 glass-panel rounded-xl overflow-hidden w-52"
                      >
                        {currentTemplates.map((tmpl) => (
                          <button
                            key={tmpl.name}
                            onClick={() => applyTemplate(tmpl)}
                            className="w-full text-left px-4 py-2.5 text-sm text-text-muted hover:text-white hover:bg-white/8 transition-colors"
                          >
                            {tmpl.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".py,.js,.ts,.java,.c,.cpp,.html,.css,.txt"
                  onChange={handleUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                  title="Upload file"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedCode ? "Copied!" : "Copy"}</span>
                </button>

                {/* Clear */}
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* ── Monaco Editor / Mobile Textarea Fallback ── */}
            <div className="glass-panel rounded-2xl overflow-hidden" style={{ height: "400px" }}>
              {isMobile ? (
                <textarea
                  className="w-full h-full p-4 bg-[#0d1117] text-white font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  value={activeTab?.content || ""}
                  onChange={(e) => updateActiveCode(e.target.value)}
                  placeholder="Write or paste your code here..."
                  spellCheck={false}
                />
              ) : (
                <MonacoEditor
                  key={activeTabId}
                  height="400px"
                  language={activeTab?.monacoLang || "python"}
                  value={activeTab?.content || ""}
                  onChange={(val) => updateActiveCode(val ?? "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    lineHeight: 1.65,
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
                    suggestOnTriggerCharacters: true,
                    tabSize: 2,
                    insertSpaces: true,
                  }}
                />
              )}
            </div>

            {/* ── AI Action Panel ── */}
            <div className="glass-panel rounded-2xl p-4 space-y-3">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setShowActionPanel(!showActionPanel)}
              >
                <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">
                  AI Actions ({ACTIONS.length})
                </p>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showActionPanel ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showActionPanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={() => setActiveAction(action.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left ${
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

                    {/* Convert target */}
                    <AnimatePresence>
                      {activeAction === "convert" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-text-muted mb-2">Convert to:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {TARGET_LANGUAGES.map((tl) => (
                              <button
                                key={tl}
                                onClick={() => setTargetLanguage(tl)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                  targetLanguage === tl
                                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
                                    : "bg-white/5 border border-white/10 text-text-muted hover:text-white"
                                }`}
                              >
                                {tl}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Run / Stop */}
              <div className="flex items-center gap-2">
                <ProviderSelector selectedProvider={provider} onChange={setProvider} />
                <button
                  onClick={handleAnalyze}
                  disabled={!activeTab?.content?.trim() || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/40 hover:border-accent-primary/60 text-white font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(110,231,255,0.1)]"
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

                {streaming && (
                  <button
                    onClick={handleStopGeneration}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/25 transition-all"
                    title="Stop generation"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Stop
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: AI Response Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            {/* Response header */}
            <div className="glass-panel rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-accent-secondary" />
                <span className="text-sm font-semibold text-white">
                  {provider === "gemini" ? "Gemini" : provider === "openai" ? "ChatGPT" : "Claude"} Response
                </span>
                {streaming && (
                  <span className="flex items-center gap-1 text-xs text-accent-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                    Streaming…
                  </span>
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-text-muted hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                >
                  Clear
                </button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400 text-sm glass-panel rounded-xl p-4"
              >
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}

            {/* Chat history */}
            <div
              className="glass-panel rounded-2xl overflow-y-auto"
              style={{ minHeight: "560px", maxHeight: "660px" }}
            >
              {history.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-16 text-center px-6 gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                    <Wand2 className="w-7 h-7 text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Streaming AI Ready</p>
                    <p className="text-text-muted text-sm leading-relaxed">
                      Choose a template, write code, pick an AI action, and see responses stream in real time.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-white/5 last:border-b-0"
                  >
                    <div className="flex items-center justify-between px-5 py-3 bg-white/3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                          <Icon className={`w-3.5 h-3.5 ${action.color}`} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white">{action.label}</span>
                          <span className="text-xs text-text-muted ml-2">· {msg.language}</span>
                          {msg.streaming && (
                            <span className="ml-2 text-xs text-accent-primary animate-pulse">typing…</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {!msg.streaming && (
                          <button
                            onClick={() => handleCopyResult(idx, msg.result)}
                            className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                            title="Copy response"
                          >
                            {copiedResult === idx
                              ? <Check className="w-3.5 h-3.5 text-green-400" />
                              : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-4">
                      <MarkdownRenderer content={msg.result} />
                      {msg.streaming && (
                        <span className="inline-block w-0.5 h-4 bg-accent-primary animate-pulse ml-0.5 align-middle" />
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading skeleton (only before first chunk arrives) */}
              {loading && history.every((m) => !m.streaming) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 py-8 flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center">
                    <Wand2 className="w-3.5 h-3.5 text-accent-secondary animate-pulse" />
                  </div>
                  <div className="space-y-2">
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

        {/* Security footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 glass-panel rounded-2xl p-5 flex items-start gap-4"
        >
          <Shield className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-semibold mb-1">Secure by design · Auto-saves locally</p>
            <p className="text-xs text-text-muted leading-relaxed">
              Code is auto-saved to localStorage as you type. AI requests go to a secure Next.js API route — 
              your API key is <strong className="text-white">never exposed</strong> to the browser. 
              Responses stream in real time like ChatGPT.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
