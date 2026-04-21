import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Results', icon: Trophy, href: '/results' },
    { name: 'My Scores', icon: TrendingUp, href: '/dashboard/scores' },
    { name: 'Charity', icon: Heart, href: '/charities' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const adminItems = [
    { name: 'Admin Overview', icon: LayoutGrid, href: '/admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-[260px] bg-[#0d0d18] border-r border-white/5 flex flex-col z-40 hidden lg:flex">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-violet-600 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white italic">
            GOLF<span className="text-violet-500">PLATFORM</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#4a4870] font-bold px-4 mb-4">
          Main Menu
        </div>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                isActive(item.href)
                  ? "bg-violet-500/10 text-violet-400 border-l-2 border-violet-500"
                  : "text-[#9b99c4] hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive(item.href) ? "text-violet-400" : "text-[#4a4870] group-hover:text-white")} />
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive(item.href) && <ChevronRight className="w-4 h-4" />}
            </Link>
          </motion.div>
        ))}

        {/* Admin Section (hardcoded check for now, can be improved) */}
        <div className="pt-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#4a4870] font-bold px-4 mb-4">
            Management
          </div>
          {adminItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive(item.href)
                  ? "bg-violet-500/10 text-violet-400 border-l-2 border-violet-500"
                  : "text-[#9b99c4] hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive(item.href) ? "text-violet-400" : "text-[#4a4870] group-hover:text-white")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 mt-auto">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="text-[10px] text-[#4a4870] font-bold uppercase">Supporting</div>
              <div className="text-xs text-[#f1f0ff] font-semibold">Cancer Research UK</div>
            </div>
          </div>
          <button className="w-full py-2 text-[10px] font-bold uppercase tracking-wider text-violet-400 hover:text-violet-300 transition-colors">
            Change Charity
          </button>
        </div>

        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-[#4a4870] hover:text-rose-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-sm">Logout Session</span>
        </button>
      </div>
    </div>
  );
};
