import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Plus, Minus, ShoppingBag, ArrowLeft, X } from 'lucide-react';

export default function DineInOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get('table');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await api.getMenu();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.id);
      if (existing) {
        return prev.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId: item.id, quantity: 1, name: item.name, price: item.price }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.itemId !== itemId);
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      await api.placeOrder({
        items: cart,
        total,
        type: 'dine-in',
        tableId: tableId || 'Unknown'
      });
      navigate(`/confirmation?type=dine-in&table=${tableId || 'Unknown'}`);
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  if (loading) {
    return <div className="min-h-screen page-shell flex items-center justify-center text-brand-black/60">Loading...</div>;
  }

  const categories = Array.from(new Set(menuItems.map(i => i.category)));

  return (
    <div className="min-h-screen page-shell pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-brand-white/80 backdrop-blur-md p-6 flex items-center justify-between border-b border-brand-beige/30">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-display">Menu</h1>
          <p className="text-[10px] font-semibold text-brand-black/50 tracking-[0.2em] uppercase">Table {tableId || 'Select'}</p>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-brand-black text-brand-yellow rounded-full text-[10px] font-semibold flex items-center justify-center">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Categories & Menu */}
      <div className="p-6">
        {menuItems.length === 0 ? (
          <div className="text-center py-20 text-brand-black/50">
            <Utensils className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-semibold">Our menu is being prepared...</p>
          </div>
        ) : (
          categories.map(category => (
            <section key={category} className="mb-10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-brand-yellow rounded-full"></span>
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {menuItems.filter(i => i.category === category).map(item => (
                  <div key={item.id} className="surface-card p-4 flex gap-4">
                    <div className="w-20 h-20 bg-brand-beige/30 rounded-2xl flex-shrink-0 flex items-center justify-center text-brand-black/20 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Utensils className="w-7 h-7" />
                      )}
                    </div>
                    <div className="flex-grow flex flex-col">
                      <h3 className="font-semibold text-base">{item.name}</h3>
                      <p className="text-xs text-brand-black/60 line-clamp-2 mb-3">{item.description}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-semibold text-brand-black">Rs. {item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-3">
                          {cart.find(i => i.itemId === item.id) && (
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-xl border border-brand-beige/60 flex items-center justify-center active:bg-brand-beige/40"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                          {cart.find(i => i.itemId === item.id) && (
                            <span className="font-semibold">{cart.find(i => i.itemId === item.id)?.quantity}</span>
                          )}
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-xl bg-brand-yellow flex items-center justify-center active:scale-95 transition-transform shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Bottom Floating Cart Button */}
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 inset-x-6 z-30"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-brand-black text-brand-yellow py-4 rounded-2xl font-semibold text-base shadow-[0_16px_30px_rgba(23,23,23,0.2)] flex items-center justify-between px-6 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-yellow text-brand-black rounded-lg flex items-center justify-center text-sm font-semibold">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </div>
                <span>Review order</span>
              </div>
              <span className="text-white/40 font-semibold">Rs. {total.toFixed(2)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 inset-x-0 bg-white rounded-t-[40px] z-50 p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">Your order</h2>
                <button onClick={() => setIsCartOpen(false)}><X /></button>
              </div>

              {cart.length === 0 ? (
                <div className="py-10 text-center opacity-40">Your basket is empty</div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.itemId} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="bg-brand-yellow text-brand-black px-2 py-1 rounded font-semibold text-xs">{item.quantity}x</span>
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <span className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-brand-beige pt-6">
                    <div className="flex justify-between mb-8">
                      <span className="text-brand-black/40 font-semibold uppercase tracking-widest">Total Amount</span>
                      <span className="text-2xl font-semibold">Rs. {total.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={placeOrder}
                      className="w-full bg-brand-black text-brand-yellow py-4 rounded-2xl font-semibold text-base shadow-[0_16px_30px_rgba(23,23,23,0.2)] active:scale-95 transition-transform"
                    >
                      Place order
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
