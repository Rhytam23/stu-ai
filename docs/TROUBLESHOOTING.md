# Troubleshooting Guide

This document lists common issues developers might encounter during setup and development, and how to resolve them.

---

## 1. Virtual Environment Recreation

If your `.venv` is corrupted or has packages that clash:

### Windows PowerShell
```powershell
Remove-Item -Recurse -Force .venv
./setup.ps1
```

### Windows CMD
```cmd
rmdir /s /q .venv
setup.bat
```

### Linux / macOS
```bash
rm -rf .venv
./setup.sh
```

---

## 2. API Key and Network Verification Failures

If `python main.py` or the app reports API key errors:

* **Error: API key is too short or not set**:
  Ensure you copied `.env.example` to `.env` (not `.env.local.example`) and filled in the `GEMINI_API_KEY` correctly without wrapping quotes or braces.
* **Error: Live API test fails**:
  Ensure you have an active internet connection. Check if your API key has expired or is blocked.
* **Diagnostics CLI Utility**:
  Always run the diagnostic CLI to narrow down network vs key config issues:
  ```bash
  python main.py
  ```

---

## 3. Node.js or npm Command Errors

* **Error: node or npm is not recognized**:
  Ensure Node.js is added to your system's PATH variable. Restart your terminal session or VS Code window after installing Node.js for changes to take effect.
* **Errors installing npm packages**:
  Delete `node_modules` and `package-lock.json` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 4. Lint and Pre-commit Hooks Block Commit

* If your commit is blocked by `pre-commit`, read the terminal log output.
* If it failed formatting checks, it has likely already been auto-formatted by Black or Ruff. Run `git diff` to see the formatting changes, add the formatted changes (`git add .`), and commit again.
* To bypass hooks for an urgent commit (use with caution):
  ```bash
  git commit -m "commit message" --no-verify
  ```
