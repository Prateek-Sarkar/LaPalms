import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Plus, Minus, Receipt, Palmtree, Utensils } from 'lucide-react';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
};

type OrderItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  tableId?: string;
  items: OrderItem[];
  total: number;
  type?: string;
  status?: string;
  createdAt?: string;
};

export default function DineInBill() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get('table') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const data = await api.getMenu();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenu();
  }, []);

  const activeOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTable = tableId ? order.tableId === tableId : true;
      const type = order.type || '';
      const isDineIn = type === 'dine-in' || type === 'dineIn';
      const isClosed = order.status === 'delivered';
      return matchesTable && isDineIn && !isClosed;
    });
  }, [orders, tableId]);

  const aggregatedItems = useMemo(() => {
    const map = new Map<string, { name: string; price: number; quantity: number }>();
    activeOrders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = map.get(item.itemId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          map.set(item.itemId, {
            name: item.name,
            price: item.price,
            quantity: item.quantity
          });
        }
      });
    });
    return Array.from(map.values());
  }, [activeOrders]);

  const total = useMemo(() => {
    return activeOrders.reduce((sum, order) => sum + order.total, 0);
  }, [activeOrders]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handleAddItems = () => {
    const section = document.getElementById('add-items');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackHome = () => {
    navigate(tableId ? `/home?table=${tableId}` : '/home');
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.itemId === item.id);
      if (existing) {
        return prev.map((entry) => entry.itemId === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry);
      }
      return [...prev, { itemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.itemId === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((entry) => entry.itemId === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry);
      }
      return prev.filter((entry) => entry.itemId !== itemId);
    });
  };

  const placeAddOnOrder = async () => {
    if (cart.length === 0) return;
    try {
      await api.placeOrder({
        items: cart,
        total: cartTotal,
        type: 'dine-in',
        tableId: tableId || 'Unknown'
      });
      setCart([]);
      setLoadingOrders(true);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen page-shell p-6">
      <header className="flex items-center justify-between mb-8">
        <button
          onClick={handleBackHome}
          className="p-3 border border-brand-beige/50 rounded-2xl"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Palmtree className="w-5 h-5 text-brand-yellow" />
            <h1 className="text-xl font-display">Table bill</h1>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-black/50">Table {tableId || 'Guest'}</p>
        </div>
        <button
          onClick={handleAddItems}
          className="p-3 border border-brand-yellow/50 text-brand-black rounded-2xl"
          aria-label="Add items"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {loadingOrders && loadingMenu ? (
        <div className="min-h-[40vh] flex items-center justify-center text-brand-black/60">Loading...</div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-yellow/20 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-brand-black" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-black/40 font-semibold">Current total</p>
                  <p className="text-2xl font-semibold">Rs. {total.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={handleAddItems}
                className="bg-brand-black text-brand-yellow px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-widest"
              >
                Add items
              </button>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold mb-4">Items ordered</h2>
            {aggregatedItems.length === 0 ? (
              <p className="text-sm text-brand-black/50">No active items yet.</p>
            ) : (
              <div className="space-y-3">
                {aggregatedItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-black/40">{item.quantity}x</p>
                    </div>
                    <p className="font-semibold text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold mb-4">Orders</h2>
            {activeOrders.length === 0 ? (
              <p className="text-sm text-brand-black/50">No active orders for this table.</p>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border border-brand-beige/30 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs uppercase tracking-widest text-brand-black/40 font-semibold">Order #{order.id.slice(-4)}</p>
                      <p className="text-xs text-brand-black/40">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.itemId}`} className="flex items-center justify-between">
                          <p className="text-sm text-brand-black/80">{item.quantity}x {item.name}</p>
                          <p className="text-sm font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div id="add-items" className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add more items</h2>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-brand-black/40 font-semibold">Add-on total</p>
                <p className="text-sm font-semibold">Rs. {cartTotal.toFixed(2)}</p>
              </div>
            </div>

            {loadingMenu ? (
              <p className="text-sm text-brand-black/50">Loading menu...</p>
            ) : menuItems.length === 0 ? (
              <p className="text-sm text-brand-black/50">Menu items are not available yet.</p>
            ) : (
              <div className="space-y-4">
                {menuItems.map((item) => {
                  const cartItem = cart.find((entry) => entry.itemId === item.id);
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-4 border border-brand-beige/30 rounded-2xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-beige/20 flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-brand-black/40" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-brand-black/40">Rs. {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {cartItem && (
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-xl border border-brand-beige/60 flex items-center justify-center"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                        {cartItem && (
                          <span className="text-sm font-semibold">{cartItem.quantity}</span>
                        )}
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded-xl bg-brand-yellow flex items-center justify-center"
                          aria-label={`Add ${item.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={placeAddOnOrder}
                disabled={cart.length === 0}
                className="flex-1 bg-brand-black text-brand-yellow py-3 rounded-2xl font-semibold uppercase tracking-widest text-xs disabled:opacity-40"
              >
                Add to order
              </button>
              <button
                onClick={handleBackHome}
                className="flex-1 border border-brand-beige/60 text-brand-black py-3 rounded-2xl font-semibold text-xs"
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
