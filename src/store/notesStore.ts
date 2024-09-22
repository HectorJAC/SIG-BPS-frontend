import { create } from 'zustand';

interface noteStoreProps {
  createNoteSuccess: boolean;
  onCreateNoteSuccess: () => void;
  getCreateNoteSuccess: () => boolean;
  resetCreateNoteSuccess: () => void;

  id_nota: number;
  onAddIdNota: (id: number) => void;
  onGetNota: () => number;
  onResetNota: () => void;
}

export const useNotesStore = create<noteStoreProps>((set, get) => ({
  createNoteSuccess: false,
  onCreateNoteSuccess: () => set({ createNoteSuccess: true }),
  getCreateNoteSuccess: () => get().createNoteSuccess,
  resetCreateNoteSuccess: () => set({ createNoteSuccess: false }),

  id_nota: 0,
  onAddIdNota: (id: number) => set({ id_nota: id }),
  onGetNota: () => get().id_nota,
  onResetNota: () => set({ id_nota: 0 }),
}));