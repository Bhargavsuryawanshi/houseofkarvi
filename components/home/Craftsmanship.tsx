'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function Craftsmanship() {
  return (
    <section className="py-24 lg:py-32 bg-brand-ivory text-brand-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(1.1rem,2vw,1.5rem)] tracking-[0.2em] font-light uppercase"
          >
            Designer behind -
          </motion.h2>
          <motion.h2 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(1.1rem,2.5vw,2rem)] tracking-[0.3em] font-light uppercase"
          >
            The vision
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Image & Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 min-w-0"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 bg-brand-beige">
              <Image
                src="/FOUNDER PAGE-20260912T062035Z-1-001/FOUNDER PAGE/IMG_2012.PNG"
                alt="Rutu V. Patel - Founder"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>
            <div className="max-w-md mx-auto lg:mx-0 w-full text-center lg:text-left">
              <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-1">
                RUTU V. PATEL
              </h3>
              <p className="text-sm font-semibold tracking-widest mt-2">B.ARCH | M.DES</p>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center gap-6 text-brand-charcoal/80 text-sm leading-relaxed font-light min-w-0"
          >
            <p>
              House of Karvi was founded by Rutu V. Patel with a clear vision—to reimagine Indian craftsmanship for contemporary living. Built on the belief that exceptional furniture is created through the harmony of design, material, and skilled craftsmanship, the brand brings together timeless artisanal traditions with a refined, modern design language.
            </p>
            <p>
              With a background that bridges architecture and furniture design, along with valuable experience at a renowned furniture design studio and workshop, Rutu developed a deep understanding of the complete journey of furniture making—from concept and proportion to material exploration, prototyping, and production. This holistic approach became the foundation of House of Karvi, where every collection is shaped by clarity of purpose, technical precision, and a lasting respect for craftsmanship.
            </p>
            <p>
              Rather than following seasonal trends, House of Karvi is driven by enduring design principles. Each piece is conceived to offer visual balance, functional intelligence, and lasting relevance, allowing it to integrate effortlessly into contemporary residences, hospitality environments, and commercial spaces across diverse cultures and contexts.
            </p>
            <p>
              The brand&apos;s identity lies in its ability to unite the authenticity of handcrafted making with the consistency of modern manufacturing. Every product reflects a careful dialogue between artisans, designers, and materials, resulting in furniture distinguished by refined proportions, honest construction, and meticulous detailing. This commitment extends beyond aesthetics, ensuring durability, comfort, and a lasting connection between the object and the space it inhabits.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}