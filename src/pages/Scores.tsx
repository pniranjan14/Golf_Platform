import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Activity } from 'lucide-react';
import { ScoreManager } from '../components/scores/ScoreManager';

const ScoresPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-5xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-violet-500 font-bold uppercase tracking-widest text-xs mb-3">
            <Activity className="w-4 h-4" />
            Performance Tracking
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tight">MY <span className="text-violet-500">SCORE HISTORY</span></h1>
          <p className="text-[#9b99c4] mt-2">Manage your rounds and track your progress throughout the month.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
            <div className="text-[10px] text-[#4a4870] font-bold uppercase tracking-wider mb-1">Monthly Peak</div>
            <div className="text-2xl font-black text-white italic">42 <span className="text-xs text-[#4a4870] not-italic font-bold ml-1">pts</span></div>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
            <div className="text-[10px] text-[#4a4870] font-bold uppercase tracking-wider mb-1">Draw Entries</div>
            <div className="text-2xl font-black text-violet-500 italic">05 <span className="text-xs text-[#4a4870] not-italic font-bold ml-1">/ 05</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <ScoreManager />
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-3xl bg-gradient-to-br from-violet-600/20 to-transparent border border-violet-500/20 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-violet-400" />
              <h2 className="font-bold text-white uppercase tracking-wider text-sm">Winning Strategy</h2>
            </div>
            <p className="text-sm text-[#9b99c4] leading-relaxed mb-4">
              Submit up to 5 scores per month. We automatically match your rounds against the official monthly winning score.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#f1f0ff] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Score 40+ is a Gold Match
              </div>
              <div className="flex items-center gap-3 text-xs text-[#f1f0ff] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Score 35-39 is a Silver Match
              </div>
              <div className="flex items-center gap-3 text-xs text-[#f1f0ff] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4a4870]" />
                Any matching score wins!
              </div>
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-[#4a4870]" />
              <h2 className="font-bold text-[#f1f0ff] uppercase tracking-wider text-sm">Next Official Draw</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-[#4a4870] font-bold uppercase mb-1">Draw Date</div>
                <div className="text-lg font-bold text-white">May 01, 2026</div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] text-[#4a4870] font-bold uppercase mb-1">Jackpot Estimate</div>
                <div className="text-2xl font-black text-emerald-400">£25,480.00</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoresPage;
