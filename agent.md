# agent.md

## Project Overview

This backend is a **NestJS modular monolith** designed for freelancing projects and SaaS prototypes.  
It implements **BetterAuth with cookie-based sessions** instead of JWT, includes structured logging with request IDs, and supports external integrations (Google OAuth, mailing services, APIs).

## Technologies

- **NestJS** (TypeScript)
- **ExpressJS** (HTTP server)
- **TypeORM** (Postgres, migrations)
- **BetterAuth** (sessions, email/password, Google provider)
- **Zod** (validation)
- **Winston** (logging with requestId + interceptors)
- **Docker** (Postgres, local dev)
- **AWS SES / Resend-ready** (mail service abstraction)

## Folder Structure

- `src/`
  - `app.module.ts`, `main.ts`: root bootstrap
  - `core/`: config, DB, mail, HTTP
  - `shared/`: interceptors, pipes, filters, response interfaces
  - `auth/`: BetterAuth, auth controller + module
  - `users/`: `UserProfile` entity, repository, service
  - `integrations/`: external providers

## Best Practices

- Use **feature-first** modularity: keep entities, services, controllers together.
- Validate DTOs with **Zod** + pipes.
- Manage authentication with **BetterAuth** (not Passport/JWT).
- Assign roles/extra fields in `UserProfile`, attached via session callback.
- Use interceptors:
  - `RequestIdInterceptor` → inject UUID per request
  - `LoggingInterceptor` → structured logs
  - `ResponseInterceptor` → normalize to `ApiResponse` (RFC 9457)

## AI Tasks Guidance

- For new endpoints: create a new module under `src/` with `controller`, `service`, `dto`.
- For DB: extend `UserProfile` or create new entities in `users/` or relevant module.
- For auth: extend `better-auth.instance.ts` (callbacks, providers, config).
- For roles: persist in `UserProfile`, merge into `session.user` on login.
- For logging: always include `requestId`.

## Automation Entry Points

- `docker-compose.yml` → run Postgres
- `npm run migration:*` → DB migrations
- `npx @better-auth/cli migrate` → BetterAuth tables
- `openapi` decorators in controllers → API docs (Swagger UI at `/docs`)

## Output Style

- **English** for AI/automation guidance
- **Spanish** for README/user docs
- Always TypeScript + NestJS conventions