import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Order } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Palmtree, User2, MapPin, Send, RefreshCw } from 'lucide-react';

export default function WaiterPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const markDelivered = async (orderId: string) => {
    try {
      await api.updateOrderStatus(orderId, 'delivered');
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <header className="flex justify-between items-center mb-8 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-brand-beige/20">
        <div className="flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-8 h-8 sm:w-10 sm:h-10" />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-black">SERVER</h1>
            <p className="text-[10px] font-bold text-brand-black/40 tracking-widest uppercase">Floor Activity</p>
          </div>
        </div>
        <button onClick={fetchOrders} className="p-3 bg-brand-white rounded-xl active:scale-90 transition-all">
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-bold italic flex items-center gap-3 px-2">
          <span className="w-3 h-3 bg-brand-yellow rounded-full animate-ping"></span>
          READY ({readyOrders.length})
        </h2>

        {readyOrders.map((order) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={order.id}
            className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-brand-beige/10 group active:border-brand-yellow transition-colors"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {order.type === 'dine-in' ? <User2 className="w-6 h-6 sm:w-7 sm:h-7 text-brand-yellow" /> : <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-brand-yellow" />}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight">{order.type === 'dine-in' ? `TABLE ${order.tableId}` : 'DELIVERY'}</h3>
                  <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Order: #{order.id?.slice(-4)}</p>
                </div>
              </div>
              <button 
                onClick={() => markDelivered(order.id!)}
                className="w-full sm:w-auto bg-brand-black text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-black/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 text-brand-yellow" />
                Mark Done
              </button>
            </div>

            <div className="space-y-2 sm:pl-18">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-1">
                  <span className="w-6 h-6 rounded-lg bg-brand-beige/20 text-[10px] font-black flex items-center justify-center flex-shrink-0">{item.quantity}x</span>
                  <span className="font-bold text-sm sm:text-base text-brand-black/80">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {readyOrders.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-brand-yellow" />
            <p className="font-bold italic text-xl uppercase tracking-tighter">Everything Is Delivered</p>
          </div>
        )}
      </div>
    </div>
  );
}
