// Configuración centralizada de Supabase
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
} as const;

// Configuración de autenticación para el navegador
export const AUTH_CONFIG = {
  storageKey: 'agendalook-auth',
  flowType: 'pkce' as const,
  persistSession: true,
  autoRefreshToken: true,
} as const;

// Verificar que las variables de entorno estén configuradas
export const validateSupabaseConfig = () => {
  if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url === 'https://placeholder.supabase.co') {
    console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL no está configurado');
  }
  if (!SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.anonKey === 'placeholder-key') {
    console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurado');
  }
  if (!SUPABASE_CONFIG.serviceKey || SUPABASE_CONFIG.serviceKey === 'placeholder-service-key') {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY no está configurado');
  }
};
