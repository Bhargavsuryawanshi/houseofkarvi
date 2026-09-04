'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Mail, Check, Archive, Trash2, Clock } from 'lucide-react';

interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: any;
  updatedAt: any;
}

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Inquiry[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Inquiry);
      });
      setInquiries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'inquiries');
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: 'new' | 'read' | 'replied' | 'archived') => {
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading inquiries...</div>;
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12 text-brand-charcoal/50">
        <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No inquiries found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-brand-charcoal">Customer Inquiries</h2>
      </div>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="border border-brand-charcoal/10 p-6 flex flex-col md:flex-row gap-6 hover:border-brand-charcoal/30 transition-colors">
            
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-brand-charcoal text-lg">{inquiry.customerName}</h3>
                  <a href={`mailto:${inquiry.customerEmail}`} className="text-sm text-brand-gold hover:underline">
                    {inquiry.customerEmail}
                  </a>
                </div>
                <span className={`text-xs uppercase tracking-widest px-3 py-1 font-medium flex items-center gap-1 ${
                  inquiry.status === 'new' ? 'bg-brand-charcoal text-brand-ivory' :
                  inquiry.status === 'read' ? 'bg-brand-gold/10 text-brand-gold' :
                  inquiry.status === 'replied' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {inquiry.status === 'new' && <Clock className="w-3 h-3" />}
                  {inquiry.status === 'read' && <Mail className="w-3 h-3" />}
                  {inquiry.status === 'replied' && <Check className="w-3 h-3" />}
                  {inquiry.status === 'archived' && <Archive className="w-3 h-3" />}
                  {inquiry.status}
                </span>
              </div>
              
              <div className="bg-brand-beige p-4 text-brand-charcoal/80 font-light text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </div>
              
              <div className="text-xs text-brand-charcoal/50">
                Received: {inquiry.createdAt?.toDate().toLocaleString()}
              </div>
            </div>

            <div className="flex md:flex-col gap-2 justify-start md:border-l md:border-brand-charcoal/10 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-brand-charcoal/10">
              {inquiry.status === 'new' && (
                <button onClick={() => updateStatus(inquiry.id, 'read')} className="text-xs uppercase tracking-widest text-brand-charcoal border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory py-2 px-4 transition-colors w-full text-center">
                  Mark Read
                </button>
              )}
              {inquiry.status !== 'replied' && (
                <button onClick={() => updateStatus(inquiry.id, 'replied')} className="text-xs uppercase tracking-widest text-brand-charcoal border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory py-2 px-4 transition-colors w-full text-center">
                  Mark Replied
                </button>
              )}
              {inquiry.status !== 'archived' && (
                <button onClick={() => updateStatus(inquiry.id, 'archived')} className="text-xs uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-charcoal py-2 px-4 transition-colors w-full text-center">
                  Archive
                </button>
              )}
              <button onClick={() => deleteInquiry(inquiry.id)} className="text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 py-2 px-4 transition-colors w-full text-center flex items-center justify-center gap-2 mt-auto">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
