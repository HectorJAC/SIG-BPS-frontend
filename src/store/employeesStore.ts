import { create } from 'zustand';

interface employeeStoreProps {
  id_empleado: number;
  onAddEmployee: (id: number) => void;
  onGetEmployee: () => number;
  onResetEmployee: () => void;
}

export const useEmployeesStore = create<employeeStoreProps>((set, get) => ({
  id_empleado: 0,
  onAddEmployee: (id: number) => set({ id_empleado: id }),
  onGetEmployee: () => get().id_empleado,
  onResetEmployee: () => set({ id_empleado: 0 }),
}));