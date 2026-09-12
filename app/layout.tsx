import type { Metadata } from 'next';
import { Montserrat, Quicksand } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ClientProviders } from '@/components/ClientProviders';

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
  title: 'Houseofkarvi | Premium Luxury Furniture',
  description: 'Discover unparalleled craftsmanship and minimalist Japandi design with Houseofkarvi.',
  openGraph: {
    title: 'Houseofkarvi | Premium Luxury Furniture',
    description: 'Discover unparalleled craftsmanship and minimalist Japandi design with Houseofkarvi.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Houseofkarvi | Premium Luxury Furniture',
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
          <SmoothScroll>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </ClientProviders>
      </body>
    </html>
  );
}