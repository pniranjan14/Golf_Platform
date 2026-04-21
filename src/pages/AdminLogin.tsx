import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, ShieldAlert, Cpu, Fingerprint } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/useToast';
import { GlassCard } from '../components/ui/GlassCard';

const AdminLogin: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      // The session change will trigger profile fetch in AuthContext
      // We navigate to /admin, if the user isn't an admin, the ProtectedRoute will boot them back here
      navigate('/admin');
      toast.success('System Access Granted');
    } catch (error) {
      console.error(error);
      toast.error('ACCESS DENIED: Unauthorized Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 font-mono relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-20"
      >
        <div className="mb-8 text-center">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4"
          >
            <Terminal className="w-10 h-10 text-red-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">Master Terminal</h1>
          <div className="flex items-center justify-center gap-2 text-[10px] text-red-500/60 uppercase tracking-[0.3em]">
             <ShieldAlert className="w-3 h-3" /> RESTRICTED ACCESS ONLY
          </div>
        </div>

        <GlassCard className="p-8 bg-black/40 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest ml-1">Admin ID</label>
              <div className="relative">
                <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-red-500/20 rounded-lg pl-12 pr-4 py-3 text-red-500 font-mono outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-red-500/20"
                  placeholder="ROOT@SYSTEM"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest ml-1">Override Key</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-red-500/20 rounded-lg pl-12 pr-4 py-3 text-red-500 font-mono outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-red-500/20"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full relative group h-14 bg-red-500/10 border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 font-bold tracking-[0.3em] uppercase">
                {loading ? 'Initializing...' : 'Authorize Login'}
              </span>
              <div className="absolute inset-0 bg-red-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>

            <div className="pt-4 text-center border-t border-red-500/10">
              <div className="text-[9px] text-red-500/40 uppercase tracking-widest leading-relaxed">
                All login attempts are logged and monitored.<br />Unauthorized access will be prosecuted.
              </div>
            </div>
          </form>
        </GlassCard>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors font-bold border-b border-transparent hover:border-white/20 pb-1"
          >
            ← Return to Surface
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
