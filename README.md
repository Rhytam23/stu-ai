# Synapse | Multi-Provider Educational AI Portal

[![Build Status](https://github.com/Rhytam23/stu-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Rhytam23/stu-ai/actions)
![Node Version](https://img.shields.io/badge/node-%3E%3D20-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Synapse is a modern, high-performance, responsive Next.js educational portal for studying AI concepts, model prompt engineering, and code-assistance techniques—supporting Google Gemini, OpenAI ChatGPT, and Anthropic Claude.

---

## Onboarding Flow

```text
       Git Clone Repository
                ↓
     Run Bootstrap Orchestrator
                ↓
    Dependencies Auto-Installed
   (.node_modules & .venv created)
                ↓
    Configuration File Configured
    (.env created from template)
                ↓
       Configure API Keys
                ↓
     Run Doctor Health Checks
                ↓
     Run Live AI Health Checks
                ↓
    Start Local Development Server
```

---

## Supported Operating Systems

* **Windows**: PowerShell (v5.1 or core) and Command Prompt (CMD).
* **Linux**: Ubuntu, Debian, CentOS, RedHat, etc. (Bash).
* **macOS**: Catalina or newer (Zsh/Bash).

---

## Requirements

Ensure you have the following installed on your host machine:
* **Git**
* **Node.js** (v20.x or newer)
* **Python** (3.10.x or newer)

---

## Quick Start (Onboarding)

To automatically install dependencies, initialize virtual environments, configure variables, and run build checks in a single command, run the bootstrap command matching your shell:

### Windows (PowerShell)
```powershell
.\setup.ps1
```

### Windows (CMD)
```cmd
setup.bat
```

### Linux / macOS
```bash
chmod +x setup.sh
./setup.sh
```

*(Note: These root setup scripts are wrappers calling `scripts/bootstrap.ps1` and `scripts/bootstrap.sh` respectively for backward compatibility.)*

---

## Developer Tooling Scripts

All modular onboarding tasks are located under the `scripts/` directory:

### 1. Installation (`install.ps1` / `install.sh`)
Detects lockfiles (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, `package-lock.json`), installs packages, and copies environment templates.
```bash
# Example
./scripts/install.sh
```

### 2. Health Verification (`verify.ps1` / `verify.sh`)
Validates Git, Node, package manager, Python versions, and reports overall compatibility.
```bash
# Example
./scripts/verify.sh
```

### 3. AI Subsystem Doctor (`doctor.ps1` / `doctor.sh`)
Performs offline diagnostics checking router registrations, provider modules, SDK packages, and default settings.
```bash
# Example
./scripts/doctor.sh
```

### 4. Live Connection Verification (`ai-health.ps1` / `ai-health.sh`)
Sends real, tiny handshake queries to Gemini, OpenAI, and Claude API gateways to measure round-trip latency and key validity. *Note: Consumes API credits/quota.*
```bash
# Example
./scripts/ai-health.sh
```

### 5. Repository Clean (`clean.ps1` / `clean.sh`)
Safely wipes temporary build outputs, compilation files, and package caches without deleting code or configurations.
```bash
# Example
./scripts/clean.sh
```

---

## Task Runner Commands

If you have `task` (Taskfile CLI) or `make` (Makefile) installed, you can use these shortcuts:

| Command Target | Taskfile Command | Makefile Command | Description |
| -------------- | ---------------- | ---------------- | ----------- |
| Onboard Setup  | `task bootstrap` | `make bootstrap` | Runs full onboarding pipeline |
| Health Checks  | `task verify`    | `make verify`    | Verifies code quality state |
| Clean Caches   | `task clean`     | `make clean`     | Safe cache and build wipe |
| Run Server     | `task dev`       | `make dev`       | Starts local server |
| Compile Assets | `task build`     | `make build`     | Compiles production builds |
| Code Lint      | `task lint`      | `make lint`      | Runs ESLint syntax verification |
| Run Tests      | `task test`      | `make test`      | Executes Vitest test suite |
| Offline Doctor | `task doctor`    | `make doctor`    | Run offline AI diagnostics |
| AI Health      | `task ai:health` | `make ai-health` | Runs live pings and latencies |
| AI Router Test | `task ai:test`   | `make ai-test`   | Runs Vitest router unit tests |

---

## AI Providers Configurations

Open your `.env` and enter your secret developer credentials:
```env
# Default fallback provider ('gemini', 'openai', or 'claude')
DEFAULT_AI_PROVIDER=gemini

# Secret credentials
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

---

## Troubleshooting

* **Missing Command Warning**: Ensure all tools (Git, Node, Python) are exported in your environment PATH variable.
* **Locked File Failures (Windows)**: Wiping caches can sometimes fail if your editor (e.g., VS Code) or shell processes are holding lock handles. Close editor instances and retry `make clean`.
* **Quota Exhaustion**: Disable live checks if you have strict budget constraints; only run `task doctor` to confirm offline settings.

---

## License

This project is licensed under the [MIT License](LICENSE).
