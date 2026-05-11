import { useState, useEffect, FormEvent } from 'react';
import { api } from '../../../lib/api';
import { MenuItem } from '../../../types';
import { Plus, Trash2, Edit2, Check, X, Search, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: 0,
    description: '',
    available: true,
    imageUrl: ''
  });

  const fetchMenu = async () => {
    try {
      const data = await api.getMenu();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        await api.updateMenuItem(editingId, formData);
      } else {
        await api.addMenuItem(formData);
      }
      resetForm();
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      try {
        await api.deleteMenuItem(id);
        fetchMenu();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startEdit = (item: MenuItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      available: item.available,
      imageUrl: item.imageUrl || ''
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Main Course',
      price: 0,
      description: '',
      available: true,
      imageUrl: ''
    });
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[32px] shadow-sm border border-brand-beige/20">
        <div>
          <h1 className="text-3xl font-black italic">MENU ARCHIVE</h1>
          <p className="text-brand-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Inventory Management</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/20" />
          <input 
            placeholder="Search flavor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-brand-white border border-brand-beige/30 rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow font-medium"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-brand-black text-white p-8 rounded-[40px] shadow-xl sticky top-8">
            <h2 className="text-xl font-black italic mb-8 flex items-center gap-3">
              {isEditing ? <Edit2 className="w-5 h-5 text-brand-yellow" /> : <Plus className="w-5 h-5 text-brand-yellow" />}
              {isEditing ? 'EDIT ITEM' : 'NEW CREATION'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Item Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-yellow transition-colors font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Price (Rs.)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-yellow transition-colors font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-yellow transition-colors font-bold appearance-none"
                  >
                    {['Main Course', 'Appetizers', 'Salads', 'Desserts', 'Beverages', 'Snacks'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-yellow transition-colors font-medium h-24 resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                type="submit"
                className="flex-grow bg-brand-yellow text-brand-black p-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-brand-yellow/10"
              >
                {isEditing ? 'Save Changes' : 'Add to Menu'}
              </button>
              {isEditing && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="bg-white/10 p-4 rounded-2xl text-white"
                >
                  <X />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-beige/20 shadow-sm flex items-center gap-4 sm:gap-6 group active:shadow-md transition-all"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-brand-beige/20 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-brand-black/20">
                  <Utensils className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-black italic text-sm sm:text-xl truncate">{item.name}</h3>
                    <span className="text-[7px] sm:text-[10px] bg-brand-beige/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest flex-shrink-0">{item.category}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-brand-black/40 font-medium line-clamp-1">{item.description}</p>
                  <p className="text-sm sm:hidden font-black mt-1">Rs. {item.price.toFixed(2)}</p>
                </div>
                <div className="text-right flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
                  <span className="text-lg sm:text-xl font-black hidden sm:block">Rs. {item.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(item)}
                      className="p-2 sm:p-3 bg-brand-white rounded-xl text-brand-black/40 active:text-brand-black active:bg-brand-yellow transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 sm:p-3 bg-brand-white rounded-xl text-brand-black/40 active:text-red-500 active:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center opacity-20">
              <Utensils className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-bold italic">NO FLAVORS FOUND</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
