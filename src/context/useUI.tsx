import { useContext } from 'react';
import { UIContext } from './UIContext';

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    console.log('El hook useUI debe estar dentro de un provider');
  }
  return context;
};
