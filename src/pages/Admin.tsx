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
  Lock, 
  Activity,
  Download,
  CheckCircle2,
  Clock,
  Terminal
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatBadge } from '../components/ui/StatBadge';
import { GlowButton } from '../components/ui/GlowButton';
import { cn } from '../lib/utils';
import { toast } from '../hooks/useToast';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'draws' | 'users' | 'winners'>('draws');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    setTimeout(() => {
      setSimulationResult({
        winners: { match5: 1, match4: 3, match3: 18 },
        pool: { match5: 42500, match4: 12450, match3: 8420 },
        totalPayout: 63370
      });
      setIsSimulating(false);
      toast.success('Simulation Complete', 'Entropy calculation reached 100% consensus.');
    }, 2000);
  };

  const tabs = [
    { id: 'draws', label: 'Draw Management', icon: Trophy },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'winners', label: 'Verifications', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 bg-violet-600/5 border border-violet-500/20 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Terminal className="w-64 h-64 rotate-12" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-violet-600 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.4)]">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">ADMIN <span className="text-violet-500">TERMINAL</span></h1>
            <div className="flex items-center gap-3 mt-2">
              <StatBadge text="SYSTEM LEVEL 4" variant="violet" />
              <div className="flex items-center gap-2 text-[10px] text-[#4a4870] font-black uppercase tracking-widest">
                <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                Network Secure
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <div className="text-right hidden sm:block">
              <div className="text-white font-bold text-sm">PRANJAL NIRANJAN</div>
              <div className="text-[#4a4870] text-[10px] uppercase font-black tracking-widest">Master Administrator</div>
           </div>
           <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 p-1">
             <div className="w-full h-full rounded-full bg-violet-600" />
           </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                  : "text-[#4a4870] hover:text-white"
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
                <GlassCard className="p-10 space-y-8 h-full">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <Settings className="w-5 h-5 text-violet-500" />
                    <h3 className="text-lg font-black text-white italic uppercase">CONFIGURE DRAW</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-[#4a4870] uppercase tracking-widest block mb-3">Draw Intensity</label>
                      <select className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:border-violet-500 transition-all appearance-none">
                        <option>Weighted Algorithm (V2.4)</option>
                        <option>Pure Random Entropy</option>
                        <option>Community Consensus</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-[#4a4870] uppercase tracking-widest block mb-3">Scheduling Month</label>
                      <input type="month" className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-5 py-4 text-white font-bold outline-none focus:border-violet-500 transition-all" />
                    </div>

                    <div className="p-6 rounded-2xl bg-violet-600/5 border border-violet-500/10 space-y-4">
                       <div className="flex justify-between text-[10px] font-black uppercase text-[#4a4870]">
                         <span>Eligible Members</span>
                         <span className="text-white">1,245 Members</span>
                       </div>
                       <div className="flex justify-between text-[10px] font-black uppercase text-[#4a4870]">
                         <span>Verified Score Pool</span>
                         <span className="text-white">6,225 Entries</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <button 
                      onClick={runSimulation}
                      disabled={isSimulating}
                      className={cn(
                        "w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500",
                        isSimulating ? "bg-white/5 text-[#4a4870]" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      )}
                    >
                      {isSimulating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                          CALCULATING ENTROPY...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-5 h-5 text-violet-500" />
                          RUN SIMULATION
                        </>
                      )}
                    </button>
                    <GlowButton 
                      label="PUBLISH OFFICIAL DRAW" 
                      className="w-full py-5" 
                      variant="primary" 
                      onClick={() => toast.info('Publishing Restricted', 'This action requires Tier-3 multisig authorization.')}
                    />
                  </div>
                </GlassCard>
              </div>

              {/* Simulation Result Panel */}
              <div className="lg:col-span-3">
                <GlassCard className="p-0 border-white/5 bg-[#0f0f1a] overflow-hidden">
                   <div className="p-10 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-violet-600/5 to-transparent">
                      <div>
                        <h3 className="text-lg font-black text-white italic uppercase">SIMULATION RESULTS</h3>
                        <p className="text-[10px] text-[#4a4870] font-black uppercase tracking-widest mt-1">Live Engine feedback</p>
                      </div>
                      {simulationResult && <StatBadge text="CONSENSUS REACHED" variant="emerald" />}
                   </div>
                   
                   <div className="p-10">
                      {simulationResult ? (
                        <div className="space-y-10">
                           <div className="grid grid-cols-3 gap-6">
                              {[
                                { label: 'Match 5', count: simulationResult.winners.match5, pool: '£42.5k', color: 'text-violet-400' },
                                { label: 'Match 4', count: simulationResult.winners.match4, pool: '£12.4k', color: 'text-white' },
                                { label: 'Match 3', count: simulationResult.winners.match3, pool: '£8.4k', color: 'text-white' },
                              ].map((tier) => (
                                <div key={tier.label} className="p-6 bg-white/[0.02] border border-white/10 rounded-[32px] text-center space-y-2">
                                  <div className="text-[10px] font-black uppercase text-[#4a4870] tracking-widest">{tier.label}</div>
                                  <div className={cn("text-4xl font-black italic", tier.color)}>{tier.count}</div>
                                  <div className="text-[10px] font-bold text-[#4a4870] italic">Pool: {tier.pool}</div>
                                </div>
                              ))}
                           </div>

                           <div className="flex items-center justify-between p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20">
                              <div className="flex items-center gap-6">
                                <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                                  <Database className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                   <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Payout Volume</div>
                                   <div className="text-4xl font-black text-white italic tracking-tighter tabular-nums">£{simulationResult.totalPayout.toLocaleString()}</div>
                                </div>
                              </div>
                              <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[#4a4870] hover:text-white">
                                <Download className="w-5 h-5" />
                              </button>
                           </div>

                           <div className="grid grid-cols-2 gap-8 pt-4">
                              <div className="flex items-center gap-4 text-xs font-bold text-[#4a4870]">
                                 <Clock className="w-4 h-4" /> ENGINE STABILITY: 99.9%
                              </div>
                              <div className="flex items-center gap-4 text-xs font-bold text-[#4a4870] justify-end underline">
                                 AUDIT LOG RECONCILIATION
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                           <div className="w-24 h-24 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                              <Eye className="w-10 h-10 text-[#4a4870] opacity-20" />
                           </div>
                           <div className="space-y-2 max-w-xs">
                              <h4 className="text-white font-bold italic uppercase tracking-widest">No Live Simulation</h4>
                              <p className="text-sm text-[#4a4870] font-medium leading-relaxed italic">
                                Initialize the draw engine from the control panel to generate potential outcomes.
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
              <GlassCard className="p-0 border-white/5 overflow-hidden">
                <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-end">
                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tight">PENDING VERIFICATIONS</h3>
                      <p className="text-[10px] text-[#4a4870] font-black uppercase tracking-[0.2em] mt-2">Jackpot & Tier 2 Proof Verification Required</p>
                   </div>
                   <StatBadge text="5 QUEUED" variant="amber" />
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="text-[10px] uppercase font-black tracking-widest text-[#4a4870] border-b border-white/5">
                         <tr>
                            <th className="px-10 py-6">Member ID</th>
                            <th className="px-6 py-6">Win Tier</th>
                            <th className="px-6 py-6">Asset Proof</th>
                            <th className="px-6 py-6 text-right">Verification Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {[
                           { id: 'MEM-4029', email: 'tiger.woods@example.com', tier: 'Match 5 (Jackpot)', status: 'Pending Review', color: 'text-violet-400' },
                           { id: 'MEM-8821', email: 'mcilroy.r@example.com', tier: 'Match 4', status: 'Incomplete', color: 'text-white' },
                           { id: 'MEM-1102', email: 'rahm.j@example.com', tier: 'Match 5 (Jackpot)', status: 'Awaiting Proof', color: 'text-violet-400' },
                         ].map((winner) => (
                           <tr key={winner.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="px-10 py-7">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-[10px] text-[#4a4870]">{winner.id.split('-')[1]}</div>
                                    <div>
                                      <div className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors uppercase italic">{winner.email}</div>
                                      <div className="text-[9px] text-[#4a4870] font-black uppercase tracking-widest">{winner.id}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-7">
                                 <div className={cn("text-xs font-black uppercase italic tracking-tight", winner.color)}>{winner.tier}</div>
                              </td>
                              <td className="px-6 py-7">
                                 <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-[#4a4870]">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", winner.status === 'Incomplete' ? 'bg-amber-500' : 'bg-blue-400 animate-pulse')} />
                                    {winner.status}
                                 </span>
                              </td>
                              <td className="px-6 py-7 text-right">
                                 <div className="flex items-center justify-end gap-3">
                                    <button className="px-4 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase text-[#4a4870] hover:bg-white/5 hover:text-white transition-all">
                                       VIEW ASSETS
                                    </button>
                                    <button 
                                      onClick={() => toast.success('Winner Verified', `Member ${winner.id} has been moved to the payout queue.`)}
                                      className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-black"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-8"
            >
               <div className="relative">
                  <div className="absolute inset-0 bg-rose-500/20 blur-[60px] rounded-full" />
                  <div className="relative w-32 h-32 rounded-[40px] bg-rose-600/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                    <Lock className="w-12 h-12" />
                  </div>
               </div>
               <div className="space-y-4 max-w-sm">
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">ACCESS DENIED</h2>
                  <p className="text-[#9b99c4] italic leading-relaxed">
                    The User Master Directory requires secondary biometric verification. This module is currently locked.
                  </p>
                  <GlowButton label="Request Authorization" variant="ghost" className="mt-4" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPage;
