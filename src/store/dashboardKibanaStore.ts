import { create } from 'zustand';

interface dashboardKibanaProps {
  id_dashboard_kibana: number;
  onAddDashboardKibana: (id: number) => void;
  onGetDashboardKibana: () => number;
  onResetDashboardKibana: () => void;
}

export const useDashboardKibanaStore = create<dashboardKibanaProps>((set, get) => ({
  id_dashboard_kibana: 0,
  onAddDashboardKibana: (id: number) => set({ id_dashboard_kibana: id }),
  onGetDashboardKibana: () => get().id_dashboard_kibana,
  onResetDashboardKibana: () => set({ id_dashboard_kibana: 0 }),
}));