import { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Activity, 
  Settings, 
  LogOut, 
  Palmtree,
  Menu as MenuIcon,
  TrendingUp
} from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardHome from './tabs/DashboardHome';
import MenuTab from './tabs/MenuTab';
import BookingsTab from './tabs/BookingsTab';
import OrdersTab from './tabs/OrdersTab';
import SalesTab from './tabs/SalesTab';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', icon: Activity, path: '/admin' },
    { label: 'Menu', icon: ShoppingBag, path: '/admin/menu' },
    { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Bookings', icon: Users, path: '/admin/bookings' },
    { label: 'Analytics', icon: TrendingUp, path: '/admin/sales' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen page-shell flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex bg-brand-black text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all flex-col fixed h-full z-30 border-r border-white/10`}>
        <div className="p-6 flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-8 h-8 flex-shrink-0" />
          {isSidebarOpen && <span className="font-display tracking-tight text-xl">Palms Admin</span>}
        </div>

        <nav className="flex-grow mt-10 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path === '/admin' && currentPath === '/admin/');
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-brand-yellow text-brand-black font-semibold' : 'hover:bg-white/5 text-white/50'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm uppercase tracking-widest font-semibold">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="m-6 flex items-center gap-4 p-4 rounded-2xl text-red-300 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && <span className="text-sm uppercase tracking-widest font-semibold">Logout</span>}
        </button>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden bg-brand-black text-white p-6 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-6 h-6" />
          <span className="font-display tracking-tight text-lg">Palms Admin</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-red-400">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-beige/30 p-2 flex justify-around items-center z-40 pb-safe">
        {navItems.slice(0, 5).map((item) => {
          const isActive = currentPath === item.path || (item.path === '/admin' && currentPath === '/admin/');
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive ? 'text-brand-yellow bg-brand-black' : 'text-brand-black/50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[8px] font-semibold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className={`flex-grow transition-all ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10`}>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="menu" element={<MenuTab />} />
          <Route path="orders" element={<OrdersTab />} />
          <Route path="bookings" element={<BookingsTab />} />
          <Route path="sales" element={<SalesTab />} />
          <Route path="settings" element={<div className="surface-card p-10 text-center text-brand-black/40"><Settings className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" /><p className="text-lg sm:text-xl font-semibold">System settings</p></div>} />
        </Routes>
      </main>

      {/* Desktop Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-10 right-10 bg-brand-black text-brand-yellow p-4 rounded-2xl shadow-[0_16px_30px_rgba(23,23,23,0.2)] z-40 hidden lg:block"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
