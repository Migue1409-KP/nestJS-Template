import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { AssetType, ASSET_TYPE_CONFIG } from '../constants/asset-types.constant';

export const RequestUploadSchema = z.object({
  assetType: z.nativeEnum(AssetType),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
});

export type RequestUploadDto = z.infer<typeof RequestUploadSchema>;

export class RequestUploadSwaggerDto {
  @ApiProperty({
    enum: AssetType,
    description:
      'Category of the asset being uploaded. Determines allowed MIME types and size limits.',
    example: AssetType.IMAGE,
  })
  assetType: AssetType;

  @ApiProperty({
    type: 'string',
    maxLength: 255,
    description:
      'Original filename including extension. Used to derive the file extension for the stored key.',
    example: 'profile-photo.jpg',
  })
  filename: string;

  @ApiProperty({
    type: 'string',
    maxLength: 100,
    description: `MIME type of the file. Must match the allowed types for the chosen assetType.\n\nAllowed per type:\n${Object.entries(
      ASSET_TYPE_CONFIG,
    )
      .map(
        ([type, cfg]) =>
          `- **${type}**: ${cfg.mimes.join(', ')} (max ${cfg.maxBytes / 1024 / 1024} MB)`,
      )
      .join('\n')}`,
    example: 'image/jpeg',
  })
  mimeType: string;
}
