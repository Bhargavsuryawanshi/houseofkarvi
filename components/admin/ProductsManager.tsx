'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, deleteDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { uploadToR2 } from '@/lib/r2UploadClient';
import { Package, Plus, Trash2, Edit2, X, Check, Upload, Eye, EyeOff, Search, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export interface ProductItem {
  id: string;
  name: string;
  price?: string;
  category?: string;
  image: string;
  images: string[];
  material?: string;
  description: string;
  size: string;
  details: string;
  colors?: string[];
  order?: number;
  visible?: boolean;
  inStock?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const DEFAULT_SEEDS: Omit<ProductItem, 'id'>[] = [
  { 
    name: 'Luvon', 
    price: '€3.100', 
    category: 'Sofas', 
    image: '/products/IMG-20260818-WA0001.jpg', 
    images: ['/products/IMG-20260818-WA0001.jpg', '/products/IMG-20260818-WA0000.jpg'],
    material: 'Premium Fabric & Solid Wood',
    description: 'The Luvon sofa brings elegance and comfort to any living space. Designed with meticulous attention to detail, it features a durable solid wood frame and plush seating.',
    size: '2400 W x 900 D x 750 H',
    details: 'Upholstery - Premium Linen Blend\nFrame - Solid Oak wood',
    colors: ['#5C4033', '#C19B6C'],
    order: 1,
    visible: true,
    inStock: true
  },
  { 
    name: 'Daily', 
    price: '€1.200', 
    category: 'Complementary Furniture', 
    image: '/products/IMG-20260818-WA0008.jpg', 
    images: ['/products/IMG-20260818-WA0008.jpg', '/products/IMG-20260818-WA0009.jpg'],
    material: 'Solid Wood & Glass',
    description: 'Daily is a versatile piece designed to complement modern interiors. With an emphasis on geometric precision, it provides both functional surface area and a bold visual statement.',
    size: '1200 W x 600 D x 400 H',
    details: 'Top - Tempered Glass\nBase - Solid Walnut',
    colors: ['#333232', '#FAF9F6'],
    order: 2,
    visible: true,
    inStock: true
  },
  { 
    name: 'Alta', 
    price: '€2.800', 
    category: 'Sofas', 
    image: '/products/IMG-20260818-WA0010.jpg', 
    images: ['/products/IMG-20260818-WA0010.jpg', '/products/IMG-20260818-WA0011.jpg'],
    material: 'Linen Blend & Steel Legs',
    description: 'Alta is defined by its sweeping curves and inviting deep seating. It balances a sculptural silhouette with the practical comfort required for a lively modern home.',
    size: '2200 W x 950 D x 780 H',
    details: 'Upholstery - Textured Bouclé\nLegs - Matte Black Steel',
    colors: ['#F3F0EA', '#5C4033'],
    order: 3,
    visible: true,
    inStock: true
  },
  { 
    name: 'Pasific', 
    price: '€3.400', 
    category: 'Beds', 
    image: '/products/IMG-20260818-WA0012.jpg', 
    images: ['/products/IMG-20260818-WA0012.jpg'],
    material: 'Upholstered Fabric & Oak',
    description: 'The Pasific bed frame offers a tranquil, low-profile design. The softly upholstered headboard provides excellent back support for reading, paired seamlessly with a sturdy oak base.',
    size: '1800 W x 2100 D x 1100 H',
    details: 'Headboard - Soft Linen\nFrame - Natural Oak finish',
    colors: ['#FAF9F6'],
    order: 4,
    visible: true,
    inStock: true
  },
  { 
    name: 'Skin', 
    price: '€3.900', 
    category: 'Sofas', 
    image: '/products/IMG-20260818-WA0000.jpg', 
    images: ['/products/IMG-20260818-WA0000.jpg', '/products/IMG-20260818-WA0001.jpg'],
    material: 'Top-Grain Leather',
    description: 'Skin is a masterclass in leather craftsmanship. The natural top-grain leather develops a beautiful patina over time, while the minimalist structure ensures it remains timeless.',
    size: '2600 W x 1000 D x 720 H',
    details: 'Upholstery - Top-grain Aniline Leather\nCushions - High-density foam with down wrap',
    colors: ['#333232', '#C19B6C'],
    order: 5,
    visible: true,
    inStock: true
  },
  { 
    name: 'Papilo', 
    price: '€1.600', 
    category: 'Armchairs', 
    image: '/products/IMG-20260818-WA0002.jpg', 
    images: ['/products/IMG-20260818-WA0002.jpg', '/products/IMG-20260818-WA0003.jpg'],
    material: 'Bouclé Fabric',
    description: 'The Papilo armchair is a cozy retreat. Covered entirely in textured bouclé fabric, it offers a soft, enveloping embrace perfect for long reading sessions or casual conversation.',
    size: '850 W x 850 D x 750 H',
    details: 'Upholstery - Premium Bouclé\nFrame - Hidden wooden structure',
    colors: ['#FAF9F6'],
    order: 6,
    visible: true,
    inStock: true
  },
  { 
    name: 'Taso Side Table', 
    price: '€1.200', 
    category: 'Table and Chairs', 
    image: '/products/IMG-20260818-WA0004.jpg', 
    images: ['/products/IMG-20260818-WA0004.jpg', '/products/IMG-20260818-WA0005.jpg'],
    material: 'Resin & Suede',
    description: 'Taso side tables explore the relationship between softness and stability through material contrast. The resin top forms a smooth, composed surface, grounding the object visually and structurally.',
    size: '400 Dia x 550 H\n500 Dia x 450 H',
    details: 'Table Top - In special finish - resin\nLegs - Cladded in fabric with suede borders',
    colors: ['#D2B48C', '#333232'],
    order: 7,
    visible: true,
    inStock: true
  },
  { 
    name: 'Onda', 
    price: '€2.400', 
    category: 'Armchairs', 
    image: '/products/IMG-20260818-WA0006.jpg', 
    images: ['/products/IMG-20260818-WA0006.jpg', '/products/IMG-20260818-WA0007.jpg'],
    material: 'Velvet & Brass',
    description: 'Onda brings a sense of fluidity and movement to stationary seating. Its curved backrest embraces the sitter, while the plush velvet upholstery offers unparalleled comfort.',
    size: '800 W x 750 D x 820 H',
    details: 'Upholstery - Premium Velvet\nLegs - Brushed Brass finish',
    colors: ['#4A5D23', '#C19B6C'],
    order: 8,
    visible: true,
    inStock: true
  },
  { 
    name: 'Vela', 
    price: '€4.500', 
    category: 'Outdoor', 
    image: '/products/IMG-20260818-WA0009.jpg', 
    images: ['/products/IMG-20260818-WA0009.jpg', '/products/IMG-20260818-WA0011.jpg'],
    material: 'Teak & Performance Fabric',
    description: 'Designed for the elements, Vela combines the natural durability of teak with high-performance weather-resistant fabrics.',
    size: '2200 W x 950 D x 650 H',
    details: 'Frame - Grade A Teak wood\nCushions - Weatherproof performance fabric',
    colors: ['#E6E2D6', '#8B5A2B'],
    order: 9,
    visible: true,
    inStock: true
  }
];

export default function ProductsManager() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [newColorHex, setNewColorHex] = useState('#5C4033');
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Sofas',
    image: '',
    images: [] as string[],
    material: '',
    description: '',
    size: '',
    details: '',
    colors: [] as string[],
    order: 1,
    visible: true,
    inStock: true,
  });

  // Subscribe to Products
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: ProductItem[] = [];
        snapshot.forEach((docSnap) => {
          const docData = docSnap.data();
          data.push({
            id: docSnap.id,
            name: docData.name || docData.title || '',
            price: typeof docData.price === 'number' ? `€${docData.price}` : (docData.price || ''),
            category: docData.category || 'Sofas',
            image: docData.image || docData.imageUrl || '',
            images: docData.images && docData.images.length > 0 ? docData.images : (docData.image ? [docData.image] : []),
            material: docData.material || '',
            description: docData.description || '',
            size: docData.size || '',
            details: docData.details || '',
            colors: docData.colors || [],
            order: docData.order ?? 1,
            visible: docData.visible !== false,
            inStock: docData.inStock !== false,
            createdAt: docData.createdAt,
            updatedAt: docData.updatedAt,
          });
        });
        setProducts(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to Categories for the dropdown selector
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats: { id: string; name: string }[] = [];
      snapshot.forEach((doc) => {
        cats.push({ id: doc.id, name: doc.data().name });
      });
      setCategories(cats);
    });

    return () => unsubscribe();
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormError(null);
  };

  // Lock background scroll when modal popup is open
  useEffect(() => {
    if (isFormOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseForm();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isFormOpen]);

  const handleOpenForm = (product?: ProductItem) => {
    setFormError(null);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price || '',
        category: product.category || 'Sofas',
        image: product.image,
        images: product.images && product.images.length > 0 ? [...product.images] : [product.image].filter(Boolean),
        material: product.material || '',
        description: product.description || '',
        size: product.size || '',
        details: product.details || '',
        colors: product.colors ? [...product.colors] : [],
        order: product.order ?? 1,
        visible: product.visible !== false,
        inStock: product.inStock !== false,
      });
      setEditingId(product.id);
    } else {
      const defaultCategory = categories.length > 0 ? categories[0].name : 'Sofas';
      setFormData({
        name: '',
        price: '',
        category: defaultCategory,
        image: '',
        images: [],
        material: '',
        description: '',
        size: '',
        details: '',
        colors: ['#5C4033'],
        order: products.length + 1,
        visible: true,
        inStock: true,
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  // Upload image directly to Cloudflare R2 using pre-signed URL + WebP compression under 500KB
  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    setUploadingImage(true);
    setUploadStatus('Compressing image to WebP under 500KB...');
    try {
      const publicUrl = await uploadToR2(file, {
        folder: 'products',
        onProgress: (status) => setUploadStatus(status),
      });

      if (isPrimary) {
        setFormData((prev) => ({
          ...prev,
          image: publicUrl,
          images: prev.images.includes(publicUrl) ? prev.images : [publicUrl, ...prev.images],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, publicUrl],
          image: prev.image || publicUrl,
        }));
      }
    } catch (err: any) {
      console.error('Cloudflare R2 upload error:', err);
      alert('Failed to upload image to Cloudflare R2: ' + (err.message || err));
    } finally {
      setUploadingImage(false);
      setUploadStatus(null);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || (prev.image === prev.images[index] ? '' : prev.image),
      };
    });
  };

  const addColorSwatch = () => {
    if (!newColorHex || formData.colors.includes(newColorHex)) return;
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, newColorHex],
    }));
  };

  const removeColorSwatch = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = formData.name.trim();
    if (!name) {
      setFormError('Piece Name is compulsory.');
      return;
    }

    const cleanedImages = formData.images.filter(Boolean);
    if (formData.image.trim() && !cleanedImages.includes(formData.image.trim())) {
      cleanedImages.unshift(formData.image.trim());
    }
    const finalImage = formData.image.trim() || cleanedImages[0] || '';
    if (!finalImage) {
      setFormError('Images is compulsory. Please upload or provide at least one product photo.');
      return;
    }

    const description = formData.description.trim();
    if (!description) {
      setFormError('Description is compulsory.');
      return;
    }

    const size = formData.size.trim();
    if (!size) {
      setFormError('Available Sizes is compulsory.');
      return;
    }

    const details = formData.details.trim();
    if (!details) {
      setFormError('Details is compulsory.');
      return;
    }

    const payload = {
      name,
      title: name,
      price: formData.price.trim(),
      category: formData.category || 'Sofas',
      image: finalImage,
      imageUrl: finalImage,
      images: cleanedImages.length > 0 ? cleanedImages : [finalImage],
      material: formData.material.trim(),
      description,
      size,
      details,
      colors: formData.colors || [],
      order: Number(formData.order) || 0,
      visible: Boolean(formData.visible),
      inStock: Boolean(formData.inStock),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      handleCloseForm();
    } catch (error) {
      handleFirestoreError(
        error,
        editingId ? OperationType.UPDATE : OperationType.CREATE,
        editingId ? `products/${editingId}` : 'products'
      );
    }
  };

  const toggleStock = async (product: ProductItem) => {
    try {
      await updateDoc(doc(db, 'products', product.id), {
        inStock: !product.inStock,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
    }
  };

  const toggleVisibility = async (product: ProductItem) => {
    try {
      await updateDoc(doc(db, 'products', product.id), {
        visible: !product.visible,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) return;
    
    // Find images to purge from R2
    const targetProduct = products.find((p) => p.id === id);
    const imagesToPurge = new Set<string>();
    if (targetProduct?.image && targetProduct.image.includes('.r2.')) {
      imagesToPurge.add(targetProduct.image);
    }
    if (Array.isArray(targetProduct?.images)) {
      targetProduct.images.forEach((img) => {
        if (img && img.includes('.r2.')) imagesToPurge.add(img);
      });
    }

    try {
      await deleteDoc(doc(db, 'products', id));

      // Attempt to clean up physical R2 files in parallel
      for (const imgUrl of Array.from(imagesToPurge)) {
        fetch('/api/r2/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: imgUrl }),
        }).catch(() => {});
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const seedDefaultProducts = async () => {
    if (!window.confirm('Populate the database with all 9 authentic House of Karvi collection items?')) return;
    try {
      for (const item of DEFAULT_SEEDS) {
        await addDoc(collection(db, 'products'), {
          ...item,
          title: item.name,
          imageUrl: item.image,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return <div className="animate-pulse p-8 text-brand-charcoal/60">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-brand-charcoal">Products & Collections</h2>
          <p className="text-xs text-brand-charcoal/60 mt-1">
            Dynamic management for Featured Carousel and Collections catalogue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 bg-brand-charcoal text-brand-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* Product Form Modal / Popup */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm"
          data-lenis-prevent="true"
        >
          <div 
            className="relative w-full max-w-4xl bg-brand-ivory border border-brand-charcoal/20 shadow-2xl h-[92vh] max-h-[850px] flex flex-col rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-3.5 border-b border-brand-charcoal/10 bg-brand-beige/50 shrink-0">
              <div>
                <h3 className="font-serif text-lg text-brand-charcoal">
                  {editingId ? 'Edit Furniture Piece' : 'Add New Furniture Piece'}
                </h3>
                <p className="text-[11px] text-brand-charcoal/60 mt-0.5">
                  Update photography, specifications, descriptions, and swatches for this piece.
                </p>
              </div>
              <button 
                type="button"
                onClick={handleCloseForm} 
                className="text-brand-charcoal/50 hover:text-brand-charcoal p-1.5 rounded-full hover:bg-brand-charcoal/10 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div 
              className="p-6 md:p-8 overflow-y-auto flex-1 overscroll-contain"
              data-lenis-prevent="true"
            >
              <form id="productEditForm" onSubmit={handleSubmit} className="space-y-6 pb-6">
                {formError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
                    <span>{formError}</span>
                    <button
                      type="button"
                      onClick={() => setFormError(null)}
                      className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}

            {/* Primary Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Piece Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. Luvon, Daily, Alta"
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-sm focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Price Label (Optional)</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. €3.100 or $3,100"
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-sm focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-sm focus:outline-none focus:border-brand-charcoal text-brand-charcoal"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Sofas">Sofas</option>
                      <option value="Armchairs">Armchairs</option>
                      <option value="Complementary Furniture">Complementary Furniture</option>
                      <option value="Table and Chairs">Table and Chairs</option>
                      <option value="Beds">Beds</option>
                      <option value="Sofa Beds">Sofa Beds</option>
                      <option value="Outdoor">Outdoor</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Images: Main & Gallery */}
            <div className="border border-brand-charcoal/10 p-5 bg-brand-ivory space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-brand-charcoal font-medium">Product Photography *</h4>
                  <p className="text-[11px] text-brand-charcoal/60">At least one image is compulsory. Upload photos or enter an image URL.</p>
                </div>

                <label className={`inline-flex items-center gap-1.5 bg-brand-charcoal text-brand-ivory px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors cursor-pointer ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingImage ? 'Optimizing...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadImageFile(e, !formData.image)}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadStatus && (
                <div className="flex items-center gap-2 p-2.5 bg-brand-beige border border-brand-gold/30 text-brand-charcoal text-[11px] rounded-sm animate-pulse">
                  <div className="w-3 h-3 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}

              {/* Main Image URL Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-brand-charcoal/70">Main Image URL *</label>
                <input
                  type="text"
                  required={formData.images.length === 0}
                  value={formData.image}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      image: val,
                      images: prev.images.includes(val) ? prev.images : [val, ...prev.images],
                    }));
                    if (formError) setFormError(null);
                  }}
                  placeholder="/products/IMG-20260818-WA0001.jpg or https://..."
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-xs focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              {/* Gallery Preview & Additional Images */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-brand-charcoal/70 block mb-2">
                  Gallery Photos ({formData.images.length})
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-20 h-20 bg-brand-beige border border-brand-charcoal/10 group overflow-hidden">
                      <Image
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        unoptimized
                      />
                      {imgUrl === formData.image && (
                        <span className="absolute top-1 left-1 bg-brand-charcoal text-[8px] text-white px-1 py-0.5 uppercase tracking-wider z-10">
                          Main
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <label className="w-20 h-20 border border-dashed border-brand-charcoal/30 flex flex-col items-center justify-center cursor-pointer hover:border-brand-charcoal text-brand-charcoal/50 hover:text-brand-charcoal transition-colors">
                    <Plus className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] uppercase tracking-wider">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadImageFile(e, false)}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Available Sizes (in mm) *</label>
                <input
                  type="text"
                  required
                  value={formData.size}
                  onChange={(e) => {
                    setFormData({ ...formData, size: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. 2400 W x 900 D x 750 H"
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-sm focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Material Specifications (Optional)</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g. Premium Fabric & Solid Wood"
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-sm focus:outline-none focus:border-brand-charcoal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="Detailed narrative describing aesthetic, ergonomics, and craftsmanship..."
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-xs focus:outline-none focus:border-brand-charcoal resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Details *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.details}
                  onChange={(e) => {
                    setFormData({ ...formData, details: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder="Upholstery - Premium Linen Blend&#10;Frame - Solid Oak wood"
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-xs focus:outline-none focus:border-brand-charcoal resize-none"
                />
              </div>
            </div>

            {/* Swatches, Display Order & Status Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-charcoal/10">
              {/* Swatches */}
              <div className="space-y-3 bg-brand-beige/40 p-4 border border-brand-charcoal/10 rounded-sm">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-widest text-brand-charcoal font-medium">Color Swatches</label>
                  <span className="text-[10px] text-brand-charcoal/60">({formData.colors.length} added)</span>
                </div>
                
                {/* Color input & preview */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-9 h-9 rounded-full border-2 border-brand-charcoal/30 shadow-inner shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: newColorHex }}
                  >
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      title="Choose color"
                    />
                  </div>
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    placeholder="#5C4033"
                    className="w-28 bg-white border border-brand-charcoal/20 px-2.5 py-1.5 text-xs uppercase font-mono font-medium text-brand-charcoal rounded-sm focus:outline-none focus:border-brand-charcoal"
                  />
                  <button
                    type="button"
                    onClick={addColorSwatch}
                    className="px-3 py-1.5 text-[11px] uppercase tracking-wider bg-brand-charcoal text-white hover:bg-brand-gold transition-colors font-medium shrink-0 rounded-sm"
                  >
                    + Add
                  </button>
                </div>

                {/* Swatches pill list */}
                <div className="flex flex-wrap gap-2 pt-1 max-h-28 overflow-y-auto pr-1">
                  {formData.colors.map((color, idx) => (
                    <span
                      key={idx}
                      onClick={() => removeColorSwatch(color)}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white border border-brand-charcoal/25 rounded-full cursor-pointer hover:border-red-400 hover:bg-red-50/50 shadow-sm transition-all group"
                      title="Click to remove color swatch"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: color }} />
                      <span className="font-mono text-[11px] font-medium text-brand-charcoal">{color}</span>
                      <span className="text-[10px] text-brand-charcoal/40 group-hover:text-red-500 font-bold ml-0.5">✕</span>
                    </span>
                  ))}
                  {formData.colors.length === 0 && (
                    <span className="text-[11px] text-brand-charcoal/50 italic">No finishes added.</span>
                  )}
                </div>
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-sm focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pInStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="accent-brand-gold w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="pInStock" className="text-xs uppercase tracking-widest text-brand-charcoal cursor-pointer">
                    In Stock
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pVisible"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="accent-brand-gold w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="pVisible" className="text-xs uppercase tracking-widest text-brand-charcoal cursor-pointer">
                    Visible in Carousel & Catalog
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Dedicated Fixed Modal Footer - Never overlaps fields */}
        <div className="px-6 py-3 border-t border-brand-charcoal/10 bg-brand-beige/50 shrink-0 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={handleCloseForm}
            className="text-xs uppercase tracking-widest text-brand-charcoal/70 hover:text-brand-charcoal py-2 px-5 rounded border border-transparent hover:border-brand-charcoal/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="productEditForm"
            className="bg-brand-charcoal text-brand-ivory py-2 px-7 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors font-medium shadow-sm"
          >
            {editingId ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, material, or description..."
            className="w-full bg-brand-beige/30 border border-brand-charcoal/15 pl-9 pr-4 py-2 text-xs text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
          />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="bg-brand-beige/30 border border-brand-charcoal/15 px-3 py-2 text-xs text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-brand-charcoal/50 border border-brand-charcoal/10">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No products found matching the criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-brand-charcoal/10 group flex flex-col bg-brand-ivory hover:border-brand-charcoal/30 transition-colors"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full bg-brand-beige/50 overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-charcoal/30">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                  {!product.inStock && (
                    <span className="bg-red-600 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 shadow-xs">
                      Out of Stock
                    </span>
                  )}
                  {!product.visible && (
                    <span className="bg-gray-700 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 shadow-xs">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 uppercase tracking-wider backdrop-blur-xs">
                  {product.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif text-base text-brand-charcoal">{product.name}</h3>
                  {product.price && (
                    <span className="text-brand-gold font-medium text-sm">{product.price}</span>
                  )}
                </div>

                {product.material && (
                  <p className="text-xs text-brand-charcoal/60 line-clamp-1 mb-2 font-light">
                    {product.material}
                  </p>
                )}

                {product.description && (
                  <p className="text-xs text-brand-charcoal/70 line-clamp-2 mb-3 flex-1 font-light">
                    {product.description}
                  </p>
                )}

                {/* Swatches preview */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    {product.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="grid grid-cols-3 gap-1 pt-3 border-t border-brand-charcoal/10 text-[11px] uppercase tracking-wider">
                  <button
                    onClick={() => toggleStock(product)}
                    className={`py-1.5 text-center flex items-center justify-center gap-1 transition-colors ${
                      product.inStock
                        ? 'text-brand-charcoal/70 hover:bg-brand-beige'
                        : 'text-amber-700 bg-amber-50'
                    }`}
                    title="Toggle Stock"
                  >
                    {product.inStock ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    {product.inStock ? 'Stock' : 'OOS'}
                  </button>

                  <button
                    onClick={() => toggleVisibility(product)}
                    className="py-1.5 text-center flex items-center justify-center gap-1 text-brand-charcoal/70 hover:bg-brand-beige transition-colors"
                    title="Toggle Visibility"
                  >
                    {product.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {product.visible ? 'Live' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => handleOpenForm(product)}
                    className="py-1.5 text-center flex items-center justify-center gap-1 text-brand-charcoal hover:bg-brand-beige transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <button
                  onClick={() => deleteProduct(product.id, product.name)}
                  className="mt-2 text-center text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 py-1 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
