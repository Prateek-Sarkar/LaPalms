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
    <div className="min-h-screen bg-[#F5F7F9] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex bg-brand-black text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all flex-col fixed h-full z-30`}>
        <div className="p-6 flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-8 h-8 flex-shrink-0" />
          {isSidebarOpen && <span className="font-black tracking-tighter text-xl">PALMS ADMIN</span>}
        </div>

        <nav className="flex-grow mt-10 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path === '/admin' && currentPath === '/admin/');
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-brand-yellow text-brand-black font-black' : 'hover:bg-white/5 text-white/50'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm uppercase tracking-widest font-bold">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="m-6 flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && <span className="text-sm uppercase tracking-widest font-bold">Logout</span>}
        </button>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden bg-brand-black text-white p-6 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Palmtree className="text-brand-yellow w-6 h-6" />
          <span className="font-black tracking-tighter text-lg uppercase">Palms Admin</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-red-400">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-beige/20 p-2 flex justify-around items-center z-40 pb-safe">
        {navItems.slice(0, 5).map((item) => {
          const isActive = currentPath === item.path || (item.path === '/admin' && currentPath === '/admin/');
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${isActive ? 'text-brand-yellow bg-brand-black' : 'text-brand-black/40'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
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
          <Route path="settings" element={<div className="p-10 text-center opacity-20"><Settings className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4" /><p className="text-xl sm:text-2xl font-black">SYSTEM SETTINGS</p></div>} />
        </Routes>
      </main>

      {/* Desktop Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-10 right-10 bg-brand-black text-brand-yellow p-4 rounded-2xl shadow-2xl z-40 hidden lg:block"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
