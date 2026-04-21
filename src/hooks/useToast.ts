import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

type ToastListener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: ToastListener[] = [];

const emit = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  show: (data: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...data, id };
    toasts = [...toasts, newToast];
    emit();

    if (data.duration !== 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, data.duration || 5000);
    }
    return id;
  },
  success: (title: string, message?: string) => toast.show({ type: 'success', title, message }),
  error: (title: string, message?: string) => toast.show({ type: 'error', title, message }),
  info: (title: string, message?: string) => toast.show({ type: 'info', title, message }),
  warning: (title: string, message?: string) => toast.show({ type: 'warning', title, message }),
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
};

export const useToasts = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setCurrentToasts);
    };
  }, []);

  return currentToasts;
};
