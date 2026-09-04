'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CatalogPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
        
        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <header className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-6">Exclusive Catalog</h1>
            <p className="text-brand-charcoal/70 text-lg leading-relaxed font-light">
              Enter your details to receive our comprehensive collection catalog, featuring detailed material specifications, bespoke options, and dimensions.
            </p>
          </header>

          {!submitted ? (
            <form 
              className="space-y-6 max-w-md" 
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Full Name</label>
                <input required type="text" id="name" className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Email Address</label>
                <input required type="email" id="email" className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Company / Studio (Optional)</label>
                <input type="text" id="company" className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
              </div>

              <button type="submit" className="w-full bg-brand-charcoal text-brand-ivory py-4 text-sm font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-6">
                Request Catalog
              </button>
            </form>
          ) : (
            <div className="bg-brand-beige p-8 text-center max-w-md border border-brand-charcoal/10">
              <h3 className="font-serif text-2xl text-brand-charcoal mb-4">Thank You</h3>
              <p className="text-brand-charcoal/70 text-sm mb-6">
                Your request has been received. You can now download the latest Houseofkarvi catalog.
              </p>
              <a href="#" className="inline-block bg-brand-gold text-white py-3 px-8 text-sm font-medium uppercase tracking-widest hover:bg-brand-charcoal transition-colors">
                Download PDF
              </a>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden bg-brand-beige shadow-xl">
            <Image 
              src="/products/IMG-20260818-WA0010.jpg"
              alt="Houseofkarvi Catalog Cover"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border border-brand-charcoal/10 m-4"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
