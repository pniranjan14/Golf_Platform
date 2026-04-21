import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlowButton } from '../ui/GlowButton';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Results', href: '/results' },
    { name: 'Charities', href: '/charities' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-white/10 py-3 shadow-[0_0_30px_rgba(124,58,237,0.1)]" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-violet-600 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            GOLF<span className="text-violet-500">PLATFORM</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-[#9b99c4] hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <GlowButton label="Go to Dashboard" className="px-6 py-2" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-[#9b99c4] hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup">
                <GlowButton label="Subscribe" className="px-6 py-2" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0f] border-b border-white/10"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-[#9b99c4]"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5 my-2" />
              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center text-[#9b99c4]">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <GlowButton label="Subscribe" className="w-full" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
