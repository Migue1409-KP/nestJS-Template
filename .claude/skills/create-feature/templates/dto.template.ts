import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

/**
 * ============================================================
 * CREATE {ENTITY_NAME} DTO
 * ============================================================
 */

/**
 * Zod schema for creating {ENTITY_NAME}
 */
export const Create{ENTITY_CLASS}Schema = z.object({
  {ZOD_SCHEMA_FIELDS}
});

/**
 * TypeScript type inferred from Zod schema
 */
export type Create{ENTITY_CLASS}Dto = z.infer<typeof Create{ENTITY_CLASS}Schema>;

/**
 * Swagger DTO class for API documentation
 */
export class Create{ENTITY_CLASS}SwaggerDto {
  {SWAGGER_CREATE_FIELDS}
}

/**
 * ============================================================
 * UPDATE {ENTITY_NAME} DTO (Partial)
 * ============================================================
 */

/**
 * Zod schema for updating {ENTITY_NAME} (all fields optional)
 */
export const Update{ENTITY_CLASS}Schema = Create{ENTITY_CLASS}Schema.partial();

/**
 * TypeScript type inferred from Zod schema
 */
export type Update{ENTITY_CLASS}Dto = z.infer<typeof Update{ENTITY_CLASS}Schema>;

/**
 * Swagger DTO class for API documentation
 */
export class Update{ENTITY_CLASS}SwaggerDto {
  {SWAGGER_UPDATE_FIELDS}
}

/**
 * ============================================================
 * INDEX EXPORTS
 * ============================================================
 */

export {
  Create{ENTITY_CLASS}Schema,
  Create{ENTITY_CLASS}Dto,
  Create{ENTITY_CLASS}SwaggerDto,
  Update{ENTITY_CLASS}Schema,
  Update{ENTITY_CLASS}Dto,
  Update{ENTITY_CLASS}SwaggerDto,
};
