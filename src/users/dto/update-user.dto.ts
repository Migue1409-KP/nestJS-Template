import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { z } from 'zod';

export const UpdatePartialUserProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  lastname: z.string().min(2).max(100).optional(),
  countryId: z.string().uuid().optional(),
  languageId: z.string().uuid().optional(),
  phone: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  genre: z.string().optional(),
}).partial();

export type UpdateUserProfileDto = z.infer<typeof UpdatePartialUserProfileSchema>;

export class UpdatePartialUserProfileSwaggerDto {
  @ApiProperty({ type: 'string', minLength: 2, maxLength: 100, required: false })
  name?: string;
  @ApiProperty({ type: 'string', minLength: 2, maxLength: 100, required: false })
  lastname?: string;
  @ApiProperty({ type: 'string', format: 'uuid', required: false })
  countryId?: UUID;
  @ApiProperty({ type: 'string', format: 'uuid', required: false })
  languageId?: UUID;
  @ApiProperty({ type: 'string', required: false })
  phone?: string;
  @ApiProperty({ type: 'string', format: 'date', required: false })
  birthDate?: Date;
  @ApiProperty({ type: 'string', required: false })
  genre?: string;
}