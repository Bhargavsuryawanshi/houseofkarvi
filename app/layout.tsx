import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ClientProviders } from '@/components/ClientProviders';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500'],
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
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans bg-background text-foreground" suppressHydrationWarning>
        <ThemeSwitcher />
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
