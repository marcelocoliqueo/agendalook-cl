'use client';

import { useCallback } from 'react';
import { useSupabaseClient, useSupabaseAuth } from '@/contexts/SupabaseContext';

export function useAuth() {
  const supabase = useSupabaseClient();
  const { user, session, loading } = useSupabaseAuth();
  
  const verified = Boolean((user as any)?.user_metadata?.verified || (user as any)?.email_confirmed_at);

  const signUp = useCallback(async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  }, [supabase.auth]);

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, [supabase.auth]);

  const resetPassword = useCallback(async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  }, [supabase.auth]);

  return {
    user,
    session,
    loading,
    verified,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
} 