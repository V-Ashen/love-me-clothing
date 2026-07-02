import { create } from 'zustand';
import { Permission } from 'shared';

interface AdminState {
  isTaskActive: boolean;
  setTaskActive: (active: boolean) => void;
  isAdmin: boolean;
  permissions: Permission[];
  level: number;
  roleName: string;
  setAuthData: (isAdmin: boolean, permissions: Permission[], level: number, roleName: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isTaskActive: false,
  setTaskActive: (active) => set({ isTaskActive: active }),
  isAdmin: false,
  permissions: [],
  level: 99,
  roleName: '',
  setAuthData: (isAdmin, permissions, level, roleName) => set({ isAdmin, permissions, level, roleName }),
}));
