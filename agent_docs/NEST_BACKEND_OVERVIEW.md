# NEST_BACKEND_OVERVIEW.md

## Overview

High-level architecture of the NestJS modular monolith backend used in this repository.

## Core Concepts

- **Framework**: NestJS + Express, written in TypeScript with strict mode enabled.
- **Persistence**: TypeORM with PostgreSQL, automatic migrations.
- **Auth**: BetterAuth with cookie-based sessions.
- **Validation**: Zod schemas + custom `ZodValidationPipe`.
- **Logging**: Winston with `requestId` injection.
- **Mailing**: AWS SES wrapper.
- **Docs**: Swagger / OpenAPI.

## Module Layout

- `src/core` – global configuration, database connections, mailer, parameters, notifications.
- `src/shared` – interceptors (`RequestId`, logging, response), Zod pipes, ProblemDetails filters, decorators, interfaces.
- `src/auth` – BetterAuth integration, auth controllers and guards.
- `src/users` – user profile management, canonical example module.

## Configuration & Setup

- Environment variables define DB, mailer and auth configuration.
- TypeORM entities are registered per feature module.
- BetterAuth schema migrations are applied via `npm run auth:migrate`.

## Patterns & Best Practices

- Use **feature-first** organization: group controllers, services, repositories and entities per domain.
- Keep controllers thin; push logic into services.
- Use DTOs derived from Zod schemas for type safety and validation.

## Important Notes

- Do not introduce alternative ORMs or validation libraries.
- Do not bypass BetterAuth or custom pipes; extend them if needed.