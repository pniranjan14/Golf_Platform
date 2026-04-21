import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Trophy, ShieldCheck, Github } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/useToast';

const SignupPage: React.FC = () => {
  const { signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      // Explicitly sign out to ensure they must log in manually, 
      // especially if email confirmation is disabled in Supabase.
      await signOut();
      
      toast.success('Account Created', 'Your account has been initialized. Please log in with your credentials.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center relative py-20 px-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[520px] relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white italic tracking-tighter uppercase">
              Golf<span className="text-violet-500">Platform</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white italic tracking-tight uppercase leading-none">JOIN THE <span className="text-violet-500">INNER CIRCLE</span></h1>
          <p className="text-[#9b99c4] font-medium italic">Your journey towards the jackpot starts here.</p>
        </div>

        <GlassCard className="p-10 border-white/5 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-[#4a4870] tracking-[0.2em] ml-1">Rank Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4870] group-focus-within:text-violet-500 transition-colors" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-bold outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-[#4a4870]"
                    placeholder="E.g. Tiger Woods"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-[#4a4870] tracking-[0.2em] ml-1">Secure Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4870] group-focus-within:text-violet-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-bold outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-[#4a4870]"
                    placeholder="name@provider.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase text-[#4a4870] tracking-[0.2em] ml-1">Security Vault Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4870] group-focus-within:text-violet-500 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-bold outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-[#4a4870]"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
                <p className="text-[9px] text-[#4a4870] font-bold uppercase tracking-widest mt-2 ml-1">Must be at least 8 characters with high entropy.</p>
              </div>
            </div>

            <GlowButton 
              label={loading ? "Registering..." : "Initialize Member Profile"} 
              className="w-full py-5 text-sm uppercase" 
              type="submit"
              disabled={loading}
            />

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center"><span className="px-4 bg-[#13131f] text-[10px] font-black text-[#4a4870] uppercase tracking-widest">Federated Identity</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
                  <Github className="w-4 h-4" /> Github
               </button>
               <button type="button" className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
                  <ShieldCheck className="w-4 h-4" /> SSO
               </button>
            </div>
          </form>

          <footer className="pt-6 border-t border-white/5 text-center">
            <p className="text-[9px] text-[#4a4870] font-bold uppercase tracking-[0.2em] leading-relaxed">
              By proceeding, you agree to the <span className="text-white underline cursor-pointer">Service Protocols</span> and <span className="text-white underline cursor-pointer">Data Encryption Policy</span>.
            </p>
          </footer>
        </GlassCard>

        <div className="mt-10 text-center">
          <p className="text-[#4a4870] text-sm font-medium italic">
            Already authorized? 
            <Link to="/login" className="text-white font-black uppercase underline ml-2 hover:text-violet-400 transition-colors">Access Session</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
