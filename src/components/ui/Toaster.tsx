import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToasts, toast, type ToastType } from '../../hooks/useToast';
import { cn } from '../../lib/utils';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-rose-400" />,
  info: <Info className="w-5 h-5 text-violet-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
};

const colors: Record<ToastType, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/5',
  error: 'border-rose-500/20 bg-rose-500/5',
  info: 'border-violet-500/20 bg-violet-500/5',
  warning: 'border-amber-500/20 bg-amber-500/5',
};

export const Toaster: React.FC = () => {
  const toasts = useToasts();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto w-80 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-4",
              colors[t.type as ToastType]
            )}
          >
            <div className="mt-0.5">{icons[t.type as ToastType]}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white leading-tight">{t.title}</h4>
              {t.message && <p className="text-xs text-[#9b99c4] mt-1 leading-relaxed">{t.message}</p>}
            </div>
            <button 
              onClick={() => toast.dismiss(t.id)}
              className="mt-0.5 text-[#4a4870] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full overflow-hidden rounded-full">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: (t.duration || 5000) / 1000, ease: 'linear' }}
                className={cn(
                  "h-full w-full",
                  t.type === 'success' ? 'bg-emerald-500' : 
                  t.type === 'error' ? 'bg-rose-500' : 
                  t.type === 'info' ? 'bg-violet-500' : 'bg-amber-500'
                )}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
