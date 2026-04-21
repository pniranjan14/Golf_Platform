import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ArrowRight, 
  Download,
  CheckCircle2,
  Users,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatBadge } from '../components/ui/StatBadge';
import { GlowButton } from '../components/ui/GlowButton';

import { supabase } from '../lib/supabase';
import type { Draw } from '../types';

const ResultsPage: React.FC = () => {
  const [latestDraw, setLatestDraw] = React.useState<Draw | null>(null);
  const [pastResults, setPastResults] = React.useState<Draw[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('draws')
        .select('*')
        .order('draw_date', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setLatestDraw(data[0]);
        setPastResults(data.slice(1));
      }
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  // Fallback if no draws published yet
  const displayDraw = latestDraw || {
    month: 'PENDING',
    draw_date: new Date().toISOString(),
    winning_score: 0,
    winners_count: 0,
    total_prize_pool: '£0',
    participants_count: 0
  };



  return (
    <div className="space-y-16 pb-20">
      {/* Hero / Latest Result */}
      <section className="relative pt-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic">
              DRAW <span className="text-violet-500">RESULTS</span>
            </h1>
            <p className="text-[#9b99c4] mt-2 font-medium flex items-center gap-2">
              Official verification of monthly prize outcomes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-1 bg-white/5 border border-white/10 rounded-xl flex">
               <button className="px-6 py-2 bg-violet-600 rounded-lg text-white text-xs font-black uppercase">Recent</button>
               <button className="px-6 py-2 text-[#4a4870] text-xs font-black uppercase hover:text-white transition-colors">Archive</button>
            </div>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <GlassCard className="p-0 border-violet-500/30 bg-[#0f0f1a] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
              {/* Left Side: The Reveal */}
              <div className="lg:col-span-2 p-12 bg-gradient-to-br from-violet-600 to-violet-900 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="relative z-10">
                  <StatBadge text="OFFICIAL RESULT" variant="violet" className="bg-white/20 border-white/30 text-white" />
                  <h2 className="text-white font-black text-3xl mt-6 italic tracking-tighter leading-none">{displayDraw.month}</h2>
                </div>
                
                <div className="relative z-10 text-center py-12">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    className="text-[12rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] tabular-nums"
                  >
                    {displayDraw.winning_score}
                  </motion.div>
                  <p className="text-white/60 font-black uppercase tracking-[0.3em] text-sm mt-4">Winning Stableford Score</p>
                </div>
                
                <div className="relative z-10 flex items-center gap-4 text-white/80 font-bold text-xs border-t border-white/10 pt-8">
                   <Calendar className="w-4 h-4" /> Draw finalized on {new Date(displayDraw.draw_date).toLocaleDateString()}
                </div>
              </div>

              {/* Right Side: Stats */}
              <div className="lg:col-span-3 p-12 space-y-12 bg-[#0a0a0f]">
                 <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-[10px] font-black text-[#4a4870] uppercase tracking-widest mb-2">Total Prize Pool</div>
                    <div className="text-4xl font-black text-white italic tracking-tight">{displayDraw.total_prize_pool}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-[#4a4870] uppercase tracking-widest mb-2">Winners Sharing</div>
                    <div className="text-4xl font-black text-white italic tracking-tight">{displayDraw.winners_count} Members</div>
                  </div>
                </div>

                <div className="p-8 rounded-[32px] bg-violet-600/10 border border-violet-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6">
                    <Trophy className="w-12 h-12 text-violet-500/10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">Platform Impact</div>
                  <div className="text-5xl font-black text-white tracking-tighter italic">LIVE RESULTS</div>
                  <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Disbursed to member wallets
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <Users className="w-5 h-5 text-[#4a4870]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-[#4a4870] uppercase tracking-widest">Total Participants</div>
                        <div className="text-white font-black">{displayDraw.participants_count} Members</div>
                      </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-[#4a4870]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-[#4a4870] uppercase tracking-widest">Probability Index</div>
                        <div className="text-white font-black">1 in 415</div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Probability Breakdown / How it works */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-1 p-10 flex flex-col justify-between">
           <div>
             <h3 className="text-sm font-black text-[#4a4870] uppercase tracking-widest mb-6">Verification Process</h3>
             <p className="text-[#9b99c4] text-sm leading-relaxed italic mb-8">
               Our drawing algorithm uses a cryptographically secure random number generator tied to the closing price of the FTSE 100 on the last trading day of each month.
             </p>
           </div>
           <GlowButton label="View Auditor Report" variant="ghost" className="w-full" />
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-0 overflow-hidden border-white/5">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black text-[#4a4870] uppercase tracking-widest">Archive History</h3>
              <div className="flex items-center gap-2 text-violet-400 text-[10px] font-black uppercase cursor-pointer hover:text-white transition-colors">
                View All <ArrowRight className="w-3 h-3" />
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/5">
                   <th className="px-8 py-4 text-[9px] uppercase font-black tracking-widest text-[#4a4870]">Month</th>
                   <th className="px-8 py-4 text-[9px] uppercase font-black tracking-widest text-[#4a4870]">Score</th>
                   <th className="px-8 py-4 text-[9px] uppercase font-black tracking-widest text-[#4a4870]">Winners</th>
                   <th className="px-8 py-4 text-[9px] uppercase font-black tracking-widest text-[#4a4870]">Pool</th>
                   <th className="px-8 py-4 text-[9px] uppercase font-black tracking-widest text-[#4a4870]">Impact</th>
                   <th className="px-8 py-4"></th>
                 </tr>
               </thead>
                <tbody className="divide-y divide-white/5">
                  {pastResults.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-4 text-xs font-black text-white italic uppercase">{row.month}</td>
                      <td className="px-8 py-4 text-xs text-violet-400 font-black tabular-nums">{row.winning_score}</td>
                      <td className="px-8 py-4 text-xs text-[#9b99c4] font-medium">{row.winners_count}</td>
                      <td className="px-8 py-4 text-xs text-white font-black">{row.total_prize_pool}</td>
                      <td className="px-8 py-4 text-xs text-emerald-400 font-bold">VERIFIED</td>
                      <td className="px-8 py-4 text-right">
                         <button className="p-2 text-[#4a4870] hover:text-white transition-colors">
                           <Download className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </GlassCard>
      </section>
    </div>
  );
};

export default ResultsPage;
