# Developer Guide

This document describes coding guidelines, formatter setups, and linting rules utilized in this project.

---

## Coding Style Rules

The project uses two programming language stacks:
1. **TypeScript / React**: Used for the Next.js frontend application runtime.
2. **Python**: Used for developer tools, utilities, and diagnostics checks.

---

## Python Developer Tooling

For Python utilities (like `main.py`), we use `ruff` and `black` for formatting and linting.

### 1. Activating the Virtual Environment
Before working on Python scripts or running formatters, activate `.venv`:
* **Windows (PowerShell)**: `.venv\Scripts\Activate.ps1`
* **Windows (CMD)**: `call .venv\Scripts\activate.bat`
* **macOS / Linux**: `source .venv/bin/activate`

### 2. Code Linting & Formatting
* To check the code using Ruff:
  ```bash
  ruff check .
  ```
* To format the code using Ruff:
  ```bash
  ruff format .
  ```
* To format the code using Black:
  ```bash
  black .
  ```

---

## Pre-commit Git Hooks

To guarantee formatting and linting compliance across commits, this project is pre-configured with `pre-commit`.

1. Make sure your `.venv` is active.
2. Register the pre-commit hooks to your local git directory:
   ```bash
   pre-commit install
   ```
3. After installing, every `git commit` command will run formatting, trailing whitespace checks, and Ruff lint validations. If any checks fail, it blocks the commit until you fix the issues.

To manually execute all hooks against files:
```bash
pre-commit run --all-files
```

---

## TypeScript Linting & Formatting

* **Type Checking**:
  ```bash
  npx tsc --noEmit
  ```
* **ESLint Checking**:
  ```bash
  npm run lint
  ```
* **Lint Auto-Fix**:
  ```bash
  npx eslint --fix
  ```

---

## Running Unit Tests

We use **Vitest** for running Next.js and TypeScript unit tests:
* **Run Tests**:
  ```bash
  npx vitest run
  ```
