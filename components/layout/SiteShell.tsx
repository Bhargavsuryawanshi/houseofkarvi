'use client';

import { usePathname } from 'next/navigation';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPreviewPage = pathname === '/catalog/preview';

  if (isPreviewPage) {
    // Pure fullscreen canvas for PDF preview - completely remove website navbar, footer, and scroll wrappers
    return <main className="h-screen w-screen overflow-hidden bg-[#141414]">{children}</main>;
  }

  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
