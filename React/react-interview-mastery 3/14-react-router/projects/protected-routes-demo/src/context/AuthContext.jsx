import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

/**
 * Minimal fake-auth provider for the demo. Real apps would talk to a
 * backend / token store here — the shape (isAuthenticated, user, login,
 * logout) is what the rest of the app depends on, not the implementation.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async ({ email }) => {
        // simulate a network round trip
        await new Promise((resolve) => setTimeout(resolve, 400));
        setUser({ email });
      },
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
