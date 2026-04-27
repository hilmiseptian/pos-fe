import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage('token', '');
  const [userRaw, setUserRaw] = useLocalStorage('user', null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  const user = useMemo(() => {
    try {
      return userRaw ? JSON.parse(userRaw) : null;
    } catch {
      return null;
    }
  }, [userRaw]);

  /**
   * Check if the current user has a permission slug.
   *  - ['*']             → superadmin/owner, always true
   *  - ['users.view'...] → check array
   *  - []                → no permissions, always false
   */
  const can = (slug) => {
    const perms = user?.permissions ?? [];
    if (perms.includes('*')) return true;
    return perms.includes(slug);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser: setUserRaw, can, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
