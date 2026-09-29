import type { Metadata } from 'next';
import { Montserrat, Quicksand } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';
import { SiteShell } from '@/components/layout/SiteShell';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Houseofkarvi | Furniture Design Studio',
  description: 'Discover unparalleled craftsmanship and minimalist Japandi design with Houseofkarvi.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Houseofkarvi | Furniture Design Studio',
    description: 'Discover unparalleled craftsmanship and minimalist Japandi design with Houseofkarvi.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Houseofkarvi | Furniture Design Studio',
    description: 'Discover unparalleled craftsmanship and minimalist Japandi design with Houseofkarvi.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${quicksand.variable}`}>
      <body className="antialiased font-sans bg-background text-foreground" suppressHydrationWarning>
        <ClientProviders>
          <SiteShell>
            {children}
          </SiteShell>
        </ClientProviders>
      </body>
    </html>
  );
}
