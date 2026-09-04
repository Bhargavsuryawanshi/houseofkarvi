'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: 'catalog',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const customerName = `${formData.firstName} ${formData.lastName}`.trim();
      await addDoc(collection(db, 'inquiries'), {
        customerName,
        customerEmail: formData.email,
        message: `[Interest: ${formData.interest}]\n\n${formData.message}`,
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 bg-brand-beige min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Information Section */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-8">Let&apos;s bring your vision to life.</h1>
            <p className="text-brand-charcoal/70 text-lg leading-relaxed font-light mb-12">
              Our production has just begun, and every piece at Houseofkarvi is meticulously made to order. Once you select a design or share your ideas, we craft it exclusively for your space.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-brand-gold font-medium mb-2">General Inquiries</h3>
                <a href="mailto:hello@houseofkarvi.in" className="text-xl font-serif text-brand-charcoal hover:text-brand-gold transition-colors">hello@houseofkarvi.in</a>
              </div>
              
              <div>
                <h3 className="text-sm uppercase tracking-widest text-brand-gold font-medium mb-2">Studio & Workshop</h3>
                <address className="text-brand-charcoal/80 not-italic leading-relaxed font-light">
                  123 Artisan Way<br />
                  Design District<br />
                  Mumbai, India
                </address>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-brand-ivory p-8 md:p-12 shadow-sm">
            <h2 className="font-serif text-2xl text-brand-charcoal mb-8">Send an Inquiry</h2>
            {success ? (
              <div className="bg-green-50 text-green-800 p-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 mb-4 text-green-500" />
                <h3 className="font-serif text-2xl mb-2">Thank You</h3>
                <p className="font-light">Your inquiry has been received. Our team will get back to you shortly.</p>
                <button 
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ firstName: '', lastName: '', email: '', interest: 'catalog', message: '' });
                  }}
                  className="mt-8 text-sm uppercase tracking-widest text-brand-charcoal border-b border-brand-charcoal pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-brand-charcoal/70">First Name</label>
                    <input type="text" id="firstName" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Last Name</label>
                    <input type="text" id="lastName" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Email Address</label>
                  <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="interest" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Area of Interest</label>
                  <select id="interest" required value={formData.interest} onChange={(e) => setFormData({...formData, interest: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors text-brand-charcoal">
                    <option value="catalog">A specific design from the catalog</option>
                    <option value="custom">Custom bespoke piece</option>
                    <option value="collaboration">Interior design collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest text-brand-charcoal/70">Message</label>
                  <textarea id="message" rows={4} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors resize-none"></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-brand-charcoal text-brand-ivory py-4 text-sm font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-4 disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
