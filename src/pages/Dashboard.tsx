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
import { useDashboardData, CHARITY_MAP } from '../hooks/useDashboardData';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    profile, 
    currentScoresCount, 
    totalEntries, 
    totalWinnings, 
    latestDraw,
    participationHistory,
    loading, 
    refresh 
  } = useDashboardData();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-[#4a4870] font-black uppercase tracking-widest animate-pulse">Syncing Mission Data...</p>
        </div>
      </div>
    );
  }

  // Calculate Impact Stats
  const subscriberFee = 25.00;
  const charityPercent = profile?.charity_percent || 0;
  const monthlyImpact = (subscriberFee * (charityPercent / 100)).toFixed(2);
  const totalImpact = (totalEntries * (subscriberFee * (charityPercent / 100))).toFixed(2);
  const selectedCharityName = profile?.charity_id ? CHARITY_MAP[profile.charity_id] || 'Selected Charity' : 'No Charity Selected';

  const stats = [
    { 
      label: 'Subscription Status', 
      value: profile?.role === 'admin' ? 'Master' : 'Elite', 
      icon: CreditCard, 
      color: 'bg-emerald-500/10 text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      sub: profile?.role === 'admin' ? 'Full System Access' : 'Monthly Member'
    },
    { 
      label: 'Current Scores', 
      value: `${currentScoresCount}/5`, 
      icon: TrendingUp, 
      color: 'bg-violet-500/10 text-violet-400',
      glow: 'shadow-[0_0_20px_rgba(124,58,237,0.2)]',
      sub: currentScoresCount < 5 ? `+${5 - currentScoresCount} entries needed` : 'Monthly quota met'
    },
    { 
      label: 'Draws Entered', 
      value: totalEntries.toString(), 
      icon: Trophy, 
      color: 'bg-amber-500/10 text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(217,119,6,0.2)]',
      sub: 'Total lifetime entries'
    },
    { 
      label: 'Total Winnings', 
      value: totalWinnings > 0 ? `£${totalWinnings.toFixed(2)}` : '£0.00', 
      icon: CheckCircle2, 
      color: 'bg-rose-500/10 text-rose-400',
      glow: 'shadow-[0_0_20px_rgba(225,29,72,0.2)]',
      sub: totalWinnings > 0 ? 'Sent to your wallet' : 'Awaiting first victory'
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
            <span className="opacity-50">Welcome back,</span> {profile?.full_name || user?.email?.split('@')[0]}
            <span className="w-1 h-1 rounded-full bg-[#4a4870]" />
            <span className="text-violet-400">{profile?.role === 'admin' ? 'Master Admin' : 'Elite Member'}</span>
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
                <div className="flex items-center gap-3">
                   <StatBadge text={`${currentScoresCount}/5 SLOTS`} variant={currentScoresCount === 5 ? 'emerald' : 'violet'} />
                </div>
              </div>
              <div className="p-2">
                <ScoreManager onScoreAdded={refresh} />
              </div>
            </GlassCard>
          </div>

          {/* This Month's Draw (40%) */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="bg-gradient-to-br from-[#13131f] to-[#0a0a0f] border-violet-500/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                  {latestDraw?.month || 'CURRENT'} DRAW
                </h2>
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
                      <div className="text-xs text-white font-bold italic">Estimated Jackpot</div>
                      <div className="text-2xl font-black text-violet-400 tracking-tighter tabular-nums">
                        {latestDraw?.total_prize_pool || '£42,500.00'}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#4a4870] font-black uppercase">
                    <span>Your Win Probability</span>
                    <span className="text-violet-400">1 in {latestDraw?.participants_count ? (latestDraw.participants_count / currentScoresCount).toFixed(0) : '452'}</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden group border-white/5 bg-[#0a0a0f]">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Heart className="w-16 h-16 text-rose-500 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-sm font-bold text-[#4a4870] uppercase tracking-widest mb-4 italic">Impact Report</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums">£{monthlyImpact}</div>
                <div className="text-[10px] text-[#4a4870] font-bold uppercase">/ Round</div>
              </div>
              <p className="text-[11px] text-[#9b99c4] leading-relaxed font-medium">
                Total contribution of <span className="text-white font-bold tabular-nums">£{totalImpact}</span> generated for <br />
                <span className="text-rose-400 font-black uppercase tracking-tight">{selectedCharityName}</span>.
              </p>
              <div className="mt-6 flex items-center gap-2 text-emerald-400/60 font-black text-[9px] uppercase tracking-[0.2em]">
                <Clock className="w-3 h-3" /> Real-time tracking active
              </div>
            </GlassCard>
          </div>
        </div>
      </ErrorBoundary>

      {/* BOTTOM ROW: PARTICIPATION HISTORY */}
      <GlassCard className="p-0 border-white/5 overflow-hidden bg-[#0a0a0f]">
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white italic uppercase tracking-tight">PARTICIPATION HISTORY</h2>
          <div className="text-[10px] text-[#4a4870] font-black uppercase tracking-widest">Lifetime Audit Log</div>
        </div>
        <div className="overflow-x-auto">
          {participationHistory.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Month</th>
                  <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Scores Entered</th>
                  <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Match Status</th>
                  <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Winnings</th>
                  <th className="px-8 py-4 text-[10px] uppercase font-black tracking-widest text-[#4a4870]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {participationHistory.map((row, i) => (
                  <motion.tr 
                    key={row.month}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight italic">{row.month}</td>
                    <td className="px-8 py-5 text-sm text-[#9b99c4] tabular-nums font-medium">{row.scores}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider",
                        row.match === 'Match Found' ? "text-emerald-400" : "text-[#4a4870]"
                      )}>
                        {row.match}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-white tabular-nums">{row.prize}</td>
                    <td className="px-8 py-5">
                      <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border tracking-widest", 
                        row.status === 'Won' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" :
                        "border-white/10 bg-white/5 text-[#4a4870]"
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center space-y-4">
               <div className="text-[#4a4870] font-black uppercase tracking-[0.3em] text-xs">No Draw History Detected</div>
               <p className="text-[11px] text-[#4a4870] italic">Add scores and wait for the monthly draw to begin your legacy.</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardPage;
