# TESTING_GUIDE.md

## Overview

Testing strategy and expectations for this NestJS backend.

## Core Concepts

- Testing framework: Jest + `@nestjs/testing`.
- Scope: unit tests for services and complex repositories.
- Mocks: repositories, external services, `DataSource` / `QueryRunner`.

## Test Types

- **Service tests**
  - Use `Test.createTestingModule` to provide the service and mock repositories.
  - Focus on business rules and error handling.
- **Repository tests (optional)**
  - Only for complex queries; otherwise rely on TypeORM behavior.

## Patterns & Best Practices

- For each service with substantial logic, create a corresponding `*.spec.ts`.
- Mock repository methods (`findOneById`, `createEntity`, etc.) and assert interactions.
- Cover:
  - Success scenarios.
  - NotFound / validation errors.
  - Transactional behavior when relevant.

## Commands

- `npm test` – run all unit tests.
- (Optionally add `npm run test:watch` or similar if configured.)

## Important Notes

- Do not bypass tests in CI; new features SHOULD include or update tests.
- Keep tests fast and deterministic; avoid real network or DB access.