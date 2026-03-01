# agent.md

## Project Overview

This backend is a **NestJS modular monolith base template**, designed for scaffolding new SaaS, enterprise, or freelancing projects quickly.  
It implements **BetterAuth** with cookie-based sessions (reducing the boilerplate of implementing passports/JWTs), structured and traceable logging with **Winston**, robust validations with **Zod**, and standard **TypeORM** for PostgreSQL. It includes a ready-to-use mailer wrapper via **AWS SES**.

## Technologies

- **NestJS** (TypeScript)
- **ExpressJS** (HTTP server)
- **TypeORM** (PostgreSQL, automatic migrations)
- **BetterAuth** (Sessions, email/password, easily extensible to OAuth)
- **Zod** (API Validation)
- **Winston** (Logging with requestId injection)
- **AWS SES integration** (Mailing service abstraction)
- **Swagger** (OpenAPI documentation)

## Folder Structure

- `src/`
  - `app.module.ts`, `main.ts`: app bootstrap, Swagger setup, global pipes/interceptors.
  - `core/`: application-wide config, DB connections, mail, HTTP wrap. Contains domains like `notification` or `parameters`.
  - `shared/`: cross-cutting logic: interceptors (`RequestId`, `Logging`, `Response`), pipes (Zod), filters (`ProblemDetails`), decorators, interfaces.
  - `auth/`: config for `@better-auth/cli`, standard auth controller + module.
  - `users/`: `UserProfile` custom logic and entities that interact with BetterAuth's mapped tables.

## Best Practices

- Use **feature-first / Modular Monolith** patterns: isolate your domains into separate folders containing their controllers, services, repositories, and entities.
- Validate incoming requests with **Zod** + custom pipes, keeping endpoints secure.
- Use **BetterAuth** commands for managing user schemas, while using TypeORM migrations for business logic tables.
- Standardized API responses across the app handled via `ResponseInterceptor` and `ProblemDetails` exception filters (RFC 9457).
- Structured logging: always leverage the injected `requestId` for troubleshooting flows in production.

## AI Tasks Guidance

- **New resources:** generate a new module at the root of `src/` (or wherever domain contexts apply) using nest generators or manually providing `controller`, `service`, `module`, and `entity` structure.
- **Relational DB / TypeORM:** Place entities logically separated. Remember to include them in the `DataSource` config / feature modules.
- **Authentication:** Use existing implementations in `auth/` or interact directly with the `BetterAuth` client instances. If extending the User model, keep it synced between BetterAuth and `users` module.
- **Transactions:** leverage TypeORM's `QueryRunner` or transactional decorators when performing critical multi-table writes.

## Scripts & Automation

- `npm run migration:run` -> Apply TypeORM migrations.
- `npm run auth:migrate` -> Apply BetterAuth schema changes.
- `npm run start:dev` -> Start server in watch mode.

## Output Style

- **English** for AI Context / Commit messages / internal comments.
- **Spanish** for User-facing documentation (`/doc`, `README.md`).
- Always follow TypeScript strict mode + NestJS conventions (dependency injection, SOLID rules).