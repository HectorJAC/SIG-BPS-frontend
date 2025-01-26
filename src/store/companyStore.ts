import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompanyProps } from '../interfaces/companyInteface';

interface CompanyStoreProps {
  company: CompanyProps;
  onSetCompany: (company: CompanyProps) => void;
  onGetCompany: () => CompanyProps;
  onClearCompany: () => void;

  createCompanySuccess: boolean;
  onCreateCompanySuccess: () => void;
  getCreateCompanySuccess: () => boolean;
  resetCreateCompanySuccess: () => void;
}

export const useCompanyStore = create<CompanyStoreProps>()(
  persist<CompanyStoreProps>(
    (set, get) => ({
      company: {} as CompanyProps,
      onSetCompany: (company: CompanyProps) => set({ company }),
      onGetCompany: () => get().company,
      onClearCompany: () => set({ company: {} as CompanyProps }),

      createCompanySuccess: false,
      onCreateCompanySuccess: () => set({ createCompanySuccess: true }),
      getCreateCompanySuccess: () => get().createCompanySuccess,
      resetCreateCompanySuccess: () => set({ createCompanySuccess: false }),
    }),
    {
      name: 'company-store',
      getStorage: () => sessionStorage,
    }
  )
);
