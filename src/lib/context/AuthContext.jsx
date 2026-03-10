import { createContext, useContext } from 'react';
import { useLocalStorage } from 'react-use';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage('token', '');
  const [userRaw, setUserRaw] = useLocalStorage('user', null);

  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser: setUserRaw }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
