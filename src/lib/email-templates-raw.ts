// Plantillas de email como strings simples para evitar errores de compilación

export const WELCOME_EMAIL_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a Agendalook</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); padding: 40px 30px; text-align: center; color: white; }
    .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
    .tagline { font-size: 16px; opacity: 0.9; }
    .content { padding: 40px 30px; text-align: center; }
    .title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 20px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .message { font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; margin: 20px 0; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 40px 0; }
    .feature { text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; transition: transform 0.2s ease; }
    .feature-icon { font-size: 32px; margin-bottom: 12px; display: block; }
    .feature-title { font-weight: bold; color: #1f2937; margin-bottom: 8px; font-size: 14px; }
    .feature-desc { font-size: 12px; color: #6b7280; line-height: 1.4; }
    .footer { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    .footer a { color: #8b5cf6; text-decoration: none; font-weight: 500; }
    @media (max-width: 600px) { .container { margin: 10px; border-radius: 12px; } .header { padding: 30px 20px; } .content { padding: 30px 20px; } .features { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Agendalook</div>
      <div class="tagline">Tu cita, tu estilo</div>
    </div>
    
    <div class="content">
      <div class="title">¡Bienvenido a Agendalook!</div>
      <div class="message">
        Gracias por unirte a la plataforma más elegante para agendar servicios de belleza. 
        Para comenzar a usar tu cuenta y acceder a todas las funcionalidades, confirma tu dirección de email.
      </div>
      
      <a href="{{CONFIRMATION_URL}}" class="button">
        ✨ Confirmar mi cuenta
      </a>
      
      <div class="features">
        <div class="feature">
          <span class="feature-icon">📅</span>
          <div class="feature-title">Agenda Inteligente</div>
          <div class="feature-desc">Gestiona tu disponibilidad y recibe reservas automáticamente</div>
        </div>
        <div class="feature">
          <span class="feature-icon">🌐</span>
          <div class="feature-title">Página Personalizada</div>
          <div class="feature-desc">Tu negocio online con diseño elegante y profesional</div>
        </div>
        <div class="feature">
          <span class="feature-icon">⭐</span>
          <div class="feature-title">Experiencia Premium</div>
          <div class="feature-desc">Diseño moderno que refleja la calidad de tus servicios</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>¿Tienes preguntas? Contáctanos en <a href="mailto:soporte@agendalook.cl">soporte@agendalook.cl</a></p>
      <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
    </div>
  </div>
</body>
</html>`;

export const WELCOME_EMAIL_TEXT = `¡Bienvenido a Agendalook!

Gracias por unirte a la plataforma más elegante para agendar servicios de belleza.

Para confirmar tu cuenta y acceder a todas las funcionalidades, visita este enlace:
{{CONFIRMATION_URL}}

Características principales:
📅 Agenda Inteligente - Gestiona tu disponibilidad y recibe reservas automáticamente
🌐 Página Personalizada - Tu negocio online con diseño elegante y profesional
⭐ Experiencia Premium - Diseño moderno que refleja la calidad de tus servicios

¿Tienes preguntas? Contáctanos en soporte@agendalook.cl

© 2025 Agendalook.cl - Tu cita, tu estilo`;

export const BOOKING_CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva - Agendalook</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); padding: 40px 30px; text-align: center; color: white; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .tagline { font-size: 16px; opacity: 0.9; }
    .content { padding: 40px 30px; text-align: center; }
    .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
    .message { font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 30px; }
    .booking-details { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 30px; border-radius: 12px; margin: 30px 0; border: 1px solid #e5e7eb; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #374151; }
    .detail-value { color: #6b7280; }
    .footer { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
    .footer a { color: #8b5cf6; text-decoration: none; font-weight: 500; }
    @media (max-width: 600px) { .container { margin: 10px; border-radius: 12px; } .header { padding: 30px 20px; } .content { padding: 30px 20px; } .detail-row { flex-direction: column; align-items: flex-start; gap: 4px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Agendalook</div>
      <div class="tagline">Tu cita, tu estilo</div>
    </div>
    
    <div class="content">
      <div class="title">✨ ¡Tu cita está confirmada!</div>
      <div class="message">
        Tu reserva ha sido confirmada exitosamente. Te esperamos en el horario agendado.
      </div>
      
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Servicio:</span>
          <span class="detail-value">{{SERVICE_NAME}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha:</span>
          <span class="detail-value">{{BOOKING_DATE}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Hora:</span>
          <span class="detail-value">{{BOOKING_TIME}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Precio:</span>
          <span class="detail-value">{{BOOKING_PRICE}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Profesional:</span>
          <span class="detail-value">{{PROFESSIONAL_NAME}}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>¿Tienes preguntas? Contáctanos en <a href="mailto:soporte@agendalook.cl">soporte@agendalook.cl</a></p>
      <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
    </div>
  </div>
</body>
</html>`;

export const BOOKING_CONFIRMATION_TEXT = `✨ ¡Tu cita está confirmada!

Tu reserva ha sido confirmada exitosamente. Te esperamos en el horario agendado.

Detalles de la reserva:
Servicio: {{SERVICE_NAME}}
Fecha: {{BOOKING_DATE}}
Hora: {{BOOKING_TIME}}
Precio: {{BOOKING_PRICE}}
Profesional: {{PROFESSIONAL_NAME}}

¿Tienes preguntas? Contáctanos en soporte@agendalook.cl

© 2025 Agendalook.cl - Tu cita, tu estilo`; 