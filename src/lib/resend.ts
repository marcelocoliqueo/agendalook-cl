import { Resend } from 'resend';

// Validar que la API key esté configurada
if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY no está configurada. Los emails no se enviarán.');
}

// Crear instancia de Resend solo si la API key está disponible
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Función para verificar si Resend está configurado
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Función para enviar email con validación
export async function sendEmailWithResend(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn('⚠️ Resend no está configurado. Email no enviado:', params.subject);
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Agendalook <noreply@agendalook.cl>',
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('❌ Error enviando email:', error);
      throw error;
    }

    console.log('✅ Email enviado exitosamente:', params.subject);
    return data;
  } catch (error) {
    console.error('❌ Error enviando email con Resend:', error);
    throw error;
  }
} 