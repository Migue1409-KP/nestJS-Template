/**
 * Extend this enum and ASSET_TYPE_CONFIG as needed for your project.
 * Each entry defines which MIME types are allowed and the maximum upload size.
 */
export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AVATAR = 'avatar',
}

interface AssetTypeRule {
  mimes: string[];
  maxBytes: number;
}

export const ASSET_TYPE_CONFIG: Record<AssetType, AssetTypeRule> = {
  [AssetType.IMAGE]: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxBytes: 10 * 1024 * 1024,
  },
  [AssetType.VIDEO]: {
    mimes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxBytes: 500 * 1024 * 1024,
  },
  [AssetType.DOCUMENT]: {
    mimes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxBytes: 20 * 1024 * 1024,
  },
  [AssetType.AVATAR]: {
    mimes: ['image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 5 * 1024 * 1024,
  },
};
