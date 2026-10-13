import { createContext, useContext } from 'react';
import { useLocalStorage } from 'react-use';

export const POS_MODES = {
  DINE_IN: 'dine_in',
  QUICK_SERVICE: 'quick_service',
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [posMode, setPosMode] = useLocalStorage('pos_mode', POS_MODES.DINE_IN);

  return (
    <SettingsContext.Provider value={{ posMode, setPosMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
