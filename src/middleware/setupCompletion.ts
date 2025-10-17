import { createServerSupabaseClient } from '@/lib/supabase-server';

export interface SetupStatus {
  completed: boolean;
  redirect?: string;
  step?: string;
}

/**
 * Verifica que el usuario completó el proceso de setup/onboarding
 * antes de poder acceder al dashboard y otras rutas protegidas
 */
export async function checkSetupCompletion(userId: string): Promise<SetupStatus> {
  try {
    const supabase = await createServerSupabaseClient();

    // Obtener profesional del usuario
    const { data: professional, error } = await supabase
      .from('professionals')
      .select('business_slug, trial_start_date, onboarding_completed, trial_end_date, subscription_status')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking setup completion:', error);
      return { completed: false, redirect: '/setup/business-slug', step: 'business-slug' };
    }

    // Si no tiene perfil profesional, debe crear uno
    if (!professional) {
      return { completed: false, redirect: '/setup/business-slug', step: 'business-slug' };
    }

    // Paso 1: Verificar business_slug
    if (!professional.business_slug) {
      return { completed: false, redirect: '/setup/business-slug', step: 'business-slug' };
    }

    // Paso 2: Verificar trial iniciado
    if (!professional.trial_start_date) {
      return { completed: false, redirect: '/setup/business-info', step: 'business-info' };
    }

    // Paso 3: Verificar onboarding completado
    if (!professional.onboarding_completed) {
      // Determinar en qué paso quedó
      if (!professional.trial_start_date) {
        return { completed: false, redirect: '/setup/trial-start', step: 'trial-start' };
      }
      return { completed: false, redirect: '/setup/business-info', step: 'business-info' };
    }

    // Verificar si el trial expiró
    if (professional.subscription_status === 'trial' && professional.trial_end_date) {
      const now = new Date();
      const endDate = new Date(professional.trial_end_date);
      
      if (now > endDate) {
        return { completed: false, redirect: '/payment', step: 'payment' };
      }
    }

    // Setup completado
    return { completed: true };
  } catch (error) {
    console.error('Error in checkSetupCompletion:', error);
    return { completed: false, redirect: '/setup/business-slug', step: 'business-slug' };
  }
}

/**
 * Verifica si una ruta específica requiere setup completado
 */
export function requiresSetupCompletion(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/availability',
    '/dashboard/bookings',
    '/dashboard/services',
    '/dashboard/settings',
  ];

  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Verifica si una ruta es parte del proceso de setup
 */
export function isSetupRoute(pathname: string): boolean {
  return pathname.startsWith('/setup/');
}


