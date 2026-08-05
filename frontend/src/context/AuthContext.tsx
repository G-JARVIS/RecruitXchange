import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { mockUsers } from '@/mocks/mockData';
import type { User, UserRole } from '@/types';

type ThemeMode = 'light' | 'dark';

interface AuthContextValue {
  currentUser: User | null;
  role: UserRole | null;
  theme: ThemeMode;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  setTheme: (theme: ThemeMode) => void;
  isAdmin: boolean;
  isStudent: boolean;
  isRecruiter: boolean;
  isApprovedRecruiter: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getDefaultUser = (): User => mockUsers.find((user) => user.role === 'student') ?? mockUsers[0];

const getUserByRole = (role: UserRole): User => {
  return mockUsers.find((user) => user.role === role) ?? getDefaultUser();
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(getDefaultUser());
  const [theme, setThemeState] = useState<ThemeMode>('light');

  const switchRole = (role: UserRole) => {
    setCurrentUser(getUserByRole(role));
  };

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  };

  const role = currentUser?.role ?? null;
  const isLoggedIn = Boolean(currentUser);
  const isAdmin = role === 'admin';
  const isStudent = role === 'student';
  const isRecruiter = role === 'recruiter';
  const isApprovedRecruiter = isRecruiter && currentUser?.status === 'active';

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      role,
      theme,
      isLoggedIn,
      switchRole,
      setTheme,
      isAdmin,
      isStudent,
      isRecruiter,
      isApprovedRecruiter,
    }),
    [currentUser, role, theme, isLoggedIn, isAdmin, isStudent, isRecruiter, isApprovedRecruiter]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
