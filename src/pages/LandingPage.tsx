import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Calendar, Bike, Palmtree, LogOut } from 'lucide-react';

export default function LandingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get('table');

  const options = [
    {
      id: 'dine-in',
      title: 'Dine In',
      desc: 'Order directly to your table',
      icon: Utensils,
      color: 'bg-brand-yellow',
      path: tableId ? `/order?table=${tableId}` : '/order'
    },
    {
      id: 'booking',
      title: 'Event Booking',
      desc: 'Plan your special moments',
      icon: Calendar,
      color: 'bg-brand-beige',
      path: '/book'
    },
    {
      id: 'delivery',
      title: 'Home Delivery',
      desc: 'Enjoy Palms at your doorstep',
      icon: Bike,
      color: 'bg-brand-white',
      path: '/delivery'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-white p-6 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-12 mt-8">
        <button 
          onClick={() => navigate('/')}
          className="p-3 bg-brand-beige/20 rounded-2xl text-brand-black/40 hover:text-brand-black transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <div className="flex-grow text-center mr-11">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <Palmtree className="text-brand-yellow w-10 h-10" />
            <h1 className="text-4xl font-bold tracking-tight">CAFE LA PALMS</h1>
          </motion.div>
          <p className="text-brand-black/60 font-medium text-sm">Bespoke Beachside Dining</p>
          {tableId && (
            <div className="mt-4 bg-brand-yellow/20 text-brand-black px-4 py-1 rounded-full text-sm font-semibold inline-block">
              Table {tableId}
            </div>
          )}
        </div>
      </header>

      <div className="w-full max-w-md space-y-4">
        {options.map((opt, idx) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(opt.path)}
            className={`${opt.color} w-full p-8 rounded-[32px] text-left flex items-center justify-between shadow-sm active:scale-[0.98] transition-all border border-brand-beige/20`}
          >
            <div>
              <h2 className="text-2xl font-black text-brand-black">{opt.title}</h2>
              <p className="text-brand-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">{opt.desc}</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <opt.icon className="w-6 h-6 text-brand-black" />
            </div>
          </motion.button>
        ))}
      </div>

      <footer className="mt-auto py-8 opacity-20 text-center">
        <p className="text-xs font-black tracking-[0.3em] uppercase">Elegance meets the Shore</p>
      </footer>
    </div>
  );
}
