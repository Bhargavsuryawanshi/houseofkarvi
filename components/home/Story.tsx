'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function Story() {
  return (
    /*
      CHANGED: py-24 lg:py-32 px-6 lg:px-16  ->  py-12 lg:py-14 + site-container
      Point 3 (huge gaps between sections): this section's BOTTOM padding
      stacked with Craftsmanship's TOP padding. py-24 + py-32 meant up to
      128px + 128px = 256px of dead space between them, and with the new
      root scaling that would have grown even larger on big screens.
      Halving both sides gives a normal, natural section-to-section flow.
      These are rem values, so they now scale with the viewport too.
    */
    <section className="py-12 lg:py-14 bg-white overflow-hidden">
      {/* CHANGED: max-w-[1400px] mx-auto -> site-container (no pixel cap; see globals.css) */}
      <div className="site-container flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-0">

        {/* Left Side */}
        <div className="w-full min-w-0 flex gap-4 lg:w-[40%]">
          <div className="min-w-0 flex-1 flex flex-col gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/20260905_063905000_iOS.jpg"
                  alt="Shell"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase font-medium text-left text-brand-charcoal/60">SHELL</p>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/20260905_070222000_iOS.jpg"
                  alt="Scrawny"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase font-medium text-left text-brand-charcoal/60">SCRAWNY</p>
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/20260901_070301000_iOS.jpg"
                  alt="Bandhu"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase font-medium text-left text-brand-charcoal/60">BANDHU</p>
            </div>  
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full min-w-0 flex flex-col lg:w-[40%]">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-charcoal text-[clamp(1.35rem,2.7vw,3.2rem)] leading-[1.15] tracking-[0.08em] lg:tracking-[0.12em] font-light mb-6 text-left uppercase lg:mt-2 lg:mb-0 lg:whitespace-nowrap"
          >
            Beyond the limits.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-brand-charcoal/70 text-base leading-relaxed font-light max-w-[60ch] text-left lg:mt-auto lg:mb-6"
          >
            Our designs draw attention from contemporary architecture, natural materials, and the rhythms of everyday life. Each collection is thoughtfully developed to balance aesthetics, comfort, and practicality, creating furniture that feels timeless in every setting.
          </motion.p>
          <div className="flex gap-4 mt-8 lg:mt-0">
            <div className="min-w-0 flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/hok 004.jpg"
                  alt="Kashi"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase font-medium text-left text-brand-charcoal/60">KASHI</p>
            </div>

            <div className="min-w-0 flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/00012.png"
                  alt="Ovate"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase font-medium text-left text-brand-charcoal/60">OVATE</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
