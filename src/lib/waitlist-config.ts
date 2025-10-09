// Script para desactivar la waitlist y permitir registro normal
// Ejecutar cuando quieras abrir el registro para todos

const ALLOWED_EMAILS = [
  'marcelo.coliqueo@gmail.com',
  // Agregar más emails aquí cuando quieras permitir más usuarios de prueba
];

// Para desactivar completamente la waitlist, cambiar esta variable a false
const WAITLIST_ENABLED = true;

// Para activar registro público, cambiar esta variable a true
const PUBLIC_REGISTRATION_ENABLED = false;

export const waitlistConfig = {
  enabled: WAITLIST_ENABLED,
  publicRegistration: PUBLIC_REGISTRATION_ENABLED,
  allowedEmails: ALLOWED_EMAILS,
  
  // Función para verificar si un email puede registrarse
  canRegister: (email: string) => {
    if (!WAITLIST_ENABLED || PUBLIC_REGISTRATION_ENABLED) {
      return true;
    }
    return ALLOWED_EMAILS.includes(email);
  },
  
  // Función para obtener el mensaje de redirección
  getRedirectMessage: (email: string) => {
    if (canRegister(email)) {
      return null; // No redirigir
    }
    
    return {
      error: 'Registro en lista de espera',
      redirect: '/waitlist',
      waitlist: true,
      message: 'Actualmente solo estamos permitiendo registros de prueba. Únete a nuestra lista de espera para ser notificado cuando esté disponible.'
    };
  }
};
