import { NextRequest, NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, url } = body;

    let targetKey = key;

    // If key not directly provided, extract it from URL
    if (!targetKey && url) {
      try {
        const parsedUrl = new URL(url);
        // Remove leading slash to get bucket key
        targetKey = decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));
      } catch {
        targetKey = url.replace(/^https?:\/\/[^/]+\//, '');
      }
    }

    if (!targetKey) {
      return NextResponse.json(
        { error: 'key or url is required' },
        { status: 400 }
      );
    }

    if (!R2_BUCKET || !process.env.R2_ACCOUNT_ID) {
      return NextResponse.json(
        { error: 'Cloudflare R2 is not fully configured.' },
        { status: 500 }
      );
    }

    // Delete object from Cloudflare R2 bucket
    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: targetKey,
    });

    await r2Client.send(deleteCommand);

    return NextResponse.json({
      success: true,
      message: `Object '${targetKey}' deleted successfully from Cloudflare R2.`,
      key: targetKey,
    });
  } catch (error: any) {
    console.error('Error deleting object from R2:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete object from Cloudflare R2' },
      { status: 500 }
    );
  }
}
