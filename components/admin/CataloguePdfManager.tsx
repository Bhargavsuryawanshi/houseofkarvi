'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { uploadToR2 } from '@/lib/r2UploadClient';
import { FileText, Upload, Download, Check, AlertCircle, RefreshCw, Trash2, ExternalLink } from 'lucide-react';

interface CatalogueSettings {
  pdfUrl: string;
  pdfName?: string;
  fileSize?: string;
  updatedAt?: any;
}

export default function CataloguePdfManager() {
  const [settings, setSettings] = useState<CatalogueSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'site_settings', 'catalogue'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as CatalogueSettings;
          setSettings(data);
          setManualUrl(data.pdfUrl || '');
        } else {
          setSettings(null);
          setManualUrl('');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching catalogue settings:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setUploading(true);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadStatus(`Preparing ${sizeInMb}MB PDF for Cloudflare R2...`);

    try {
      // Direct client-to-R2 upload via pre-signed URL (bypasses 50MB limit)
      const downloadUrl = await uploadToR2(file, {
        folder: 'catalogue',
        onProgress: (status) => setUploadStatus(status),
      });

      const sizeFormatted = `${sizeInMb} MB`;

      // Save public URL & metadata directly to Firestore
      await setDoc(doc(db, 'site_settings', 'catalogue'), {
        pdfUrl: downloadUrl,
        pdfName: file.name,
        fileSize: sizeFormatted,
        updatedAt: serverTimestamp(),
      });

      setSuccessMsg('Catalogue PDF uploaded to Cloudflare R2 and published successfully!');
      setManualUrl(downloadUrl);
    } catch (err: any) {
      console.error('Cloudflare R2 upload error:', err);
      setErrorMsg(err.message || 'Failed to upload PDF. You can also specify an external PDF URL below.');
    } finally {
      setUploading(false);
      setUploadStatus(null);
      e.target.value = '';
    }
  };

  const handleRemoveCatalogue = async () => {
    if (!window.confirm('Are you sure you want to remove the current catalogue? Users will see a notice until a new PDF is added.')) {
      return;
    }

    const previousUrl = settings?.pdfUrl;

    setDeleting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Delete Firestore configuration
      await deleteDoc(doc(db, 'site_settings', 'catalogue'));
      
      // 2. Also delete the actual PDF file from Cloudflare R2 bucket
      if (previousUrl) {
        try {
          await fetch('/api/r2/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: previousUrl }),
          });
        } catch (r2Err) {
          console.warn('Note: Could not purge file from Cloudflare R2 bucket automatically:', r2Err);
        }
      }

      setSettings(null);
      setManualUrl('');
      setSuccessMsg('Catalogue removed from database and Cloudflare R2.');
    } catch (err: any) {
      console.error('Error removing catalogue:', err);
      setErrorMsg('Failed to remove catalogue: ' + (err.message || err));
    } finally {
      setDeleting(false);
    }
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) {
      setErrorMsg('Please provide a valid URL.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await setDoc(doc(db, 'site_settings', 'catalogue'), {
        pdfUrl: manualUrl.trim(),
        pdfName: 'House of Karvi Catalogue.pdf',
        fileSize: 'Custom Link',
        updatedAt: serverTimestamp(),
      });

      setSuccessMsg('Catalogue PDF link updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'site_settings/catalogue');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-brand-charcoal/60">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading catalogue settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-serif text-2xl text-brand-charcoal mb-1">Catalogue PDF Management</h2>
        <p className="text-xs text-brand-charcoal/60">
          Manage the digital collection catalogue downloaded or viewed by website visitors. Uploads are stored on Cloudflare R2 without size restrictions.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-3">
          <Check className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Current Catalogue Card */}
      <div className="border border-brand-charcoal/10 bg-brand-beige/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs uppercase tracking-widest text-brand-charcoal/70">Active Catalogue File</h3>
          {settings?.pdfUrl && (
            <span className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-xs flex items-center gap-1 font-medium">
              <Check className="w-3 h-3" /> Live on Website
            </span>
          )}
        </div>

        {settings?.pdfUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-ivory p-4 border border-brand-charcoal/10 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-brand-charcoal text-sm truncate max-w-md">
                  {settings.pdfName || 'House of Karvi Catalogue.pdf'}
                </p>
                <div className="flex items-center gap-3 text-xs text-brand-charcoal/50 mt-1">
                  {settings.fileSize && <span>{settings.fileSize}</span>}
                  {settings.updatedAt && (
                    <span>Updated: {settings.updatedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/catalog/preview?url=${encodeURIComponent(settings.pdfUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-brand-charcoal text-brand-ivory px-3.5 py-2 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors"
                title="Stream preview PDF in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview (Stream)
              </a>
              <button
                type="button"
                onClick={handleRemoveCatalogue}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 px-3.5 py-2 text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                title="Remove catalogue"
              >
                <Trash2 className="w-3.5 h-3.5" /> {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-brand-charcoal/60 bg-brand-ivory p-6 text-center border border-dashed border-brand-charcoal/20">
            No catalogue PDF currently active. Upload a PDF below to enable instant viewing for visitors.
          </div>
        )}
      </div>

      {/* Upload New PDF to Cloudflare R2 */}
      <div className="border border-brand-charcoal/10 p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-brand-charcoal font-medium">Upload New PDF to Cloudflare R2</h3>
        <p className="text-xs text-brand-charcoal/60">
          Upload any catalog PDF (supports 50MB+ high-resolution architectural portfolios). Direct-to-R2 pre-signed uploads bypass Vercel serverless request limits completely.
        </p>

        {uploadStatus && (
          <div className="flex items-center gap-2 p-3 bg-brand-beige border border-brand-gold/40 text-brand-charcoal text-xs rounded-sm animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-gold shrink-0" />
            <span>{uploadStatus}</span>
          </div>
        )}

        <label className={`block border-2 border-dashed border-brand-charcoal/20 p-8 text-center cursor-pointer hover:border-brand-charcoal transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-8 h-8 text-brand-gold mx-auto mb-3" />
          <span className="text-sm font-medium text-brand-charcoal block mb-1">
            {uploading ? (uploadStatus || 'Uploading directly to Cloudflare R2...') : 'Click to browse or drag PDF here'}
          </span>
          <span className="text-xs text-brand-charcoal/50">Supports PDF format (50MB+ supported via direct Cloudflare R2 upload)</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Manual URL Alternative */}
      <div className="border border-brand-charcoal/10 p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-brand-charcoal/70">Or Set Custom / External PDF URL</h3>
        <form onSubmit={handleManualSave} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://pub-xxxxxx.r2.dev/catalogue/... or https://..."
            className="flex-1 bg-transparent border-b border-brand-charcoal/20 py-2.5 px-1 text-sm focus:outline-none focus:border-brand-charcoal"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-brand-charcoal text-brand-ivory px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
            Save URL
          </button>
        </form>
      </div>
    </div>
  );
}
