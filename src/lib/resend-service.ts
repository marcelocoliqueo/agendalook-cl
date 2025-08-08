import { resend as sharedResend } from '@/lib/resend';

const resend = sharedResend;

export class ResendService {
  static async sendWelcomeEmail(email: string, confirmationUrl: string, businessName: string) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const safeConfirmationUrl = confirmationUrl || `${appUrl}/verify-email`;
      // Usar dominio de producción cuando esté verificado
      const fromEmail = process.env.NODE_ENV === 'production' 
        ? 'Agendalook <noreply@agendalook.cl>'
        : 'Agendalook <onboarding@resend.dev>';

      if (!resend) {
        console.warn('⚠️ Resend no configurado. No se envía welcome email.');
        return null;
      }
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: '¡Bienvenido a Agendalook! Confirma tu cuenta',
        replyTo: 'soporte@agendalook.cl',
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@agendalook.cl>',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'normal'
        },
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a Agendalook</title>
            <meta name="description" content="Confirma tu cuenta en Agendalook - Tu cita, tu estilo">
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 0; 
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                min-height: 100vh;
              }
              .email-container { 
                max-width: 600px; 
                margin: 20px auto; 
                background-color: #ffffff; 
                border-radius: 24px; 
                overflow: hidden; 
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(139, 92, 246, 0.1);
              }
              .header { 
                background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); 
                padding: 40px 30px; 
                text-align: center; 
                color: white; 
                position: relative;
                overflow: hidden;
              }
              .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
              }
              .logo-container {
                position: relative;
                z-index: 1;
                margin-bottom: 20px;
              }
              .logo {
                width: 120px;
                height: auto;
                margin: 0 auto 15px;
                display: block;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
              }
              .brand-name {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .tagline {
                font-size: 18px;
                opacity: 0.95;
                font-weight: 300;
              }
              .content { 
                padding: 50px 40px; 
                text-align: center; 
                background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
              }
              .title { 
                font-size: 32px; 
                font-weight: bold; 
                color: #1f2937; 
                margin-bottom: 25px; 
                background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent; 
                background-clip: text;
                line-height: 1.2;
              }
              .message { 
                font-size: 18px; 
                color: #6b7280; 
                line-height: 1.7; 
                margin-bottom: 40px;
                max-width: 480px;
                margin-left: auto;
                margin-right: auto;
              }
              .button { 
                display: inline-block; 
                background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); 
                color: white; 
                text-decoration: none; 
                padding: 18px 40px; 
                border-radius: 50px; 
                font-weight: bold; 
                font-size: 18px; 
                margin: 30px 0; 
                transition: all 0.3s ease; 
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
                position: relative;
                overflow: hidden;
              }
              .button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
              }
              .button:hover::before {
                left: 100%;
              }
              .features { 
                margin: 50px 0; 
                padding: 0 20px;
              }
              .features-title {
                text-align: center;
                font-size: 24px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 40px;
                background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .features-grid {
                display: flex;
                flex-direction: column;
                gap: 25px;
                max-width: 500px;
                margin: 0 auto;
              }
              .feature { 
                display: flex;
                align-items: center;
                padding: 25px;
                background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%); 
                border-radius: 16px; 
                border: 1px solid rgba(229, 231, 235, 0.8); 
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                min-height: 80px;
              }
              .feature::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%);
                border-radius: 0 4px 4px 0;
              }
              .feature:hover {
                transform: translateX(8px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
                border-color: rgba(139, 92, 246, 0.2);
              }
              .feature-icon { 
                font-size: 32px; 
                margin-right: 20px; 
                flex-shrink: 0;
                filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
                transition: transform 0.3s ease;
              }
              .feature:hover .feature-icon {
                transform: scale(1.1);
              }
              .feature-content {
                flex: 1;
                min-width: 0;
              }
              .feature-title { 
                font-weight: 700; 
                color: #1f2937; 
                margin-bottom: 6px; 
                font-size: 16px; 
                line-height: 1.3;
              }
              .feature-desc { 
                font-size: 14px; 
                color: #6b7280; 
                line-height: 1.5; 
                font-weight: 400;
              }
              .footer { 
                background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); 
                padding: 40px 30px; 
                text-align: center; 
                color: #6b7280; 
                font-size: 14px; 
                border-top: 1px solid #e5e7eb; 
              }
              .footer a { 
                color: #8b5cf6; 
                text-decoration: none; 
                font-weight: 500; 
                transition: color 0.2s ease;
              }
              .footer a:hover {
                color: #7c3aed;
              }
              .unsubscribe { 
                font-size: 12px; 
                color: #9ca3af; 
                margin-top: 25px; 
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
              .social-links {
                margin: 20px 0;
              }
              .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #6b7280;
                text-decoration: none;
                font-size: 16px;
                transition: color 0.2s ease;
              }
              .social-links a:hover {
                color: #8b5cf6;
              }
              @media (max-width: 600px) { 
                .email-container { 
                  margin: 10px; 
                  border-radius: 16px; 
                } 
                .header { 
                  padding: 30px 20px; 
                } 
                .content { 
                  padding: 40px 25px; 
                } 
                .features { 
                  padding: 0 15px;
                  margin: 40px 0;
                }
                .features-title {
                  font-size: 22px;
                  margin-bottom: 30px;
                }
                .features-grid {
                  gap: 20px;
                  max-width: 100%;
                }
                .feature {
                  padding: 20px;
                  min-height: 70px;
                }
                .feature-icon {
                  font-size: 28px;
                  margin-right: 16px;
                }
                .feature-title {
                  font-size: 15px;
                  margin-bottom: 4px;
                }
                .feature-desc {
                  font-size: 13px;
                  line-height: 1.4;
                }
                .title {
                  font-size: 28px;
                }
                .message {
                  font-size: 16px;
                }
                .button {
                  padding: 16px 32px;
                  font-size: 16px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <div class="logo-container">
                  <img src="https://agendalook.cl/logo.png" alt="Agendalook" class="logo">
                  <div class="brand-name">Agendalook</div>
                  <div class="tagline">Tu cita, tu estilo</div>
                </div>
              </div>
              
              <div class="content">
                <div class="title">¡Bienvenido a Agendalook!</div>
                <div class="message">
                  Gracias por unirte a la plataforma más elegante para agendar servicios de belleza. 
                  Para comenzar a usar tu cuenta y acceder a todas las funcionalidades, confirma tu dirección de email.
                </div>
                
                <a href="${safeConfirmationUrl}" class="button">
                  ✨ Confirmar mi cuenta
                </a>
                
                <div class="features">
                  <div class="features-title">Características Principales</div>
                  <div class="features-grid">
                    <div class="feature">
                      <span class="feature-icon">📅</span>
                      <div class="feature-content">
                        <div class="feature-title">Agenda Inteligente</div>
                        <div class="feature-desc">Gestiona tu disponibilidad y recibe reservas automáticamente</div>
                      </div>
                    </div>
                    <div class="feature">
                      <span class="feature-icon">🌐</span>
                      <div class="feature-content">
                        <div class="feature-title">Página Personalizada</div>
                        <div class="feature-desc">Tu negocio online con diseño elegante y profesional</div>
                      </div>
                    </div>
                    <div class="feature">
                      <span class="feature-icon">⭐</span>
                      <div class="feature-content">
                        <div class="feature-title">Experiencia Premium</div>
                        <div class="feature-desc">Diseño moderno que refleja la calidad de tus servicios</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <div class="social-links">
                  <a href="https://agendalook.cl">🌐 Sitio Web</a>
                  <a href="mailto:soporte@agendalook.cl">📧 Soporte</a>
                  <a href="https://instagram.com/agendalook">📱 Instagram</a>
                </div>
                <p>¿Tienes preguntas? Contáctanos en <a href="mailto:soporte@agendalook.cl">soporte@agendalook.cl</a></p>
                <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
                <div class="unsubscribe">
                  <a href="mailto:unsubscribe@agendalook.cl?subject=Unsubscribe">Darse de baja</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          ¡Bienvenido a Agendalook!
          
          Gracias por unirte a la plataforma más elegante para agendar servicios de belleza.
          
          Para confirmar tu cuenta y acceder a todas las funcionalidades, visita este enlace:
          ${safeConfirmationUrl}
          
          Características principales:
          📅 Agenda Inteligente - Gestiona tu disponibilidad y recibe reservas automáticamente
          🌐 Página Personalizada - Tu negocio online con diseño elegante y profesional
          ⭐ Experiencia Premium - Diseño moderno que refleja la calidad de tus servicios
          
          ¿Tienes preguntas? Contáctanos en soporte@agendalook.cl
          
          © 2025 Agendalook.cl - Tu cita, tu estilo
          
          Para darse de baja: unsubscribe@agendalook.cl
        `
      });

      if (error) {
        console.error('❌ Error sending welcome email:', error);
        throw error;
      }

      console.log('✅ Welcome email sent successfully:', data);
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
      // Usar dominio de producción cuando esté verificado
      const fromEmail = process.env.NODE_ENV === 'production' 
        ? 'Agendalook <noreply@agendalook.cl>'
        : 'Agendalook <onboarding@resend.dev>';

      if (!resend) {
        console.warn('⚠️ Resend no configurado. No se envía booking confirmation.');
        return null;
      }
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: '✨ Tu cita está confirmada - Agendalook',
        replyTo: 'soporte@agendalook.cl',
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@agendalook.cl>',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'normal'
        },
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Reserva - Agendalook</title>
            <meta name="description" content="Tu cita está confirmada - Agendalook">
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 0; 
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                min-height: 100vh;
              }
              .email-container { 
                max-width: 600px; 
                margin: 20px auto; 
                background-color: #ffffff; 
                border-radius: 24px; 
                overflow: hidden; 
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(139, 92, 246, 0.1);
              }
              .header { 
                background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); 
                padding: 40px 30px; 
                text-align: center; 
                color: white; 
                position: relative;
                overflow: hidden;
              }
              .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
              }
              .logo-container {
                position: relative;
                z-index: 1;
                margin-bottom: 20px;
              }
              .logo {
                width: 120px;
                height: auto;
                margin: 0 auto 15px;
                display: block;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
              }
              .brand-name {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .tagline {
                font-size: 18px;
                opacity: 0.95;
                font-weight: 300;
              }
              .content { 
                padding: 50px 40px; 
                text-align: center; 
                background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
              }
              .title { 
                font-size: 32px; 
                font-weight: bold; 
                color: #1f2937; 
                margin-bottom: 25px; 
                background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent; 
                background-clip: text;
                line-height: 1.2;
              }
              .message { 
                font-size: 18px; 
                color: #6b7280; 
                line-height: 1.7; 
                margin-bottom: 40px;
                max-width: 480px;
                margin-left: auto;
                margin-right: auto;
              }
              .booking-details { 
                background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); 
                padding: 40px; 
                border-radius: 20px; 
                margin: 40px 0; 
                border: 1px solid #e5e7eb;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
              }
              .detail-row { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 16px 0; 
                border-bottom: 1px solid #e5e7eb; 
                font-size: 16px;
              }
              .detail-row:last-child { 
                border-bottom: none; 
              }
              .detail-label { 
                font-weight: 600; 
                color: #374151; 
              }
              .detail-value { 
                color: #6b7280; 
                font-weight: 500;
              }
              .footer { 
                background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); 
                padding: 40px 30px; 
                text-align: center; 
                color: #6b7280; 
                font-size: 14px; 
                border-top: 1px solid #e5e7eb; 
              }
              .footer a { 
                color: #8b5cf6; 
                text-decoration: none; 
                font-weight: 500; 
                transition: color 0.2s ease;
              }
              .footer a:hover {
                color: #7c3aed;
              }
              .unsubscribe { 
                font-size: 12px; 
                color: #9ca3af; 
                margin-top: 25px; 
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
              .social-links {
                margin: 20px 0;
              }
              .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #6b7280;
                text-decoration: none;
                font-size: 16px;
                transition: color 0.2s ease;
              }
              .social-links a:hover {
                color: #8b5cf6;
              }
              @media (max-width: 600px) { 
                .email-container { 
                  margin: 10px; 
                  border-radius: 16px; 
                } 
                .header { 
                  padding: 30px 20px; 
                } 
                .content { 
                  padding: 40px 25px; 
                } 
                .booking-details {
                  padding: 30px 25px;
                }
                .detail-row {
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 8px;
                  text-align: left;
                }
                .title {
                  font-size: 28px;
                }
                .message {
                  font-size: 16px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <div class="logo-container">
                  <img src="https://agendalook.cl/logo.png" alt="Agendalook" class="logo">
                  <div class="brand-name">Agendalook</div>
                  <div class="tagline">Tu cita, tu estilo</div>
                </div>
              </div>
              
              <div class="content">
                <div class="title">✨ ¡Tu cita está confirmada!</div>
                <div class="message">
                  Tu reserva ha sido confirmada exitosamente. Te esperamos en el horario agendado.
                </div>
                
                <div class="booking-details">
                  <div class="detail-row">
                    <span class="detail-label">Servicio:</span>
                    <span class="detail-value">${bookingData.serviceName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">${bookingData.date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Hora:</span>
                    <span class="detail-value">${bookingData.time}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Precio:</span>
                    <span class="detail-value">$${bookingData.price.toLocaleString()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Profesional:</span>
                    <span class="detail-value">${bookingData.professionalName}</span>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <div class="social-links">
                  <a href="https://agendalook.cl">🌐 Sitio Web</a>
                  <a href="mailto:soporte@agendalook.cl">📧 Soporte</a>
                  <a href="https://instagram.com/agendalook">📱 Instagram</a>
                </div>
                <p>¿Tienes preguntas? Contáctanos en <a href="mailto:soporte@agendalook.cl">soporte@agendalook.cl</a></p>
                <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
                <div class="unsubscribe">
                  <a href="mailto:unsubscribe@agendalook.cl?subject=Unsubscribe">Darse de baja</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Error sending booking confirmation:', error);
        throw error;
      }

      console.log('✅ Booking confirmation email sent successfully:', data);
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
      const { data, error } = await resend.emails.send({
        from: 'Agendalook <onboarding@resend.dev>',
        to: [email],
        subject: '✨ Nueva reserva recibida - Agendalook',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nueva Reserva - Agendalook</title>
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
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Agendalook</div>
                <div class="tagline">Tu cita, tu estilo</div>
              </div>
              
              <div class="content">
                <div class="title">✨ ¡Nueva reserva recibida!</div>
                <div class="message">
                  Has recibido una nueva reserva. Revisa los detalles a continuación.
                </div>
                
                <div class="booking-details">
                  <div class="detail-row">
                    <span class="detail-label">Cliente:</span>
                    <span class="detail-value">${bookingData.clientName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Servicio:</span>
                    <span class="detail-value">${bookingData.serviceName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">${bookingData.date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Hora:</span>
                    <span class="detail-value">${bookingData.time}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Precio:</span>
                    <span class="detail-value">$${bookingData.price}</span>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <p>Gestiona tus reservas en tu <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">dashboard</a></p>
                <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('❌ Error sending professional notification:', error);
        throw error;
      }

      console.log('✅ Professional notification email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in sendProfessionalNotification:', error);
      throw error;
    }
  }
} 