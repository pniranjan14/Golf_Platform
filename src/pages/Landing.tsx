import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Heart, Quote } from 'lucide-react';
import CountUpRaw from 'react-countup';
const CountUp = (CountUpRaw as any).default || CountUpRaw;
import { cn } from '../lib/utils';
import { GlowButton } from '../components/ui/GlowButton';
import { GlassCard } from '../components/ui/GlassCard';
import { StatBadge } from '../components/ui/StatBadge';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const LandingPage: React.FC = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };



  const stats = [
    { label: "Members", value: "2,400+" },
    { label: "Raised", value: "£180,000" },
    { label: "Winners", value: "847" }
  ];

  return (
    <div className="relative">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" 
               style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-emerald-600/15 rounded-full blur-[100px] animate-pulse" 
               style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] bg-rose-600/10 rounded-full blur-[80px] animate-pulse" 
               style={{ animationDuration: '7s', animationDelay: '1s' }} />
        </div>

        {/* Dot Grid Layer */}
        <div className="absolute inset-0 dot-grid pointer-events-none opacity-40" />

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div variants={item} className="mb-8 flex justify-center">
            <StatBadge text="🏆 Monthly Prize Pool Active" variant="emerald" />
          </motion.div>

          <motion.h1 variants={item} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] mb-8">
            <span className="block text-white">Play Golf.</span>
            <span className="block bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">Win Big.</span>
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Change Lives.</span>
          </motion.h1>

          <motion.p variants={item} className="text-lg md:text-xl text-[#9b99c4] max-w-xl mx-auto mb-12 leading-relaxed">
            Enter your scores. Join the monthly draw. Support the charity you love. The elite platform for golfers with a mission.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <GlowButton label="Start Subscription" className="w-full sm:w-auto" />
            <button className="px-8 py-3.5 rounded-xl font-semibold text-[#f1f0ff] border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
              See How It Works
            </button>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#4a4870] font-bold">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#4a4870] font-bold">Scroll to explore</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-violet-500 to-transparent"
          />
        </motion.div>
      </section>

      {/* SECTION 2: LIVE PRIZE POOL */}
      <ErrorBoundary name="PrizePool">
        <section id="prizes" className="py-32 bg-[#0f0f1a] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 italic tracking-tight">
                THIS MONTH'S <span className="text-violet-500">PRIZE POOL</span>
              </h2>
              <div className="w-24 h-1 bg-violet-600 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <GlassCard className="text-center py-12 border-violet-500/10">
                <div className="text-[#4a4870] font-bold uppercase tracking-widest text-xs mb-4">Jackpot (5-Match)</div>
                <div className="text-6xl md:text-7xl font-black text-violet-500 mb-2 tracking-tighter tabular-nums">
                  £<CountUp end={42500} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                </div>
                <div className="text-violet-400/50 text-sm font-medium">Monthly Guaranteed</div>
              </GlassCard>

              <GlassCard className="text-center py-12 border-amber-500/10">
                <div className="text-[#4a4870] font-bold uppercase tracking-widest text-xs mb-4">4-Match Prize</div>
                <div className="text-6xl md:text-7xl font-black text-amber-500 mb-2 tracking-tighter tabular-nums">
                  £<CountUp end={8200} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                </div>
                <div className="text-amber-400/50 text-sm font-medium">Estimated Pool</div>
              </GlassCard>

              <GlassCard className="text-center py-12 border-emerald-500/10">
                <div className="text-[#4a4870] font-bold uppercase tracking-widest text-xs mb-4">3-Match Prize</div>
                <div className="text-6xl md:text-7xl font-black text-emerald-500 mb-2 tracking-tighter tabular-nums">
                  £<CountUp end={1450} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                </div>
                <div className="text-emerald-400/50 text-sm font-medium">Instant Payout</div>
              </GlassCard>
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#4a4870] uppercase tracking-wider">Pool Growth Status</span>
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Active & Building</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '85%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-600 to-violet-400 relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20" />
                </motion.div>
              </div>
              <p className="mt-6 text-[#4a4870] text-sm italic font-medium">
                "Every new subscription directly increases the available prize pool for the current month."
              </p>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* SECTION 3: HOW IT WORKS */}
      <ErrorBoundary name="HowItWorks">
        <section id="how-it-works" className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <StatBadge text="Simplified Process" variant="violet" className="mb-6" />
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                ELEVATE YOUR GAME <br />IN <span className="text-violet-500 underline decoration-violet-500/30 underline-offset-8">THREE STEPS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Dashed Connector Line */}
              <div className="absolute top-24 left-0 w-full h-px border-t border-dashed border-white/10 hidden md:block" />

              {[
                { 
                  icon: Target, 
                  title: "Enter Your Scores", 
                  desc: "Record your Stableford performance. Every point matters for your draw eligibility.",
                  color: "bg-violet-600"
                },
                { 
                  icon: Trophy, 
                  title: "Join The Draw", 
                  desc: "Your entries are processed into the monthly pool. Higher performance means better odds.",
                  color: "bg-amber-600"
                },
                { 
                  icon: Heart, 
                  title: "Support Charity", 
                  desc: "A portion of every entry goes directly to your selected cause. Win-win across the board.",
                  color: "bg-emerald-600"
                }
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      className="relative flex flex-col items-center text-center group"
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10",
                        "shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-500 group-hover:scale-110",
                        step.color
                      )}>
                        <Icon className="w-8 h-8 text-white" />
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0a0a0f] border-2 border-white/10 flex items-center justify-center text-sm font-bold text-white">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">{step.title}</h3>
                      <p className="text-[#9b99c4] leading-relaxed max-w-xs">{step.desc}</p>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* SECTION 4: CHARITY SPOTLIGHT */}
      <section className="py-32 relative group overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" 
            alt="Charity background" 
            className="w-full h-full object-cover grayscale opacity-20 transition-transform duration-[10s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <StatBadge text="Featured Partnership" variant="rose" className="mb-8" />
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              CANCER RESEARCH <br /><span className="text-rose-500">UK FOUNDATION</span>
            </h2>
            <p className="text-[#9b99c4] text-lg leading-relaxed mb-10 max-w-xl">
              We are proud to spotlight our primary partner this quarter. Your participation has already raised over £42,000 for life-saving research. Every swing you take brings us closer to a cure.
            </p>
            <div className="flex gap-12 mb-10">
              <div>
                <div className="text-3xl font-black text-white italic tracking-tighter">£42,000+</div>
                <div className="text-[10px] uppercase tracking-widest text-[#4a4870] font-bold mt-1">Raised This Year</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white italic tracking-tighter">1,240</div>
                <div className="text-[10px] uppercase tracking-widest text-[#4a4870] font-bold mt-1">Lives Impacted</div>
              </div>
            </div>
            <GlowButton label="Support This Cause" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="bg-white/5 border-white/10 p-10 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />
              <Quote className="w-12 h-12 text-rose-500/20 mb-6" />
              <p className="text-xl text-white font-medium italic leading-relaxed mb-8">
                "The support from the golf community has been unprecedented. These funds are directly accelerating our clinical trials for early detection."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-rose-500/30 overflow-hidden bg-rose-500/10" />
                <div>
                  <div className="text-white font-bold tracking-tight">Dr. Sarah Jenkins</div>
                  <div className="text-[#4a4870] text-xs font-bold uppercase tracking-widest">Lead Researcher, CRUK</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: WINNERS TICKER */}
      <section className="py-12 border-y border-white/5 bg-[#0a0a0f] relative overflow-hidden">
        <div className="flex whitespace-nowrap ticker-scroll">
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-16 px-8 items-center">
              <div className="flex items-center gap-4">
                <span className="text-emerald-500">🏆</span>
                <span className="text-white font-bold tracking-tight">John D. won £2,400</span>
                <span className="text-[#4a4870]">|</span>
                <span className="text-[#9b99c4]">❤️ donated to Children's Heart Foundation</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-amber-500">🏆</span>
                <span className="text-white font-bold tracking-tight">Sarah M. won £8,200</span>
                <span className="text-[#4a4870]">|</span>
                <span className="text-[#9b99c4]">❤️ donated to Cancer Research UK</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-violet-500">🏆</span>
                <span className="text-white font-bold tracking-tight">Michael P. won £42,500</span>
                <span className="text-[#4a4870]">|</span>
                <span className="text-[#9b99c4]">❤️ donated to Macmillan Support</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-emerald-500">🏆</span>
                <span className="text-white font-bold tracking-tight">Emma L. won £1,800</span>
                <span className="text-[#4a4870]">|</span>
                <span className="text-[#9b99c4]">❤️ donated to British Red Cross</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="py-40 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Violet Glow Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter italic">
            READY TO <span className="text-violet-500">PLAY YOUR PART?</span>
          </h2>
          <p className="text-xl text-[#9b99c4] mb-12 leading-relaxed">
            Join a collective of elite golfers who are making a real-world difference while playing the game they love. Subscription starts from just £15/month.
          </p>
          <GlowButton label="Subscribe Now — From £15/month" className="text-lg px-12 py-4" />
          
          <div className="mt-12 flex items-center justify-center gap-6 text-[#4a4870]">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Cancel Anytime</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Secure Checkout</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Verified Impact</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
