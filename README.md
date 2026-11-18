<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![Build Status](https://github.com/Rhytam23/stu-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Rhytam23/stu-ai/actions)


<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Synapse</h3>

  <p align="center">
    Synapse is a modern, high-performance, responsive Next.js educational portal for studying AI concepts, model prompt engineering, and code-assistance techniques—supporting Google Gemini, OpenAI ChatGPT, and Anthropic Claude.
    <br />
    <a href="https://github.com/Rhytam23/stu-ai"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Rhytam23/stu-ai/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/Rhytam23/stu-ai/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

Synapse is a modern, high-performance, responsive Next.js educational portal for studying AI concepts, model prompt engineering, and code-assistance techniques—supporting Google Gemini, OpenAI ChatGPT, and Anthropic Claude.

### AI Providers Configurations


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

### Troubleshooting


* **Missing Command Warning**: Ensure all tools (Git, Node, Python) are exported in your environment PATH variable.
* **Locked File Failures (Windows)**: Wiping caches can sometimes fail if your editor (e.g., VS Code) or shell processes are holding lock handles. Close editor instances and retry `make clean`.
* **Quota Exhaustion**: Disable live checks if you have strict budget constraints; only run `task doctor` to confirm offline settings.

---

### 📖 Project Understanding (Future Reference)


Synapse is a multi-provider AI learning portal for studying AI/ML concepts, prompt engineering
and code-assistance techniques. It routes requests to Google Gemini, OpenAI, or Anthropic behind
a common provider interface (with automatic model fallback on quota/availability errors), and
wraps that in an educational site: playgrounds, a prompt lab, a coding-assistant comparison page,
quizzes, and a history/foundations section for learning the underlying concepts, not just using
the tools.

**Stack:** Next.js + TypeScript, a pluggable AI provider layer (`src/lib/ai/providers/`), Vitest
for unit tests, ESLint + Prettier, GitHub Actions CI (lint, typecheck, test, build).
**Status:** actively maintained with real CI coverage.

### 🎯 Where This Can Be Used


- A learning resource/reference site for AI concepts and prompt engineering, usable as-is.
- A reference implementation for a provider-agnostic AI backend with graceful model fallback —
  reusable in any project that needs to survive one provider's outage or rate limit.
- **Hackathons:** good fit as a base for any "AI education" or "AI tooling comparison" track, or
  simply as a ready-made multi-provider AI backend to build a different frontend on top of.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
* [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
* [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
* [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
* [![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
* [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
* [![pytest](https://img.shields.io/badge/pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Onboarding Flow


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

### Supported Operating Systems


* **Windows**: PowerShell (v5.1 or core) and Command Prompt (CMD).
* **Linux**: Ubuntu, Debian, CentOS, RedHat, etc. (Bash).
* **macOS**: Catalina or newer (Zsh/Bash).

---

### Requirements


Ensure you have the following installed on your host machine:
* **Git**
* **Node.js** (v20.x or newer)
* **Python** (3.10.x or newer)

---

### Quick Start (Onboarding)


To automatically install dependencies, initialize virtual environments, configure variables, and run build checks in a single command, run the bootstrap command matching your shell:

#### Windows (PowerShell)
```powershell
.\setup.ps1
```

#### Windows (CMD)
```cmd
setup.bat
```

#### Linux / macOS
```bash
chmod +x setup.sh
./setup.sh
```

*(Note: These root setup scripts are wrappers calling `scripts/bootstrap.ps1` and `scripts/bootstrap.sh` respectively for backward compatibility.)*

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

### Developer Tooling Scripts


All modular onboarding tasks are located under the `scripts/` directory:

#### 1. Installation (`install.ps1` / `install.sh`)
Detects lockfiles (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, `package-lock.json`), installs packages, and copies environment templates.
```bash
# Example
./scripts/install.sh
```

#### 2. Health Verification (`verify.ps1` / `verify.sh`)
Validates Git, Node, package manager, Python versions, and reports overall compatibility.
```bash
# Example
./scripts/verify.sh
```

#### 3. AI Subsystem Doctor (`doctor.ps1` / `doctor.sh`)
Performs offline diagnostics checking router registrations, provider modules, SDK packages, and default settings.
```bash
# Example
./scripts/doctor.sh
```

#### 4. Live Connection Verification (`ai-health.ps1` / `ai-health.sh`)
Sends real, tiny handshake queries to Gemini, OpenAI, and Claude API gateways to measure round-trip latency and key validity. *Note: Consumes API credits/quota.*
```bash
# Example
./scripts/ai-health.sh
```

#### 5. Repository Clean (`clean.ps1` / `clean.sh`)
Safely wipes temporary build outputs, compilation files, and package caches without deleting code or configurations.
```bash
# Example
./scripts/clean.sh
```

---

### Task Runner Commands


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

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/Rhytam23/stu-ai/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License


This project is licensed under the [MIT License](LICENSE).

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Rhytam Biswas - [@Rhytam23](https://github.com/Rhytam23)

Project Link: [https://github.com/Rhytam23/stu-ai](https://github.com/Rhytam23/stu-ai)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/Rhytam23/stu-ai.svg?style=for-the-badge
[contributors-url]: https://github.com/Rhytam23/stu-ai/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Rhytam23/stu-ai.svg?style=for-the-badge
[forks-url]: https://github.com/Rhytam23/stu-ai/network/members
[stars-shield]: https://img.shields.io/github/stars/Rhytam23/stu-ai.svg?style=for-the-badge
[stars-url]: https://github.com/Rhytam23/stu-ai/stargazers
[issues-shield]: https://img.shields.io/github/issues/Rhytam23/stu-ai.svg?style=for-the-badge
[issues-url]: https://github.com/Rhytam23/stu-ai/issues
[license-shield]: https://img.shields.io/github/license/Rhytam23/stu-ai.svg?style=for-the-badge
[license-url]: https://github.com/Rhytam23/stu-ai/blob/main/LICENSE
