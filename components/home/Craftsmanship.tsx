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
    <section className="py-12 lg:py-14 bg-brand-ivory text-brand-charcoal overflow-hidden">
      {/* CHANGED: max-w-7xl mx-auto px-6 lg:px-12 -> site-container (point 2) */}
      <div className="site-container relative z-10">

        {/* Header */}
        {/* CHANGED: mb-16 -> mb-8 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(1.1rem,1.8vw,2rem)] tracking-[0.2em] font-light uppercase"
          >
            Designer behind -
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(1.1rem,2.2vw,2.6rem)] tracking-[0.3em] font-light uppercase"
          >
            The vision
          </motion.h2>
        </div>

        {/*
          CHANGED: grid-cols-2 -> grid-cols-[minmax(0,26vw)_1fr]

          This was the dead-space bug in your 2160px screenshot. With plain
          grid-cols-2 both columns are equal width (~1170px each at that
          size), but the photo inside column 1 was capped in pixels and
          left-aligned, so several hundred px of column 1 sat empty before
          the text column even began.

          Sizing the photo column as a PERCENTAGE of the viewport (26vw)
          means the column is always exactly as wide as the photo wants to
          be, at every screen size - the text starts immediately after the
          image, and the whole pairing keeps the same proportion as the
          design preview whether the screen is 1280px or 3840px.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,26vw)_1fr] gap-10 lg:gap-14">

          {/* Left: Image & Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-5 min-w-0"
          >
            {/* No pixel max-width: the image simply fills its column, which is itself 26vw. */}
            <div className="relative aspect-[3/4] w-full bg-brand-beige">
              <Image
                src="/FOUNDER PAGE-20260912T062035Z-1-001/FOUNDER PAGE/IMG_2012.PNG"
                alt="Rutu V. Patel - Founder"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>
            <div className="w-full text-center lg:text-left">
              <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-1">
                RUTU V. PATEL
              </h3>
              <p className="text-sm font-semibold tracking-widest mt-2">B.ARCH | M.DES</p>
            </div>
          </motion.div>

          {/* Right: Text */}
          {/*
            justify-center removed: with it, the four paragraphs were
            vertically centred against the tall photo column, which is what
            pushed the text down into the middle and left blank space above
            it in your screenshot. justify-start makes the text start level
            with the top of the photo, as in the design preview.
          */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-start gap-5 text-brand-charcoal/80 text-sm leading-relaxed font-light min-w-0"
          >
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}
