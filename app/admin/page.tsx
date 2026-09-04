'use client';

import { useAuth } from '@/lib/AuthProvider';
import { useState } from 'react';
import InquiriesManager from '@/components/admin/InquiriesManager';
import CatalogManager from '@/components/admin/CatalogManager';
import { LogIn, LayoutDashboard, MessageSquare, PackageSearch, LogOut } from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, loading, signInWithGoogle, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'catalog'>('inquiries');

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-brand-beige">
        <div className="w-8 h-8 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-brand-beige px-6">
        <div className="bg-brand-ivory p-12 max-w-md w-full shadow-sm text-center">
          <LayoutDashboard className="w-12 h-12 text-brand-gold mx-auto mb-6" />
          <h1 className="font-serif text-2xl text-brand-charcoal mb-4">Admin Dashboard</h1>
          <p className="text-brand-charcoal/70 mb-8 font-light leading-relaxed">
            Please sign in with an authorized admin account to access the dashboard.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-brand-charcoal text-brand-ivory py-4 text-sm font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-beige px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-2">Dashboard</h1>
            <p className="text-brand-charcoal/70 font-light">Welcome back, {user.displayName || 'Admin'}.</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-brand-charcoal/10 mb-8 hide-scrollbar">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 py-4 px-6 text-sm uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'text-brand-charcoal border-b-2 border-brand-charcoal font-medium'
                : 'text-brand-charcoal/50 hover:text-brand-charcoal/80'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Inquiries
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 py-4 px-6 text-sm uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'text-brand-charcoal border-b-2 border-brand-charcoal font-medium'
                : 'text-brand-charcoal/50 hover:text-brand-charcoal/80'
            }`}
          >
            <PackageSearch className="w-4 h-4" />
            Catalog Management
          </button>
        </div>

        {/* Content */}
        <div className="bg-brand-ivory p-6 md:p-8 shadow-sm">
          {activeTab === 'inquiries' ? <InquiriesManager /> : <CatalogManager />}
        </div>
      </div>
    </div>
  );
}
