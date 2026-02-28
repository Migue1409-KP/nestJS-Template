import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { gender_type } from '../entities/user-profiles.entity';

export const UpdatePartialUserProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  lastname: z.string().min(2).max(100).optional(),
  languageId: z.string().uuid().optional(),
  phone: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  gender: z.nativeEnum(gender_type).optional(),
}).partial();

export type UpdateUserProfileDto = z.infer<typeof UpdatePartialUserProfileSchema>;

export class UpdatePartialUserProfileSwaggerDto {
  @ApiProperty({ type: 'string', minLength: 2, maxLength: 100, required: false })
  name?: string;
  @ApiProperty({ type: 'string', minLength: 2, maxLength: 100, required: false })
  lastname?: string;
  @ApiProperty({ type: 'string', format: 'uuid', required: false })
  languageId?: string;
  @ApiProperty({ type: 'string', required: false })
  phone?: string;
  @ApiProperty({ type: 'string', format: 'date', required: false })
  birthDate?: Date;
  @ApiProperty({ type: 'string', required: false })
  gender?: gender_type;
}