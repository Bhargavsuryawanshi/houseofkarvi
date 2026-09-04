'use client';

import { AuthProvider } from '@/lib/AuthProvider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
