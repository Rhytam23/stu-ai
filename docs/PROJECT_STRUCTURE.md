# Project Structure & Architecture

This document maps the refined codebase layout of the Synapse AI Portal, detailing directories, responsibilities, and components organization.

---

## 1. Directory Structure Map

```text
├── docs/                        # Architecture & Onboarding Guides
│   ├── DEVELOPMENT.md
│   ├── SETUP.md
│   ├── TROUBLESHOOTING.md
│   └── PROJECT_STRUCTURE.md     # [THIS FILE] Project structure mapping
├── scripts/                     # Onboarding & Verification Automation
│   ├── utils.ps1 / .sh          # Logging & common terminal configs
│   ├── install.ps1 / .sh        # Idempotent dependency installer
│   ├── verify.ps1 / .sh         # Local environment engine checkers
│   ├── doctor.ps1 / .sh         # Offline AI routing diagnostic checkers
│   ├── ai-health.ps1 / .sh      # Live provider endpoint connectivity handshakes
│   ├── clean.ps1 / .sh          # Caching cleaner
│   ├── bootstrap.ps1 / .sh      # Main setup orchestrator
│   └── bootstrap.bat            # CMD bootloader
├── src/
│   ├── app/                     # Next.js Route Handlers & Views
│   │   ├── api/                 # Dynamic Backend API Handlers
│   │   │   ├── chat/            # Assistant chat endpoint
│   │   │   ├── analyze-code/    # Code analysis executor
│   │   │   ├── explain-code/    # Step-by-step code breakdown
│   │   │   ├── generate-code/   # Synthesizes source files from description
│   │   │   ├── improve-prompt/  # Prompt engineering optimizer
│   │   │   └── stream-analyze/  # Streaming analyzer interface
│   │   ├── layout.tsx           # Global document container
│   │   ├── page.tsx             # Interactive dashboard
│   │   └── ...                  # Custom educational tool pages
│   ├── components/              # React Component Library
│   │   ├── layout/              # Structural Layout Containers
│   │   │   ├── Header.tsx       # Navigation bar
│   │   │   ├── Footer.tsx       # Bottom links bar
│   │   │   ├── SecurityLayer.tsx# Client-deterrent event blocks
│   │   │   └── CursorGlow.tsx   # Custom cursor interactive background
│   │   ├── features/            # Feature-Specific Context Modules
│   │   │   ├── ChatInterface.tsx# Playground multi-turn chat wrapper
│   │   │   ├── ProviderSelector.tsx# Active AI provider dropdown
│   │   │   ├── InteractiveTimeline.tsx# History timeline slider
│   │   │   ├── WorkflowDiagram.tsx# Core attention model visualizations
│   │   │   ├── AssistantComparison.tsx# LLM parameter differences
│   │   │   └── CollaborationSplit.tsx# Interactive pair-programming comparison
│   │   └── ui/                  # Atomic & Shared Reusable Atoms
│   │       ├── PageHero.tsx     # Generic page introduction headers
│   │       ├── GlassCard.tsx    # Semi-transparent glass layout block
│   │       ├── CodeBlock.tsx    # Styled copyable source panel
│   │       ├── LoadingDots.tsx  # Interactive chat awaiting signals
│   │       └── MarkdownRenderer.tsx# Secured md-to-react rendering pipeline
│   └── lib/                     # System Logic Core
│       ├── ai/                  # AI Router & LLM Gateway
│       │   ├── providers/       # Specific API implementations (Gemini, OpenAI, Claude)
│       │   ├── router.ts        # Dynamic load balancer and active fallback resolver
│       │   └── types.ts         # Generic message interfaces
│       ├── code-analysis.ts     # Analysis prompt generation definitions
│       └── rate-limit.ts        # Client request rate control layer
└── Taskfile.yml / Makefile      # Task runners for project orchestration
```

---

## 2. Refactoring Summary

### Files Reorganized
* Moved **Header.tsx**, **Footer.tsx**, **SecurityLayer.tsx**, and **CursorGlow.tsx** into `src/components/layout/` to separate visual scaffolding from feature logic.
* Moved **AssistantComparison.tsx**, **ChatInterface.tsx**, **CollaborationSplit.tsx**, **InteractiveTimeline.tsx**, **ProviderSelector.tsx**, and **WorkflowDiagram.tsx** into `src/components/features/` to group core application elements.
* Retained shared primitives (**PageHero.tsx**, **GlassCard.tsx**, **CodeBlock.tsx**, **LoadingDots.tsx**, **MarkdownRenderer.tsx**) under `src/components/ui/` for cross-page reuse.

### Dead Code & Unused Variables Cleaned
* Removed unused `Metadata` type import in `/history/page.tsx`.
* Removed unused `Brain` icon import in `/quiz/page.tsx`.
* Removed unused callback loop index parameter `i` in `/quiz/page.tsx`.
* Removed unused `selected` and `setSelected` states in `/comparison/page.tsx`.
* Removed unused `toggleSelect` and `visibleTools` functions in `/comparison/page.tsx`.
* Removed unused `BookOpen` icon import in `InteractiveTimeline.tsx`.
* Confirmed that `playground/` and `ai-playground/` represent different modules (simple general assistant chatbot vs. advanced IDE editor playground).

---

## 3. Validation Outputs

All changes pass verification pipelines:
* **Linting Checks**: 0 Errors, 0 Warnings.
* **TypeScript Compiler**: 0 Errors.
* **Unit Test Cases**: 100% Passed.
* **Next.js Production Build**: Compiled successfully.
