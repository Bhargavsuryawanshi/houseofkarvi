'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function Craftsmanship() {
  return (
    /*
      CHANGED: py-24 lg:py-32 -> py-12 lg:py-14 (point 3, see Story.tsx:
      this section's TOP padding was stacking with Story's BOTTOM padding
      to create the big blank band between the two sections).
    */
    <section className="py-12 lg:py-[4.5vw] bg-brand-ivory text-brand-charcoal overflow-hidden">
      {/* CHANGED: max-w-7xl mx-auto px-6 lg:px-12 -> site-container (point 2) */}
      <div className="site-container relative z-10">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-[3.2vw]">

          {/* Left: Image & Name */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex min-w-0 flex-col"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[2.25vw] tracking-[0.2em] font-light uppercase"
            >
              Designer behind -
            </motion.h2>
            <div className="mt-8 flex flex-1 min-h-0 items-end gap-4 lg:mt-[2.5vw] lg:gap-[1.25vw]">
              <div className="relative aspect-[3/4] w-full bg-brand-beige lg:aspect-[2/3] lg:w-[58%] lg:shrink-0">
                <Image
                  src="/FOUNDER PAGE-20260912T062035Z-1-001/FOUNDER PAGE/IMG_2012.PNG"
                  alt="Rutu V. Patel - Founder"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="font-serif text-[2.5vw] font-bold mb-[0.25vw] leading-none">
                  <span className="lg:whitespace-nowrap">RUTU V.</span>
                  <span className="lg:block">PATEL</span>
                </h3>
                <p className="text-[0.9vw] font-semibold tracking-widest mt-[0.5vw]">B.ARCH | M.DES</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex min-w-0 flex-col"
          >
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-right text-[2.25vw] tracking-[0.2em] font-light uppercase"
            >
              The vision
            </motion.h2>
            <div className="mt-8 flex flex-col gap-5 text-brand-charcoal/80 text-[1vw] leading-relaxed font-light lg:mt-[2.5vw] lg:flex-1 lg:justify-between lg:gap-[1.5vw]">
              <p>
                House of Karvi was founded by Rutu V. Patel with a clear vision&mdash;to reimagine Indian craftsmanship for contemporary living. Built on the belief that exceptional furniture is created through the harmony of design, material, and skilled craftsmanship, the brand brings together timeless artisanal traditions with a refined, modern design language.
              </p>
              <p>
                With a background that bridges architecture and furniture design, along with valuable experience at a renowned furniture design studio and workshop, Rutu developed a deep understanding of the complete journey of furniture making&mdash;from concept and proportion to material exploration, prototyping, and production. This holistic approach became the foundation of House of Karvi, where every collection is shaped by clarity of purpose, technical precision, and a lasting respect for craftsmanship.
              </p>
              <p>
                Rather than following seasonal trends, House of Karvi is driven by enduring design principles. Each piece is conceived to offer visual balance, functional intelligence, and lasting relevance, allowing it to integrate effortlessly into contemporary residences, hospitality environments, and commercial spaces across diverse cultures and contexts.
              </p>
              <p>
                The brand&apos;s identity lies in its ability to unite the authenticity of handcrafted making with the consistency of modern manufacturing. Every product reflects a careful dialogue between artisans, designers, and materials, resulting in furniture distinguished by refined proportions, honest construction, and meticulous detailing. This commitment extends beyond aesthetics, ensuring durability, comfort, and a lasting connection between the object and the space it inhabits.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
