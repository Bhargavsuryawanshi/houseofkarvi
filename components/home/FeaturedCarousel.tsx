'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const carouselItems = [
  {
    id: 1,
    title: 'The Osaka Chair',
    image: '/products/IMG-20260818-WA0001.jpg',
  },
  {
    id: 2,
    title: 'Kyoto Lounge Sofa',
    image: '/products/IMG-20260818-WA0008.jpg',
  },
  {
    id: 3,
    title: 'Zen Platform Bed',
    image: '/products/IMG-20260818-WA0012.jpg',
  },
  {
    id: 4,
    title: 'Nara Dining Table',
    image: '/products/IMG-20260818-WA0000.jpg',
  },
];

export function FeaturedCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 lg:py-32 bg-brand-beige overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-brand-charcoal font-serif text-3xl md:text-5xl mb-4">Curated Pieces</h2>
          <p className="text-brand-charcoal/70 text-sm max-w-md">
            Explore our signature collection, where each piece is designed to bring balance and tranquility to your space.
          </p>
        </motion.div>
        
        <div className="flex gap-4">
          <button 
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full border border-brand-charcoal flex items-center justify-center text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={scrollNext}
            className="w-12 h-12 rounded-full border border-brand-charcoal flex items-center justify-center text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="ml-6 lg:ml-auto lg:max-w-[calc(100vw-(100vw-80rem)/2)] lg:pl-12">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-4">
            {carouselItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 pl-4"
              >
                <Link href={`/catalog`} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-ivory mb-6">
                    <Image 
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      unoptimized
                    />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl text-brand-charcoal">{item.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
