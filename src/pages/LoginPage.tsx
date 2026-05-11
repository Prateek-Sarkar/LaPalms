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
    <div className="min-h-screen page-shell flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <Palmtree className="text-brand-yellow w-10 h-10" />
            <h1 className="text-3xl font-display tracking-tight">LA PALMS</h1>
          </motion.div>
          <p className="text-brand-black/50 text-xs tracking-[0.28em] uppercase font-semibold">Beachside Kitchen and Bar</p>
        </div>

        {!role ? (
          <div className="space-y-4">
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setRole('customer')}
              className="w-full p-6 surface-card text-left flex items-center justify-between hover:border-brand-yellow/60 transition-colors"
            >
              <div>
                <h2 className="text-xl font-bold text-brand-black">Customer</h2>
                <p className="text-brand-black/50 text-xs mt-2">Start your dining experience</p>
              </div>
              <div className="w-11 h-11 bg-brand-yellow/15 rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-brand-black" />
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setRole('staff')}
              className="w-full p-6 surface-card text-left flex items-center justify-between bg-brand-black text-white border-brand-black/80"
            >
              <div>
                <h2 className="text-xl font-bold">Staff</h2>
                <p className="text-white/60 text-xs mt-2">Access internal systems</p>
              </div>
              <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-yellow" />
              </div>
            </motion.button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card p-8 text-center"
          >
            {role === 'customer' ? (
              <>
                <h3 className="text-2xl font-display mb-4">Welcome Guest</h3>
                <p className="text-brand-black/60 mb-8">Enjoy beachside flavors with quick ordering.</p>
                <button 
                  onClick={handleCustomerLogin}
                  className="w-full bg-brand-yellow text-brand-black p-4 rounded-2xl font-semibold tracking-wide text-sm flex items-center justify-center gap-2 group"
                >
                  Continue to Menu
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-display mb-2">Staff Portal</h3>
                <p className="text-brand-black/50 text-xs tracking-[0.2em] uppercase mb-8">Select department</p>
                <div className="space-y-3 mb-8">
                  {['admin', 'kitchen', 'server'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setStaffType(type as any)}
                      className={`w-full p-4 rounded-2xl border transition-all font-semibold uppercase tracking-widest text-xs ${
                        staffType === type 
                        ? 'border-brand-yellow bg-brand-yellow/10 text-brand-black' 
                        : 'border-brand-beige/40 text-brand-black/50 hover:border-brand-yellow/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setRole(null)}
                    className="flex-1 p-4 rounded-2xl font-semibold text-sm text-brand-black/50"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!staffType}
                    onClick={handleStaffLogin}
                    className="flex-[2] bg-brand-black text-white p-4 rounded-2xl font-semibold uppercase tracking-widest text-sm disabled:opacity-40"
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
