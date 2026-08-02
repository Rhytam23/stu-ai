# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-01

### Added
* **Unified AI Provider Abstraction**: Modular adapter layer decoupling Route handlers and frontend from third-party SDK dependencies.
* **OpenAI (ChatGPT) Integration**: Fully supported `gpt-4o-mini` adapter with JSON-mode checks.
* **Anthropic (Claude) Integration**: Fully supported `claude-3-5-haiku` adapter splitting system parameters to conform to message specifications.
* **Central AI Router**: Decoupled dispatcher prioritizing credentials loading and managing fallbacks.
* **Provider Selector Component**: Glossmorphic selector control embedded in Chat, Playground, and Code Tools interfaces.
* **Vitest Unit Test Suite**: Verification coverage checking fallbacks, override dispatches, and invalid targets.
* **Python Tooling Diagnostics**: Diagnostic scripts verifying Internet connection, Python virtual environments, and configuration.
* **CI/CD Build Action**: Automating dependencies compile, lints, type-checking, and vitest runs on push.
* **Standard Templates**: Bug, feature request, and pull request files.
