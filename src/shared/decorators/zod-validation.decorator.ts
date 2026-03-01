import { SetMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

export const ZOD_SCHEMA_KEY = 'zodSchema';

export const ZodValidation = (schema: ZodSchema) => SetMetadata(ZOD_SCHEMA_KEY, schema);
