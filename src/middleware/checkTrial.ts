import { createClient as createServiceClient } from '@supabase/supabase-js';

export interface TrialCheckResult {
  isExpired: boolean;
  daysRemaining?: number;
  professional?: any;
  shouldRedirect: boolean;
  redirectUrl?: string;
}

/**
 * Verifica si el trial del usuario ha expirado
 * @param userId - ID del usuario autenticado
 * @returns Resultado de la verificación del trial
 */
export async function checkTrialExpiration(userId: string): Promise<TrialCheckResult> {
  try {
    // Crear cliente con service role key para acceso completo
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !serviceKey) {
      console.error('❌ Configuración de Supabase faltante en checkTrialExpiration');
      return {
        isExpired: false,
        shouldRedirect: false
      };
    }

    const supabase = createServiceClient(supabaseUrl, serviceKey);

    // Consultar información del profesional
    const { data: professional, error } = await supabase
      .from('professionals')
      .select('id, user_id, business_name, plan, trial_start_date, trial_end_date, subscription_status')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('❌ Error consultando profesional en checkTrialExpiration:', error);
      return {
        isExpired: false,
        shouldRedirect: false
      };
    }

    if (!professional) {
      console.log('ℹ️ No se encontró profesional para user_id:', userId);
      return {
        isExpired: false,
        shouldRedirect: false
      };
    }

    // Si no es plan trial, no aplicar verificación
    if (professional.plan !== 'trial') {
      return {
        isExpired: false,
        shouldRedirect: false,
        professional
      };
    }

    // Verificar si tiene trial_end_date
    if (!professional.trial_end_date) {
      console.log('⚠️ Usuario con plan trial pero sin trial_end_date:', userId);
      return {
        isExpired: false,
        shouldRedirect: false,
        professional
      };
    }

    // Verificar expiración
    const now = new Date();
    const trialEndDate = new Date(professional.trial_end_date);
    const isExpired = now > trialEndDate;

    // Calcular días restantes
    const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    console.log('🔍 Verificación de trial:', {
      userId,
      plan: professional.plan,
      trialEndDate: professional.trial_end_date,
      isExpired,
      daysRemaining: isExpired ? 0 : daysRemaining
    });

    return {
      isExpired,
      daysRemaining: isExpired ? 0 : daysRemaining,
      professional,
      shouldRedirect: isExpired,
      redirectUrl: isExpired ? '/plans?trial-expired=true' : undefined
    };

  } catch (error) {
    console.error('💥 Error inesperado en checkTrialExpiration:', error);
    return {
      isExpired: false,
      shouldRedirect: false
    };
  }
}

/**
 * Actualiza el estado del profesional cuando el trial expira
 * @param userId - ID del usuario
 */
export async function handleTrialExpiration(userId: string): Promise<void> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !serviceKey) {
      console.error('❌ Configuración de Supabase faltante en handleTrialExpiration');
      return;
    }

    const supabase = createServiceClient(supabaseUrl, serviceKey);

    // Actualizar el profesional a plan look cuando expire el trial
    const { error } = await supabase
      .from('professionals')
      .update({
        plan: 'look',
        subscription_status: 'cancelled',
        trial_end_date: null
      })
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error actualizando profesional tras expiración de trial:', error);
    } else {
      console.log('✅ Profesional actualizado a plan free tras expiración de trial:', userId);
    }

  } catch (error) {
    console.error('💥 Error inesperado en handleTrialExpiration:', error);
  }
}
