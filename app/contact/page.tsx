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
    <div className="min-h-screen pt-28 sm:pt-36 pb-20 px-6 lg:px-12 bg-brand-ivory">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-gap-xl)' }}>
          
          {/* Information Section */}
          <div>
            <h1 className="font-serif text-brand-charcoal" style={{ fontSize: 'var(--fs-heading)', marginBottom: 'var(--space-gap-md)' }}>Let&apos;s bring your vision to life.</h1>
            <p className="text-brand-charcoal/70 leading-relaxed font-light" style={{ fontSize: 'var(--fs-body)', marginBottom: 'var(--space-gap-lg)' }}>
              Every piece at House of Karvi is thoughtfully developed to balance aesthetics, comfort, and practicality. Whether inquiring about a piece from our collection or planning a bespoke commission, we invite you to connect.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="uppercase tracking-widest text-brand-gold font-medium mb-1.5" style={{ fontSize: 'var(--fs-eyebrow)' }}>Studio & Location</h3>
                <p className="text-lg font-serif text-brand-charcoal">Kalol, Gandhinagar</p>
                <p className="text-sm font-light text-brand-charcoal/70 mt-1">Visit by appointment only.</p>
              </div>
              
              <div>
                <h3 className="uppercase tracking-widest text-brand-gold font-medium mb-1.5" style={{ fontSize: 'var(--fs-eyebrow)' }}>Direct Inquiries</h3>
                <p className="text-base font-medium text-brand-charcoal">
                  <a href="tel:+919879866629" className="hover:text-brand-gold transition-colors">+91 98798 66629</a>
                </p>
                <p className="text-base font-light text-brand-charcoal/80 mt-1">
                  <a href="mailto:houseofkarvi.dw@gmail.com" className="hover:text-brand-gold transition-colors">houseofkarvi.dw@gmail.com</a>
                </p>
              </div>

              <div>
                <h3 className="uppercase tracking-widest text-brand-gold font-medium mb-1.5" style={{ fontSize: 'var(--fs-eyebrow)' }}>Founder & Principal</h3>
                <p className="text-base font-serif font-bold text-brand-charcoal">Rutu V. Patel</p>
                <p className="text-xs tracking-widest font-sans font-semibold text-brand-charcoal/60 mt-0.5">B.ARCH | M.DES</p>
              </div>

              <div className="pt-2">
                <a 
                  href="https://wa.me/919879866629" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#20ba5a] transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-brand-beige p-8 md:p-12 shadow-sm">
            <h2 className="font-serif text-brand-charcoal" style={{ fontSize: 'var(--fs-label-xl)', marginBottom: 'var(--space-gap-lg)' }}>Send an Inquiry</h2>
            {success ? (
              <div className="bg-green-50 text-green-800 p-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 mb-4 text-green-500" />
                <h3 className="font-serif mb-2" style={{ fontSize: 'var(--fs-label-xl)' }}>Thank You</h3>
                <p className="font-light">Your inquiry has been received. Our team will get back to you shortly.</p>
                <button 
                  style={{ fontSize: 'var(--fs-eyebrow)' }}
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
                    <label htmlFor="firstName" className="uppercase tracking-widest text-brand-charcoal/70" style={{ fontSize: 'var(--fs-eyebrow)' }}>First Name</label>
                    <input type="text" id="firstName" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="uppercase tracking-widest text-brand-charcoal/70" style={{ fontSize: 'var(--fs-eyebrow)' }}>Last Name</label>
                    <input type="text" id="lastName" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="uppercase tracking-widest text-brand-charcoal/70" style={{ fontSize: 'var(--fs-eyebrow)' }}>Email Address</label>
                  <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="interest" className="uppercase tracking-widest text-brand-charcoal/70" style={{ fontSize: 'var(--fs-eyebrow)' }}>Area of Interest</label>
                  <select id="interest" required value={formData.interest} onChange={(e) => setFormData({...formData, interest: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors text-brand-charcoal">
                    <option value="catalog">A specific design from the catalog</option>
                    <option value="custom">Custom bespoke piece</option>
                    <option value="collaboration">Interior design collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="uppercase tracking-widest text-brand-charcoal/70" style={{ fontSize: 'var(--fs-eyebrow)' }}>Message</label>
                  <textarea id="message" rows={4} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-transparent border-b border-brand-charcoal/20 py-3 focus:outline-none focus:border-brand-charcoal transition-colors resize-none"></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brand-charcoal text-brand-ivory py-4 font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-4 disabled:opacity-50" style={{ fontSize: 'var(--fs-eyebrow)' }}>
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
