# AGENTS.md

You are an AI coding agent working on a NestJS modular monolith backend.
Optimize for **correctness**, **consistency with existing patterns**, and **small, well-tested changes**.

## Project Overview

- This repository is a NestJS modular monolith template for SaaS / enterprise backends.
- Tech stack: NestJS (TypeScript), Express, TypeORM (PostgreSQL), BetterAuth, Zod, Winston, AWS SES, Swagger.
- Always prefer following existing patterns over introducing new abstractions.

For more detailed domain docs, you MAY open files under `agent_docs/` (start with `agent_docs/README.md`).

## Architecture & Folder Structure

- We use a **feature-first / modular monolith** structure:
  - `src/core`: cross-cutting infrastructure (config, DB, mailer, parameters, notifications).
  - `src/shared`: interceptors, pipes (Zod), filters (ProblemDetails RFC9457), decorators, interfaces.
  - `src/auth`: BetterAuth integration and auth controllers.
  - `src/users`: example feature module with entity, repository, service, controller and DTOs.

When adding new functionality, mirror the patterns from the `users` module
(see `agent_docs/USERS_MODULE_GUIDE.md` for a detailed walkthrough).

## How to implement a new feature

When the user asks to implement a new feature (e.g. "add projects module"):

1. **Plan first**
   - Locate or create a dedicated folder under `src/<feature-name>/`.
   - Identify required entity(ies), repository, service, controller and DTOs.
   - Check `USERS_MODULE_GUIDE.md` for the canonical pattern.

2. **Data layer (Entity + Repository)**
   - Define a TypeORM `@Entity` in `entities/`.
   - Implement a custom `Repository` class that extends `Repository<Entity>` and provides:
     - `findAll`, `findOneById`, `createEntity`, `updateEntity`, `deleteEntity` (or soft delete) methods.
   - Ensure entities are registered in the module and in the TypeORM data source if needed.

3. **Service layer**
   - Implement a `@Injectable()` service that uses the repository.
   - Keep business logic here, not in controllers.
   - Use transactions via `@Transactional()` or `QueryRunner` for multi-table writes.

4. **Controller + DTOs**
   - Create a controller under `controllers/` that:
     - Uses `ZodValidationPipe` for request validation with Zod schemas.
     - Uses DTO types inferred from Zod schemas.
     - Documents routes with `@nestjs/swagger` decorators and example responses.
   - Follow the response format: `ApiSuccess<T>` and ProblemDetails for errors.

5. **Tests**
   - Always create or update unit tests for services and any complex repository logic.
   - Use Jest, mocks for repositories, and focus on business behavior.
   - Look at `users` service tests as the main reference.

## Transactions & Database

- Use TypeORM `QueryRunner` or transactional decorators for operations that touch multiple tables.
- Prefer repository methods that accept an optional `queryRunner` to participate in existing transactions.
- Never silently swallow errors; let Nest's exception filters handle them or throw explicit HTTP exceptions.

## Authentication & Authorization

- Use existing BetterAuth integration in `src/auth` for authentication concerns.
- When extending the User model or profile:
  - Keep BetterAuth user tables and `users` module entities in sync.
  - Do not modify auth flows unless explicitly requested.

## Logging & Error Handling

- Use Winston with injected `requestId` for all logs.
- Rely on `ResponseInterceptor` and ProblemDetails filters from `src/shared` for consistent error responses.
- Do not introduce new logging frameworks.

## Commands & Tooling

Preferred commands the agent should use:

- `npm run start:dev` – start dev server in watch mode.
- `npm run migration:run` – apply TypeORM migrations.
- `npm run auth:migrate` – apply BetterAuth schema changes.
- `npm test` – run unit tests.
- `npm run lint` – run linters (if configured).

Before suggesting code changes, try to reason about **which commands should be run** to validate the work.

## Output & Language Conventions

- Use **English** for:
  - Commit messages.
  - Internal comments in code.
  - AI-facing descriptions and prompts.
- Use **Spanish** for:
  - User-facing documentation (`/doc`, `README.md`).

When generating documentation, respect this language split.

## Guardrails (Always / Ask / Never)

- **Always:**
  - Follow existing patterns from the `users` module.
  - Add or update tests when changing business logic.
  - Keep TypeScript strict mode and NestJS DI conventions.

- **Ask first:**
  - When introducing new dependencies.
  - When altering auth flows or security-related logic.
  - When performing large refactors across modules.

- **Never:**
  - Disable validations, authentication or authorization checks to "make it work".
  - Introduce `any` types or weaken typing without explicit justification.
  - Commit example secrets or credentials in code.