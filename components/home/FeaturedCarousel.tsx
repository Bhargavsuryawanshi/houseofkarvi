'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CarouselProduct {
  id: string | number;
  name: string;
  price: string;
  category: string;
  image: string;
  images: string[];
  material?: string;
  description: string;
  size?: string;
  details?: string;
  colors: string[];
  order?: number;
  visible?: boolean;
}

export function FeaturedCarousel() {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<CarouselProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Subscribe to real-time Categories from Firestore CMS
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const visibleCats: string[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.visible !== false && data.name) {
            visibleCats.push(data.name);
          }
        });
        setCategories(['All', ...visibleCats]);
      },
      (err) => console.error('Error loading categories', err)
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Products from Firestore CMS
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: CarouselProduct[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.visible !== false) {
            const mainImg = data.image || data.imageUrl || '';
            const gallery = Array.isArray(data.images) && data.images.length > 0 ? data.images : (mainImg ? [mainImg] : []);
            loaded.push({
              id: docSnap.id,
              name: data.name || data.title || '',
              price: typeof data.price === 'number' ? `€${data.price}` : (data.price || ''),
              category: data.category || '',
              image: mainImg,
              images: gallery,
              material: data.material || '',
              description: data.description || '',
              size: data.size || '',
              details: data.details || '',
              colors: Array.isArray(data.colors) ? data.colors : [],
              order: data.order ?? 1,
              visible: data.visible !== false,
            });
          }
        });
        setProducts(loaded);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading products:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? products 
    : products.filter(item => item.category === activeCategory);

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
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  const openProduct = (product: CarouselProduct) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProduct && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
    }
  };

  return (
    <section id="collection" className="py-12 lg:py-14 bg-white overflow-hidden">
      <div className="site-container text-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-charcoal font-bold text-3xl md:text-3.9xl tracking-widest uppercase mb-[clamp(0.75rem,2vh,1.75rem)]"
        >
          COLLECTION
        </motion.h2>

        {/* Categories Tabs */}
        {categories.length > 1 && (
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-brand-charcoal/50 text-sm animate-pulse">
            Loading collection...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="py-16 px-4 max-w-md mx-auto text-center border border-dashed border-brand-charcoal/20 rounded-xs my-6 bg-brand-beige/10">
            <PackageOpen className="w-10 h-10 text-brand-charcoal/30 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-brand-charcoal mb-1">No Collection Items</h3>
            <p className="text-xs text-brand-charcoal/60 font-light leading-relaxed">
              {activeCategory === 'All' 
                ? 'All products have been removed from the CMS. New items added via the Admin Dashboard will appear here.'
                : `No products currently found under "${activeCategory}".`}
            </p>
          </div>
        )}
        
        {/* Product Grid */}
        {!loading && paginatedItems.length > 0 && (
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
                  <div className="relative h-[clamp(110px,21vh,340px)] w-full overflow-hidden bg-brand-ivory mb-3 mix-blend-multiply flex items-center justify-center">
                    {item.image ? (
                      <Image 
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        className="object-contain transition-transform duration-700 group-hover:scale-105 p-4"
                        referrerPolicy="no-referrer"
                        unoptimized
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    ) : (
                      <div className="text-xs text-brand-charcoal/40">No photo</div>
                    )}
                  </div>
                  <h3 className="font-sans font-medium text-base text-brand-charcoal mb-0.5">{item.name}</h3>
                
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

      {/* Product Detail Modal (Restored to Old Design) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/40 backdrop-blur-sm"
            onClick={closeProduct}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              data-lenis-prevent="true"
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Image Gallery */}
              <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full flex items-center justify-center overflow-hidden bg-white">
                <div className="relative w-full h-full min-h-[400px]">
                  {selectedProduct.images.length > 0 ? (
                    <Image 
                      src={selectedProduct.images[currentImageIndex] || selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      unoptimized
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-brand-charcoal/40">
                      No image available
                    </div>
                  )}
                </div>

                {/* Restored Old Arrows + New Dots */}
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

                    {/* New Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
                      {selectedProduct.images.map((_, idx) => (
                        <span 
                          key={idx} 
                          className={`block h-1.5 rounded-full transition-all ${
                            idx === currentImageIndex ? 'w-6 bg-brand-charcoal' : 'w-1.5 bg-brand-charcoal/30'
                          }`}
                        />
                      ))}
                    </div>
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
                  
                  {selectedProduct.description && (
                    <div className="space-y-4 mb-8">
                      {selectedProduct.description.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx} className="text-sm text-brand-charcoal/70 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                  
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