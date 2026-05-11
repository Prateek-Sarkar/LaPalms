import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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
      color: 'border-brand-yellow',
      path: tableId ? `/order?table=${tableId}` : '/order'
    },
    {
      id: 'booking',
      title: 'Event Booking',
      desc: 'Plan your special moments',
      icon: Calendar,
      color: 'border-brand-beige',
      path: '/book'
    },
    {
      id: 'delivery',
      title: 'Home Delivery',
      desc: 'Enjoy Palms at your doorstep',
      icon: Bike,
      color: 'border-brand-beige/60',
      path: '/delivery'
    }
  ];

  return (
    <div className="min-h-screen page-shell p-6 flex flex-col items-center">
      <header className="w-full max-w-md flex items-start gap-3 justify-between mb-10 mt-6">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-2xl text-brand-black/50 hover:text-brand-black transition-colors border border-brand-beige/50"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <div className="flex-grow text-center mr-11">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <Palmtree className="text-brand-yellow w-9 h-9" />
            <h1 className="text-3xl font-display tracking-tight">CAFE LA PALMS</h1>
          </motion.div>
          <p className="text-brand-black/60 text-sm">Bespoke Beachside Dining</p>
          {tableId && (
            <div className="mt-4 border border-brand-yellow/40 text-brand-black px-4 py-1 rounded-full text-sm font-semibold inline-block">
              Table {tableId}
            </div>
          )}
        </div>
      </header>

      <div className="w-full max-w-md space-y-3">
        {options.map((opt, idx) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(opt.path)}
            className={`w-full p-5 rounded-3xl text-left flex items-center justify-between border ${opt.color} bg-white/80 hover:bg-white transition-colors active:scale-[0.99]`}
          >
            <div>
              <h2 className="text-xl font-semibold text-brand-black">{opt.title}</h2>
              <p className="text-brand-black/50 text-xs mt-2">{opt.desc}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-brand-beige/60">
              <opt.icon className="w-5 h-5 text-brand-black" />
            </div>
          </motion.button>
        ))}
      </div>

      <footer className="mt-auto py-8 text-center text-brand-black/40">
        <p className="text-[11px] tracking-[0.32em] uppercase">Elegance meets the shore</p>
      </footer>
    </div>
  );
}
