import { createContext, useContext } from 'react';
import VehicleStore from './VehicleStore';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const store = new VehicleStore();
  return (
    <StoreContext.Provider value={{ store }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);