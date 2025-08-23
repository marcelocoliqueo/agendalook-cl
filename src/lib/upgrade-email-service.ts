import { createServerSupabaseClient } from '@/lib/supabase-server';
import { resend } from '@/lib/resend';
import { UPGRADE_SUGGESTION_EMAIL, PLAN_ACTIVATED_EMAIL } from './email-templates';

export interface UpgradeEmailData {
  userId: string;
  userEmail: string;
  userName: string;
  currentPlan: string;
  upgradePlan: string;
  upgradePrice: number;
}

export interface PlanActivatedEmailData {
  userId: string;
  userEmail: string;
  userName: string;
  planName: string;
  planPrice: number;
}

/**
 * Envía email de sugerencia de upgrade
 * Se ejecuta automáticamente después de cierto tiempo de uso
 */
export async function sendUpgradeSuggestionEmail(data: UpgradeEmailData) {
  try {
    const { userEmail, userName, currentPlan, upgradePlan, upgradePrice } = data;

    if (!resend) {
      console.error('Resend no está configurado');
      return { success: false, error: 'Resend not configured' };
    }

    await resend.emails.send({
      from: 'Agendalook <noreply@agendalook.cl>',
      to: userEmail,
      subject: UPGRADE_SUGGESTION_EMAIL.subject,
      html: UPGRADE_SUGGESTION_EMAIL.html(userName, currentPlan, upgradePlan, upgradePrice),
    });

    console.log(`Email de upgrade enviado a ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error enviando email de upgrade:', error);
    return { success: false, error };
  }
}

/**
 * Envía email de confirmación cuando se activa un plan
 */
export async function sendPlanActivatedEmail(data: PlanActivatedEmailData) {
  try {
    const { userEmail, userName, planName, planPrice } = data;

    if (!resend) {
      console.error('Resend no está configurado');
      return { success: false, error: 'Resend not configured' };
    }

    await resend.emails.send({
      from: 'Agendalook <noreply@agendalook.cl>',
      to: userEmail,
      subject: PLAN_ACTIVATED_EMAIL.subject,
      html: PLAN_ACTIVATED_EMAIL.html(userName, planName, planPrice),
    });

    console.log(`Email de plan activado enviado a ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error enviando email de plan activado:', error);
    return { success: false, error };
  }
}

/**
 * Programa emails de sugerencia de upgrade
 * Se ejecuta automáticamente para usuarios que han estado usando el plan gratuito
 */
export async function scheduleUpgradeSuggestions() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Buscar usuarios que han estado usando el plan gratuito por más de 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: users, error } = await supabase
      .from('professionals')
      .select(`
        id,
        user_id,
        plan,
        created_at
      `)
      .eq('plan', 'free')
      .lt('created_at', sevenDaysAgo.toISOString());

    if (error) {
      console.error('Error buscando usuarios para upgrade:', error);
      return;
    }

    // Enviar emails de sugerencia
    for (const user of users || []) {
      try {
        // Obtener información del usuario desde auth
        const { data: userProfile } = await supabase.auth.admin.getUserById(user.user_id);
        const userEmail = userProfile?.user?.email;
        const userName = userProfile?.user?.user_metadata?.full_name || 'Usuario';

        if (userEmail) {
          await sendUpgradeSuggestionEmail({
            userId: user.user_id,
            userEmail,
            userName,
            currentPlan: 'Free',
            upgradePlan: 'Pro',
            upgradePrice: 9990,
          });

          // Esperar un poco entre emails para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (userError) {
        console.error(`Error procesando usuario ${user.user_id}:`, userError);
        continue;
      }
    }

    console.log(`Emails de upgrade programados para ${users?.length || 0} usuarios`);
  } catch (error) {
    console.error('Error programando emails de upgrade:', error);
  }
}

/**
 * Envía email de bienvenida con sugerencias de upgrade
 * Se ejecuta 3 días después del registro
 */
export async function sendWelcomeUpgradeEmail(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Obtener información del usuario desde auth
    const { data: userProfile } = await supabase.auth.admin.getUserById(userId);
    const userEmail = userProfile?.user?.email;
    const userName = userProfile?.user?.user_metadata?.full_name || 'Usuario';

    if (userEmail) {
      // Verificar si el usuario tiene plan gratuito
      const { data: professional } = await supabase
        .from('professionals')
        .select('plan')
        .eq('user_id', userId)
        .single();

      if (professional && professional.plan === 'free') {
        // Enviar email de bienvenida con sugerencias
        await sendUpgradeSuggestionEmail({
          userId,
          userEmail,
          userName,
          currentPlan: 'Free',
          upgradePlan: 'Pro',
          upgradePrice: 9990,
        });
      }
    }
  } catch (error) {
    console.error('Error enviando email de bienvenida con upgrade:', error);
  }
}
