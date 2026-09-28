'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-[#FDFCFA] text-[#2C2926] font-sans flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-lg">
          <h1 className="font-serif text-3xl md:text-4xl text-[#2C2926] mb-4">
            System Error
          </h1>
          <p className="text-[#2C2926]/70 text-base mb-8">
            A critical error occurred. Please attempt to reload the application.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="bg-[#2C2926] text-white py-3 px-8 text-xs tracking-widest uppercase font-medium hover:bg-[#C19B6C] transition-colors cursor-pointer"
            >
              Reload
            </button>
            <Link
              href="/"
              className="border border-[#2C2926] text-[#2C2926] py-3 px-8 text-xs tracking-widest uppercase font-medium hover:bg-[#2C2926] hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
