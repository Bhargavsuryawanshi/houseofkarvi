import { Suspense } from 'react';
import PreviewClient from './PreviewClient';

export const metadata = {
  title: 'Catalogue Preview | House of Karvi',
  description: 'Stream and preview the official House of Karvi architectural & luxury furniture catalogue online.',
};

export default function CatalogPreviewPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-white text-sm">
            Loading preview viewer...
          </div>
        }
      >
        <PreviewClient />
      </Suspense>
    </div>
  );
}
