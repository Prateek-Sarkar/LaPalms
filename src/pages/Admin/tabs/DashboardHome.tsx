import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Calendar,
  Zap,
  Palmtree,
  RefreshCw
} from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    dailyRevenue: 0,
    pendingBookings: 0
  });
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchStats = async () => {
    try {
      const orders = await api.getOrders();
      const bookings = await api.getBookings();
      
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
      const revenue = todayOrders.reduce((s, o) => s + o.total, 0);
      const guestCount = bookings.filter(b => b.status === 'pending').length;

      setStats({
        totalOrders: todayOrders.length,
        dailyRevenue: revenue,
        pendingBookings: guestCount
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      const menuItems = [
        { name: 'Paradise Burger', category: 'Main Course', price: 15.50, description: 'Juicy grilled patty with pineapple and teriyaki glaze.', available: true },
        { name: 'Coconut Shrimp', category: 'Appetizers', price: 12.00, description: 'Crispy shrimp served with a sweet chili dipping sauce.', available: true },
        { name: 'Blue Lagoon Mocktail', category: 'Beverages', price: 8.50, description: 'Refreshing mix of citrus, blueberry, and sparkling water.', available: true },
        { name: 'Island Breeze Salad', category: 'Salads', price: 13.00, description: 'Mixed greens with mango, avocado, and lime vinaigrette.', available: true },
        { name: 'Beach Fries', category: 'Snacks', price: 6.50, description: 'Truffle oil and sea salt dusted chunky fries.', available: true },
        { name: 'Mango Sticky Rice', category: 'Desserts', price: 9.00, description: 'Classic mango sticky rice with coconut cream.', available: true },
        { name: 'Island Lava Cake', category: 'Desserts', price: 10.50, description: 'Warm chocolate cake with passion fruit center.', available: true },
        { name: 'Avocado Summer Toast', category: 'Snacks', price: 12.00, description: 'Smashed avocado, radish, and lime on toasted sourdough.', available: true },
        { name: 'Jungle Juice', category: 'Beverages', price: 9.50, description: 'Kiwi, green apple, and spinach fresh pressed juice.', available: true },
        { name: 'Seafood Sensation Burger', category: 'Burgers', price: 18.00, description: 'Crispy fish fillet with spicy tartar and slaw.', available: true },
      ];

      for (const item of menuItems) {
        await api.addMenuItem(item);
      }
      
      alert('Database seeded with sample items!');
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const statCards = [
    { label: 'Today Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Daily Revenue', value: `Rs. ${stats.dailyRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Users, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display">Command Center</h1>
          <p className="text-brand-black/50 font-semibold uppercase tracking-widest text-[9px] sm:text-[10px] mt-1">Live statistics</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchStats}
            className="flex-1 sm:flex-none p-4 bg-white rounded-2xl border border-brand-beige/40 hover:bg-brand-white transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 text-brand-black" />
          </button>
          <button 
            onClick={seedDatabase}
            disabled={isSeeding}
            className="flex-[3] sm:flex-none bg-brand-yellow text-brand-black px-6 sm:px-8 py-4 rounded-2xl font-semibold uppercase tracking-widest text-[10px] sm:text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_16px_30px_rgba(212,175,55,0.2)]"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            {isSeeding ? 'Seeding...' : 'Seed data'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label}
            className="surface-card p-6 sm:p-8 border-brand-beige/30 group active:border-brand-yellow transition-all"
          >
            <div className={`${stat.bg} w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-sm`}>
              <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
            </div>
            <p className="text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-black/30 mb-1">{stat.label}</p>
            <p className="text-2xl sm:text-4xl font-semibold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-brand-black text-white p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-[0_20px_40px_rgba(23,23,23,0.35)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display mb-3 sm:mb-4">Tropical hospitality</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md">Your command center is connected to all guest points. Manage with beachside ease.</p>
          </div>
          <div className="flex -space-x-3 sm:-space-x-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 border-brand-black bg-brand-yellow flex items-center justify-center font-semibold text-brand-black text-xs sm:text-base">
                P
              </div>
            ))}
          </div>
        </div>
        <Palmtree className="absolute -bottom-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 text-white/5 rotate-12" />
      </div>
    </div>
  );
}
