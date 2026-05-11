import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Bike, Utensils, Calendar, MapPin, Palmtree } from 'lucide-react';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get('type');
  const tableId = searchParams.get('table');

  const getDetails = () => {
    switch (type) {
      case 'dine-in':
        return {
          title: 'Order Confirmed',
          icon: Utensils,
          message: `Your meal is being prepared for Table ${tableId || 'Your Table'}.`,
          buttonText: 'Back to Menu',
          buttonAction: () => navigate('/home')
        };
      case 'delivery':
        return {
          title: 'Out for Delivery',
          icon: Bike,
          message: 'Your order is confirmed and will be at your door soon!',
          buttonText: 'Track Order',
          buttonAction: () => navigate('/track-order')
        };
      case 'booking':
        return {
          title: 'Booking Confirmed',
          icon: Calendar,
          message: 'Your special event has been scheduled. See you soon!',
          buttonText: 'Back to Home',
          buttonAction: () => navigate('/home')
        };
      default:
        return {
          title: 'Order Success',
          icon: CheckCircle2,
          message: 'Your request has been processed successfully.',
          buttonText: 'Continue',
          buttonAction: () => navigate('/home')
        };
    }
  };

  const details = getDetails();

  return (
    <div className="min-h-screen bg-brand-white p-6 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-24 h-24 bg-brand-yellow rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-brand-yellow/20"
      >
        <details.icon className="w-10 h-10 text-brand-black" />
      </motion.div>

      <h1 className="text-4xl font-black italic mb-4">{details.title}</h1>
      <p className="text-brand-black/40 font-medium mb-12 max-w-xs uppercase tracking-widest text-xs leading-loose">
        {details.message}
      </p>

      <button 
        onClick={details.buttonAction}
        className="w-full max-w-xs bg-brand-black text-brand-yellow p-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-black/20 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        {details.buttonText === 'Track Order' && <MapPin className="w-5 h-5" />}
        {details.buttonText}
      </button>

      <footer className="absolute bottom-12 flex items-center gap-3 opacity-20">
        <Palmtree className="w-6 h-6" />
        <p className="text-xs font-black tracking-[0.3em] uppercase">Cafe La Palms</p>
      </footer>
    </div>
  );
}
