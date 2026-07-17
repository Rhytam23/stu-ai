"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-white/10 text-accent-primary font-mono text-sm">
      {children}
    </code>
  );
}

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {/* ignore */}
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs text-text-muted font-mono uppercase">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied</span></> : <><Copy className="w-3 h-3" /><span>Copy</span></>}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{ margin: 0, background: "transparent", fontSize: "0.8rem", lineHeight: "1.6", padding: "1rem 1.25rem" }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const components: Components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ inline, className: cls, children, ...props }: any) {
      const match = /language-(\w+)/.exec(cls || "");
      const code = String(children).replace(/\n$/, "");
      if (!inline && match) {
        return <CodeBlock language={match[1]} code={code} />;
      }
      return <InlineCode {...props}>{children}</InlineCode>;
    },
    h1: ({ children }) => <h1 className="text-2xl font-display font-bold text-white mt-6 mb-3">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-display font-semibold text-white mt-5 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-semibold text-white/90 mt-4 mb-2">{children}</h3>,
    p: ({ children }) => <p className="text-text-muted leading-relaxed mb-3">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-text-muted">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-text-muted">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }) => <em className="text-accent-primary/80 italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent-primary/50 pl-4 my-3 text-text-muted italic">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-primary/80 underline underline-offset-2 transition-colors">
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse border border-white/10 rounded-lg text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="border border-white/10 px-3 py-2 bg-white/5 text-white font-semibold text-left">{children}</th>,
    td: ({ children }) => <td className="border border-white/10 px-3 py-2 text-text-muted">{children}</td>,
    hr: () => <hr className="border-white/10 my-6" />,
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
