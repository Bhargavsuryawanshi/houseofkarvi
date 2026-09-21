import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="section-fit flex flex-col items-center text-center bg-brand-ivory">
      <h2 className="font-serif text-brand-charcoal mb-4" style={{ fontSize: 'var(--fs-heading)' }}>Not Found</h2>
      <p className="text-brand-charcoal/70 mb-8" style={{ fontSize: 'var(--fs-body)' }}>Could not find requested resource</p>
      <Link href="/" className="inline-block bg-brand-charcoal text-white py-3 px-8 font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors" style={{ fontSize: 'var(--fs-eyebrow)' }}>
        Return Home
      </Link>
    </div>
  );
}
