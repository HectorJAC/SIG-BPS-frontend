import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectStoreProps {
  id_proyecto: number;
  onAddProject: (id: number) => void;
  onGetProject: () => number;
  onResetProject: () => void;

  id_tarea_proyecto: number;
  onAddTaskProject: (id: number) => void;
  onGetTaskProject: () => number;
  onResetTaskProject: () => void;
}

interface TaskSuccessStoreProps {
  addingTaskSuccess: boolean;
  onAddingTaskSuccess: () => void;
  getAddingTaskSuccess: () => boolean;
  resetAddingTaskSuccess: () => void;
}

interface EmployeeOrDepartmentSuccess {
  addingEmployeeDepartmentSuccess: boolean;
  onAddingEmployeeDepartmentSuccess: () => void;
  getAddingEmployeeDepartmentSuccess: () => boolean;
  resetAddingEmployeeDepartmentSuccess: () => void;
}

export const useProjectStore = create<ProjectStoreProps>()(
  persist<ProjectStoreProps>(
    (set, get) => ({
      id_proyecto: 0,
      onAddProject: (id: number) => set({ id_proyecto: id }),
      onGetProject: () => get().id_proyecto,
      onResetProject: () => set({ id_proyecto: 0 }),

      id_tarea_proyecto: 0,
      onAddTaskProject: (id: number) => set({ id_tarea_proyecto: id }),
      onGetTaskProject: () => get().id_tarea_proyecto,
      onResetTaskProject: () => set({ id_tarea_proyecto: 0 }),
    }),
    {
      name: 'project-store',
      getStorage: () => sessionStorage,
    }
  )
);

export const useTaskSuccessStore = create<TaskSuccessStoreProps>((set, get) => ({
  addingTaskSuccess: false,
  onAddingTaskSuccess: () => set({ addingTaskSuccess: true }),
  getAddingTaskSuccess: () => get().addingTaskSuccess,
  resetAddingTaskSuccess: () => set({ addingTaskSuccess: false }),
}));

export const useEmployeeOrDepartmentSuccessStore = create<EmployeeOrDepartmentSuccess>((set, get) => ({
  addingEmployeeDepartmentSuccess: false,
  onAddingEmployeeDepartmentSuccess: () => set({ addingEmployeeDepartmentSuccess: true }),
  getAddingEmployeeDepartmentSuccess: () => get().addingEmployeeDepartmentSuccess,
  resetAddingEmployeeDepartmentSuccess: () => set({ addingEmployeeDepartmentSuccess: false }),
}));
