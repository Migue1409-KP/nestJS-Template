# USERS_MODULE_GUIDE.md

## Overview

The `users` module manages user profiles linked to BetterAuth users.
It is the **reference implementation** for how to design a feature module.

## Core Concepts

- Entity: `UserProfile` with enums, relations, timestamps.
- Repository: `UserRepository` extending `Repository<UserProfile>`.
- Service: `UsersService` with transactions and validation.
- Controller: `UsersController` with Zod validation and Swagger docs.
- DTOs: Zod schemas + Swagger DTO classes.
- Tests: Jest tests for `UsersService` using mocked repositories.

## Module Layout

- `src/users/entities/user-profiles.entity.ts`
- `src/users/repositories/user-profiles.repository.ts`
- `src/users/services/users.service.ts`
- `src/users/controllers/users.controller.ts`
- `src/users/dto/create-user.dto.ts`
- `src/users/dto/update-user.dto.ts`
- `src/users/services/users.service.spec.ts` (or equivalent test file)

## Patterns & Best Practices

- **Entity**
  - Use an enum for `gender_type`.
  - Use `@ManyToOne` to `Language` with `@JoinColumn`.
  - Use default values for role, nullable fields for optional properties.

- **Repository**
  - Provide methods like `findOneByAuthUserId`, `createEntity`, `updateEntity`, `softDeleteProfile`.
  - Support raw SQL queries only when necessary (e.g. cross-table updates).

- **Service**
  - Validate related entities (e.g. `languageId`) and throw `NotFoundException` with structured data.
  - Use `@Transactional()` for `createProfile` and `updateProfile`.
  - Keep name synchronization logic with BetterAuth user table in the service.

- **Controller**
  - Protect endpoints with `AuthGuard` and `@Session()` where necessary.
  - Use Zod schemas (`CreateUserProfileSchema`, `UpdatePartialUserProfileSchema`) via `ZodValidationPipe`.
  - Provide Swagger examples for success and error responses.

- **Tests**
  - Use Jest and `@nestjs/testing` to create a `TestingModule`.
  - Mock repositories and `DataSource` transactional behavior.
  - Test both successful flows and error cases (e.g. profile not found).

## Important Notes

- When implementing new modules, use the `users` module as a direct template.
- Keep naming and patterns consistent to make reasoning easier for agents and humans.