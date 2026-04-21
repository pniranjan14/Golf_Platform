import React, { useRef } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  showGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, showGlow = true }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-6",
        "hover:border-violet-500/20 transition-all duration-500 hover:bg-white/[0.05]",
        "group overflow-hidden",
        className
      )}
    >
      {/* Dynamic Mouse-Follow Glow */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(124,58,237,0.1), transparent 60%)`
        }}
      />
      
      {/* Corner Glow */}
      {showGlow && (
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/15 transition-all duration-500" />
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};
