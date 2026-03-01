# AGENTS.md

You are an AI coding agent working on a NestJS modular monolith backend.
Optimize for **correctness**, **consistency with existing patterns**, and **small, well-tested changes**.

## Project Overview

- This repository is a NestJS modular monolith template for SaaS / enterprise backends.
- Tech stack: NestJS (TypeScript), Express, TypeORM (PostgreSQL), BetterAuth, Zod, Winston, AWS SES, Swagger.
- Always follow existing patterns from the `users` module and `agent_docs/*` before inventing new architectures.

For deeper context, you MAY open docs under `agent_docs/` (start with `agent_docs/README.md`).

## Architecture & Conventions

- Feature-first / modular monolith:
  - `src/core`: infrastructure and cross-cutting concerns (DB, mailer, parameters, notifications).
  - `src/shared`: interceptors, pipes (Zod), filters (ProblemDetails RFC9457), decorators, interfaces.
  - `src/auth`: BetterAuth integration and auth controllers.
  - `src/users`: canonical example module (entity, repository, service, controller, DTOs, tests).

- Language:
  - **English** for code comments, commit messages, internal docs for agents.
  - **Spanish** for user-facing docs (`/doc`, `README.md`).

## How to implement a new feature

When asked to implement a new feature:

1. Plan the module folder under `src/<feature>/`.
2. Define:
   - Entity (TypeORM) in `entities/`.
   - Repository extending `Repository<Entity>` with helper methods and optional `QueryRunner`.
   - Service with business logic and transactions.
   - Controller with Zod validation, Swagger docs, and standardized responses.
   - DTOs based on Zod schemas (+ Swagger DTO classes).
   - Unit tests mirroring the `users` module tests.

See `agent_docs/FEATURE_WORKFLOW.md` and `agent_docs/USERS_MODULE_GUIDE.md` for details.

## Testing & Commands

Preferred commands:

- `npm run start:dev` – start dev server in watch mode.
- `npm run migration:run` – apply TypeORM migrations.
- `npm run auth:migrate` – apply BetterAuth schema changes.
- `npm test` – run unit tests.
- `npm run lint` – run lints (if configured).

Agents SHOULD reason about which commands to run after changes.

## Guardrails

- **Always**
  - Follow patterns from `users` module and `agent_docs/*`.
  - Keep TypeScript strict mode and NestJS DI best practices.
  - Add or update tests when changing business logic.

- **Ask first**
  - Introducing new dependencies.
  - Changing authentication / security behavior.
  - Large refactors across modules.

- **Never**
  - Disable validations, auth, or error handling to “make it work”.
  - Replace strong typings with `any` without justification.
  - Hardcode secrets or credentials.