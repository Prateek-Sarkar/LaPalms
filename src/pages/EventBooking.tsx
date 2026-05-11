import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { motion } from 'motion/react';
import { Calendar, Users, Phone, User, Clock, Send, Palmtree, ArrowLeft } from 'lucide-react';

export default function EventBooking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    eventType: 'Birthday',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.addBooking({
        ...formData,
        status: 'pending'
      });
      alert('Booking request sent! We will contact you shortly.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to send booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white p-6 pb-20">
      <button 
        onClick={() => navigate('/')}
        className="mb-8 p-3 bg-white rounded-full shadow-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <header className="mb-10 text-center">
        <Palmtree className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Book an Event</h1>
        <p className="text-brand-black/60 font-medium">Create memories by the shore</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-brand-beige/20 space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/30" />
            <input 
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-brand-white rounded-2xl outline-none font-medium text-sm"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/30" />
            <input 
              required
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-brand-white rounded-2xl outline-none font-medium text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/30" />
              <input 
                required
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-brand-white rounded-2xl outline-none font-medium text-sm"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/30" />
              <input 
                required
                type="time"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-brand-white rounded-2xl outline-none font-medium text-sm"
              />
            </div>
          </div>

          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/30" />
            <select 
              value={formData.guests}
              onChange={e => setFormData({...formData, guests: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-brand-white rounded-2xl outline-none font-medium text-sm appearance-none"
            >
              {[2,4,6,8,10,15,20,50].map(n => (
                <option key={n} value={n}>{n} Guests</option>
              ))}
            </select>
          </div>

          <textarea 
            placeholder="Tell us more about your event..."
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            className="w-full p-6 bg-brand-white rounded-2xl outline-none font-medium text-sm h-32 resize-none"
          />
        </div>

        <button 
          disabled={submitting}
          type="submit"
          className="w-full bg-brand-black text-brand-yellow py-6 rounded-[32px] font-black text-xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {submitting ? 'SENDING...' : 'CONFIRM REQUEST'}
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
