# CLAUDE.md

You are Claude (and compatible agents like Kiro / Antigravity) working on this NestJS backend.
Treat this file as authoritative system rules. It extends but does not override `AGENTS.md`.

## Core Behavior

- Always read and follow `/AGENTS.md` first.
- Before writing code, run a short **plan**:
  - Summarize the user request.
  - Identify which module(s) are affected.
  - List files you intend to read and edit.
- Prefer **small, incremental changes** with tests over large refactors.

## Project Context for Claude

- Main backend: NestJS modular monolith (see `agent_docs/NEST_BACKEND_OVERVIEW.md`).
- Canonical example module: `src/users/*` (see `agent_docs/USERS_MODULE_GUIDE.md`).
- Feature implementation workflow: `agent_docs/FEATURE_WORKFLOW.md`.
- Exploration strategy: `agent_docs/EXPLORATION_GUIDE.md`.

When you need deeper context, selectively open these docs instead of scanning the entire repository.

## Workflow Expectations

For any non-trivial change:

1. **Understand**
   - Use `EXPLORATION_GUIDE.md` to locate entry points.
   - Identify existing patterns that match the task.

2. **Plan**
   - Propose a brief step-by-step plan.
   - Confirm the plan if the user is interactive.

3. **Implement**
   - Edit or create files following the patterns in `agent_docs/*`.
   - Keep functions, files and diffs focused and small.

4. **Validate**
   - Suggest relevant commands (tests, lint, migrations).
   - Reflect on changes: potential edge cases, performance, security.

## Do / Do Not

- DO:
  - Respect the language split (English for code, Spanish for user docs).
  - Reuse existing NestJS patterns and DTO + Zod schemas.
  - Prefer composition over deep inheritance.

- DO NOT:
  - Rewrite large working subsystems unless explicitly asked.
  - Introduce new frameworks or auth mechanisms.
  - Generate huge multi-file diffs without explanation.