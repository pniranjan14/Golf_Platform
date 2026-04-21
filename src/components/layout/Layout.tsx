import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  if (isAdminLogin) {
    return <>{children}</>;
  }

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f1f0ff] flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[260px] p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f1f0ff] flex flex-col pt-20">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <span className="text-2xl font-bold tracking-tight text-white italic">
                GOLF<span className="text-violet-500">PLATFORM</span>
              </span>
            </Link>
            <p className="text-[#9b99c4] text-base leading-relaxed max-w-sm mb-8">
              Redefining the game through charitable impact, community engagement, and elite prize excitement. Play for a cause, win for a lifetime.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-[#4a4870]">Platform</h4>
            <ul className="space-y-4 text-sm text-[#9b99c4]">
              <li><Link to="/charities" className="hover:text-violet-400 transition-colors">Browse Charities</Link></li>
              <li><Link to="/pricing" className="hover:text-violet-400 transition-colors">Subscription Plans</Link></li>
              <li><Link to="/draws" className="hover:text-violet-400 transition-colors">Monthly Draws</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-[#4a4870]">Legal</h4>
            <ul className="space-y-4 text-sm text-[#9b99c4]">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Draw Rules</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[#4a4870] font-medium tracking-wide">
            © 2026 GOLF PLATFORM — ELEVATING THE GAME.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] text-[#4a4870] font-bold uppercase tracking-widest">Powered by Supabase</span>
            <span className="text-[10px] text-[#4a4870] font-bold uppercase tracking-widest">Secure Payments via Stripe</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
