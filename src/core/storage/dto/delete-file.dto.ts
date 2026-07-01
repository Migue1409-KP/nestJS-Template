import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const DeleteFileSchema = z.object({
  key: z.string().min(1),
});

export type DeleteFileDto = z.infer<typeof DeleteFileSchema>;

export class DeleteFileSwaggerDto {
  @ApiProperty({
    type: 'string',
    description:
      'The storage key of the file to delete. This is the `key` returned by `POST /storage/presign`. ' +
      'Alternatively, you may pass the full `publicUrl` — the service will extract the key automatically.',
    example: 'image/2026-06/a1b2c3d4-uuid.jpg',
  })
  key: string;
}
