# FEATURE_WORKFLOW.md

## Overview

Standard workflow for adding a new feature or domain module to the NestJS backend.

## Core Concepts

- Each feature lives in its own folder under `src/<feature>/`.
- A complete feature includes: entity, repository, service, controller, DTOs and tests.
- The `users` module is the canonical example.

## Standard Workflow

1. **Entity**
   - Create a TypeORM `@Entity` in `src/<feature>/entities/`.
   - Use `uuid` primary keys and explicit column names.
   - Add relations using `@ManyToOne`, `@OneToMany`, etc., when needed.
   - Include `@CreateDateColumn` and `@UpdateDateColumn` for timestamps.

2. **Repository**
   - Create a class extending `Repository<Entity>` in `src/<feature>/repositories/`.
   - Inject `DataSource` and implement a `getRepository(queryRunner?)` helper.
   - Provide high-level methods:
     - Read: `findAll`, `findOneById`, `findBy<key>`.
     - Write: `createEntity`, `updateEntity`, `deleteEntity` / `softDelete`.
   - Accept an optional `QueryRunner` argument for methods that can participate in transactions.

3. **Service**
   - Create an `@Injectable()` service in `src/<feature>/services/`.
   - Inject the repository (and other dependencies).
   - Keep all business logic here (validations, cross-entity operations, transactions).
   - Use `@Transactional()` or explicit `QueryRunner` for multi-table writes.
   - Throw Nest HTTP exceptions (e.g. `NotFoundException`) with structured error payloads.

4. **Controller**
   - Create a controller under `src/<feature>/controllers/`.
   - Use `@UseGuards` for authentication as needed.
   - Use `ZodValidationPipe` with Zod schemas for bodies.
   - Document endpoints with `@nestjs/swagger` decorators and realistic examples.
   - Wrap responses in the standardized success format.

5. **DTOs & Validation**
   - Define Zod schemas in `src/<feature>/dto/`.
   - Export DTO types as `z.infer<typeof Schema>`.
   - Provide Swagger DTO classes annotated with `@ApiProperty`.

6. **Tests**
   - Create Jest unit tests under `src/<feature>/services/__tests__/` or similar.
   - Mock repositories and other dependencies.
   - Cover success and error paths (e.g. entity not found, invalid state).

## Patterns & Best Practices

- Start from the `users` module when in doubt.
- Keep each step small and verifiable.
- Always update or add tests when changing business logic.

## Important Notes

- Do not introduce new layers or patterns (e.g. CQRS, event sourcing) unless explicitly required.
- Coordinate DB changes with TypeORM migrations and BetterAuth migrations when needed.