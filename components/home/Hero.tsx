'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

const heroImages = [
  '/PAGE_ONE_OF_FRONT_PAGE/.PNG/4.svg',
  '/PAGE_ONE_OF_FRONT_PAGE/.PNG/5.svg',
  '/PAGE_ONE_OF_FRONT_PAGE/.PNG/6.svg',
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
              className="object-cover object-center"
              priority
              referrerPolicy="no-referrer"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
        {/* Subtle gradient to ensure navbar is visible at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent"></div>
      </div>

    </section>
  );
}
