'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Mail, FileText, Check, Archive, Trash2, Clock, Search, ExternalLink } from 'lucide-react';

interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: any;
  updatedAt: any;
}

interface CatalogRequest {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  status: 'new' | 'downloaded' | 'contacted';
  createdAt: any;
}

export default function SubmissionsManager() {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'inquiries'>('catalog');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [catalogRequests, setCatalogRequests] = useState<CatalogRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to Inquiries
  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Inquiry[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Inquiry);
        });
        setInquiries(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to Catalog Requests
  useEffect(() => {
    const q = query(collection(db, 'catalog_requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: CatalogRequest[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as CatalogRequest);
        });
        setCatalogRequests(data);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'catalog_requests');
      }
    );

    return () => unsubscribe();
  }, []);

  // Handlers for Inquiries
  const updateInquiryStatus = async (id: string, status: 'new' | 'read' | 'replied' | 'archived') => {
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
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  // Handlers for Catalog Requests
  const updateCatalogStatus = async (id: string, status: 'new' | 'downloaded' | 'contacted') => {
    try {
      await updateDoc(doc(db, 'catalog_requests', id), {
        status,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `catalog_requests/${id}`);
    }
  };

  const deleteCatalogRequest = async (id: string) => {
    if (!window.confirm('Delete this catalog request record?')) return;
    try {
      await deleteDoc(doc(db, 'catalog_requests', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `catalog_requests/${id}`);
    }
  };

  // Filters
  const filteredCatalogRequests = catalogRequests.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.company?.toLowerCase().includes(q)
    );
  });

  const filteredInquiries = inquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.customerName?.toLowerCase().includes(q) ||
      item.customerEmail?.toLowerCase().includes(q) ||
      item.message?.toLowerCase().includes(q)
    );
  });

  const newCatalogCount = catalogRequests.filter((r) => r.status === 'new').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-brand-charcoal">User Submissions</h2>
          <p className="text-xs text-brand-charcoal/60 mt-1">Review enquiries and exclusive catalog requests</p>
        </div>

        {/* Sub-tabs */}
        <div className="flex bg-brand-beige/50 p-1 border border-brand-charcoal/10 self-start">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'catalog'
                ? 'bg-brand-charcoal text-brand-ivory font-medium shadow-xs'
                : 'text-brand-charcoal/70 hover:text-brand-charcoal'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Catalog Requests ({catalogRequests.length})
            {newCatalogCount > 0 && (
              <span className="bg-brand-gold text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {newCatalogCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'inquiries'
                ? 'bg-brand-charcoal text-brand-ivory font-medium shadow-xs'
                : 'text-brand-charcoal/70 hover:text-brand-charcoal'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Reach Us Inquiries ({inquiries.length})
            {newInquiriesCount > 0 && (
              <span className="bg-brand-gold text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {newInquiriesCount} new
              </span>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-6 text-center text-xs text-brand-charcoal/50 animate-pulse border border-brand-charcoal/10">
          Syncing submissions with database...
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeSubTab === 'catalog' ? 'catalog requests' : 'inquiries'} by name, email, or content...`}
          className="w-full bg-brand-beige/30 border border-brand-charcoal/15 pl-9 pr-4 py-2.5 text-xs text-brand-charcoal placeholder:text-brand-charcoal/40 focus:outline-none focus:border-brand-charcoal"
        />
      </div>

      {/* Content */}
      {activeSubTab === 'catalog' ? (
        <div>
          {filteredCatalogRequests.length === 0 ? (
            <div className="text-center py-16 text-brand-charcoal/50 border border-brand-charcoal/10">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No catalog requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-brand-charcoal/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-beige/60 text-brand-charcoal/70 uppercase tracking-widest border-b border-brand-charcoal/10">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-charcoal/10">
                  {filteredCatalogRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-brand-beige/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-brand-charcoal">
                        {req.fullName}
                      </td>
                      <td className="py-3 px-4">
                        <a href={`mailto:${req.email}`} className="text-brand-gold hover:underline flex items-center gap-1">
                          {req.email} <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-brand-charcoal/70">
                        {req.company || '—'}
                      </td>
                      <td className="py-3 px-4 text-brand-charcoal/50">
                        {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={req.status}
                          onChange={(e) => updateCatalogStatus(req.id, e.target.value as any)}
                          className={`text-[11px] uppercase tracking-wider px-2 py-1 border rounded-xs ${
                            req.status === 'new'
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : req.status === 'downloaded'
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : 'bg-green-50 border-green-300 text-green-800'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="downloaded">Downloaded</option>
                          <option value="contacted">Contacted</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteCatalogRequest(req.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-16 text-brand-charcoal/50 border border-brand-charcoal/10">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No customer inquiries found.</p>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="border border-brand-charcoal/10 p-5 flex flex-col md:flex-row gap-5 hover:border-brand-charcoal/30 transition-colors bg-brand-ivory"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-brand-charcoal text-base">{inquiry.customerName}</h3>
                      <a href={`mailto:${inquiry.customerEmail}`} className="text-xs text-brand-gold hover:underline flex items-center gap-1 mt-0.5">
                        {inquiry.customerEmail} <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                    <span
                      className={`text-[11px] uppercase tracking-widest px-2.5 py-1 font-medium flex items-center gap-1 ${
                        inquiry.status === 'new'
                          ? 'bg-brand-charcoal text-brand-ivory'
                          : inquiry.status === 'read'
                          ? 'bg-brand-gold/15 text-brand-gold'
                          : inquiry.status === 'replied'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {inquiry.status === 'new' && <Clock className="w-3 h-3" />}
                      {inquiry.status === 'read' && <Mail className="w-3 h-3" />}
                      {inquiry.status === 'replied' && <Check className="w-3 h-3" />}
                      {inquiry.status === 'archived' && <Archive className="w-3 h-3" />}
                      {inquiry.status}
                    </span>
                  </div>

                  <div className="bg-brand-beige/40 p-3.5 text-brand-charcoal/80 font-light text-xs leading-relaxed whitespace-pre-wrap border-l-2 border-brand-gold">
                    {inquiry.message}
                  </div>

                  <div className="text-[11px] text-brand-charcoal/50">
                    Received: {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleString() : 'Recent'}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-start md:border-l md:border-brand-charcoal/10 md:pl-5 pt-3 md:pt-0 border-t md:border-t-0 border-brand-charcoal/10">
                  {inquiry.status === 'new' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                      className="text-[11px] uppercase tracking-widest text-brand-charcoal border border-brand-charcoal/30 hover:bg-brand-charcoal hover:text-brand-ivory py-1.5 px-3 transition-colors text-center"
                    >
                      Mark Read
                    </button>
                  )}
                  {inquiry.status !== 'replied' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'replied')}
                      className="text-[11px] uppercase tracking-widest text-brand-charcoal border border-brand-charcoal/30 hover:bg-brand-charcoal hover:text-brand-ivory py-1.5 px-3 transition-colors text-center"
                    >
                      Mark Replied
                    </button>
                  )}
                  {inquiry.status !== 'archived' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'archived')}
                      className="text-[11px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-charcoal py-1.5 px-3 transition-colors text-center"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50 py-1.5 px-3 transition-colors text-center flex items-center justify-center gap-1 mt-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
