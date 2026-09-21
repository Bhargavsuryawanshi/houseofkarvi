'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['All', 'Sofas', 'Armchairs', 'Complementary Furniture', 'Table and Chairs', 'Beds', 'Sofa Beds', 'Outdoor'];

const collectionItems = [
  { 
    id: 1, 
    name: 'Luvon', 
    price: '€3.100', 
    category: 'Sofas', 
    image: '/products/IMG-20260818-WA0001.jpg', 
    images: ['/products/IMG-20260818-WA0001.jpg', '/products/IMG-20260818-WA0000.jpg'],
    material: 'Premium Fabric & Solid Wood',
    description: 'The Luvon sofa brings elegance and comfort to any living space. Designed with meticulous attention to detail, it features a durable solid wood frame and plush seating.',
    size: '2400 W x 900 D x 750 H',
    details: 'Upholstery - Premium Linen Blend\nFrame - Solid Oak wood',
    colors: ['#5C4033', '#C19B6C'] 
  },
  { 
    id: 2, 
    name: 'Daily', 
    price: '€1.200', 
    category: 'Complementary Furniture', 
    image: '/products/IMG-20260818-WA0008.jpg', 
    images: ['/products/IMG-20260818-WA0008.jpg', '/products/IMG-20260818-WA0009.jpg'],
    material: 'Solid Wood & Glass',
    description: 'Daily is a versatile piece designed to complement modern interiors. With an emphasis on geometric precision, it provides both functional surface area and a bold visual statement.',
    size: '1200 W x 600 D x 400 H',
    details: 'Top - Tempered Glass\nBase - Solid Walnut',
    colors: ['#333232', '#FAF9F6'] 
  },
  { 
    id: 3, 
    name: 'Alta', 
    price: '€2.800', 
    category: 'Sofas', 
    image: '/products/IMG-20260818-WA0010.jpg', 
    images: ['/products/IMG-20260818-WA0010.jpg', '/products/IMG-20260818-WA0011.jpg'],
    material: 'Linen Blend & Steel Legs',
    description: 'Alta is defined by its sweeping curves and inviting deep seating. It balances a sculptural silhouette with the practical comfort required for a lively modern home.',
    size: '2200 W x 950 D x 780 H',
    details: 'Upholstery - Textured Bouclé\nLegs - Matte Black Steel',
    colors: ['#F3F0EA', '#5C4033'] 
  },
  { 
    id: 4, 
    name: 'Pasific', 
    price: '€3.400', 
    category: 'Beds', 
    image: '/products/IMG-20260818-WA0012.jpg', 
    images: ['/products/IMG-20260818-WA0012.jpg'],
    material: 'Upholstered Fabric & Oak',
    description: 'The Pasific bed frame offers a tranquil, low-profile design. The softly upholstered headboard provides excellent back support for reading, paired seamlessly with a sturdy oak base.',
    size: '1800 W x 2100 D x 1100 H',
    details: 'Headboard - Soft Linen\nFrame - Natural Oak finish',
    colors: ['#FAF9F6'] 
  },
  { 
    id: 5, 
    name: 'Skin', 
    price: '€3.900', 
    category: 'Sofas', 
    image: '/products/IMG-20260818-WA0000.jpg', 
    images: ['/products/IMG-20260818-WA0000.jpg', '/products/IMG-20260818-WA0001.jpg'],
    material: 'Top-Grain Leather',
    description: 'Skin is a masterclass in leather craftsmanship. The natural top-grain leather develops a beautiful patina over time, while the minimalist structure ensures it remains timeless.',
    size: '2600 W x 1000 D x 720 H',
    details: 'Upholstery - Top-grain Aniline Leather\nCushions - High-density foam with down wrap',
    colors: ['#333232', '#C19B6C'] 
  },
  { 
    id: 6, 
    name: 'Papilo', 
    price: '€1.600', 
    category: 'Armchairs', 
    image: '/products/IMG-20260818-WA0002.jpg', 
    images: ['/products/IMG-20260818-WA0002.jpg', '/products/IMG-20260818-WA0003.jpg'],
    material: 'Bouclé Fabric',
    description: 'The Papilo armchair is a cozy retreat. Covered entirely in textured bouclé fabric, it offers a soft, enveloping embrace perfect for long reading sessions or casual conversation.',
    size: '850 W x 850 D x 750 H',
    details: 'Upholstery - Premium Bouclé\nFrame - Hidden wooden structure',
    colors: ['#FAF9F6'] 
  },
  { 
    id: 7, 
    name: 'Taso Side Table', 
    price: '€1.200', 
    category: 'Table and Chairs', 
    image: '/products/IMG-20260818-WA0004.jpg', 
    images: ['/products/IMG-20260818-WA0004.jpg', '/products/IMG-20260818-WA0005.jpg'],
    material: 'Resin & Suede',
    description: 'Taso side tables explore the relationship between softness and stability through material contrast. The resin top forms a smooth, composed surface, grounding the object visually and structurally. In contrast, the fabric-clad legs which are constructed in cross planes introduce tactility and warmth, visually challenging the expectation of hardness in load-bearing elements.\n\nThe form remains restrained and architectural, allowing material expression and proportion to take precedence. Familiar in use yet unconventional in construction, the tables invite both touch and contemplation.\n\nTaso is a part of a series of material experiments that reimagine furniture through softness, surface, and form.',
    size: '400 Dia x 550 H\n500 Dia x 450 H',
    details: 'Table Top - In special finish - resin\nLegs - Cladded in fabric with suede borders',
    colors: ['#D2B48C', '#333232'] 
  },
  { 
    id: 8, 
    name: 'Onda', 
    price: '€2.400', 
    category: 'Armchairs', 
    image: '/products/IMG-20260818-WA0006.jpg', 
    images: ['/products/IMG-20260818-WA0006.jpg', '/products/IMG-20260818-WA0007.jpg'],
    material: 'Velvet & Brass',
    description: 'Onda brings a sense of fluidity and movement to stationary seating. Its curved backrest embraces the sitter, while the plush velvet upholstery offers unparalleled comfort. Accentuated with subtle brass detailing, it is a statement piece for any contemporary setting.',
    size: '800 W x 750 D x 820 H',
    details: 'Upholstery - Premium Velvet\nLegs - Brushed Brass finish',
    colors: ['#4A5D23', '#C19B6C'] 
  },
  { 
    id: 9, 
    name: 'Vela', 
    price: '€4.500', 
    category: 'Outdoor', 
    image: '/products/IMG-20260818-WA0009.jpg', 
    images: ['/products/IMG-20260818-WA0009.jpg', '/products/IMG-20260818-WA0011.jpg'],
    material: 'Teak & Performance Fabric',
    description: 'Designed for the elements, Vela combines the natural durability of teak with high-performance weather-resistant fabrics. Its low profile and wide seating area encourage relaxation and seamless indoor-outdoor living.',
    size: '2200 W x 950 D x 650 H',
    details: 'Frame - Grade A Teak wood\nCushions - Weatherproof performance fabric',
    colors: ['#E6E2D6', '#8B5A2B'] 
  },
];

