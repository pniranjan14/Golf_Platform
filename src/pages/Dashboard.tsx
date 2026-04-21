import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  CreditCard, 
  Heart, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { ScoreManager } from '../components/scores/ScoreManager';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { StatBadge } from '../components/ui/StatBadge';
import { GlowButton } from '../components/ui/GlowButton';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { cn } from '../lib/utils';
import { toast } from '../hooks/useToast';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { 
      label: 'Subscription Status', 
      value: 'Active', 
      icon: CreditCard, 
      color: 'bg-emerald-500/10 text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      sub: 'Renews May 12, 2026'
    },
    { 
      label: 'Current Scores', 
      value: '4/5', 
      icon: TrendingUp, 
      color: 'bg-violet-500/10 text-violet-400',
      glow: 'shadow-[0_0_20px_rgba(124,58,237,0.2)]',
      sub: '+1 entry needed'
    },
    { 
      label: 'Draws Entered', 
      value: '12', 
      icon: Trophy, 
      color: 'bg-amber-500/10 text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(217,119,6,0.2)]',
      sub: 'Total lifetime entries'
    },
    { 
      label: 'Total Winnings', 
      value: '£450', 
      icon: CheckCircle2, 
      color: 'bg-rose-500/10 text-rose-400',
      glow: 'shadow-[0_0_20px_rgba(225,29,72,0.2)]',
      sub: 'Sent to your wallet'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight italic">
            DASHBOARD <span className="text-violet-500">OVERVIEW</span>
          </h1>
          <p className="text-[#9b99c4] mt-2 font-medium flex items-center gap-2">
            <span className="opacity-50">Welcome back,</span> {user?.email?.split('@')[0]}
            <span className="w-1 h-1 rounded-full bg-[#4a4870]" />
            <span className="text-violet-400">Elite Member</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => toast.info('System Sync', 'Exporting your tournament data to CSV...')}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            Export Data
          </button>
          <GlowButton 
            label="Submit New Score" 
            variant="primary" 
            className="py-2.5 px-6 text-sm" 
            onClick={() => toast.warning('Round Recording', 'Please use the "Record Round" button in the history panel below.')}
          />
        </div>
      </header>

      {/* TOP ROW STATS */}
      <ErrorBoundary name="DashboardStats">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <GlassCard className="h-full relative overflow-hidden group-hover:border-violet-500/30">
                  <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity", stat.color.split(' ')[0])} />
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn("p-2.5 rounded-xl transition-all duration-300", stat.color, stat.glow)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#4a4870] group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-white tabular-nums">{stat.value}</div>
                    <div className="text-[10px] uppercase font-black text-[#4a4870] tracking-[0.1em]">{stat.label}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-[#9b99c4] group-hover:text-white transition-colors">
                    {stat.sub}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </ErrorBoundary>

      {/* MIDDLE SECTION */}
      <ErrorBoundary name="DashboardMiddle">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Score Manager (60%) */}
          <div className="lg:col-span-3">
            <GlassCard className="p-0 border-white/5 bg-[#0f0f1a] overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-violet-600/5 to-transparent">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-3 italic">
                    <TrendingUp className="w-5 h-5 text-violet-500" /> MY ACTIVE SCORES
                  </h2>
                  <p className="text-xs text-[#4a4870] font-bold mt-1 uppercase tracking-widest">Top 5 Recent entries</p>
                </div>
                <GlowButton label="Add Score" variant="ghost" className="py-2 px-4 text-xs font-black uppercase" />
              </div>
              <div className="p-2">
                <ScoreManager />
              </div>
            </GlassCard>
          </div>

          {/* This Month's Draw (40%) */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="bg-gradient-to-br from-[#13131f] to-[#0a0a0f] border-violet-500/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white italic">MAY DRAW</h2>
                <StatBadge text="ACTIVE" variant="violet" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-[10px] uppercase text-[#4a4870] font-black tracking-widest mb-4">Ends In</div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { val: '12', label: 'Days' },
                      { val: '08', label: 'Hrs' },
                      { val: '45', label: 'Min' },
                      { val: '12', label: 'Sec' },
                    ].map((t) => (
                      <div key={t.label} className="text-center bg-white/5 rounded-xl py-3 border border-white/5">
                        <div className="text-xl font-black text-white tabular-nums">{t.val}</div>
                        <div className="text-[9px] uppercase font-bold text-[#4a4870]">{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-violet-600/5 border border-violet-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-violet-600 rounded-lg shadow-lg">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-white font-bold">Estimated Jackpot</div>
                      <div className="text-2xl font-black text-violet-400 tracking-tighter">£42,500.00</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#4a4870] font-black uppercase">
                    <span>Your Win Probability</span>
                    <span className="text-violet-400">1 in 452</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Heart className="w-12 h-12 text-rose-500/10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-sm font-bold text-[#4a4870] uppercase tracking-widest mb-4">Impact Report</h3>
              <div className="text-2xl font-black text-white mb-2 italic">£2,450.00</div>
              <p className="text-xs text-[#9b99c4] leading-relaxed">
                Total contribution from you and your referred members to <span className="text-rose-400 font-bold">Cancer Research UK</span>.
              </p>
              <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase">
                <Clock className="w-3 h-3" /> Updated 2m ago
              </div>
            </GlassCard>
          </div>
        </div>
      </ErrorBoundary>

      {/* BOTTOM ROW: PARTICIPATION HISTORY */}
      <GlassCard className="p-0 border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <h2 className="text-xl font-bold text-white italic">PARTICIPATION HISTORY</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Month</th>
                <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Scores Entered</th>
                <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Match Type</th>
                <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Prize</th>
                <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { month: 'April 2026', scores: '5/5', match: '3-Match', prize: '£12.50', status: 'Won', color: 'text-emerald-400' },
                { month: 'March 2026', scores: '5/5', match: 'No Match', prize: '-', status: 'No Match', color: 'text-[#4a4870]' },
                { month: 'February 2026', scores: '4/5', match: 'Upcoming', prize: 'TBD', status: 'Pending', color: 'text-amber-400' },
              ].map((row, i) => (
                <motion.tr 
                  key={row.month}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{row.month}</td>
                  <td className="px-8 py-5 text-sm text-[#9b99c4] tabular-nums">{row.scores}</td>
                  <td className="px-8 py-5 text-sm text-[#9b99c4] uppercase font-medium">{row.match}</td>
                  <td className="px-8 py-5 text-sm font-black text-white">{row.prize}</td>
                  <td className="px-8 py-5">
                    <span className={cn("text-[10px] font-black uppercase px-2 py-1 rounded border", 
                      row.status === 'Won' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" :
                      row.status === 'Pending' ? "border-amber-500/20 bg-amber-500/10 text-amber-400" :
                      "border-white/10 bg-white/5 text-[#4a4870]"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardPage;
