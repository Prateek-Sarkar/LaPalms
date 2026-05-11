import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Order, MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, Palmtree, Package, Utensils, RefreshCw } from 'lucide-react';

interface CategorizedItem {
  id: string;
  name: string;
  quantity: number;
  orderId: string;
  tableId?: string;
  type: string;
  category: string;
  status: string;
}

export default function KitchenDisplay() {
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
    const interval = setInterval(fetchOrders, 10000); // Polling instead of realtime
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-brand-black text-white p-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-8 h-8" />
          <h1 className="text-2xl font-black tracking-tighter">KITCHEN MONITOR</h1>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse"></span> {pendingOrders.length} Pending</span>
            <span className="flex items-center gap-2 text-white/40"><span className="w-2 h-2 bg-white/20 rounded-full"></span> {preparingOrders.length} Preparing</span>
          </div>
          <button onClick={fetchOrders} className="p-3 bg-white/5 rounded-2xl active:scale-95 transition-all">
            <RefreshCw className="w-5 h-5 text-brand-yellow" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {orders.filter(o => o.status !== 'ready' && o.status !== 'delivered').map((order) => (
            <motion.div 
              layout
              key={order.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-6 rounded-[32px] border-2 transition-colors ${order.status === 'preparing' ? 'bg-zinc-900 border-brand-yellow' : 'bg-zinc-900/50 border-white/5'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {order.type === 'dine-in' ? <Utensils className="w-3 h-3 text-brand-yellow" /> : <Package className="w-3 h-3 text-brand-yellow" />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow">
                      {order.type === 'dine-in' ? `Table ${order.tableId}` : 'Delivery'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold truncate max-w-[120px]">Order #{order.id?.slice(-4)}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <span className="font-black text-brand-yellow text-lg">{item.quantity}x</span>
                      <p className="font-bold text-lg leading-tight">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' ? (
                  <button 
                    onClick={() => updateStatus(order.id!, 'preparing')}
                    className="w-full bg-white text-brand-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-yellow transition-colors"
                  >
                    START PREPARING
                  </button>
                ) : (
                  <button 
                    onClick={() => updateStatus(order.id!, 'ready')}
                    className="w-full bg-brand-yellow text-brand-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    MARK AS READY
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && !loading && (
          <div className="col-span-full py-40 text-center opacity-20">
            <RefreshCw className="w-16 h-16 mx-auto mb-4 animate-spin-slow" />
            <p className="text-2xl font-bold italic">NO ACTIVE ORDERS</p>
          </div>
        )}
      </div>
    </div>
  );
}
