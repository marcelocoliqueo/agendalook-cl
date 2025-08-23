// Plantillas de email elegantes para Agendalook.cl
import { 
  WELCOME_EMAIL_HTML, 
  WELCOME_EMAIL_TEXT, 
  BOOKING_CONFIRMATION_HTML, 
  BOOKING_CONFIRMATION_TEXT 
} from './email-templates-raw';

export const emailTemplates = {
  welcome: {
    subject: '¡Bienvenido a Agendalook! Confirma tu cuenta',
    html: WELCOME_EMAIL_HTML,
    text: WELCOME_EMAIL_TEXT
  },

  bookingConfirmation: {
    subject: '✨ Tu cita está confirmada - Agendalook',
    html: BOOKING_CONFIRMATION_HTML,
    text: BOOKING_CONFIRMATION_TEXT
  }
}; 

// Template para sugerencia de upgrade
export const UPGRADE_SUGGESTION_EMAIL = {
  subject: '🚀 Desbloquea todo el potencial de Agendalook',
  html: (userName: string, currentPlan: string, upgradePlan: string, upgradePrice: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upgrade tu plan - Agendalook</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">¡Hola ${userName}!</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Es hora de llevar tu negocio al siguiente nivel
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
            Tu plan actual: ${currentPlan}
          </h2>
          
          <p style="color: #475569; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
            Has estado usando Agendalook con el plan ${currentPlan}. ¡Excelente trabajo! 
            Pero creemos que podrías aprovechar mucho más nuestras funcionalidades premium.
          </p>

          <!-- Upgrade Card -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%); border: 2px solid #0ea5e9; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center;">
            <h3 style="color: #0ea5e9; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
              🚀 Plan ${upgradePlan} Recomendado
            </h3>
            <div style="font-size: 32px; font-weight: 700; color: #0f172a; margin: 20px 0;">
              $${upgradePrice.toLocaleString()}
              <span style="font-size: 16px; font-weight: 400; color: #64748b;">/mes</span>
            </div>
            <p style="color: #475569; margin: 0 0 20px 0; font-size: 14px;">
              Acceso completo a todas las funciones premium
            </p>
            <a href="https://agendalook.cl/plans" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 12px; font-weight: 600; font-size: 16px;">
              Ver Planes
            </a>
          </div>

          <!-- Benefits -->
          <h3 style="color: #0f172a; margin: 30px 0 20px 0; font-size: 20px; font-weight: 600;">
            ¿Qué obtienes con el upgrade?
          </h3>
          <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Reservas ilimitadas</li>
            <li>Servicios ilimitados</li>
            <li>Estadísticas avanzadas</li>
            <li>Soporte prioritario</li>
            <li>Sin marca de Agendalook</li>
            <li>Funciones premium exclusivas</li>
          </ul>

          <p style="color: #475569; margin: 30px 0 0 0; font-size: 16px; line-height: 1.6;">
            <strong>¿Tienes preguntas?</strong> Nuestro equipo está aquí para ayudarte a elegir el plan perfecto.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 30px 20px; text-align: center;">
          <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px;">
            Este email fue enviado a ${userName} desde Agendalook
          </p>
          <div style="margin: 20px 0;">
            <a href="https://agendalook.cl" style="color: #0ea5e9; text-decoration: none; margin: 0 10px; font-size: 14px;">Sitio Web</a>
            <a href="https://agendalook.cl/contact" style="color: #0ea5e9; text-decoration: none; margin: 0 10px; font-size: 14px;">Contacto</a>
            <a href="https://agendalook.cl/help" style="color: #0ea5e9; text-decoration: none; margin: 0 10px; font-size: 14px;">Ayuda</a>
          </div>
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            © 2024 Agendalook. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
};

// Template para confirmación de plan activado
export const PLAN_ACTIVATED_EMAIL = {
  subject: '🎉 ¡Tu plan ha sido activado exitosamente!',
  html: (userName: string, planName: string, planPrice: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Plan Activado - Agendalook</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">¡Plan Activado!</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Tu plan ${planName} está listo para usar
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
            ¡Felicidades, ${userName}!
          </h2>
          
          <p style="color: #475569; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
            Tu plan <strong>${planName}</strong> ha sido activado exitosamente. 
            ${planPrice > 0 ? `El cargo de $${planPrice.toLocaleString()} ha sido procesado correctamente.` : 'Tu plan gratuito está activo.'}
          </p>

          <!-- Success Card -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%); border: 2px solid #22c55e; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center;">
            <div style="font-size: 48px; margin: 20px 0;">🎉</div>
            <h3 style="color: #22c55e; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
              Plan ${planName} Activado
            </h3>
            <p style="color: #475569; margin: 0; font-size: 14px;">
              Accede a tu dashboard para empezar a usar todas las funciones
            </p>
          </div>

          <!-- Next Steps -->
          <h3 style="color: #0f172a; margin: 30px 0 20px 0; font-size: 20px; font-weight: 600;">
            Próximos pasos recomendados:
          </h3>
          <ol style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Configura tus servicios y horarios</li>
            <li>Personaliza tu página pública</li>
            <li>Invita a tus primeros clientes</li>
            <li>Explora las funciones premium</li>
          </ol>

          <div style="text-align: center; margin: 40px 0;">
            <a href="https://agendalook.cl/dashboard" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
              Ir al Dashboard
            </a>
          </div>

          <p style="color: #475569; margin: 30px 0 0 0; font-size: 16px; line-height: 1.6;">
            <strong>¿Necesitas ayuda?</strong> Nuestro equipo de soporte está disponible 24/7 para ayudarte.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 30px 20px; text-align: center;">
          <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px;">
            Gracias por confiar en Agendalook
          </p>
          <div style="margin: 20px 0;">
            <a href="https://agendalook.cl/help" style="color: #0ea5e9; text-decoration: none; margin: 0 10px; font-size: 14px;">Centro de Ayuda</a>
            <a href="https://agendalook.cl/contact" style="color: #0ea5e9; text-decoration: none; margin: 0 10px; font-size: 14px;">Soporte</a>
            <a href="https://agendalook.cl/tutorials" style="color: #0ea5e9; text-decoration: none; margin: 0 10px; font-size: 14px;">Tutoriales</a>
          </div>
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            © 2024 Agendalook. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}; 