import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Plus, Minus, ShoppingBag, ArrowLeft, X, MapPin, Phone } from 'lucide-react';

export default function HomeDelivery() {
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    name: ''
  });

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
    if (cart.length === 0 || !deliveryInfo.address || !deliveryInfo.phone) return;
    try {
      await api.placeOrder({
        items: cart,
        total,
        type: 'delivery',
        deliveryInfo
      });
      navigate('/confirmation?type=delivery');
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  const categories = Array.from(new Set(menuItems.map(i => i.category)));

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md p-6 flex items-center justify-between border-b border-brand-beige/20">
        <button onClick={() => navigate('/')} className="p-2 -ml-2"><ArrowLeft /></button>
        <div className="text-center">
          <h1 className="text-xl font-black italic">DELIVERY</h1>
          <p className="text-[10px] font-bold text-brand-black/40 tracking-[0.2em] uppercase">Palms at Home</p>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2">
          <ShoppingBag />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-black text-brand-yellow rounded-full text-[10px] font-black flex items-center justify-center">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Categories & Menu */}
      <div className="p-6">
        {menuItems.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Utensils className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl font-bold">Delivery menu coming soon...</p>
          </div>
        ) : (
          categories.map(category => (
            <section key={category} className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-brand-yellow rounded-full"></span>
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {menuItems.filter(i => i.category === category).map(item => (
                  <div key={item.id} className="card-beachy flex gap-4">
                    <div className="w-24 h-24 bg-brand-beige/20 rounded-xl flex-shrink-0 flex items-center justify-center text-brand-black/20">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <div className="flex-grow flex flex-col">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-xs text-brand-black/60 line-clamp-2 mb-2">{item.description}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-bold text-brand-black">Rs. {item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className={`w-8 h-8 rounded-lg border border-brand-beige flex items-center justify-center active:bg-brand-beige transition-opacity ${cart.find(i => i.itemId === item.id) ? 'opacity-100' : 'opacity-0'}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          {cart.find(i => i.itemId === item.id) && (
                            <span className="font-bold">{cart.find(i => i.itemId === item.id)?.quantity}</span>
                          )}
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center active:scale-90 transition-transform shadow-sm"
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
              className="w-full bg-black text-brand-yellow py-5 rounded-2xl font-black text-lg shadow-2xl flex items-center justify-between px-8 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-yellow text-black rounded-lg flex items-center justify-center text-sm">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </div>
                <span>PROCEED TO CART</span>
              </div>
              <span className="text-white/40 font-bold">Rs. {total.toFixed(2)}</span>
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
              className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black italic">YOUR BAG</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-brand-white rounded-full"><X /></button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center opacity-20">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="font-black italic text-xl">EMPTY BAG</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.itemId} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center font-black">{item.quantity}</span>
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-[10px] text-brand-black/40 font-bold uppercase tracking-widest">Rs. {item.price.toFixed(2)} / unit</p>
                          </div>
                        </div>
                        <span className="font-black text-brand-black">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-brand-white p-6 rounded-[32px] space-y-4">
                    <h3 className="font-black italic flex items-center gap-2">
                       <MapPin className="w-5 h-5 text-brand-yellow" />
                       SHIPPING DETAILS
                    </h3>
                    <input 
                      placeholder="Receiver Name"
                      value={deliveryInfo.name}
                      onChange={e => setDeliveryInfo({...deliveryInfo, name: e.target.value})}
                      className="w-full bg-white p-4 rounded-2xl border border-brand-beige/30 outline-none font-medium"
                    />
                    <input 
                      placeholder="Mobile Number"
                      value={deliveryInfo.phone}
                      onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                      className="w-full bg-white p-4 rounded-2xl border border-brand-beige/30 outline-none font-medium"
                    />
                    <textarea 
                      placeholder="Full Delivery Address"
                      value={deliveryInfo.address}
                      onChange={e => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                      className="w-full bg-white p-4 rounded-2xl border border-brand-beige/30 outline-none h-32 resize-none font-medium"
                    />
                  </div>

                  <div className="pt-6">
                    <div className="flex justify-between mb-8 items-end">
                      <div>
                        <p className="text-[10px] text-black/40 font-black tracking-[0.2em] uppercase">Total Order</p>
                        <p className="text-4xl font-black italic">Rs. {total.toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={placeOrder}
                      disabled={!deliveryInfo.address || !deliveryInfo.phone}
                      className="w-full bg-brand-black text-brand-yellow py-6 rounded-2xl font-black text-xl shadow-2xl shadow-brand-black/20 active:scale-95 transition-all disabled:opacity-30"
                    >
                      ORDER FOR DELIVERY
                    </button>
                    <p className="mt-4 text-[10px] text-center font-bold text-brand-black/30 uppercase tracking-widest">Typical delivery time: 35-45 mins</p>
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
