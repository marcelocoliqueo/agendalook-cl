'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupabaseClient, createClient as createSupabaseClient } from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, AUTH_CONFIG } from '@/lib/supabase-config';

interface SupabaseContextType {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Cliente singleton para evitar múltiples instancias de GoTrueClient
let browserClient: SupabaseClient | null = null;

const createBrowserClient = () => {
  if (!browserClient) {
    browserClient = createSupabaseClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: AUTH_CONFIG,
    });
  }
  return browserClient;
};

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createBrowserClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <SupabaseContext.Provider value={{ supabase, user, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

export function useSupabaseClient() {
  const { supabase } = useSupabase();
  return supabase;
}

export function useSupabaseAuth() {
  const { user, session, loading } = useSupabase();
  return { user, session, loading };
}
