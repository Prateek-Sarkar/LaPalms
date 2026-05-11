import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Bike, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderTracking() {
  const navigate = useNavigate();
  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = [
    { title: 'Order Confirmed', desc: 'Starting prep', icon: CheckCircle2 },
    { title: 'In Kitchen', desc: 'Cooking your meal', icon: CheckCircle2 },
    { title: 'Out for Delivery', desc: 'Rider is on the way', icon: Bike },
    { title: 'Arrived', desc: 'Enjoy your meal!', icon: MapPin }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex(prev => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen page-shell flex flex-col">
      {/* Mock Map Area */}
      <div className="relative flex-grow bg-brand-beige/20 overflow-hidden">
        {/* Mock Map Background Gradients */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Mock Path */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 600">
          <path 
            d="M 50 100 Q 150 150 200 100 T 350 150" 
            fill="none" 
            stroke="black" 
            strokeWidth="4" 
            strokeDasharray="8 8"
          />
        </svg>

        {/* Home Pin */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-[50px] top-[100px] -translate-x-1/2 -translate-y-1/2 text-brand-black"
        >
          <div className="bg-white p-3 rounded-2xl shadow-[0_16px_30px_rgba(23,23,23,0.12)] border border-brand-beige/30">
            <MapPin className="w-5 h-5" />
          </div>
        </motion.div>

        {/* User Destination Pin */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-[350px] top-[150px] -translate-x-1/2 -translate-y-1/2 text-brand-yellow"
        >
          <div className="bg-brand-black p-3 rounded-2xl shadow-[0_16px_30px_rgba(23,23,23,0.2)]">
            <Navigation className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Moving Delivery Icon */}
        <motion.div
          animate={{ 
            left: statusIndex >= 2 ? ['50px', '350px'] : '50px',
            top: statusIndex >= 2 ? ['100px', '150px'] : '100px'
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="bg-brand-yellow p-3 rounded-3xl shadow-[0_16px_30px_rgba(23,23,23,0.2)] border-2 border-white">
            <Bike className="w-5 h-5 text-brand-black" />
          </div>
        </motion.div>

        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-brand-beige/40 shadow-sm active:scale-95 transition-all text-brand-black"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-t-[48px] p-8 shadow-[0_-12px_30px_rgba(23,23,23,0.12)] border-t border-brand-beige/30">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-display mb-1">Live tracking</h1>
              <p className="text-brand-black/50 text-[10px] font-semibold uppercase tracking-[0.2em]">Estimated: 25-30 mins</p>
            </div>
            <div className="px-4 py-2 bg-brand-yellow rounded-full text-xs font-semibold uppercase tracking-widest">
              Lp-9921
            </div>
          </div>

          <div className="space-y-8">
            {statuses.map((s, i) => (
              <div key={i} className={`flex items-center gap-5 transition-all duration-500 ${i > statusIndex ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${i === statusIndex ? 'bg-brand-yellow text-brand-black scale-105 ring-4 ring-brand-yellow/20' : 'bg-brand-beige/30 text-brand-black/40'}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-semibold text-base ${i === statusIndex ? 'text-brand-black' : 'text-brand-black/40'}`}>{s.title}</h3>
                  <p className="text-xs text-brand-black/50">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => window.location.href = 'tel:+1234567890'}
            className="w-full mt-10 p-4 bg-brand-black text-brand-yellow rounded-2xl font-semibold uppercase tracking-widest text-sm shadow-[0_16px_30px_rgba(23,23,23,0.2)] flex items-center justify-center gap-3"
          >
            Call Support
          </button>
        </div>
      </div>
    </div>
  );
}
