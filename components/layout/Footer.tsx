import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-ivory/80 pt-20 pb-10 px-6 lg:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-1">
          <Link href="/" className="block mb-6 relative h-17 w- opacity-150">
             <Image 
                src="/HOK Logo_ White font.png" 
                alt="Houseofkarvi" 
                fill 
                className="object-contain object-left brightness-0 invert" 
                priority
              />
          </Link>
          <p className="text-sm leading-relaxed max-w-sm mb-6">
            Elevating modern living through meticulous craftsmanship, sustainable materials, and minimalist Japandi design.
          </p>
        </div>

        <div>
          <h4 className="text-white font-serif text-lg mb-6">Explore</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/collections" className="hover:text-brand-gold transition-colors">Collections</Link></li>
            <li><Link href="/catalog" className="hover:text-brand-gold transition-colors">Download Catalog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-serif text-lg mb-6">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Inquiries</Link></li>
            <li><Link href="#" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-brand-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} houseofkarvi.in. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
