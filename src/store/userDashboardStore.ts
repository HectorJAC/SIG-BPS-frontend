import { create } from 'zustand';

interface userDashboardProps {
  id_user_dashboard: number;
  onAddUserDashboard: (id: number) => void;
  onGetUserDashboard: () => number;
  onResetUserDashboard: () => void;
}

export const useUserDashboardStore = create<userDashboardProps>((set, get) => ({
  id_user_dashboard: 0,
  onAddUserDashboard: (id: number) => set({ id_user_dashboard: id }),
  onGetUserDashboard: () => get().id_user_dashboard,
  onResetUserDashboard: () => set({ id_user_dashboard: 0 }),
}));