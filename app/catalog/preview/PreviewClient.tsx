'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StreamingPdfViewer from '@/components/catalog/StreamingPdfViewer';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PreviewClient() {
  const searchParams = useSearchParams();
  const directUrl = searchParams.get('url');

  const [pdfUrl, setPdfUrl] = useState<string | null>(directUrl);
  const [pdfName, setPdfName] = useState<string>('House of Karvi Catalogue');
  const [fileSize, setFileSize] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!directUrl);

  useEffect(() => {
    if (directUrl) {
      return;
    }

    async function fetchCatalogueConfig() {
      try {
        const docSnap = await getDoc(doc(db, 'site_settings', 'catalogue'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.pdfUrl) {
            setPdfUrl(data.pdfUrl);
            setPdfName(data.pdfName || 'House of Karvi Catalogue');
            setFileSize(data.fileSize);
          }
        }
      } catch (err) {
        console.error('Error loading catalogue setting:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogueConfig();
  }, [directUrl]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-white">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-4" />
        <p className="text-sm font-light tracking-widest uppercase">Opening Catalogue...</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
        <h1 className="font-serif text-2xl text-brand-gold">Catalogue Unavailable</h1>
        <p className="text-sm text-white/60 max-w-md">
          No catalogue file is currently active. Please check back shortly or request a copy via our catalog page.
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-brand-gold text-black font-semibold text-xs uppercase tracking-widest px-6 py-3 hover:bg-white transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return <StreamingPdfViewer pdfUrl={pdfUrl} pdfTitle={pdfName} fileSize={fileSize} />;
}
