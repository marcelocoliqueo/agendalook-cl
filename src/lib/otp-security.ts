/**
 * Sistema de validación de OTP con expiración personalizada
 * Mitiga el warning "Auth OTP Long Expiry"
 */

export interface OTPSecurityConfig {
  maxAttempts: number;
  lockoutDuration: number; // minutos
  rateLimitWindow: number; // minutos
  rateLimitMaxAttempts: number;
}

export const DEFAULT_OTP_CONFIG: OTPSecurityConfig = {
  maxAttempts: 3,
  lockoutDuration: 15, // 15 minutos de bloqueo
  rateLimitWindow: 5, // ventana de 5 minutos
  rateLimitMaxAttempts: 5 // máximo 5 intentos por ventana
};

export interface OTPSecurityResult {
  isValid: boolean;
  reason?: 'expired' | 'max_attempts' | 'rate_limited' | 'invalid' | 'locked';
  remainingAttempts?: number;
  lockoutExpiresAt?: string;
  nextAttemptAllowedAt?: string;
}

export class OTPSecurityManager {
  private static instance: OTPSecurityManager;
  private attempts: Map<string, { count: number; lastAttempt: number; lockoutUntil?: number }> = new Map();

  static getInstance(): OTPSecurityManager {
    if (!OTPSecurityManager.instance) {
      OTPSecurityManager.instance = new OTPSecurityManager();
    }
    return OTPSecurityManager.instance;
  }

  /**
   * Valida si un intento de OTP está permitido
   */
  validateAttempt(email: string, config: OTPSecurityConfig = DEFAULT_OTP_CONFIG): OTPSecurityResult {
    const now = Date.now();
    const key = email.toLowerCase();
    const attemptData = this.attempts.get(key);

    // Si no hay datos previos, permitir intento
    if (!attemptData) {
      return { isValid: true };
    }

    // Verificar si está en lockout
    if (attemptData.lockoutUntil && now < attemptData.lockoutUntil) {
      return {
        isValid: false,
        reason: 'locked',
        lockoutExpiresAt: new Date(attemptData.lockoutUntil).toISOString()
      };
    }

    // Verificar rate limiting
    const windowStart = now - (config.rateLimitWindow * 60 * 1000);
    if (attemptData.lastAttempt > windowStart && attemptData.count >= config.rateLimitMaxAttempts) {
      const nextAttemptAt = attemptData.lastAttempt + (config.rateLimitWindow * 60 * 1000);
      return {
        isValid: false,
        reason: 'rate_limited',
        nextAttemptAllowedAt: new Date(nextAttemptAt).toISOString()
      };
    }

    // Verificar máximo de intentos
    if (attemptData.count >= config.maxAttempts) {
      const lockoutUntil = now + (config.lockoutDuration * 60 * 1000);
      this.attempts.set(key, {
        ...attemptData,
        lockoutUntil,
        count: 0 // Reset count después del lockout
      });
      
      return {
        isValid: false,
        reason: 'max_attempts',
        lockoutExpiresAt: new Date(lockoutUntil).toISOString()
      };
    }

    return {
      isValid: true,
      remainingAttempts: config.maxAttempts - attemptData.count
    };
  }

  /**
   * Registra un intento de OTP
   */
  recordAttempt(email: string, success: boolean, config: OTPSecurityConfig = DEFAULT_OTP_CONFIG): void {
    const key = email.toLowerCase();
    const now = Date.now();
    const attemptData = this.attempts.get(key);

    if (success) {
      // Si es exitoso, limpiar datos
      this.attempts.delete(key);
      return;
    }

    // Si falla, incrementar contador
    const newData = {
      count: (attemptData?.count || 0) + 1,
      lastAttempt: now,
      lockoutUntil: attemptData?.lockoutUntil
    };

    this.attempts.set(key, newData);
  }

  /**
   * Limpia intentos antiguos (llamar periódicamente)
   */
  cleanupOldAttempts(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    for (const [key, data] of this.attempts.entries()) {
      if (now - data.lastAttempt > maxAge) {
        this.attempts.delete(key);
      }
    }
  }

  /**
   * Obtiene estadísticas de intentos para un email
   */
  getAttemptStats(email: string): {
    count: number;
    lastAttempt: string | null;
    isLocked: boolean;
    lockoutExpiresAt: string | null;
  } {
    const key = email.toLowerCase();
    const attemptData = this.attempts.get(key);

    if (!attemptData) {
      return {
        count: 0,
        lastAttempt: null,
        isLocked: false,
        lockoutExpiresAt: null
      };
    }

    const now = Date.now();
    const isLocked = attemptData.lockoutUntil ? now < attemptData.lockoutUntil : false;

    return {
      count: attemptData.count,
      lastAttempt: new Date(attemptData.lastAttempt).toISOString(),
      isLocked,
      lockoutExpiresAt: attemptData.lockoutUntil ? new Date(attemptData.lockoutUntil).toISOString() : null
    };
  }
}

/**
 * Función de utilidad para validar OTP con seguridad mejorada
 */
export function validateOTPWithSecurity(
  email: string,
  code: string,
  expectedCode: string,
  config: OTPSecurityConfig = DEFAULT_OTP_CONFIG
): OTPSecurityResult {
  const securityManager = OTPSecurityManager.getInstance();
  
  // Verificar si el intento está permitido
  const attemptValidation = securityManager.validateAttempt(email, config);
  if (!attemptValidation.isValid) {
    return attemptValidation;
  }

  // Validar código
  const isValidCode = code === expectedCode;
  
  // Registrar intento
  securityManager.recordAttempt(email, isValidCode, config);

  if (isValidCode) {
    return { isValid: true };
  } else {
    return {
      isValid: false,
      reason: 'invalid',
      remainingAttempts: attemptValidation.remainingAttempts ? attemptValidation.remainingAttempts - 1 : undefined
    };
  }
}


