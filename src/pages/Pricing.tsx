import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatBadge } from '../components/ui/StatBadge';
import { GlowButton } from '../components/ui/GlowButton';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly Elite',
    price: '29',
    period: 'mo',
    description: 'Perfect for consistent players looking for recurring jackpot opportunities.',
    features: [
      'Automatic Draw Entry',
      'Charity Contribution (5%)',
      'Advanced Score Analytics',
      'Private Member Lounge Access',
      'Exclusive Partner Discounts'
    ],
    buttonText: 'BEGIN EXCELLENCE',
    highlight: false
  },
  {
    id: 'yearly',
    name: 'Annual Legend',
    price: '299',
    period: 'yr',
    description: 'The ultimate commitment to the game and the cause. Two months free.',
    features: [
      '2 Months Free Included',
      'Automatic Draw Entry',
      'Charity Contribution (10%)',
      'Full Score Intelligence Suit',
      'VIP Event Invitations',
      'Global Leaderboard Badge'
    ],
    buttonText: 'CLAIM LEGACY',
    highlight: true
  }
];

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Identity Required', 'Please create an account or login to initialize a subscription.');
      navigate('/signup');
      return;
    }

    setIsProcessing(planId);
    
    // Simulate Stripe Checkout Redirect
    toast.info('Initializing Stripe Checkout...', 'Connecting to secure payment gateway...');
    
    setTimeout(async () => {
      try {
        // Prepare for real Stripe: 
        // 1. Call backend to create checkout session
        // 2. Redirect to stripe.com
        
        // For now, simulate success: 
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'subscriber' })
          .eq('id', user.id);

        if (error) throw error;

        toast.success('Subscription Activated', `Welcome to the ${planId === 'yearly' ? 'Annual Legend' : 'Monthly Elite'} circle!`);
        setIsProcessing(null);
        navigate('/dashboard');
      } catch (err) {
        toast.error('Payment Error', 'Failed to synchronize subscription state.');
        setIsProcessing(null);
      }
    }, 2000);
  };

  return (
    <div className="space-y-24 pb-32">
      {/* Hero Section */}
      <section className="relative pt-12 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/5 border border-violet-500/20 rounded-full text-violet-400 text-xs font-black uppercase tracking-[0.2em] mb-8"
        >
          <Sparkles className="w-4 h-4" /> MEMBERSHIP TIERS
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter italic leading-none mb-8"
        >
          CHOOSE YOUR <br />
          <span className="text-violet-500">LEAGUE.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto text-lg text-[#9b99c4] font-medium leading-relaxed italic"
        >
          Select your membership tier and start your journey towards the jackpot 
          while supporting amazing causes.
        </motion.p>
      </section>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <GlassCard className={cn(
              "p-12 h-full flex flex-col space-y-10 relative overflow-hidden transition-all duration-500",
              plan.highlight ? "border-violet-500/40 shadow-[0_0_50px_rgba(124,58,237,0.1)] scale-105 z-10" : "border-white/5 hover:border-white/10"
            )}>
              {plan.highlight && (
                <div className="absolute top-0 right-0 p-8">
                  <StatBadge text="BEST VALUE" variant="violet" />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white italic tracking-tight uppercase leading-none">{plan.name}</h3>
                <p className="text-sm text-[#9b99c4] font-medium leading-relaxed italic">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-white italic tracking-tighter">£{plan.price}</span>
                <span className="text-[#4a4870] font-black uppercase text-xs tracking-widest">/ {plan.period}</span>
              </div>

              <div className="space-y-8 flex-1">
                <div className="text-[10px] font-black text-[#4a4870] uppercase tracking-widest border-b border-white/5 pb-4">Inclusive Privileges</div>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-sm">
                      <div className="mt-1 p-1 bg-violet-600/10 rounded border border-violet-500/20 group-hover:bg-violet-600 group-hover:text-black transition-all">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-[#9b99c4] font-medium group-hover:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 pt-10">
                <GlowButton 
                  label={isProcessing === plan.id ? "Securing..." : plan.buttonText} 
                  className="w-full py-5 text-sm" 
                  variant={plan.highlight ? 'primary' : 'ghost'} 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing !== null}
                />
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-[#4a4870] tracking-[0.2em] group-hover:text-[#9b99c4] transition-colors">
                  <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encryption
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Callout */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative group"
      >
        <div className="absolute inset-0 bg-violet-600/5 border border-white/5 rounded-[40px] transition-all group-hover:bg-violet-600/10" />
        <div className="relative p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] shadow-2xl group-hover:scale-110 transition-transform duration-500">
             <Building2 className="w-12 h-12 text-violet-500" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
             <h4 className="text-2xl font-black text-white italic tracking-tight uppercase">CORPORATE ENROLLMENT</h4>
             <p className="text-sm text-[#9b99c4] font-medium italic leading-relaxed">
               Are you a golf club owner or an organization looking for bulk memberships? 
               Unlock tailored packages including custom charity sponsorship integration and priority support.
             </p>
             <button className="flex items-center gap-2 text-violet-400 text-xs font-black uppercase tracking-widest hover:text-white transition-all">
                Contact Sales Intelligence <Zap className="w-4 h-4" />
             </button>
          </div>
        </div>
      </motion.section>

      {/* FAQ Link / Quick Support */}
      <div className="text-center">
        <p className="text-[#4a4870] text-sm font-medium italic">
          Questions about your subscription? <span className="text-white font-black uppercase underline ml-2 cursor-pointer">Visit Knowledge Hub</span>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
