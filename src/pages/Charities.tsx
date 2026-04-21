import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target, ExternalLink, Shield, TrendingUp, HandHeart } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatBadge } from '../components/ui/StatBadge';
import { GlowButton } from '../components/ui/GlowButton';
import { cn } from '../lib/utils';

const CharitiesPage: React.FC = () => {
  const charities = [
    {
      id: 1,
      name: "Green Fairways Foundation",
      category: "Environment",
      description: "Dedicated to preserving natural ecosystems on golf courses and surrounding wildlife habitats.",
      impact: "£12,450 raised",
      image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=800",
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      id: 2,
      name: "Junior Golfers Initiative",
      category: "Education",
      description: "Providing equipment and professional coaching to underprivileged youth to grow the game.",
      impact: "450+ Sponsored",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      accent: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      id: 3,
      name: "Veterans Golf Retreat",
      category: "Mental Health",
      description: "Using the therapeutic benefits of golf to support veteran rehabilitation and community.",
      impact: "128 Retreats",
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800",
      accent: "text-rose-400",
      bg: "bg-rose-500/10"
    },
    {
      id: 4,
      name: "Cancer Research UK",
      category: "Health",
      description: "Pioneering research to beat cancer for everyone, funded by the pride of our community.",
      impact: "£28,900 Total",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
      accent: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      id: 5,
      name: "Ocean Clean Up",
      category: "Sustainability",
      description: "Removing plastic waste from coastal areas near seaside golf resorts globally.",
      impact: "12 Tons Removed",
      image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=800",
      accent: "text-cyan-400",
      bg: "bg-cyan-500/10"
    },
    {
      id: 6,
      name: "Blind Golf Association",
      category: "Inclusion",
      description: "Making golf accessible for the visually impaired through specialized training.",
      impact: "85 Active Players",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
      accent: "text-amber-400",
      bg: "bg-amber-500/10"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-24 pb-32">
      {/* Hero Section */}
      <section className="relative pt-12 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8"
        >
          <Heart className="w-4 h-4 fill-emerald-400/20" /> IMPACT DIRECTORY
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter italic leading-none mb-8"
        >
          EVERY SWING <br />
          <span className="text-emerald-500">MATTERS.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto text-lg text-[#9b99c4] font-medium leading-relaxed italic"
        >
          Select a verified partner to receive a portion of every entry fee. 
          Transparency and impact at the core of our community.
        </motion.p>
      </section>

      {/* Impact Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { label: 'Total Contribution', val: '£842,900', icon: HandHeart, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Verified Partners', val: '12', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Community Growth', val: '+24%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={item}>
              <GlassCard className="p-10 group overflow-hidden">
                <div className={cn("absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700", stat.bg)} />
                <div className={cn("inline-flex p-4 rounded-2xl mb-8 transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-black text-white italic tracking-tighter mb-2 tabular-nums">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a4870]">{stat.label}</div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Directory Grid */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tight">THE <span className="text-emerald-500">COUNCIL</span></h2>
            <p className="text-xs text-[#4a4870] font-black uppercase tracking-[0.2em] mt-2">Verified Social Impacts</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="text-white font-bold text-sm">Sort By</div>
                <div className="text-[#4a4870] text-[10px] uppercase font-black">Impact Intensity</div>
             </div>
             <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-white">
                <Users className="w-5 h-5" />
             </button>
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {charities.map((charity, i) => (
            <motion.div key={charity.id} variants={item} className="group">
              <GlassCard className="p-0 border-white/5 hover:border-emerald-500/30 overflow-hidden group-hover:-translate-y-2 transition-all duration-500">
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={charity.image} 
                    alt={charity.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-80" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                  <div className="absolute top-6 left-6">
                    <StatBadge text={charity.category} variant={i % 3 === 0 ? 'emerald' : i % 3 === 1 ? 'violet' : 'rose'} />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black text-white italic tracking-tighter leading-tight">{charity.name}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <p className="text-sm text-[#9b99c4] font-medium leading-relaxed italic">
                    "{charity.description}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <div className="text-[9px] font-black uppercase text-[#4a4870] tracking-widest mb-1">Impact Delivered</div>
                      <div className={cn("text-lg font-black italic", charity.accent)}>{charity.impact}</div>
                    </div>
                    <button className="p-4 bg-white/5 rounded-2xl text-white hover:bg-emerald-500 hover:text-black transition-all duration-300">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Nomination Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative py-20 rounded-[40px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-emerald-600/10 border border-emerald-500/20" />
        <div className="absolute top-0 right-0 p-12">
          <Target className="w-32 h-32 text-emerald-500/5 rotate-12" />
        </div>
        
        <div className="relative text-center max-w-2xl mx-auto space-y-8 p-12">
          <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">NOMINATE <br /><span className="text-emerald-500">A CAUSE</span></h2>
          <p className="text-[#9b99c4] italic font-medium">
            Know a charity that aligns with our vision? Submit a nomination for our next vetting cycle.
          </p>
          <div className="flex justify-center">
            <GlowButton label="Submit Nomination" variant="primary" className="py-4 px-10" />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CharitiesPage;
