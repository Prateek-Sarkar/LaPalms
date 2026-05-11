import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Calendar, Users, Phone, Clock, Check, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: 'confirmed' | 'rejected') => {
    try {
      await api.updateBookingStatus(id, status);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-brand-beige/20">
        <div>
          <h1 className="text-3xl font-black italic">GUEST BOOKINGS</h1>
          <p className="text-brand-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Reservation Desk</p>
        </div>
        <button onClick={fetchBookings} className="p-4 bg-brand-white rounded-2xl">
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {bookings.map((booking) => (
            <motion.div 
              layout
              key={booking.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-brand-beige/20 shadow-sm group active:border-brand-yellow transition-all"
            >
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                <div>
                  <h3 className="text-lg sm:text-2xl font-black italic text-brand-black truncate max-w-[150px] sm:max-w-none">{booking.name}</h3>
                  <div className="flex items-center gap-2 text-brand-black/40 mt-1">
                    <Phone className="w-3 h-3" />
                    <span className="text-[10px] sm:text-xs font-bold">{booking.phone}</span>
                  </div>
                </div>
                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                  booking.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-brand-yellow/20 text-brand-black'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-brand-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl">
                  <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest text-brand-black/20 mb-1">Date & Time</p>
                  <p className="text-xs sm:text-sm font-bold flex items-center gap-2 truncate"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-brand-yellow flex-shrink-0" /> {booking.date}</p>
                  <p className="text-xs sm:text-sm font-bold flex items-center gap-2 mt-1 truncate"><Clock className="w-3 h-3 sm:w-4 sm:h-4 text-brand-yellow flex-shrink-0" /> {booking.time}</p>
                </div>
                <div className="bg-brand-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl">
                  <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest text-brand-black/20 mb-1">Party Size</p>
                  <p className="text-xs sm:text-sm font-bold flex items-center gap-2"><Users className="w-3 h-3 sm:w-4 sm:h-4 text-brand-yellow flex-shrink-0" /> {booking.guests}</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-brand-black/40 mt-1 truncate">{booking.eventType}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-6 sm:mb-8 p-4 rounded-2xl sm:rounded-3xl bg-brand-beige/10 border border-brand-beige/20 italic text-xs sm:text-sm text-brand-black/60 line-clamp-3">
                  "{booking.notes}"
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex gap-2 sm:gap-3">
                  <button 
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    className="flex-grow bg-brand-black text-white py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-black/10 active:scale-95 transition-all"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-brand-yellow" />
                    Accept
                  </button>
                  <button 
                    onClick={() => updateStatus(booking.id, 'rejected')}
                    className="bg-brand-white text-brand-black/40 px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest active:text-red-500 transition-all active:scale-95"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {bookings.length === 0 && !loading && (
          <div className="col-span-full py-40 text-center opacity-20">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <p className="text-2xl font-bold italic">NO RESERVATIONS</p>
          </div>
        )}
      </div>
    </div>
  );
}
