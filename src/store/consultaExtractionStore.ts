import { create } from 'zustand';

interface consultaExtractionProps {
  id_consulta_extraccion: number;
  onAddConsultaExtraccion: (id: number) => void;
  onGetConsultaExtraccion: () => number;
  onResetConsultaExtraccion: () => void;

  editPage: boolean;
  onChangeEditPage: () => void;
  onResetEditPage: () => void;
}

export const useConsultaExtraccionStore = create<consultaExtractionProps>((set, get) => ({
  id_consulta_extraccion: 0,
  onAddConsultaExtraccion: (id: number) => set({ id_consulta_extraccion: id }),
  onGetConsultaExtraccion: () => get().id_consulta_extraccion,
  onResetConsultaExtraccion: () => set({ id_consulta_extraccion: 0 }),

  editPage: true,
  onChangeEditPage: () => set({ editPage: false }),
  onResetEditPage: () => set({ editPage: true }),
}));