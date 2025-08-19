import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase-config';

// Cliente para el lado del servidor (sin autenticación)
export const supabase = createSupabaseClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Cliente para el servidor con cookies (usar en middleware y API routes)
export const createServerSupabaseClient = () => {
  return createSupabaseClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
};

// NOTA: Para el navegador, usar useSupabaseClient() del SupabaseContext
// Este archivo ya no exporta createClient() para evitar múltiples instancias