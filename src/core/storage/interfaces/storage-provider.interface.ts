export const STORAGE_PROVIDER = Symbol('STORAGE_PROVIDER');

export interface PresignedUploadParams {
  key: string;
  mimeType: string;
  expiresInSeconds: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
}

export interface IStorageProvider {
  getPresignedUploadUrl(params: PresignedUploadParams): Promise<PresignedUploadResult>;
  deleteFile(key: string): Promise<void>;
  deleteFiles(keys: string[]): Promise<void>;
  getPublicUrl(key: string): string;
  extractKeyFromUrl(url: string): string;
}
