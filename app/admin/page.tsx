'use client';

import { useAuth } from '@/lib/AuthProvider';
import { useState } from 'react';
import SubmissionsManager from '@/components/admin/SubmissionsManager';
import ProductsManager from '@/components/admin/ProductsManager';
import CategoriesManager from '@/components/admin/CategoriesManager';
import CataloguePdfManager from '@/components/admin/CataloguePdfManager';
import {
  LogIn,
  LayoutDashboard,
  MessageSquare,
  PackageSearch,
  Layers,
  FileText,
  LogOut,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, loading, authError, authErrorCode, signInWithGoogle, signOut, clearAuthError } = useAuth();
  const [activeTab, setActiveTab] = useState<'submissions' | 'products' | 'categories' | 'catalogue'>('submissions');
  const [copied, setCopied] = useState(false);
  
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyHost = () => {
    const hostToCopy = currentHost || (typeof window !== 'undefined' ? window.location.hostname : '');
    if (hostToCopy) {
      navigator.clipboard.writeText(hostToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-brand-beige">
        <div className="w-8 h-8 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    const isUnauthorizedDomain =
      authErrorCode === 'auth/unauthorized-domain' ||
      authError?.includes('auth/unauthorized-domain');

    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-brand-beige px-6">
        <div className="bg-brand-ivory p-8 md:p-12 max-w-lg w-full shadow-sm text-center border border-brand-charcoal/10">
          <LayoutDashboard className="w-12 h-12 text-brand-gold mx-auto mb-6" />
          <h1 className="font-serif text-2xl text-brand-charcoal mb-3">Admin Dashboard</h1>
          <p className="text-brand-charcoal/70 mb-8 font-light text-sm leading-relaxed">
            Please sign in with your authorized administrator Google account to access the CMS and submissions.
          </p>

          {isUnauthorizedDomain && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 rounded-xs space-y-3">
              <div className="flex items-start gap-2.5 font-medium text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Firebase Action Required: Add Authorized Domain</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Firebase Authentication has blocked sign-in because this Cloud Run domain is not yet on your Firebase project&apos;s allowed domains list.
              </p>
              
              <div className="bg-white/80 p-2.5 border border-amber-200/80 rounded flex items-center justify-between gap-2">
                <code className="font-mono text-[11px] text-amber-950 break-all select-all">
                  {currentHost || 'ais-dev-...run.app'}
                </code>
                <button
                  type="button"
                  onClick={handleCopyHost}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium rounded transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="space-y-1.5 pt-1 text-amber-900">
                <p className="font-medium text-[11px] uppercase tracking-wider">Quick 3-step fix:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-amber-800">
                  <li>Click the Firebase Settings link below</li>
                  <li>Under <strong>Authorized domains</strong>, click <strong>Add domain</strong></li>
                  <li>Paste <strong className="font-mono">{currentHost}</strong> and click <strong>Save</strong></li>
                </ol>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://console.firebase.google.com/project/cool-continuity-79brs/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-900 text-white text-[11px] font-medium tracking-wider uppercase hover:bg-amber-800 transition-colors rounded-xs"
                >
                  <span>Open Firebase Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={clearAuthError}
                  className="px-3 py-2 text-amber-800 hover:text-amber-950 text-[11px] uppercase tracking-wider font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {authError && !isUnauthorizedDomain && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-left text-xs text-red-900 rounded-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-950 mb-0.5">Authentication Error</p>
                <p className="text-red-800">{authError}</p>
              </div>
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            className="w-full bg-brand-charcoal text-brand-ivory py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Signed in, but email is not an authorized administrator
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-brand-beige px-6">
        <div className="bg-brand-ivory p-8 md:p-12 max-w-md w-full shadow-sm text-center border border-brand-charcoal/10">
          <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto mb-6" />
          <h1 className="font-serif text-2xl text-brand-charcoal mb-3">Access Restricted</h1>
          <p className="text-brand-charcoal/70 mb-2 font-light text-sm">
            Signed in as <span className="font-medium text-brand-charcoal">{user.email}</span>
          </p>
          <p className="text-brand-charcoal/60 mb-8 font-light text-xs leading-relaxed">
            This account does not have administrator privileges. Please sign out and sign in using the authorized administrator account.
          </p>
          <button
            onClick={signOut}
            className="w-full bg-brand-charcoal text-brand-ivory py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out / Switch Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-beige px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-1">Admin Dashboard & CMS</h1>
            <p className="text-brand-charcoal/70 font-light text-xs">
              Logged in as <span className="font-medium text-brand-charcoal">{user.email}</span>
            </p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-charcoal/70 hover:text-brand-charcoal transition-colors self-start md:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-brand-charcoal/10 mb-8 hide-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 py-3 px-5 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'text-brand-charcoal border-b-2 border-brand-charcoal font-medium'
                : 'text-brand-charcoal/50 hover:text-brand-charcoal/80'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            User Submissions
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-5 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-brand-charcoal border-b-2 border-brand-charcoal font-medium'
                : 'text-brand-charcoal/50 hover:text-brand-charcoal/80'
            }`}
          >
            <PackageSearch className="w-4 h-4" />
            Products & Collections
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 py-3 px-5 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'categories'
                ? 'text-brand-charcoal border-b-2 border-brand-charcoal font-medium'
                : 'text-brand-charcoal/50 hover:text-brand-charcoal/80'
            }`}
          >
            <Layers className="w-4 h-4" />
            Categories
          </button>

          <button
            onClick={() => setActiveTab('catalogue')}
            className={`flex items-center gap-2 py-3 px-5 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'catalogue'
                ? 'text-brand-charcoal border-b-2 border-brand-charcoal font-medium'
                : 'text-brand-charcoal/50 hover:text-brand-charcoal/80'
            }`}
          >
            <FileText className="w-4 h-4" />
            Catalogue PDF
          </button>
        </div>

        {/* Tab Panels */}
        <div className="bg-brand-ivory p-6 md:p-8 shadow-xs border border-brand-charcoal/10">
          {activeTab === 'submissions' && <SubmissionsManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'catalogue' && <CataloguePdfManager />}
        </div>
      </div>
    </div>
  );
}
