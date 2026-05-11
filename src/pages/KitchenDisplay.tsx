import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Order, MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, Palmtree, Package, Utensils, RefreshCw, LogOut } from 'lucide-react';

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
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

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
    <div className="min-h-screen dark-shell text-white p-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-7 h-7" />
          <h1 className="text-2xl font-display tracking-tight">Kitchen Monitor</h1>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex gap-3 text-[11px] font-semibold uppercase tracking-widest">
            <span className="flex items-center gap-2 text-white/80"><span className="w-2 h-2 bg-brand-yellow rounded-full"></span> {pendingOrders.length} Pending</span>
            <span className="flex items-center gap-2 text-white/40"><span className="w-2 h-2 bg-white/20 rounded-full"></span> {preparingOrders.length} Preparing</span>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchOrders} className="p-3 border border-white/10 rounded-2xl active:scale-95 transition-all hover:bg-white/5" title="Refresh">
              <RefreshCw className="w-4 h-4 text-brand-yellow" />
            </button>
            <button onClick={handleLogout} className="p-3 border border-white/10 rounded-2xl active:scale-95 transition-all hover:bg-red-500/10" title="Logout">
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
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
              className={`p-6 rounded-3xl border transition-colors ${order.status === 'preparing' ? 'bg-zinc-900 border-brand-yellow/60' : 'bg-zinc-900/60 border-white/10'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {order.type === 'dine-in' ? <Utensils className="w-3 h-3 text-brand-yellow" /> : <Package className="w-3 h-3 text-brand-yellow" />}
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-yellow">
                      {order.type === 'dine-in' ? `Table ${order.tableId}` : 'Delivery'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold truncate max-w-[140px]">Order #{order.id?.slice(-4)}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <span className="font-semibold text-brand-yellow text-base">{item.quantity}x</span>
                      <p className="font-semibold text-base leading-tight">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' ? (
                  <button 
                    onClick={() => updateStatus(order.id!, 'preparing')}
                    className="w-full bg-white text-brand-black py-3 rounded-2xl font-semibold text-sm uppercase tracking-widest hover:bg-brand-yellow transition-colors"
                  >
                    START PREPARING
                  </button>
                ) : (
                  <button 
                    onClick={() => updateStatus(order.id!, 'ready')}
                    className="w-full bg-brand-yellow text-brand-black py-3 rounded-2xl font-semibold text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
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
          <div className="col-span-full py-40 text-center text-white/30">
            <RefreshCw className="w-12 h-12 mx-auto mb-4" />
            <p className="text-xl font-semibold tracking-wide">No active orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
