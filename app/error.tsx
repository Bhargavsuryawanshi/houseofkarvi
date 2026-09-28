'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="section-fit flex flex-col items-center text-center bg-brand-ivory py-20 px-6">
      <h2
        className="font-serif text-brand-charcoal mb-4"
        style={{ fontSize: 'var(--fs-heading)' }}
      >
        Something went wrong
      </h2>
      <p
        className="text-brand-charcoal/70 mb-8 max-w-md"
        style={{ fontSize: 'var(--fs-body)' }}
      >
        An unexpected issue occurred while rendering this page. Please try again.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="bg-brand-charcoal text-white py-3 px-8 font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors cursor-pointer"
          style={{ fontSize: 'var(--fs-eyebrow)' }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-brand-charcoal text-brand-charcoal py-3 px-8 font-medium uppercase tracking-widest hover:bg-brand-charcoal hover:text-white transition-colors"
          style={{ fontSize: 'var(--fs-eyebrow)' }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
