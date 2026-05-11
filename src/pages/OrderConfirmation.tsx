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
          buttonText: 'View bill',
          buttonAction: () => navigate(tableId ? `/bill?table=${tableId}` : '/bill'),
          secondaryText: 'Add more items',
          secondaryAction: () => navigate(tableId ? `/order?table=${tableId}` : '/order')
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
    <div className="min-h-screen page-shell p-6 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="surface-card w-full max-w-md px-8 py-10"
      >
        <div className="w-20 h-20 bg-brand-yellow rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-[0_16px_30px_rgba(212,175,55,0.25)]">
          <details.icon className="w-8 h-8 text-brand-black" />
        </div>

        <h1 className="text-3xl font-display mb-3">{details.title}</h1>
        <p className="text-brand-black/50 mb-8 text-sm leading-relaxed">
          {details.message}
        </p>

        <div className="space-y-3">
          <button 
            onClick={details.buttonAction}
            className="w-full bg-brand-black text-brand-yellow p-4 rounded-2xl font-semibold uppercase tracking-widest text-sm shadow-[0_16px_30px_rgba(23,23,23,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {details.buttonText === 'Track Order' && <MapPin className="w-5 h-5" />}
            {details.buttonText}
          </button>
          {details.secondaryText && details.secondaryAction && (
            <button
              onClick={details.secondaryAction}
              className="w-full border border-brand-beige/60 text-brand-black p-4 rounded-2xl font-semibold text-sm"
            >
              {details.secondaryText}
            </button>
          )}
        </div>
      </motion.div>

      <footer className="mt-10 flex items-center gap-3 text-brand-black/30">
        <Palmtree className="w-5 h-5" />
        <p className="text-[10px] tracking-[0.32em] uppercase">Cafe La Palms</p>
      </footer>
    </div>
  );
}
