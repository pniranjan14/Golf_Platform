import React from 'react';
import { cn } from '../../lib/utils';

interface StatBadgeProps {
  text: string;
  variant?: 'emerald' | 'violet' | 'amber' | 'rose';
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ text, variant = 'emerald', className }) => {
  const styles = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 dot-emerald-400",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400 dot-violet-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400 dot-amber-400",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400 dot-rose-400",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium",
      styles[variant],
      className
    )}>
      <div className={cn(
        "w-1.5 h-1.5 rounded-full animate-pulse",
        variant === 'emerald' && "bg-emerald-400",
        variant === 'violet' && "bg-violet-400",
        variant === 'amber' && "bg-amber-400",
        variant === 'rose' && "bg-rose-400",
      )} />
      {text}
    </div>
  );
};
