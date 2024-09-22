import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompanyProps } from '../interfaces/companyInteface';

interface CompanyStoreProps {
  company: CompanyProps;
  onSetCompany: (company: CompanyProps) => void;
  onGetCompany: () => CompanyProps;
  onClearCompany: () => void;
}

export const useCompanyStore = create<CompanyStoreProps>()(
  persist<CompanyStoreProps>(
    (set, get) => ({
      company: {} as CompanyProps,
      onSetCompany: (company: CompanyProps) => set({ company }),
      onGetCompany: () => get().company,
      onClearCompany: () => set({ company: {} as CompanyProps }),
    }),
    {
      name: 'company-store',
      getStorage: () => sessionStorage,
    }
  )
);
