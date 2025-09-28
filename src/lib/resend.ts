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

// Función para enviar email con validación y fallback
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
    // Determinar el remitente basado en el entorno
    const fromAddress = getFromAddress();
    
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('❌ Error enviando email:', error);
      
      // Si es error de dominio no verificado, usar fallback
      if (error.message?.includes('domain') || 
          error.message?.includes('verification') || 
          error.message?.includes('testing emails') ||
          error.message?.includes('own email address')) {
        console.log('🔄 Intentando con dominio de fallback...');
        return await sendEmailWithFallback(params);
      }
      
      throw error;
    }

    console.log('✅ Email enviado exitosamente:', params.subject);
    return data;
  } catch (error) {
    console.error('❌ Error enviando email con Resend:', error);
    
    // Intentar con fallback si es posible
    if (error.message?.includes('domain') || 
        error.message?.includes('verification') || 
        error.message?.includes('testing emails') ||
        error.message?.includes('own email address')) {
      console.log('🔄 Intentando con dominio de fallback...');
      return await sendEmailWithFallback(params);
    }
    
    throw error;
  }
}

// Función para determinar la dirección de envío
function getFromAddress(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDomainVerified = process.env.RESEND_DOMAIN_VERIFIED === 'true';
  
  if (isProduction && isDomainVerified) {
    return 'Agendalook <noreply@agendalook.cl>';
  } else {
    return 'Agendalook <noreply@resend.dev>';
  }
}

// Función de fallback para cuando el dominio no está verificado
async function sendEmailWithFallback(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Agendalook <noreply@resend.dev>',
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('❌ Error con fallback también:', error);
      throw error;
    }

    console.log('✅ Email enviado con fallback:', params.subject);
    return data;
  } catch (error) {
    console.error('❌ Error con fallback:', error);
    throw error;
  }
} 