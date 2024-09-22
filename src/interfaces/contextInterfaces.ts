import { ReactNode } from "react";

export interface UIState {
  openSection: string | null;
  closeSection: string | null;
  activeOption: string | null;
}

export const initialState: UIState = {
  openSection: null,
  closeSection: null,
  activeOption: null,
};
  
export type Action = 
| { type: 'SET_OPEN_SECTION', payload: string | null }
| { type: 'SET_CLOSE_SECTION', payload: string | null }
| { type: 'SET_ACTIVE_OPTION', payload: string | null }
| { type: 'RESET_CONTEXT' };

export interface UIProviderProps {
  children: ReactNode;
}