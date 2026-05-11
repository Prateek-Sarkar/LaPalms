import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { ShoppingBag, Clock, Package, Utensils, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function OrdersTab() {
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
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-brand-yellow/20 text-brand-black';
      case 'preparing': return 'bg-blue-100 text-blue-600';
      case 'ready': return 'bg-green-100 text-green-600';
      case 'delivered': return 'bg-brand-black/10 text-brand-black/40';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-brand-beige/20">
        <div>
          <h1 className="text-3xl font-black italic">LIVE ORDERS</h1>
          <p className="text-brand-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Floor Operations</p>
        </div>
        <button onClick={fetchOrders} className="p-4 bg-brand-white rounded-2xl">
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
            <motion.div 
              layout
              key={order.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-beige/20 shadow-sm flex flex-col gap-4 sm:gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-beige/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-yellow flex-shrink-0">
                    {order.type === 'dine-in' ? <Utensils className="w-6 h-6 sm:w-8 sm:h-8" /> : <Package className="w-6 h-6 sm:w-8 sm:h-8" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <h3 className="font-black italic text-sm sm:text-lg uppercase tracking-tight">
                        {order.type === 'dine-in' ? `T-${order.tableId}` : 'DELIVERY'}
                      </h3>
                      <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold text-brand-black/40 uppercase tracking-widest flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-black italic whitespace-nowrap">Rs. {order.total.toFixed(2)}</span>
              </div>

              <div className="flex-grow flex flex-wrap gap-1.5 sm:gap-2">
                {order.items.map((item, idx) => (
                  <span key={idx} className="bg-brand-white px-2 py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border border-brand-beige/10">
                    {item.quantity}x {item.name}
                  </span>
                ))}
              </div>

              <div className="w-full flex">
                {order.status !== 'delivered' && (
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id!, e.target.value)}
                    className="w-full bg-brand-black text-white p-4 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest outline-none border-none appearance-none text-center"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && !loading && (
          <div className="py-20 text-center opacity-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl font-bold italic">NO ACTIVE ORDERS</p>
          </div>
        )}
      </div>
    </div>
  );
}
