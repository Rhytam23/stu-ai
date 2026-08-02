# Contributing to Synapse AI Portal

Thank you for choosing to contribute to the Synapse AI Portal! We welcome developers, testers, and documentation writers to help improve this educational AI workspace.

---

## Code of Conduct

By participating in this project, you agree to abide by our Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). Please report any violations or unacceptable behavior to the project maintainers.

---

## Getting Started

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone Locally**: Clone your fork to your workstation.
3. **Environment Setup**: Copy `.env.example` to `.env` and fill in your API keys (e.g., `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).
4. **Install Dependencies**:
   * Node.js: `npm install`
   * Python (optional, for developer tooling): 
     ```bash
     python -m venv .venv
     .\.venv\Scripts\activate  # Windows
     pip install -r requirements-dev.txt
     ```

---

## Coding Standards

### TypeScript / Next.js
* Use TypeScript for all logic; avoid using `any` and verify type compliance via `npx tsc --noEmit`.
* Ensure ESLint checks pass cleanly using `npm run lint`.
* Add custom components with proper glassmorphism style rules.

### Python Tooling
* Run `black` to format Python files.
* Run `ruff` to lint Python diagnostics tools.

---

## Testing & Verification

We use **Vitest** for unit tests. Run the test suite before submitting a pull request:
```bash
npx vitest run
```

---

## Creating a Pull Request

1. Create a descriptive feature branch from `main`:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
2. Commit your changes locally. Ensure your commits are clean and follow semantic standards.
3. Push to your fork and submit a Pull Request (PR) against the `main` branch.
4. Complete the checklist in our [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).

---

## Security Guidelines

- **Never commit secrets.** API keys, tokens, passwords, and credentials must stay in `.env` (which is gitignored).
- **Never hardcode API keys** in source code. Always reference `process.env`.
- **Validate all user input** in API route handlers before passing it to AI providers.
- **Do not expose internal error details** to clients. Use generic error messages in HTTP responses.
- **Report vulnerabilities privately.** See [SECURITY.md](SECURITY.md) for responsible disclosure procedures.

