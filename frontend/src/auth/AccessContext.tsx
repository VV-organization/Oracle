import { createContext, useContext } from 'react';
export const MoneyAccessContext = createContext(true);
export const useMoneyAccess = () => useContext(MoneyAccessContext);
