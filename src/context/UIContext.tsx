import { createContext, Dispatch } from 'react';
import { Action, initialState, UIState } from '../interfaces/contextInterfaces';

export const UIContext = createContext<{
  state: UIState;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
