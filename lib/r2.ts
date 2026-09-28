import { S3Client } from '@aws-sdk/client-s3';

// Validate or lazily initialize the S3Client configured for Cloudflare R2
export const accountId = process.env.R2_ACCOUNT_ID || '';
export const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
export const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME || '';
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
