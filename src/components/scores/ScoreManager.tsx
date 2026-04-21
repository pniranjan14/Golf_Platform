import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Score } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Trash2, 
  Calendar, 
  Trophy, 
  AlertCircle, 
  X, 
  ChevronRight,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { GlowButton } from '../ui/GlowButton';
import { GlassCard } from '../ui/GlassCard';
import { toast } from '../../hooks/useToast';

interface ScoreManagerProps {
  onScoreAdded?: () => void;
}

export const ScoreManager: React.FC<ScoreManagerProps> = ({ onScoreAdded }) => {
  const { user } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newScore, setNewScore] = useState('');
  const [scoreDate, setScoreDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user]);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user?.id)
        .order('score_date', { ascending: false });

      if (error) throw error;
      setScores(data || []);
    } catch (err: any) {
      console.error('Error fetching scores:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const scoreNum = parseInt(newScore);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      toast.error('Invalid Score', 'Score must be between 1 and 45');
      return;
    }

    if (scores.some(s => s.score_date === scoreDate)) {
      toast.error('Entry Exists', 'A score for this date already exists');
      return;
    }

    try {
      if (scores.length >= 5) {
        const oldestScore = [...scores].sort((a, b) => 
          new Date(a.score_date).getTime() - new Date(b.score_date).getTime()
        )[0];
        
        const { error: deleteError } = await supabase
          .from('scores')
          .delete()
          .eq('id', oldestScore.id);

        if (deleteError) throw deleteError;
      }

      const { error: insertError } = await supabase
        .from('scores')
        .insert({
          user_id: user?.id,
          score: scoreNum,
          score_date: scoreDate
        });

      if (insertError) throw insertError;

      toast.success('Score Recorded', `Round of ${scoreNum} successfully added.`);
      await fetchScores();
      if (onScoreAdded) onScoreAdded();
      setIsAdding(false);
      setNewScore('');
    } catch (err: any) {
      toast.error('Operation Failed', err.message);
    }
  };

  const handleDeleteScore = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Score Removed', 'The round has been deleted from your history.');
      setScores(scores.filter(s => s.id !== id));
      if (onScoreAdded) onScoreAdded();
    } catch (err: any) {
      toast.error('Delete Failed', err.message);
    }
  };

  if (loading) return (
    <div className="space-y-4 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 w-full rounded-2xl skeleton" />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header with "Add" Trigger */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-violet-500" />
          </div>
          <span className="text-sm font-bold text-white uppercase tracking-widest italic">Performance History</span>
        </div>
        {!isAdding && (
          <GlowButton 
            label="Record Round" 
            variant="ghost" 
            className="py-2.5 px-6 text-xs"
            onClick={() => setIsAdding(true)}
          />
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsAdding(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg"
            >
              <GlassCard className="p-8 border-violet-500/20 bg-[#0a0a0f] shadow-[0_0_50px_rgba(124,58,237,0.15)]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-white italic tracking-tight">ADD <span className="text-violet-500">NEW SCORE</span></h2>
                  <button onClick={() => setIsAdding(false)} className="p-2 text-[#4a4870] hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddScore} className="space-y-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <label className="text-[10px] font-black uppercase text-[#4a4870] tracking-[0.2em] block mb-4">Stableford Score</label>
                      <input 
                        type="number"
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                        className="w-full text-center bg-transparent text-6xl md:text-8xl font-black text-violet-500 outline-none placeholder:text-violet-500/10 transition-all focus:scale-110"
                        placeholder="00"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-[#4a4870] tracking-[0.2em] block mb-2 px-1">Date of Round</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4870]" />
                        <input 
                          type="date"
                          value={scoreDate}
                          onChange={(e) => setScoreDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-medium outline-none focus:border-violet-500/50 transition-all"
                          max={format(new Date(), 'yyyy-MM-dd')}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {scores.length === 5 && (
                    <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Note: You have 5 scores. This will replace the oldest entry automatically.
                    </div>
                  )}

                  <div className="flex gap-4">
                    <GlowButton label="Confirm Score" className="flex-1 py-4" type="submit" />
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {scores.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/10">
              <History className="w-8 h-8 text-[#4a4870]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">No Scores Found</h3>
              <p className="text-[#4a4870] font-medium text-sm">Add your first score to start competing in monthly draws.</p>
            </div>
            <GlowButton label="Add First Score" variant="ghost" onClick={() => setIsAdding(true)} />
          </motion.div>
        ) : (
          <div className="space-y-3">
            {scores.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl tabular-nums shadow-lg",
                      score.score >= 36 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10" :
                      score.score >= 30 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-amber-500/10" :
                      "bg-white/5 text-[#9b99c4] border border-white/10 shadow-black"
                    )}>
                      {score.score}
                    </div>
                    <div>
                      <div className="text-white font-bold tracking-tight mb-1">Stableford Round</div>
                      <div className="flex items-center gap-2 text-[10px] text-[#4a4870] font-black uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(score.score_date), 'MMMM dd, yyyy')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {index === 0 && (
                      <div className="hidden sm:flex px-2 py-1 bg-violet-600/10 border border-violet-500/20 rounded-md text-[9px] font-black text-violet-400 uppercase tracking-tighter">
                        Most Recent
                      </div>
                    )}
                    <button 
                      onClick={() => handleDeleteScore(score.id)}
                      className="p-3 text-[#4a4870] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#4a4870] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
