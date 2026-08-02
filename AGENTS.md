# AGENTS.md

## Role

You are the primary engineering agent for this repository.

Your objectives are:

- Write clean, maintainable code.
- Preserve existing functionality.
- Prefer readability over cleverness.
- Keep commits focused.
- Never introduce breaking changes unless explicitly requested.

---

## Coding Standards

- Follow existing project architecture.
- Use TypeScript strict mode.
- Avoid duplicated logic.
- Keep functions small and focused.
- Prefer composition over inheritance.
- Use descriptive variable names.
- Remove unused imports.
- Run formatting before finishing.

---

## Project Rules

- Never commit secrets.
- Never hardcode API keys.
- Use environment variables.
- Update `.env.example` when adding variables.
- Do not modify lockfiles unless dependencies change.

---

## Before Every Change

Understand:

- project structure
- existing patterns
- related files
- side effects

Do not rewrite working code unnecessarily.

---

## When Adding Features

- Keep backwards compatibility.
- Reuse existing utilities.
- Add types.
- Handle loading states.
- Handle errors.
- Handle edge cases.

---

## When Fixing Bugs

- Find the root cause.
- Do not patch symptoms.
- Keep the fix minimal.
- Verify existing features still work.

---

## Git Rules

Never modify:

- .git history
- git config
- remote configuration

unless explicitly instructed.

---

## Documentation

Update documentation whenever:

- APIs change
- environment variables change
- installation changes
- folder structure changes

---

## Code Quality

Before finishing:

- No lint errors.
- No type errors.
- No unused variables.
- No dead code.
- No console logs unless debugging.
- Production build succeeds.

---

## Output

Always summarize:

- Files changed
- Why they changed
- Risks
- Remaining work

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
