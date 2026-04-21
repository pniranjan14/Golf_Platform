import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({ label, variant = 'primary', className, ...props }) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative group px-8 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300",
        isPrimary && "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)]",
        isSecondary && "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_30px_rgba(5,150,105,0.3)] hover:shadow-[0_0_50px_rgba(5,150,105,0.5)]",
        isGhost && "border border-white/10 bg-white/5 hover:bg-white/10",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{label}</span>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
           bg-gradient-to-r from-transparent via-white/10 to-transparent 
           transition-transform duration-700 ease-in-out" />
    </motion.button>
  );
};
