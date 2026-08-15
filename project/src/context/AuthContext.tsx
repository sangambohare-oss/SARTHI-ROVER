import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Language } from '../types';
import { loginApi, registerApi, getProfile, updateProfile as updateProfileApi } from '../services/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultUser: User = {
  id: 'usr-001', name: 'Sangam Bohare', email: 'sangambohare@gmail.com', phone: '+91 9226295319',
  farmLocation: 'TGPCET Nagpur, Maharashtra', numberOfFarms: 5, preferredLanguage: 'en',
  darkMode: false, notifications: true, createdAt: '2026-08-05T08:00:00Z',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('agrivision_token');
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (err) {
          console.warn('Backend profile fetch failed, using stored or default user session');
          setUser(defaultUser);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string, _remember?: boolean) => {
    try {
      const { user: loggedInUser, token } = await loginApi(email, password);
      localStorage.setItem('agrivision_token', token);
      setUser(loggedInUser);
    } catch (err) {
      console.warn('Backend login unavailable or invalid, falling back to client login state');
      const u = { ...defaultUser, email };
      setUser(u);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { user: registeredUser, token } = await registerApi(name, email, password);
      localStorage.setItem('agrivision_token', token);
      setUser(registeredUser);
    } catch (err) {
      console.warn('Backend registration failed, using local registration state');
      const u = { ...defaultUser, name, email };
      setUser(u);
    }
  };

  const logout = async () => {
    localStorage.removeItem('agrivision_token');
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const updated = await updateProfileApi(updates);
      setUser(updated);
    } catch (err) {
      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

interface LangContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
}

const LangContext = createContext<LangContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  return <LangContext.Provider value={{ language, setLanguage }}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
