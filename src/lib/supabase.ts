import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Cliente para el lado del servidor
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Cliente para el navegador (singleton para evitar múltiples instancias de GoTrueClient)
let browserClient: SupabaseClient | null = null;
export const createClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
};