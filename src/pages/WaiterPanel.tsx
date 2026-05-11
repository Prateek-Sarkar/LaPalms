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
    <div className="min-h-screen page-shell p-6">
      <header className="flex justify-between items-center mb-8 surface-card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-8 h-8 sm:w-9 sm:h-9" />
          <div>
            <h1 className="text-xl sm:text-2xl font-display text-brand-black">Server</h1>
            <p className="text-[10px] font-semibold text-brand-black/50 tracking-[0.2em] uppercase">Floor activity</p>
          </div>
        </div>
        <button onClick={fetchOrders} className="p-3 border border-brand-beige/50 rounded-2xl active:scale-95 transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-3 px-2">
          <span className="w-2.5 h-2.5 bg-brand-yellow rounded-full"></span>
          Ready ({readyOrders.length})
        </h2>

        {readyOrders.map((order) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={order.id}
            className="surface-card p-6 sm:p-7 border-brand-beige/40 group active:border-brand-yellow transition-colors"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {order.type === 'dine-in' ? <User2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-yellow" /> : <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-yellow" />}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{order.type === 'dine-in' ? `Table ${order.tableId}` : 'Delivery'}</h3>
                  <p className="text-[10px] font-semibold text-brand-black/50 uppercase tracking-widest">Order: #{order.id?.slice(-4)}</p>
                </div>
              </div>
              <button 
                onClick={() => markDelivered(order.id!)}
                className="w-full sm:w-auto bg-brand-black text-white px-6 py-3 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-[0_10px_24px_rgba(23,23,23,0.15)] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 text-brand-yellow" />
                Mark Done
              </button>
            </div>

            <div className="space-y-2 sm:pl-18">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-1">
                  <span className="w-6 h-6 rounded-lg bg-brand-beige/30 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">{item.quantity}x</span>
                  <span className="font-semibold text-sm sm:text-base text-brand-black/80">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {readyOrders.length === 0 && (
          <div className="py-20 text-center text-brand-black/40">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-brand-yellow" />
            <p className="font-semibold text-lg tracking-wide">Everything is delivered</p>
          </div>
        )}
      </div>
    </div>
  );
}
