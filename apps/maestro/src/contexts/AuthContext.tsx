// This context is used to provide signInState and have only one instance of useWeb3SignIn.
// Needed to prevent multiple signature requests.
import React, { createContext, useContext } from "react";

import { useWeb3SignIn } from "~/lib/auth/useWeb3SignIn";

type AuthContextType = ReturnType<typeof useWeb3SignIn>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const signInState = useWeb3SignIn();
  return (
    <AuthContext.Provider value={signInState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
