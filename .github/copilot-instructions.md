# GitHub Copilot Instructions

You are GitHub Copilot working in this repository.

- Always read and follow `/AGENTS.md`.
- Prefer patterns from `src/users` and docs under `agent_docs/`.
- When generating code:
  - Use NestJS conventions (modules, providers, DTOs).
  - Use TypeScript strict mode.
  - Use Zod for validation and DTO types.
- When editing tests:
  - Use Jest and `@nestjs/testing`.
  - Mock repositories and external services.

If the user asks for documentation:
- Use **Spanish** for user-facing docs (README, /doc).
- Use **English** for code comments and internal technical docs.