'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, deleteDoc, addDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Plus, Trash2, Edit2, X, Eye, EyeOff, Layers, ArrowUp, ArrowDown } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug?: string;
  order: number;
  visible: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const DEFAULT_CATEGORIES = [
  'Sofas',
  'Armchairs',
  'Complementary Furniture',
  'Table and Chairs',
  'Beds',
  'Sofa Beds',
  'Outdoor',
];

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    order: 0,
    visible: true,
  });

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Category[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'categories');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleOpenForm = (cat?: Category) => {
    if (cat) {
      setFormData({
        name: cat.name,
        order: cat.order ?? 0,
        visible: cat.visible ?? true,
      });
      setEditingId(cat.id);
    } else {
      setFormData({
        name: '',
        order: categories.length + 1,
        visible: true,
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
    if (!formData.name.trim()) return;

    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), {
          name: formData.name.trim(),
          slug,
          order: Number(formData.order),
          visible: formData.visible,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'categories'), {
          name: formData.name.trim(),
          slug,
          order: Number(formData.order),
          visible: formData.visible,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      handleCloseForm();
    } catch (error) {
      handleFirestoreError(
        error,
        editingId ? OperationType.UPDATE : OperationType.CREATE,
        editingId ? `categories/${editingId}` : 'categories'
      );
    }
  };

  const toggleVisibility = async (cat: Category) => {
    try {
      await updateDoc(doc(db, 'categories', cat.id), {
        visible: !cat.visible,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${cat.id}`);
    }
  };

  const changeOrder = async (cat: Category, delta: number) => {
    try {
      const newOrder = Math.max(0, (cat.order || 0) + delta);
      await updateDoc(doc(db, 'categories', cat.id), {
        order: newOrder,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${cat.id}`);
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const seedDefaultCategories = async () => {
    if (!window.confirm('Populate the database with the standard House of Karvi furniture categories?')) return;
    try {
      for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
        const catName = DEFAULT_CATEGORIES[i];
        const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await addDoc(collection(db, 'categories'), {
          name: catName,
          slug,
          order: i + 1,
          visible: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    }
  };

  if (loading) {
    return <div className="animate-pulse p-8 text-brand-charcoal/60">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-brand-charcoal">Categories</h2>
          <p className="text-xs text-brand-charcoal/60 mt-1">
            Manage product categories for the Featured Collections and filtering tabs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isFormOpen && (
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 bg-brand-charcoal text-brand-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="border border-brand-charcoal/10 p-6 bg-brand-beige/30">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-serif text-lg text-brand-charcoal">
              {editingId ? 'Edit Category' : 'Create Category'}
            </h3>
            <button onClick={handleCloseForm} className="text-brand-charcoal/50 hover:text-brand-charcoal">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-brand-charcoal/70">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Armchairs, Dining Tables..."
                className="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-sm focus:outline-none focus:border-brand-charcoal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
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

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="catVisible"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="accent-brand-gold w-4 h-4 cursor-pointer"
                />
                <label htmlFor="catVisible" className="text-xs uppercase tracking-widest text-brand-charcoal cursor-pointer">
                  Visible on site
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseForm}
                className="text-xs uppercase tracking-widest text-brand-charcoal/70 hover:text-brand-charcoal py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-charcoal text-brand-ivory py-2.5 px-6 text-xs uppercase tracking-widest hover:bg-brand-gold transition-colors"
              >
                {editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List Table */}
      {categories.length === 0 ? (
        <div className="text-center py-16 text-brand-charcoal/50 border border-brand-charcoal/10">
          <Layers className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No categories created yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-brand-charcoal/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-beige/60 text-brand-charcoal/70 uppercase tracking-widest border-b border-brand-charcoal/10">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-charcoal/10">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-brand-beige/20 transition-colors">
                  <td className="py-3 px-4 text-brand-charcoal font-medium">
                    <div className="flex items-center gap-1">
                      <span>{cat.order ?? idx + 1}</span>
                      <div className="flex flex-col ml-2">
                        <button
                          onClick={() => changeOrder(cat, -1)}
                          className="text-brand-charcoal/40 hover:text-brand-charcoal p-0.5"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => changeOrder(cat, 1)}
                          className="text-brand-charcoal/40 hover:text-brand-charcoal p-0.5"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-brand-charcoal text-sm">
                    {cat.name}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleVisibility(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-xs transition-colors ${
                        cat.visible
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {cat.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {cat.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenForm(cat)}
                      className="text-brand-charcoal hover:text-brand-gold p-1"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5 inline" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id, cat.name)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
