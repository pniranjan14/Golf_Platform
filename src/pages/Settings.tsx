import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, CreditCard, Heart, Save, Check, Loader2, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CHARITY_MAP } from '../hooks/useDashboardData';
import { cn } from '../lib/utils';
import { toast } from '../hooks/useToast';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    charity_id: '',
    charity_percent: 10,
    avatar_url: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setFormData({
          full_name: data.full_name || '',
          charity_id: data.charity_id || '',
          charity_percent: data.charity_percent || 10,
          avatar_url: data.avatar_url || ''
        });
      }
      setLoading(true);
      setTimeout(() => setLoading(false), 500); // Smooth transition
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          charity_id: formData.charity_id,
          charity_percent: formData.charity_percent,
          avatar_url: formData.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error('Failed to update settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-[#9b99c4]">Manage your profile and charity preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="md:col-span-2 space-y-6">
          <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <User className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-bold text-white">Personal Information</h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-[#131322] border border-white/10 flex items-center justify-center overflow-hidden">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#4a4870]" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-violet-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a4870] uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-[#131322] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Heart className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Charity Allocation</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#4a4870] uppercase tracking-wider mb-2">Select Primary Charity</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(CHARITY_MAP).map(([id, name]) => (
                    <button
                      key={id}
                      onClick={() => setFormData({ ...formData, charity_id: id })}
                      className={cn(
                        "text-left px-4 py-3 rounded-xl border transition-all duration-300",
                        formData.charity_id === id
                          ? "bg-violet-500/10 border-violet-500/50 text-white"
                          : "bg-transparent border-white/5 text-[#9b99c4] hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{name}</span>
                        {formData.charity_id === id && <Check className="w-4 h-4 text-violet-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-bold text-[#4a4870] uppercase tracking-wider">Donation Percentage per round</label>
                  <span className="text-violet-400 font-bold">{formData.charity_percent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={formData.charity_percent}
                  onChange={(e) => setFormData({ ...formData, charity_percent: parseInt(e.target.value) })}
                  className="w-full h-2 bg-[#131322] rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="flex justify-between mt-2 text-[10px] text-[#4a4870] font-bold">
                  <span>5%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Security & Subscription */}
        <div className="space-y-8">
          <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Security</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full py-3 bg-[#131322] border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/5 transition-colors">
                Change Password
              </button>
              <button className="w-full py-3 bg-[#131322] border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/5 transition-colors">
                Enable Two-Factor
              </button>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Subscription</h2>
            </div>
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-violet-400 uppercase">Current Plan</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">Active</span>
              </div>
              <div className="text-xl font-bold text-white mb-4">Elite Pro Member</div>
              <button className="w-full py-3 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors">
                Manage in Stripe
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
