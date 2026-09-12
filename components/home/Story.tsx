'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function Story() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-16 lg:gap-24">
        
        {/* Left Side */}
        <div className="w-full xl:w-[45%] min-w-0 flex gap-8">
          <div className="w-1/2 min-w-0 flex flex-col gap-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image 
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/00012.png"
                  alt="Shell"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase text-brand-charcoal font-medium text-left text-brand-charcoal/60">SHELL</p>
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
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/hok 004.jpg"
                  alt="Scrawny"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase text-brand-charcoal font-medium text-left text-brand-charcoal/60">SCRAWNY</p>
            </div>
          </div>
          
          <div className="w-1/2 min-w-0 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full aspect-[3/4] relative bg-brand-ivory mb-3"
            >
              <Image 
                src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/20260901_070301000_iOS.jpg"
                alt="Bandhu"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </motion.div>
            <p className="text-sm tracking-wider uppercase text-brand-charcoal font-medium text-left text-brand-charcoal/60">BANDHU</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full xl:w-[55%] min-w-0 flex flex-col justify-between">
          
          <div className="mb-16 xl:mb-0 xl:mt-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-charcoal text-[clamp(1.75rem,4vw,3.8rem)] leading-tight tracking-[0.15em] lg:tracking-[0.2em] font-light mb-12 xl:mb-16 text-left uppercase"
            >
              Beyond the limits.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-brand-charcoal/70 text-lg leading-relaxed font-light max-w-2xl text-left"
            >
              Our designs draw attention from contemporary architecture, natural materials, and the rhythms of everyday life. Each collection is thoughtfully developed to balance aesthetics, comfort, and practicality, creating furniture that feels timeless in every setting.
            </motion.p>
          </div>

          <div className="flex gap-8 mt-16 xl:mt-auto">
            <div className="w-1/2 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image 
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/20260905_063905000_iOS.jpg"
                  alt="Kashi"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase text-brand-charcoal font-medium text-left text-brand-charcoal/60">KASHI</p>
            </div>
            
            <div className="w-1/2 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="w-full aspect-[4/5] relative bg-brand-ivory mb-3"
              >
                <Image 
                  src="/Second furniture page-20260912T061849Z-1-001/Second furniture page/20260905_070222000_iOS.jpg"
                  alt="Ovate"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              </motion.div>
              <p className="text-sm tracking-wider uppercase text-brand-charcoal font-medium text-left text-brand-charcoal/60">OVATE</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}