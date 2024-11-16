import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProps } from '../interfaces/userInterface';

interface UserStoreProps {
  user: UserProps;
  onSetUser: (user: UserProps) => void;
  onGetUser: () => UserProps;
  onClearUser: () => void;
}

export const useUserStore = create<UserStoreProps>()(
  persist<UserStoreProps>(
    (set, get) => ({
      user: {} as UserProps,
      onSetUser: (user: UserProps) => set({ user }),
      onGetUser: () => get().user,
      onClearUser: () => set({ user: {} as UserProps }),
    }),
    {
      name: 'user-store',
      getStorage: () => sessionStorage,
    }
  )
);