export function FeaturedCarousel() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);

  const prevPageRef = useRef(currentPage);
  useLayoutEffect(() => {
    if (currentPage !== prevPageRef.current) {
      prevPageRef.current = currentPage;
      const section = document.getElementById('collection');
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    }
  }, [currentPage]);

  
  // Modal state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems = activeCategory === 'All' 
    ? collectionItems 
    : collectionItems.filter(item => item.category === activeCategory);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(0);
  };

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openProduct = (item: any) => {
    setSelectedProduct(item);
    setCurrentImageIndex(0);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
    }
  };

  return (
     // CHANGED: py-24 lg:py-32 -> py-12 lg:py-14 (point 3: stacking section padding) */}
    <section id="collection" className="py-12 lg:py-14 bg-white overflow-hidden">
      {/* CHANGED: max-w-7xl mx-auto px-6 lg:px-12 -> site-container (point 2) */}
      <div className="site-container text-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-charcoal font-bold text-3xl md:text-4xl tracking-widest uppercase mb-[clamp(0.75rem,2vh,1.75rem)]"
        >
          COLLECTION
        </motion.h2>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-[clamp(0.75rem,2.5vh,2rem)]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-xs md:text-sm transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-brand-charcoal text-white px-4 py-1.5 rounded-full' 
                  : 'text-brand-charcoal/60 hover:text-brand-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-[clamp(1rem,3vh,2.5rem)]">
          {paginatedItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col items-center text-center cursor-pointer"
              onClick={() => openProduct(item)}
            >
              <div className="w-full">
                {/*
                  CHANGED: aspect-[4/3] -> h-[clamp(110px,21vh,340px)]

                  THIS IS THE FIX FOR "collection never fits one screen".
                  aspect-[4/3] ties the image HEIGHT to its COLUMN WIDTH.
                  On a 3840px screen each of the 3 columns is ~1150px wide,
                  so each image became ~860px tall - two rows alone were
                  ~1700px, guaranteeing 3-4 scrolls no matter what padding
                  I trimmed. On a narrow screen the same rule made them too
                  short. Height driven by the column width can never fit a
                  screen reliably.

                  Sizing the image off viewport HEIGHT instead means two
                  rows + heading + filters + pagination always add up to
                  roughly one screen, at 1280x651 and at 3840px alike.
                  This is the one place vh is the correct tool: the whole
                  requirement here is "fit the visible screen".
                */}
                <div className="relative h-[clamp(110px,21vh,340px)] w-full overflow-hidden bg-brand-ivory mb-3 mix-blend-multiply flex items-center justify-center">
                  <Image 
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105 p-4"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                </div>
                <h3 className="font-sans font-medium text-base text-brand-charcoal mb-0.5">{item.name}</h3>
                <p className="text-brand-charcoal/60 text-sm mb-2">{item.price}</p>
                <div className="flex items-center justify-center gap-2">
                  {item.colors.map((color, idx) => (
                    <div 
                      key={idx} 
                      className="w-3 h-3 rounded-full border border-brand-charcoal/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-[clamp(1rem,3vh,2.5rem)] gap-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-charcoal/20 text-brand-charcoal hover:bg-brand-charcoal hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-charcoal transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentPage === idx ? 'bg-brand-charcoal' : 'bg-brand-charcoal/20 hover:bg-brand-charcoal/50'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-charcoal/20 text-brand-charcoal hover:bg-brand-charcoal hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-charcoal transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/40 backdrop-blur-sm"
            onClick={closeProduct}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Image Gallery */}
              <div className="w-full md:w-1/2 relative bg-[#e5e5e5] min-h-[40vh] md:min-h-full flex items-center justify-center p-8">
                <div className="relative w-full h-full min-h-[400px]">
                  <Image 
                    src={selectedProduct.images[currentImageIndex]}
                    alt={selectedProduct.name}
                    fill
                    className="object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                </div>
                
                {selectedProduct.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-charcoal py-4 px-2 shadow-sm transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-charcoal py-4 px-2 shadow-sm transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Product Info */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white">
                <div className="flex justify-end mb-6">
                  <button 
                    onClick={closeProduct}
                    className="flex items-center gap-2 text-sm font-medium text-brand-charcoal hover:text-brand-charcoal/70 transition-colors"
                  >
                    Close <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="font-sans font-bold text-3xl md:text-4xl text-brand-charcoal mb-6">{selectedProduct.name}</h2>
                  
                  <div className="space-y-4 mb-8">
                    {selectedProduct.description.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-sm text-brand-charcoal/70 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {selectedProduct.size && (
                    <div className="mb-6">
                      <h3 className="font-bold text-sm text-brand-charcoal mb-2">Available Size (in mm)</h3>
                      {selectedProduct.size.split('\n').map((line: string, idx: number) => (
                        <p key={idx} className="text-sm text-brand-charcoal/70">{line}</p>
                      ))}
                    </div>
                  )}

                  {selectedProduct.details && (
                    <div className="mb-8">
                      <h3 className="font-bold text-sm text-brand-charcoal mb-2">Details</h3>
                      {selectedProduct.details.split('\n').map((line: string, idx: number) => (
                        <p key={idx} className="text-sm text-brand-charcoal/70">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
