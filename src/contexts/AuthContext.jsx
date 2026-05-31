import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

const SESSION_DURATION = 60 * 60 * 1000; // 1 jam dalam milidetik
const SESSION_KEY = 'admin_session_expiry';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const startSession = useCallback(() => {
    const expiry = Date.now() + SESSION_DURATION;
    localStorage.setItem(SESSION_KEY, expiry.toString());
  }, []);

  const isSessionValid = useCallback(() => {
    const expiry = localStorage.getItem(SESSION_KEY);
    if (!expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  }, []);

  const logout = useCallback(async () => {
    clearSession();
    await signOut(auth);
  }, [clearSession]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && isSessionValid()) {
        setUser(firebaseUser);
      } else if (firebaseUser && !isSessionValid()) {
        // Sesi habis, paksa logout
        signOut(auth);
        clearSession();
        setUser(null);
      } else {
        clearSession();
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isSessionValid, clearSession]);

  // Cek sesi setiap menit
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (!isSessionValid()) {
        signOut(auth);
        clearSession();
        setUser(null);
      }
    }, 60 * 1000); // cek setiap 60 detik

    return () => clearInterval(interval);
  }, [user, isSessionValid, clearSession]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, startSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
