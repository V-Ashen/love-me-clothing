import { create } from 'zustand';

interface AdminState {
  isTaskActive: boolean;
  setTaskActive: (active: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isTaskActive: false,
  setTaskActive: (active) => set({ isTaskActive: active }),
}));
