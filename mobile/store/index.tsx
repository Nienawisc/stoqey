/**
|--------------------------------------------------
| react state management using react hooks (createContext)
|--------------------------------------------------
*/
import React from 'react';
import { IState } from './interfaces';
import reducers from './reducers';

// the ranges we will use for our chart (1H=1 hour, 1D= 1 day, ...etc)
const ranges: string[] = ['1H', '1D', '1W', '1M', '1Y', 'ALL'];

const intialState: IState = {
  coins: [],
  toplist: [],
  wallets: [],
  favourites: [],
  ranges,
  currentCoin: null,
  chartValues: [],
  news: [],
  isLoading: false,
};
// hook to create context with the initial state
export const Store = React.createContext<IState | any>(intialState);

// return the StoreProvider as a wrapper for our App to be able to manage state
export function StoreProvider({ children }: JSX.ElementChildrenAttribute): React.ReactElement {
  const [state, dispatch] = React.useReducer(reducers, intialState);
  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>;
}
