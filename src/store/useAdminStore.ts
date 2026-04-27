import { create } from 'zustand';

interface AdminState {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAdmin: localStorage.getItem('isAdmin') === 'true',
  setIsAdmin: (isAdmin: boolean) => {
    localStorage.setItem('isAdmin', isAdmin.toString());
    set({ isAdmin });
  },
  logout: () => {
    localStorage.removeItem('isAdmin');
    set({ isAdmin: false });
  },
}));
