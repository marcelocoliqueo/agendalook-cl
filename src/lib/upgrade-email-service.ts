import { createServerSupabaseClient } from '@/lib/supabase-server';
import { resend } from '@/lib/resend';
import { UPGRADE_SUGGESTION_EMAIL, PLAN_ACTIVATED_EMAIL } from './email-templates';
import { generateInvoicePDF, InvoiceData } from './pdf-generator';

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
  businessName: string;
  planName: string;
  planPrice: number;
  transactionId?: string;
  paymentMethod?: string;
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
    const { userEmail, userName, businessName, planName, planPrice, transactionId, paymentMethod } = data;

    if (!resend) {
      console.error('Resend no está configurado');
      return { success: false, error: 'Resend not configured' };
    }

    // Generar boleta
    const invoiceData: InvoiceData = {
      invoiceNumber: '', // Se generará automáticamente
      date: new Date().toLocaleDateString('es-CL'),
      customerName: userName,
      customerEmail: userEmail,
      businessName: businessName,
      planName: planName,
      planPrice: planPrice,
      currency: 'CLP',
      paymentMethod: paymentMethod || 'Tarjeta de crédito',
      transactionId: transactionId || 'N/A',
      status: 'Aprobado'
    };

    const pdfResult = await generateInvoicePDF(invoiceData);
    
    if (!pdfResult.success) {
      console.error('Error generando boleta:', pdfResult.error);
      // Continuar sin boleta si hay error
    }

    // Enviar email con confirmación
    await resend.emails.send({
      from: 'Agendalook <noreply@agendalook.cl>',
      to: userEmail,
      subject: `✅ Plan ${planName} activado - Boleta #${pdfResult.invoiceNumber}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; font-size: 28px; margin: 0;">Agendalook</h1>
            <p style="color: #64748b; margin: 10px 0 0 0;">Tu plan ha sido activado exitosamente</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #0c4a6e; margin: 0 0 15px 0;">🎉 ¡Plan ${planName} Activado!</h2>
            <p style="color: #075985; margin: 0;">Hola ${userName},</p>
            <p style="color: #075985; margin: 10px 0 0 0;">
              Tu plan <strong>${planName}</strong> ha sido activado exitosamente. 
              Ahora puedes disfrutar de todas las funcionalidades premium.
            </p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">📋 Detalles del Pago</h3>
            <p style="margin: 5px 0; color: #475569;"><strong>Plan:</strong> ${planName}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Precio:</strong> $${planPrice.toLocaleString()} CLP</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Método de pago:</strong> ${paymentMethod || 'Tarjeta de crédito'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Boleta:</strong> #${pdfResult.invoiceNumber}</p>
            ${transactionId ? `<p style="margin: 5px 0; color: #475569;"><strong>ID de transacción:</strong> ${transactionId}</p>` : ''}
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="color: #065f46; margin: 0 0 15px 0;">🚀 Próximos Pasos</h3>
            <ul style="color: #047857; margin: 0; padding-left: 20px;">
              <li>Configura tus servicios en el dashboard</li>
              <li>Establece tu disponibilidad</li>
              <li>Personaliza tu página pública</li>
              <li>Invita a tus clientes a reservar</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.agendalook.cl/dashboard" 
               style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Ir al Dashboard
            </a>
          </div>

          <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 30px;">
            <p>¿Necesitas ayuda? Contacta a soporte@agendalook.cl</p>
            <p>© 2025 Agendalook. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    console.log(`Email de plan activado con boleta #${pdfResult.invoiceNumber} enviado a ${userEmail}`);
    return { success: true, invoiceNumber: pdfResult.invoiceNumber };
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
      .eq('plan', 'look')
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
            currentPlan: 'Look',
            upgradePlan: 'Pro',
            upgradePrice: 16990,
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

      if (professional && professional.plan === 'look') {
        // Enviar email de bienvenida con sugerencias
        await sendUpgradeSuggestionEmail({
          userId,
          userEmail,
          userName,
          currentPlan: 'Look',
          upgradePlan: 'Pro',
          upgradePrice: 16990,
        });
      }
    }
  } catch (error) {
    console.error('Error enviando email de bienvenida con upgrade:', error);
  }
}
