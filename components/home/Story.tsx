'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function Story() {
  return (
    <section className="py-24 lg:py-40 px-6 lg:px-12 bg-brand-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] w-full w-full max-w-md mx-auto lg:max-w-none"
          >
            <Image 
              src="/products/IMG-20260818-WA0003.jpg"
              alt="Japandi design aesthetic"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              unoptimized
            />
            {/* Decorative block */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-beige -z-10 hidden md:block"></div>
          </motion.div>
        </div>

        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-brand-gold font-medium tracking-[0.2em] uppercase text-xs mb-6">
              Our Philosophy
            </h2>
            <h3 className="font-serif text-4xl lg:text-5xl text-brand-charcoal leading-[1.1] mb-8 text-balance">
              Editorial storytelling through design.
            </h3>
            <p className="text-brand-charcoal/70 text-lg leading-relaxed font-light mb-10 max-w-lg">
              Houseofkarvi embraces the minimalist essence of Japandi architecture—blending Scandinavian functionality with Japanese rustic elegance. Every piece we craft is a testament to unparalleled craftsmanship and sustainable materials.
            </p>
            
            <button className="text-brand-charcoal border-b border-brand-charcoal pb-1 uppercase tracking-widest text-sm font-medium hover:text-brand-gold hover:border-brand-gold transition-colors">
              Discover Our Story
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
