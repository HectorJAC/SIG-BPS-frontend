import { useEffect, useReducer } from 'react';
import { UIContext } from './UIContext';
import { uiReducer } from './UIReducer';
import { UIProviderProps, initialState } from '../interfaces/contextInterfaces';

export const UIProvider = ({ children }: UIProviderProps) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Guardar el state en el localStorage
  useEffect(() => {
    if (state.activeOption !== null && state.openSection !== null) {
      localStorage.setItem('state', JSON.stringify(state));
    }
  }, [state]);

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
};
