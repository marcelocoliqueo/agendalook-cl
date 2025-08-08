import { resend as sharedResend } from '@/lib/resend';

const resend = sharedResend;

// Plantilla base minimalista y segura para correo HTML
function renderBaseEmail(params: {
  preheader?: string;
  title: string;
  intro?: string;
  bodyHtml?: string;
  action?: { label: string; url: string } | null;
  footerNote?: string;
}): string {
  const preheader = params.preheader || '';
  const title = params.title;
  const intro = params.intro || '';
  const action = params.action;
  const bodyHtml = params.bodyHtml || '';
  const footerNote = params.footerNote || '© 2025 Agendalook.cl — Tu cita, tu estilo';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.agendalook.cl';

  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f6f9fc;">
    <span style="display:none; color:transparent; opacity:0; visibility:hidden; height:0; width:0; overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f6f9fc; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">
            <tr>
              <td style="padding:20px 24px 8px 24px; text-align:center; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                <img src="${appUrl}/logo.png" width="40" height="40" alt="Agendalook" style="display:inline-block; width:40px; height:40px; border-radius:8px; margin-bottom:8px;"/>
                <div style="font-size:16px; font-weight:600; color:#111827;">Agendalook</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px 24px; text-align:center; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                <h1 style="margin:12px 0; font-size:22px; line-height:1.3; color:#111827;">${title}</h1>
              </td>
            </tr>
            ${intro ? `<tr><td style="padding:0 24px; text-align:center; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:#4b5563; font-size:14px; line-height:1.6;">${intro}</td></tr>` : ''}
            ${bodyHtml ? `<tr><td style="padding:16px 24px; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:#374151; font-size:14px; line-height:1.6;">${bodyHtml}</td></tr>` : ''}
            ${action ? `
              <tr>
                <td style="padding:16px 24px; text-align:center;">
                  <a href="${action.url}" target="_self" style="display:inline-block; padding:12px 20px; background:#111827; color:#ffffff; text-decoration:none; border-radius:8px; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; font-size:14px; font-weight:600;">${action.label}</a>
                </td>
              </tr>
            ` : ''}
            <tr>
              <td style="padding:16px 24px; text-align:center; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:#6b7280; font-size:12px; border-top:1px solid #f3f4f6;">${footerNote}</td>
            </tr>
          </table>
          <div style="margin-top:8px; color:#9ca3af; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; font-size:11px;">Si no esperabas este correo, puedes ignorarlo.</div>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

export class ResendService {
  static async sendVerificationCode(email: string, code: string) {
    try {
      if (!resend) {
        console.warn('⚠️ Resend no configurado. No se envía verification code.');
        return null;
      }
      const fromEmail = process.env.NODE_ENV === 'production' 
        ? 'Agendalook <noreply@agendalook.cl>'
        : 'Agendalook <onboarding@resend.dev>';

      const codeHtml = `
        <div style="text-align:center; margin:12px 0;">
          <div style="display:inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:24px; letter-spacing:6px; font-weight:700; color:#111827; background:#f3f4f6; padding:12px 16px; border-radius:8px;">${code}</div>
        </div>
        <div style="margin-top:8px; color:#6b7280; font-size:12px; text-align:center;">El código expira en 10 minutos.</div>
      `;

      const html = renderBaseEmail({
        preheader: 'Usa este código para verificar tu correo.',
        title: 'Verifica tu correo',
        intro: 'Ingresa el siguiente código en la ventana de verificación para confirmar tu cuenta.',
        bodyHtml: codeHtml,
        action: null,
      });

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: 'Tu código de verificación - Agendalook',
        html,
        text: `Tu código de verificación es: ${code}\nEl código expira en 10 minutos.`,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in sendVerificationCode:', error);
      throw error;
    }
  }

  static async sendWelcomeEmail(email: string, confirmationUrl: string, businessName: string) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const safeConfirmationUrl = confirmationUrl || `${appUrl}/verify-email`;
      const fromEmail = process.env.NODE_ENV === 'production' 
        ? 'Agendalook <noreply@agendalook.cl>'
        : 'Agendalook <onboarding@resend.dev>';

      if (!resend) {
        console.warn('⚠️ Resend no configurado. No se envía welcome email.');
        return null;
      }

      const html = renderBaseEmail({
        preheader: 'Confirma tu cuenta para empezar a usar Agendalook.',
        title: `¡Bienvenido${businessName ? `, ${businessName}` : ''}!`,
        intro: 'Para comenzar, confirma tu dirección de correo electrónico.',
        action: { label: 'Confirmar mi cuenta', url: safeConfirmationUrl },
      });

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: '¡Bienvenido a Agendalook! Confirma tu cuenta',
        replyTo: 'soporte@agendalook.cl',
        headers: { 'List-Unsubscribe': '<mailto:unsubscribe@agendalook.cl>' },
        html,
        text: `Bienvenido a Agendalook${businessName ? `, ${businessName}` : ''}.\nConfirma tu cuenta: ${safeConfirmationUrl}`,
      });

      if (error) {
        console.error('❌ Error sending welcome email:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in sendWelcomeEmail:', error);
      throw error;
    }
  }

  static async sendBookingConfirmation(
    email: string,
    bookingData: {
      serviceName: string;
      date: string;
      time: string;
      price: number;
      professionalName: string;
    }
  ) {
    try {
      const fromEmail = process.env.NODE_ENV === 'production' 
        ? 'Agendalook <noreply@agendalook.cl>'
        : 'Agendalook <onboarding@resend.dev>';

      if (!resend) {
        console.warn('⚠️ Resend no configurado. No se envía booking confirmation.');
        return null;
      }

      const details = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate; border-spacing:0 8px;">
          <tr><td style="width:40%; color:#6b7280;">Servicio</td><td style="color:#111827; font-weight:600;">${bookingData.serviceName}</td></tr>
          <tr><td style="color:#6b7280;">Fecha</td><td style="color:#111827; font-weight:600;">${bookingData.date}</td></tr>
          <tr><td style="color:#6b7280;">Hora</td><td style="color:#111827; font-weight:600;">${bookingData.time}</td></tr>
          <tr><td style="color:#6b7280;">Precio</td><td style="color:#111827; font-weight:600;">$${bookingData.price.toLocaleString()}</td></tr>
          <tr><td style="color:#6b7280;">Profesional</td><td style="color:#111827; font-weight:600;">${bookingData.professionalName}</td></tr>
        </table>
      `;

      const html = renderBaseEmail({
        preheader: 'Tu cita ha sido confirmada.',
        title: 'Tu cita está confirmada',
        intro: 'Gracias por tu reserva. Te esperamos en el horario agendado.',
        bodyHtml: details,
        action: null,
      });

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: '✨ Tu cita está confirmada - Agendalook',
        replyTo: 'soporte@agendalook.cl',
        headers: { 'List-Unsubscribe': '<mailto:unsubscribe@agendalook.cl>' },
        html,
        text: `Tu cita está confirmada.\nServicio: ${bookingData.serviceName}\nFecha: ${bookingData.date}\nHora: ${bookingData.time}\nPrecio: $${bookingData.price}\nProfesional: ${bookingData.professionalName}`,
      });

      if (error) {
        console.error('❌ Error sending booking confirmation:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in sendBookingConfirmation:', error);
      throw error;
    }
  }

  static async sendProfessionalNotification(
    email: string,
    bookingData: {
      clientName: string;
      serviceName: string;
      date: string;
      time: string;
      price: number;
    }
  ) {
    try {
      if (!resend) {
        console.warn('⚠️ Resend no configurado. No se envía notificación a profesional.');
        return null;
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const details = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate; border-spacing:0 8px;">
          <tr><td style="width:40%; color:#6b7280;">Cliente</td><td style="color:#111827; font-weight:600;">${bookingData.clientName}</td></tr>
          <tr><td style="color:#6b7280;">Servicio</td><td style="color:#111827; font-weight:600;">${bookingData.serviceName}</td></tr>
          <tr><td style="color:#6b7280;">Fecha</td><td style="color:#111827; font-weight:600;">${bookingData.date}</td></tr>
          <tr><td style="color:#6b7280;">Hora</td><td style="color:#111827; font-weight:600;">${bookingData.time}</td></tr>
          <tr><td style="color:#6b7280;">Precio</td><td style="color:#111827; font-weight:600;">$${bookingData.price}</td></tr>
        </table>
      `;

      const html = renderBaseEmail({
        preheader: 'Tienes una nueva reserva.',
        title: 'Nueva reserva recibida',
        intro: 'Revisa los detalles y gestiona tu agenda desde el dashboard.',
        bodyHtml: details,
        action: { label: 'Ir al dashboard', url: `${appUrl}/dashboard` },
      });

      const { data, error } = await resend.emails.send({
        from: 'Agendalook <onboarding@resend.dev>',
        to: [email],
        subject: '✨ Nueva reserva recibida - Agendalook',
        html,
        text: `Nueva reserva recibida.\nCliente: ${bookingData.clientName}\nServicio: ${bookingData.serviceName}\nFecha: ${bookingData.date}\nHora: ${bookingData.time}\nPrecio: $${bookingData.price}\nDashboard: ${appUrl}/dashboard`,
      });

      if (error) {
        console.error('❌ Error sending professional notification:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in sendProfessionalNotification:', error);
      throw error;
    }
  }
}