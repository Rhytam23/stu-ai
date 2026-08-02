"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Sparkles } from "lucide-react";

export type AIProviderId = "gemini" | "openai" | "claude";

interface ProviderOption {
  id: AIProviderId;
  name: string;
  badge: string;
  desc: string;
}

const PROVIDERS: ProviderOption[] = [
  {
    id: "gemini",
    name: "Gemini",
    badge: "1.5 Flash",
    desc: "Google's fast, multimodal frontier model",
  },
  {
    id: "openai",
    name: "ChatGPT",
    badge: "GPT-4o Mini",
    desc: "OpenAI's smart, versatile assistant",
  },
  {
    id: "claude",
    name: "Claude",
    badge: "3.5 Haiku",
    desc: "Anthropic's high-precision coding model",
  },
];

interface ProviderSelectorProps {
  selectedProvider: AIProviderId;
  onChange: (provider: AIProviderId) => void;
}

export default function ProviderSelector({
  selectedProvider,
  onChange,
}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-medium hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-accent-secondary"
      >
        <Sparkles className="w-3.5 h-3.5 text-accent-secondary" />
        <span>{current.name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-accent-secondary/20 text-accent-secondary font-semibold uppercase">
          {current.badge}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-[10px] font-bold text-text-muted px-2.5 py-1.5 uppercase tracking-wider">
            Select AI Engine
          </p>
          <div className="space-y-0.5">
            {PROVIDERS.map((provider) => {
              const isSelected = provider.id === selectedProvider;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => {
                    onChange(provider.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "bg-accent-secondary/10 border border-accent-secondary/25"
                      : "border border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${isSelected ? "text-accent-secondary" : "text-white"}`}>
                        {provider.name}
                      </p>
                      <span className="text-[9px] px-1 py-0.5 rounded-xs bg-white/10 text-text-muted font-medium">
                        {provider.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5 truncate">{provider.desc}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-accent-secondary shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
