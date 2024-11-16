import { create } from 'zustand';

interface conexionDBProps {
  id_conexion_db: number;
  onAddConexionDB: (id: number) => void;
  onGetConexionDB: () => number;
  onResetConexionDB: () => void;
}

export const useConexionDBStore = create<conexionDBProps>((set, get) => ({
  id_conexion_db: 0,
  onAddConexionDB: (id: number) => set({ id_conexion_db: id }),
  onGetConexionDB: () => get().id_conexion_db,
  onResetConexionDB: () => set({ id_conexion_db: 0 }),
}));