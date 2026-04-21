import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile, Draw } from '../types';

export const CHARITY_MAP: Record<string, string> = {
  'char_1': 'Green Fairways Foundation',
  'char_2': 'Junior Golfers Initiative',
  'char_3': 'Veterans Golf Retreat',
  'char_4': 'Cancer Research UK',
  'char_5': 'Ocean Clean Up',
  'char_6': 'Blind Golf Association'
};

export const useDashboardData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentScoresCount, setCurrentScoresCount] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [latestDraw, setLatestDraw] = useState<Draw | null>(null);
  const [participationHistory, setParticipationHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileError) {
        setProfile(profileData);
      }

      // 2. Fetch Latest Draw
      const { data: drawsData, error: drawsError } = await supabase
        .from('draws')
        .select('*')
        .order('draw_date', { ascending: false })
        .limit(5);

      if (!drawsError && drawsData && drawsData.length > 0) {
        setLatestDraw(drawsData[0]);
      }

      // 3. Fetch User Scores
      const { data: scoresData, error: scoresError } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)
        .order('score_date', { ascending: false });

      if (!scoresError && scoresData) {
        const scores = scoresData || [];
        setTotalEntries(scores.length);
        
        // Count scores for current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthScores = scores.filter(s => new Date(s.score_date) >= startOfMonth);
        setCurrentScoresCount(Math.min(5, currentMonthScores.length));

        // 4. Calculate Winnings & Participation History
        // We match scores with draws by month
        const history: any[] = [];
        let winnings = 0;

        if (drawsData) {
          drawsData.forEach(draw => {
            const drawDate = new Date(draw.draw_date);
            const monthLabel = draw.month || formatMonth(drawDate);
            
            // Find user scores for that month/year
            const monthScores = scores.filter(s => {
              const sDate = new Date(s.score_date);
              return sDate.getMonth() === drawDate.getMonth() && sDate.getFullYear() === drawDate.getFullYear();
            });

            if (monthScores.length > 0) {
              const hasWin = monthScores.some(s => s.score === draw.winning_score);
              const prize = hasWin ? draw.total_prize_pool : '-';
              
              if (hasWin) {
                // Simplified winnings calculation: just use the prize pool string/value
                const prizeVal = typeof draw.total_prize_pool === 'string' 
                  ? parseFloat(draw.total_prize_pool.replace(/[^0-9.]/g, '')) 
                  : draw.total_prize_pool;
                winnings += prizeVal || 0;
              }

              history.push({
                month: monthLabel,
                scores: `${monthScores.length}/5`,
                match: hasWin ? 'Match Found' : 'No Match',
                prize: hasWin ? `£${prize}` : '-',
                status: hasWin ? 'Won' : 'Completed'
              });
            }
          });
        }
        
        setParticipationHistory(history);
        setTotalWinnings(winnings);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    currentScoresCount,
    totalEntries,
    totalWinnings,
    latestDraw,
    participationHistory,
    loading,
    refresh: fetchData
  };
};
