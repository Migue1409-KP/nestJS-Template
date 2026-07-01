import { Body, Controller, Delete, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { StorageService, RequestUploadResult } from './storage.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  RequestUploadDto,
  RequestUploadSchema,
  RequestUploadSwaggerDto,
} from './dto/request-upload.dto';
import { DeleteFileDto, DeleteFileSchema, DeleteFileSwaggerDto } from './dto/delete-file.dto';
import { ApiSuccess } from '@/shared/interfaces/api-response';

@ApiTags('Storage')
@Controller('storage')
@UseGuards(AuthGuard)
@ApiSecurity('apiKeyAuth')
@ApiSecurity('cookieAuth')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presign')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Request a presigned upload URL',
    description: `Generates a short-lived presigned **PUT** URL so the client can upload a file directly to Cloudflare R2 without routing binary data through the API server.

**Typical upload flow:**
1. Call this endpoint with \`assetType\`, \`filename\`, and \`mimeType\`.
2. Receive \`{ uploadUrl, key, publicUrl, expiresAt }\`.
3. From the frontend, perform a \`PUT\` request to \`uploadUrl\` with the file binary as the body and the \`Content-Type\` header set to the same \`mimeType\` sent here.
4. Once the upload succeeds, store the returned \`publicUrl\` in your resource (e.g. a user avatar field, a post cover image).
5. Keep the \`key\` if you need to delete the file later via \`DELETE /storage/file\`.

> The presigned URL expires at \`expiresAt\`. A new one must be requested after expiry.`,
  })
  @ApiBody({ type: RequestUploadSwaggerDto })
  @ApiResponse({
    status: 200,
    description: 'Presigned upload URL generated successfully.',
    schema: {
      example: {
        status: 'success',
        data: {
          uploadUrl:
            'https://<account>.r2.cloudflarestorage.com/image/2026-06/uuid.jpg?X-Amz-Signature=...',
          key: 'image/2026-06/a1b2c3d4-uuid.jpg',
          publicUrl: 'https://assets.yourdomain.com/image/2026-06/a1b2c3d4-uuid.jpg',
          expiresAt: '2026-06-29T15:05:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation error — invalid `assetType`, `filename`, or `mimeType` not allowed for the chosen asset type.',
    schema: {
      example: {
        type: 'about:blank',
        title: 'Bad Request',
        status: 400,
        detail: 'MIME type "video/mp4" is not allowed for asset type "image"',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid session.' })
  async presign(
    @Body(new ZodValidationPipe(RequestUploadSchema)) body: RequestUploadDto,
  ): Promise<ApiSuccess<RequestUploadResult>> {
    return {
      status: 'success',
      data: await this.storageService.requestUpload(body),
    };
  }

  @Delete('file')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete a stored file',
    description: `Permanently removes a file from Cloudflare R2 storage.

Accepts either:
- The **\`key\`** returned by \`POST /storage/presign\` (e.g. \`image/2026-06/uuid.jpg\`), or
- The full **\`publicUrl\`** stored in the database — the service extracts the key automatically.

> **Note:** deletion is permanent and cannot be undone. Remove the corresponding URL from your database record before or after calling this endpoint.

When deleting a resource that holds stored URLs, inject \`StorageService\` in the feature service and call \`storageService.deleteFiles(urls)\` before/after the entity delete.`,
  })
  @ApiBody({ type: DeleteFileSwaggerDto })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully.',
    schema: { example: { status: 'success', data: { deleted: true } } },
  })
  @ApiResponse({ status: 400, description: 'Validation error — `key` is empty or missing.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid session.' })
  async deleteFile(
    @Body(new ZodValidationPipe(DeleteFileSchema)) body: DeleteFileDto,
  ): Promise<ApiSuccess<{ deleted: boolean }>> {
    await this.storageService.deleteFile(body.key);
    return { status: 'success', data: { deleted: true } };
  }
}
