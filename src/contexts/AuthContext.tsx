'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { Professional } from '@/types';
import { useSupabaseAuth } from '@/contexts/SupabaseContext';
import { useProfessional } from '@/hooks/useProfessional';

interface AuthContextType {
  user: User | null;
  professional: Professional | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { professional, loading: professionalLoading } = useProfessional();

  return (
    <AuthContext.Provider value={{ 
      user, 
      professional, 
      loading: authLoading || professionalLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 