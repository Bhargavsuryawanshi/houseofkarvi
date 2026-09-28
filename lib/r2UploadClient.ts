import imageCompression from 'browser-image-compression';

export interface UploadProgressCallback {
  (status: string): void;
}

/**
 * Compresses an image file client-side to WebP format under 500KB using browser-image-compression.
 * If file is already under 500KB and WebP, minimal compression is applied.
 */
export async function compressImageToWebP(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<File> {
  // If the file is not an image (e.g. PDF or SVG), skip image compression
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  onProgress?.('Compressing image to WebP under 500KB...');

  const options = {
    maxSizeMB: 0.48, // strictly under 500KB (~490KB)
    maxWidthOrHeight: 1920, // maintain high-res furniture clarity
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.85,
    onProgress: (percent: number) => {
      onProgress?.(`Compressing image to WebP: ${percent}%`);
    },
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const webpFile = new File([compressedBlob], `${baseName}.webp`, {
      type: 'image/webp',
    });
    return webpFile;
  } catch (error) {
    console.warn('browser-image-compression failed, falling back to original file:', error);
    return file;
  }
}

/**
 * Deletes a file directly from Cloudflare R2 bucket.
 */
export async function deleteFromR2(urlOrKey: string): Promise<boolean> {
  if (!urlOrKey) return false;
  try {
    const res = await fetch('/api/r2/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlOrKey }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete file from Cloudflare R2:', err);
    return false;
  }
}

/**
 * Uploads a file directly to Cloudflare R2 using a pre-signed URL.
 * 1. Automatically compresses images to WebP (<500KB) via browser-image-compression.
 *    PDFs and other documents skip compression.
 * 2. Fetches a pre-signed PUT URL from /api/r2/presign.
 * 3. Uploads the file directly to R2 from the client browser.
 * 4. Returns the public R2 URL.
 */
export async function uploadToR2(
  file: File,
  options: {
    folder?: 'products' | 'catalogue';
    onProgress?: UploadProgressCallback;
  } = {}
): Promise<string> {
  const { folder = 'products', onProgress } = options;

  let fileToUpload = file;

  // Step 1: Compress if image (skip if PDF)
  if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
    const originalMb = (file.size / (1024 * 1024)).toFixed(2);
    onProgress?.(`Optimizing image (${originalMb}MB)...`);
    fileToUpload = await compressImageToWebP(file, onProgress);
    const finalKb = Math.round(fileToUpload.size / 1024);
    onProgress?.(`Compressed to WebP (${finalKb}KB). Requesting direct upload URL...`);
  } else {
    onProgress?.('Requesting direct upload URL for Cloudflare R2...');
  }

  // Step 2: Request pre-signed URL from Next.js backend
  const presignRes = await fetch('/api/r2/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: fileToUpload.name,
      contentType: fileToUpload.type || 'application/octet-stream',
      folder,
    }),
  });

  if (!presignRes.ok) {
    const errData = await presignRes.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to get upload authorization (HTTP ${presignRes.status})`);
  }

  const { presignedUrl, publicUrl } = await presignRes.json();

  if (!presignedUrl || !publicUrl) {
    throw new Error('Invalid response from upload service: missing URL');
  }

  // Step 3: Upload file directly to Cloudflare R2 via HTTP PUT with progress tracking
  onProgress?.(`Uploading directly to Cloudflare R2 (${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB)...`);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl, true);
    xhr.setRequestHeader('Content-Type', fileToUpload.type || 'application/octet-stream');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        const uploadedMb = (e.loaded / (1024 * 1024)).toFixed(1);
        const totalMb = (e.total / (1024 * 1024)).toFixed(1);
        onProgress?.(`Uploading directly to Cloudflare R2: ${percent}% (${uploadedMb}MB / ${totalMb}MB)`);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Cloudflare R2 direct upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during direct upload to Cloudflare R2.'));
    };

    xhr.send(fileToUpload);
  });

  onProgress?.('Upload complete!');
  return publicUrl;
}
