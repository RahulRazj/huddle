import React, { createContext, useContext, useState, useEffect } from 'react';

// For securely storing the session token, you can use expo-secure-store.
// For now, we'll manage the session in memory.

type AuthContextData = {
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would restore the session from a secure store.
    // For this example, we'll just finish loading.
    setIsLoading(false);
  }, []);

  const value = {
    signIn: (token: string) => {
      setSession(token);
      // In a real app, you would also persist the token here.
    },
    signOut: () => {
      setSession(null);
      // In a real app, you would also clear the persisted token.
    },
    session,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
