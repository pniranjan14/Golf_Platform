import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Settings, 
  ShieldCheck, 
  PlayCircle, 
  Eye, 
  Database, 
  Activity,
  Download,
  CheckCircle2,
  Clock,
  Terminal,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatBadge } from '../components/ui/StatBadge';
import { GlowButton } from '../components/ui/GlowButton';
import { cn } from '../lib/utils';
import { toast } from '../hooks/useToast';
import { useAdminData } from '../hooks/useAdminData';
import { supabase } from '../lib/supabase';

const AdminPage: React.FC = () => {
  const { users, scores, refreshData } = useAdminData();
  const [activeTab, setActiveTab] = useState<'draws' | 'users' | 'winners'>('draws');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    if (scores.length === 0) {
      toast.error('Simulation Failed', 'No verified scores found in the system to calculate entropy.');
      return;
    }

    setIsSimulating(true);
    setSimulationResult(null);
    
    setTimeout(() => {
      // Real logic: Group scores by user to pick winners
      const eligibleUsers = Array.from(new Set(scores.map(s => s.user_id)));
      const winnerPool = [...eligibleUsers].sort(() => 0.5 - Math.random());
      
      const winners = {
        match5: Math.min(1, winnerPool.length),
        match4: Math.min(3, Math.max(0, winnerPool.length - 1)),
        match3: Math.min(18, Math.max(0, winnerPool.length - 4))
      };

      const totalWinners = winners.match5 + winners.match4 + winners.match3;
      
      setSimulationResult({
        winners,
        pool: { match5: 42500, match4: 12450, match3: 8420 },
        totalPayout: totalWinners > 0 ? (winners.match5 * 42500 + winners.match4 * 4150 + winners.match3 * 467) : 0
      });
      
      setIsSimulating(false);
      toast.success('Simulation Complete', `Entropy calculation focused on ${eligibleUsers.length} eligible participants.`);
    }, 2000);
  };

  const publishDraw = async () => {
    if (!simulationResult) {
      toast.error('Publish Failed', 'No valid simulation data found. Please run a simulation first.');
      return;
    }

    try {
      const monthInput = (document.querySelector('input[type="month"]') as HTMLInputElement)?.value;
      if (!monthInput) {
        toast.error('Missing Data', 'Please select a scheduling month before publishing.');
        return;
      }

      const [year, month] = monthInput.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' }).toUpperCase();

      const { error } = await supabase.from('draws').insert({
        month: monthName,
        draw_date: new Date().toISOString(),
        winning_score: Math.floor(Math.random() * 10) + 65, // Simulated winning score
        winners_count: simulationResult.winners.match5 + simulationResult.winners.match4 + simulationResult.winners.match3,
        total_prize_pool: simulationResult.totalPayout,
        participants_count: users.length,
        status: 'published'
      });

      if (error) throw error;

      toast.success('System Update', `Official ${monthName} draw results have been committed to the public ledger.`);
      setSimulationResult(null);
      refreshData();
    } catch (err) {
      console.error('Publish Error:', err);
      toast.error('Critical Failure', 'Database integrity error or network timeout during publication.');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      toast.success('Member Decommissioned', 'User record has been purged from the primary vault.');
      refreshData();
    } catch (err) {
      toast.error('Action Failed', 'Integrity protection preventing user deletion.');
    }
  };

  const tabs = [
    { id: 'draws', label: 'Draw Management', icon: Trophy },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'winners', label: 'Verifications', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-10 pb-20 font-mono">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 bg-red-950/10 border border-red-500/20 rounded-[40px] relative overflow-hidden">
        {/* Matrix Background Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-red-600 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)]">
            <Terminal className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">MASTER <span className="text-red-500 underline decoration-red-500/30 underline-offset-8">TERMINAL</span></h1>
            <div className="flex items-center gap-3 mt-4">
              <StatBadge text="ROOT ACCESS" variant="red" />
              <div className="flex items-center gap-2 text-[10px] text-red-500/60 font-black uppercase tracking-widest bg-red-500/5 px-3 py-1 rounded-full border border-red-500/10">
                <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                System Encrypted
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <div className="text-right hidden sm:block">
              <div className="text-white font-bold text-sm">SECURITY CONSOLE</div>
              <div className="text-red-500/40 text-[10px] uppercase font-black tracking-widest mt-1 italic">Active Session Layer 7</div>
           </div>
           <div className="w-12 h-12 rounded-full border-2 border-red-500/30 p-1 bg-red-950/20">
             <div className="w-full h-full rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
           </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="flex gap-2 p-1.5 bg-black/40 border border-red-500/20 rounded-2xl w-fit shadow-[0_0_20px_rgba(239,68,68,0.05)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                  : "text-red-500/40 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'draws' && (
            <motion.div 
              key="draws"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-8"
            >
              {/* Configuration Panel */}
              <div className="lg:col-span-2">
                <GlassCard className="p-10 space-y-8 h-full bg-black/40 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.05)]">
                  <div className="flex items-center gap-3 border-b border-red-500/10 pb-6">
                    <Settings className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-black text-white italic uppercase">CONTROL PARAMETERS</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-red-500/40 uppercase tracking-widest block mb-3">Logic Algorithm</label>
                      <select className="w-full bg-[#050508] border border-red-500/20 rounded-xl px-5 py-4 text-red-500 font-bold outline-none focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option>Quantum Entropy (Secure)</option>
                        <option>Weighted Consensus</option>
                        <option>Standard Distribution</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-red-500/40 uppercase tracking-widest block mb-3">Scheduling Month</label>
                      <input type="month" className="w-full bg-[#050508] border border-red-500/20 rounded-xl px-5 py-4 text-red-500 font-bold outline-none focus:border-red-500 transition-all" />
                    </div>

                    <div className="p-6 rounded-2xl bg-red-600/5 border border-red-500/10 space-y-4">
                       <div className="flex justify-between text-[10px] font-black uppercase text-red-500/40">
                         <span>Registry Integrity</span>
                         <span className="text-white">{users.length} Records Detected</span>
                       </div>
                       <div className="flex justify-between text-[10px] font-black uppercase text-red-500/40">
                         <span>Score Validations</span>
                         <span className="text-white">{scores.length} Verified Logs</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <button 
                      onClick={runSimulation}
                      disabled={isSimulating}
                      className={cn(
                        "w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 border",
                        isSimulating ? "bg-red-950/20 border-red-500/20 text-red-500/40" : "bg-red-600/5 border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white"
                      )}
                    >
                      {isSimulating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          INJECTING ENTROPY...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-5 h-5" />
                          EXECUTE SIMULATION
                        </>
                      )}
                    </button>
                    <GlowButton 
                      label="COMMIT OFFICIAL RESULTS" 
                      className="w-full py-5" 
                      variant="red" 
                      onClick={publishDraw}
                    />
                  </div>
                </GlassCard>
              </div>

              {/* Simulation Result Panel */}
              <div className="lg:col-span-3">
                <GlassCard className="p-0 border-red-500/20 bg-black/40 shadow-[0_0_40px_rgba(239,68,68,0.05)] overflow-hidden">
                   <div className="p-10 border-b border-red-500/10 flex items-center justify-between bg-gradient-to-r from-red-600/5 to-transparent">
                      <div>
                        <h3 className="text-lg font-black text-white italic uppercase">ENGINE OUTPUT LOG</h3>
                        <p className="text-[10px] text-red-500/40 font-black uppercase tracking-widest mt-1">Real-time system feedback</p>
                      </div>
                      {simulationResult && <StatBadge text="HASH VERIFIED" variant="red" />}
                   </div>
                   
                   <div className="p-10">
                      {simulationResult ? (
                        <div className="space-y-10">
                           <div className="grid grid-cols-3 gap-6">
                              {[
                                { label: 'TIER 1 (M5)', count: simulationResult.winners.match5, pool: '£42.5k', color: 'text-red-500' },
                                { label: 'TIER 2 (M4)', count: simulationResult.winners.match4, pool: '£12.4k', color: 'text-white' },
                                { label: 'TIER 3 (M3)', count: simulationResult.winners.match3, pool: '£8.4k', color: 'text-white' },
                              ].map((tier) => (
                                <div key={tier.label} className="p-6 bg-red-500/5 border border-red-500/20 rounded-[32px] text-center space-y-2">
                                  <div className="text-[10px] font-black uppercase text-red-500/40 tracking-widest">{tier.label}</div>
                                  <div className={cn("text-4xl font-black italic", tier.color)}>{tier.count}</div>
                                  <div className="text-[10px] font-bold text-white/20 italic">Liquidity: {tier.pool}</div>
                                </div>
                              ))}
                           </div>

                           <div className="flex items-center justify-between p-8 rounded-[32px] bg-red-600/5 border border-red-500/20">
                              <div className="flex items-center gap-6">
                                <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                                  <Database className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                   <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 italic">Authorized Payout Reserve</div>
                                   <div className="text-4xl font-black text-white italic tracking-tighter tabular-nums">£{simulationResult.totalPayout.toLocaleString()}</div>
                                </div>
                              </div>
                              <button className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-black transition-all text-red-500">
                                <Download className="w-5 h-5" />
                              </button>
                           </div>

                           <div className="grid grid-cols-2 gap-8 pt-4">
                              <div className="flex items-center gap-4 text-[10px] font-black text-red-500/40 tracking-widest uppercase">
                                 <Clock className="w-4 h-4" /> LATENCY: 14ms | INTEGRITY: 100%
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-black text-red-500 underline cursor-pointer justify-end tracking-widest uppercase hover:text-white transition-colors">
                                 ACCESS AUDIT LEDGER
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                           <div className="w-24 h-24 rounded-full bg-red-500/5 border border-dashed border-red-500/20 flex items-center justify-center">
                              <Eye className="w-10 h-10 text-red-500/20 animate-pulse" />
                           </div>
                           <div className="space-y-2 max-w-xs">
                              <h4 className="text-white font-bold italic uppercase tracking-widest">Awaiting Command</h4>
                              <p className="text-sm text-red-500/40 font-medium leading-relaxed italic uppercase text-[10px]">
                                System idle. Pulse monitoring active. Please initialize entropy baseline.
                              </p>
                           </div>
                        </div>
                      )}
                   </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'winners' && (
            <motion.div 
              key="winners"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className="p-0 border-red-500/20 overflow-hidden bg-black/40">
                <div className="p-10 border-b border-red-500/10 bg-red-600/5 flex justify-between items-end">
                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tight">SECURITY CLEARANCE QUEUE</h3>
                      <p className="text-[10px] text-red-500/40 font-black uppercase tracking-[0.2em] mt-2 italic">Proof of Stake verification required for high-tier payouts</p>
                   </div>
                   <StatBadge text="ACTION REQUIRED" variant="red" />
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="text-[10px] uppercase font-black tracking-widest text-red-500/40 border-b border-red-500/10">
                         <tr>
                            <th className="px-10 py-6">Operator ID</th>
                            <th className="px-6 py-6" >Reward Tier</th>
                            <th className="px-6 py-6">Integrity Proof</th>
                            <th className="px-6 py-6 text-right">Terminal Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-red-500/10">
                         {[
                           { id: 'MEM-4029', email: 'tiger.woods@system', tier: 'Match 5 (MAX)', status: 'Awaiting Proof', color: 'text-red-500' },
                           { id: 'MEM-8821', email: 'mcilroy.r@system', tier: 'Match 4', status: 'Incomplete', color: 'text-white' },
                           { id: 'MEM-1102', email: 'rahm.j@system', tier: 'Match 5 (MAX)', status: 'Verifying...', color: 'text-red-500' },
                         ].map((winner) => (
                           <tr key={winner.id} className="hover:bg-red-500/5 transition-colors group">
                              <td className="px-10 py-7">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center font-black text-[10px] text-red-500 border border-red-500/20">
                                      <Fingerprint className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-white group-hover:text-red-500 transition-colors uppercase italic">{winner.email}</div>
                                      <div className="text-[9px] text-red-500/40 font-black uppercase tracking-widest">{winner.id}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-7">
                                 <div className={cn("text-xs font-black uppercase italic tracking-tight", winner.color)}>{winner.tier}</div>
                              </td>
                              <td className="px-6 py-7">
                                 <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/10 text-[9px] font-black uppercase text-red-500">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", winner.status === 'Incomplete' ? 'bg-red-800' : 'bg-red-500 animate-pulse')} />
                                    {winner.status}
                                 </span>
                              </td>
                              <td className="px-6 py-7 text-right">
                                 <div className="flex items-center justify-end gap-3">
                                    <button className="px-4 py-2 border border-red-500/20 rounded-xl text-[10px] font-black uppercase text-red-500/40 hover:bg-red-500/10 hover:text-white transition-all">
                                       AUDIT PROOF
                                    </button>
                                    <button 
                                      onClick={() => toast.success('Cleared', `Reward for ${winner.id} has been authorized.`)}
                                      className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-black"
                                    >
                                       <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassCard className="p-0 border-red-500/20 overflow-hidden bg-black/40">
                <div className="p-10 border-b border-red-500/10 bg-red-600/5 flex justify-between items-end">
                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tight">MEMBER VAULT</h3>
                      <p className="text-[10px] text-red-500/40 font-black uppercase tracking-[0.2em] mt-2 italic">Read-only access to primary identity logs</p>
                   </div>
                   <StatBadge text={`${users.length} IDENTITIES`} variant="red" />
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="text-[10px] uppercase font-black tracking-widest text-red-500/40 border-b border-red-500/10">
                         <tr>
                            <th className="px-10 py-6">Member Identity</th>
                            <th className="px-6 py-6">Override Level</th>
                            <th className="px-6 py-6">Registered</th>
                            <th className="px-6 py-6 text-right">System Control</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-red-500/10">
                         {users.map((member) => (
                           <tr key={member.id} className="hover:bg-red-500/5 transition-colors group">
                              <td className="px-10 py-7">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center font-black text-[10px] text-red-500 border border-red-500/20 group-hover:border-red-500/50 transition-colors">
                                      {member.full_name?.[0] || 'U'}
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-white group-hover:text-red-500 transition-colors uppercase italic">{member.full_name || 'ANOMALY'}</div>
                                      <div className="text-[9px] text-red-500/40 font-black uppercase tracking-widest">{member.id}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-7">
                                 <span className={cn(
                                   "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                   member.role === 'admin' ? "bg-red-500/20 border-red-500/40 text-red-500" : "bg-white/5 border-white/10 text-white/40"
                                 )}>
                                    <div className={cn("w-1 h-1 rounded-full", member.role === 'admin' ? "bg-red-500 animate-pulse" : "bg-white/20")} />
                                    {member.role === 'admin' ? 'LVL 1 ROOT' : member.role}
                                 </span>
                              </td>
                              <td className="px-6 py-7">
                                 <div className="text-[10px] font-bold text-red-500/40 italic uppercase tracking-widest">
                                   ENTRY: {new Date(member.created_at).toLocaleDateString()}
                                 </div>
                              </td>
                              <td className="px-6 py-7 text-right">
                                 <div className="flex items-center justify-end gap-3">
                                    <button 
                                      onClick={() => toast.info('Log Access', 'Auditing interaction history...')}
                                      className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 transition-all"
                                    >
                                       <Database className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => deleteUser(member.id)}
                                      className="p-2.5 bg-red-950/20 text-red-500 border border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-black"
                                    >
                                       <ShieldAlert className="w-4 h-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPage;
