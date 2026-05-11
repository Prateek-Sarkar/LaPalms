import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, ShieldCheck, Palmtree, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'customer' | 'staff' | null>(null);
  const [staffType, setStaffType] = useState<'admin' | 'kitchen' | 'server' | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleStaffLogin = () => {
    if (staffType === 'admin') {
      navigate('/admin');
    } else if (staffType === 'kitchen') {
       navigate('/kitchen');
    } else if (staffType === 'server') {
       navigate('/waiter');
    }
  };

  const handleCustomerLogin = () => {
    const tableId = searchParams.get('table');
    navigate(tableId ? `/home?table=${tableId}` : '/home');
  };

  return (
    <div className="min-h-screen bg-brand-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Palmtree className="text-brand-yellow w-12 h-12" />
            <h1 className="text-4xl font-black italic tracking-tight">LA PALMS</h1>
          </motion.div>
          <p className="text-brand-black/40 font-bold uppercase tracking-[0.2em] text-xs">Authentic Beachside Experience</p>
        </div>

        {!role ? (
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('customer')}
              className="w-full p-8 bg-brand-yellow rounded-[32px] text-left flex items-center justify-between shadow-sm border border-brand-yellow/20"
            >
              <div>
                <h2 className="text-2xl font-black text-brand-black">Customer</h2>
                <p className="text-brand-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Start your dining experience</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <User className="w-6 h-6 text-brand-black" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('staff')}
              className="w-full p-8 bg-brand-black text-white rounded-[32px] text-left flex items-center justify-between shadow-sm"
            >
              <div>
                <h2 className="text-2xl font-black">Staff</h2>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Access internal systems</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-brand-yellow" />
              </div>
            </motion.button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[48px] shadow-xl shadow-brand-black/5 border border-brand-beige/20 text-center"
          >
            {role === 'customer' ? (
              <>
                <h3 className="text-2xl font-black mb-4">Welcome Guest</h3>
                <p className="text-brand-black/60 mb-8 font-medium">Enjoy exclusive beachside flavors and quick ordering.</p>
                <button 
                  onClick={handleCustomerLogin}
                  className="w-full bg-brand-yellow text-brand-black p-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                >
                  Continue to Menu
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black mb-2">Staff Portal</h3>
                <p className="text-brand-black/40 text-xs font-bold uppercase tracking-widest mb-8">Select your department</p>
                <div className="space-y-3 mb-8">
                  {['admin', 'kitchen', 'server'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setStaffType(type as any)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-xs ${
                        staffType === type 
                        ? 'border-brand-yellow bg-brand-yellow/5 text-brand-black' 
                        : 'border-brand-beige/20 text-brand-black/40 hover:border-brand-yellow/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setRole(null)}
                    className="flex-1 p-5 rounded-2xl font-bold text-sm text-brand-black/40"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!staffType}
                    onClick={handleStaffLogin}
                    className="flex-[2] bg-brand-black text-white p-5 rounded-2xl font-black uppercase tracking-widest text-sm disabled:opacity-50"
                  >
                    Login
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
