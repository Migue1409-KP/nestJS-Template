# NEST_BACKEND_OVERVIEW.md

## Overview

High-level architecture of the NestJS modular monolith backend used in this repository.

## Core Concepts

- **Framework**: NestJS + Express, written in TypeScript with strict mode enabled.
- **Persistence**: TypeORM with PostgreSQL, automatic migrations.
- **Auth**: BetterAuth with cookie-based sessions.
- **Validation**: Zod schemas + custom `ZodValidationPipe`.
- **Logging**: Winston with `requestId` injection.
- **Mailing**: AWS SES wrapper (`NotificationService`).
- **Storage**: Cloudflare R2 presigned-URL upload flow (`StorageService`).
- **Docs**: Swagger / OpenAPI.

## Module Layout

- `src/core` – global configuration, database connections, mailer, parameters, notifications, asset storage.
- `src/shared` – interceptors (`RequestId`, logging, response), Zod pipes, ProblemDetails filters, decorators, interfaces.
- `src/auth` – BetterAuth integration, auth controllers and guards.
- `src/users` – user profile management, canonical example module.

## Asset Storage (`StorageModule`)

Located at `src/core/storage/`. Exported globally via `CoreModule` — inject `StorageService` anywhere without additional imports.

**Provider pattern (Strategy):** `IStorageProvider` interface + `STORAGE_PROVIDER` injection token. Default implementation is `CloudflareR2Provider` (S3-compatible). To switch provider, change `useClass` in `storage.module.ts` only — no other file needs to change.

**Upload flow (presigned URL — file never passes through the API):**
1. `POST /storage/presign` → returns `{ uploadUrl, key, publicUrl, expiresAt }`.
2. Frontend `PUT`s the file binary directly to `uploadUrl` with the correct `Content-Type`.
3. Store `publicUrl` in the entity field (e.g. `user.photoUrl`, `post.coverUrl`).
4. To delete: `DELETE /storage/file` with the `key` or `publicUrl`, **or** call `storageService.deleteFiles(urls)` from the feature service before deleting the entity.

**Adding asset types:** extend `AssetType` enum and `ASSET_TYPE_CONFIG` in `src/core/storage/constants/asset-types.constant.ts`.

**Required env vars:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_PRESIGN_EXPIRES_IN` (default 300 s).

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