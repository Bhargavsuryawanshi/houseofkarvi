'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Collection', href: '/#collection' },
  { name: 'Catalogue', href: '/catalog' },
  { name: 'Reach Us', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Is the current page the home page? (Home page has dark background at the top)
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine text and background colors based on scroll state and current page
  const navBackground = isScrolled 
    ? 'bg-brand-ivory/90 backdrop-blur-md border-b border-brand-charcoal/10 shadow-sm py-4' 
    : 'bg-transparent py-6';
    
  const textColor = (isScrolled || !isHome) ? 'text-brand-charcoal' : 'text-white';
  const logoSrc = (isScrolled || !isHome) ? '/HOK Logo_ Gray font.png' : '/HOK Logo_ White font.png';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navBackground}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Actions (Left side for balance, empty on desktop to push logo to center if desired, but we'll keep logo left) */}
          
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center group">
            <div className="relative h-10 sm:h-12 w-48 sm:w-56 overflow-visible">
               <Image 
                 src={logoSrc} 
                 alt="Houseofkarvi" 
                 fill 
                 className="object-contain object-left transition-all duration-500 origin-left scale-125 sm:scale-150"
                 priority
              />
            </div>
          </Link>

          {/* Desktop Nav - Aligned to right */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors relative group ${textColor} hover:text-brand-gold`}
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center relative z-50">
            <button 
              className={`${textColor} hover:text-brand-gold transition-colors`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-brand-ivory pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-8 text-center mt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-serif text-brand-charcoal hover:text-brand-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
