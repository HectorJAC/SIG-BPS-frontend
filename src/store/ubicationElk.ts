import { create } from 'zustand';

interface ubicationElkStoreProps {
  editUbicationElkSuccess: boolean;
  onEditUbicationElkSuccess: () => void;
  getEditUbicationElkSuccess: () => boolean;
  resetEditUbicationElkSuccess: () => void;

  id_elk_ubication: number;
  onAddIdElkUbication: (id: number) => void;
  onGetElkUbication: () => number;
  onResetElkUbication: () => void;
}

export const useUbicationElkStore = create<ubicationElkStoreProps>((set, get) => ({
  editUbicationElkSuccess: false,
  onEditUbicationElkSuccess: () => set({ editUbicationElkSuccess: true }),
  getEditUbicationElkSuccess: () => get().editUbicationElkSuccess,
  resetEditUbicationElkSuccess: () => set({ editUbicationElkSuccess: false }),

  id_elk_ubication: 0,
  onAddIdElkUbication: (id: number) => set({ id_elk_ubication: id }),
  onGetElkUbication: () => get().id_elk_ubication,
  onResetElkUbication: () => set({ id_elk_ubication: 0 }),
}));