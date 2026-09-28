'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Download, CheckCircle2, AlertCircle, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CatalogPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string>('House of Karvi - Exclusive Catalog.pdf');

  // Load the active catalogue PDF settings on mount
  useEffect(() => {
    async function fetchCatalogueSettings() {
      try {
        const snap = await getDoc(doc(db, 'site_settings', 'catalogue'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.pdfUrl) {
            setPdfUrl(data.pdfUrl);
          }
          if (data.pdfName) {
            setPdfName(data.pdfName);
          }
        }
      } catch (err) {
        console.error('Error fetching catalogue settings:', err);
      }
    }
    fetchCatalogueSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form field validations
    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please provide your full name.');
      return;
    }

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Store submission into Google Firebase Firestore
      await addDoc(collection(db, 'catalog_requests'), {
        fullName: trimmedName,
        email: trimmedEmail.toLowerCase(),
        company: formData.company.trim() || null,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      // Showcase the streaming viewer in a new tab immediately
      window.open('/catalog/preview', '_blank', 'noopener,noreferrer');

      setSubmitted(true);
    } catch (err: any) {
      console.error('Catalogue request error:', err);
      setErrorMsg('We encountered an error submitting your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 bg-brand-ivory min-h-screen">
      <div className="site-container flex flex-col md:flex-row items-center gap-12 lg:gap-16">
        
        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <header className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-6">Exclusive Catalog</h1>
            <p className="text-brand-charcoal/70 text-lg leading-relaxed font-light">
              Enter your details to receive our comprehensive collection catalog, featuring detailed material specifications, bespoke options, and dimensions.
            </p>
          </header>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!submitted ? (
            <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Full Name *</label>
                <input
                  required
                  type="text"
                  id="name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors text-brand-charcoal"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Email Address *</label>
                <input
                  required
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors text-brand-charcoal"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Company / Studio (Optional)</label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors text-brand-charcoal"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-charcoal text-brand-ivory py-4 text-sm font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Submitting Details...' : 'Request Catalog'}
              </button>
            </form>
          ) : (
            <div className="bg-brand-beige p-8 text-center max-w-md border border-brand-charcoal/10 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-brand-gold mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-brand-charcoal mb-2">Thank You</h3>
              <p className="text-brand-charcoal/70 text-sm mb-6 leading-relaxed font-light">
                Your request has been registered. You can now view the official House of Karvi collection catalogue.
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/catalog/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-brand-gold text-white py-3.5 px-8 text-xs font-medium uppercase tracking-widest hover:bg-brand-charcoal transition-colors shadow-xs w-full"
                >
                  <Eye className="w-4 h-4" />
                  View Catalogue Online
                </Link>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ fullName: '', email: '', company: '' });
                }}
                className="mt-6 text-xs uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-charcoal border-b border-brand-charcoal/20 pb-0.5 transition-colors"
              >
                Submit another request
              </button>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-[3/4] w-full max-w-[max(280px,min(100%,26vw))] mx-auto overflow-hidden bg-brand-beige shadow-xl">
            <Image 
              src="/products/Catalougue_image.png"
              alt="Houseofkarvi Catalog Cover"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              unoptimized
            />
            <div className="absolute inset-0 border border-brand-charcoal/10 m-4"></div>
          </div>
        </div>

      </div>
    </div>
  );
}