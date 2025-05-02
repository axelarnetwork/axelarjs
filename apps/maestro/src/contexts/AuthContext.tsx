import React, { createContext, useContext } from "react";

import { useWeb3SignIn } from "~/lib/auth/useWeb3SignIn";

type AuthContextType = ReturnType<typeof useWeb3SignIn>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a provider for the AuthContext. It is used to provide the signInState to the children and have only one instance of the signInState.
// Needed because useWeb3SignIn is a hook and would create a new instance of the hook on every render, triggering multiple sign in attempts.
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
