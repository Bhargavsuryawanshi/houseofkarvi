'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, deleteDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Package, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  inStock: boolean;
  imageUrl: string;
  createdAt: any;
  updatedAt: any;
}

export default function CatalogManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'chairs',
    price: 0,
    inStock: true,
    imageUrl: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Product[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        inStock: product.inStock,
        imageUrl: product.imageUrl,
      });
      setEditingId(product.id);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'chairs',
        price: 0,
        inStock: true,
        imageUrl: '',
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), {
          ...formData,
          price: Number(formData.price),
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          price: Number(formData.price),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      handleCloseForm();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, editingId ? `products/${editingId}` : 'products');
    }
  };

  const toggleStock = async (id: string, currentStock: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), {
        inStock: !currentStock,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading catalog...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-brand-charcoal">Catalog</h2>
        {!isFormOpen && (
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 bg-brand-charcoal text-brand-ivory px-4 py-2 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="border border-brand-charcoal/10 p-6 bg-brand-beige/30 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl text-brand-charcoal">{editingId ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={handleCloseForm} className="text-brand-charcoal/50 hover:text-brand-charcoal">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 focus:outline-none focus:border-brand-charcoal transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 focus:outline-none focus:border-brand-charcoal transition-colors text-brand-charcoal"
                >
                  <option value="beds">Beds</option>
                  <option value="chairs">Chairs</option>
                  <option value="sofas">Sofas</option>
                  <option value="tables">Tables</option>
                  <option value="wardrobes">Wardrobes</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Price ($)</label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  step="0.01"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 focus:outline-none focus:border-brand-charcoal transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Image URL</label>
                <input 
                  type="url" 
                  required 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 focus:outline-none focus:border-brand-charcoal transition-colors" 
                  placeholder="/images/products/chairs/chair-1.jpg or https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Description</label>
              <textarea 
                required 
                rows={3} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 focus:outline-none focus:border-brand-charcoal transition-colors resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="inStock" 
                checked={formData.inStock} 
                onChange={e => setFormData({...formData, inStock: e.target.checked})}
                className="accent-brand-gold w-4 h-4"
              />
              <label htmlFor="inStock" className="text-sm font-medium text-brand-charcoal">In Stock</label>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button"
                onClick={handleCloseForm}
                className="text-xs uppercase tracking-widest text-brand-charcoal/70 hover:text-brand-charcoal py-3 px-6 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-brand-charcoal text-brand-ivory py-3 px-8 text-sm font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors"
              >
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!isFormOpen && products.length === 0 && (
        <div className="text-center py-12 text-brand-charcoal/50">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No products found in the catalog.</p>
        </div>
      )}

      {!isFormOpen && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-brand-charcoal/10 group flex flex-col">
              <div className="relative aspect-[4/3] w-full bg-brand-beige/50 overflow-hidden">
                {product.imageUrl && (
                  <Image 
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                )}
                {!product.inStock && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] uppercase tracking-widest px-2 py-1 z-10">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-lg text-brand-charcoal">{product.title}</h3>
                  <span className="text-brand-gold font-medium">${product.price.toFixed(2)}</span>
                </div>
                <div className="text-xs uppercase tracking-widest text-brand-charcoal/50 mb-3">{product.category}</div>
                <p className="text-sm font-light text-brand-charcoal/70 line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-brand-charcoal/10">
                  <button 
                    onClick={() => toggleStock(product.id, product.inStock)} 
                    className={`col-span-1 text-xs uppercase tracking-widest flex items-center justify-center gap-1 py-2 ${product.inStock ? 'text-brand-charcoal hover:bg-brand-beige' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                    title="Toggle Stock Status"
                  >
                    {product.inStock ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    {product.inStock ? 'OOS' : 'Stock'}
                  </button>
                  <button 
                    onClick={() => handleOpenForm(product)} 
                    className="col-span-1 text-xs uppercase tracking-widest text-brand-charcoal hover:bg-brand-beige flex items-center justify-center gap-1 py-2"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)} 
                    className="col-span-1 text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center justify-center gap-1 py-2"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
