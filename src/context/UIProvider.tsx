import { useReducer } from 'react';
import { UIContext } from './UIContext';
import { uiReducer } from './UIReducer';
import { UIProviderProps, initialState } from '../interfaces/contextInterfaces';

export const UIProvider = ({ children }: UIProviderProps) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
};
