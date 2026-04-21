import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Score } from '../types';

export const useAdminData = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all regular user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all scores for calculation
      const { data: scoresData, error: scoresError } = await supabase
        .from('scores')
        .select('*');

      if (scoresError) throw scoresError;

      setUsers(profilesData || []);
      setScores(scoresData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { users, scores, loading, refreshData: fetchData };
};
