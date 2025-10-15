import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"; // ✅ import these from firebase/auth
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // refresh token so custom claims (admin) are present
        const token = await u.getIdTokenResult(true);
        setIsAdmin(!!token.claims?.admin);
      } else {
        setIsAdmin(false);
      }
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAdmin,
      signUp: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),
      signIn: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),
      signInWithGoogle: () => signInWithPopup(auth, googleProvider),
      signOut: () => fbSignOut(auth),
    }),
    [user, initializing, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() must be used within <AuthProvider>");
  return ctx;
}


