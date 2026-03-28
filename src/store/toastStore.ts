import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  
  addToast: (message, type = 'success') => {
    const id = Date.now().toString();
    set({ toasts: [...get().toasts, { id, message, type }] });
    
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },
  
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
