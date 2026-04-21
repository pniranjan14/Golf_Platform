import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile, Score } from '../types';

export interface DashboardStats {
  profile: Profile | null;
  currentScoresCount: number;
  totalEntries: number;
  totalWinnings: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentScoresCount, setCurrentScoresCount] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
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

      // 2. Fetch Scores for current month (count)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { count: currentCount, error: countError } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('score_date', firstDay);

      if (!countError) {
        setCurrentScoresCount(currentCount || 0);
      }

      // 3. Fetch Total Entries (lifetime)
      const { count: lifetimeCount, error: lifetimeError } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!lifetimeError) {
        setTotalEntries(lifetimeCount || 0);
      }

      // 4. Fetch Winnings (Placeholder for now as no winnings table exists)
      // If you eventually create a 'winnings' table, fetch it here.
      setTotalWinnings(0);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    currentScoresCount,
    totalEntries,
    totalWinnings,
    loading,
    refresh: fetchData
  };
};
