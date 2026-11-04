import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem('movie-booking-user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('movie-booking-user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const handleAuthFailure = () => setUser(null);
    window.addEventListener('movie-booking-auth-failed', handleAuthFailure);
    return () => window.removeEventListener('movie-booking-auth-failed', handleAuthFailure);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user?.token),
    isAdmin: Boolean(user?.roles?.includes('ROLE_ADMIN')),
    signIn({ userId, jwtToken, username, roles }) {
      const session = { userId, token: jwtToken, username, roles: Array.from(roles || []) };
      localStorage.setItem('movie-booking-user', JSON.stringify(session));
      setUser(session);
    },
    signOut() {
      localStorage.removeItem('movie-booking-user');
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
