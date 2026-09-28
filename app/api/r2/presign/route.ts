import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType, folder = 'products' } = body;
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    if (!R2_BUCKET || !process.env.R2_ACCOUNT_ID) {
      return NextResponse.json(
        { 
          error: 'Cloudflare R2 is not fully configured. Please ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and NEXT_PUBLIC_R2_PUBLIC_URL are set.' 
        },
        { status: 500 }
      );
    }

    // Sanitize filename and create unique key
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${Date.now()}_${sanitizedName}`;

    // Command to upload directly to R2
    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
      // Cache-Control for fast browser & CDN delivery
      CacheControl: 'public, max-age=31536000, immutable',
    });

    // Generate pre-signed URL valid for 15 minutes (900 seconds)
    const presignedUrl = await getSignedUrl(r2Client, putCommand, { expiresIn: 900 });

    // Construct the public URL
    const publicBase = R2_PUBLIC_URL.replace(/\/$/, '');
    const publicUrl = publicBase ? `${publicBase}/${key}` : `https://${R2_BUCKET}.r2.dev/${key}`;

    return NextResponse.json({
      presignedUrl,
      publicUrl,
      key,
    });
  } catch (error: any) {
    console.error('Error generating R2 presigned URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate pre-signed upload URL' },
      { status: 500 }
    );
  }
}
