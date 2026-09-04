'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function Craftsmanship() {
  return (
    <section className="py-24 lg:py-32 bg-brand-charcoal text-brand-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-serif text-4xl lg:text-5xl leading-tight mb-8">
              Sourced from nature, crafted for generations.
            </h2>
            <div className="space-y-6 text-brand-ivory/70 text-lg font-light">
              <p>
                We believe that the best furniture is built to outlast trends. Our materials are ethically sourced from sustainable forests, focusing on natural walnut, solid oak, and breathable linen.
              </p>
              <p>
                Every joint is precision-cut, and every surface is hand-finished by master artisans who have dedicated their lives to the art of furniture making.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 h-[600px]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full h-full rounded-tl-full overflow-hidden"
            >
              <Image
                src="/products/IMG-20260818-WA0004.jpg"
                alt="Wood texture detail"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative w-full h-full rounded-br-full overflow-hidden mt-12"
            >
              <Image
                src="/products/IMG-20260818-WA0011.jpg"
                alt="Craftsmanship detail"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
