'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const heroImages = [
  '/hero/IMG-20260818-WA0005.jpg',
  '/hero/IMG-20260818-WA0007.jpg',
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-brand-charcoal">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image 
              src={heroImages[currentImage]}
              alt="Minimalist luxury living room"
              fill
              className="object-cover opacity-70 object-center"
              priority
              referrerPolicy="no-referrer"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
        {/* Subtle gradient overlay for text readability - deepened at the top for the navbar */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/60"></div>
      </div>

      {/* Added pt-24 to push the content down slightly, avoiding overlap with the transparent navbar */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto flex flex-col items-center pt-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-brand-beige/80 tracking-[0.2em] uppercase text-sm font-medium mb-6"
        >
          A New Era of Living
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 text-balance"
        >
          Form meets function in perfect harmony.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link 
            href="/catalog" 
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-ivory text-brand-charcoal text-sm font-medium tracking-widest uppercase hover:bg-brand-gold hover:text-white transition-all duration-300"
          >
            View Catalog
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
