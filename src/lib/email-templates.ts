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