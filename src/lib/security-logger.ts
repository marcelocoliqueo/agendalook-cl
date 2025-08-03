import { checkSecurityAlerts } from './security-alerts';

interface SecurityEvent {
  type: 'login_success' | 'login_failed' | 'unauthorized_access' | 'rate_limit_exceeded' | 'webhook_received' | 'suspicious_activity';
  ip: string;
  userAgent?: string;
  userId?: string;
  email?: string;
  details?: any;
  timestamp: string;
}

class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];

  private constructor() {}

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  log(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Log a consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Security Event:', securityEvent);
    }

    // En producción, aquí enviarías a un servicio de logging
    // como CloudWatch, Loggly, o similar
    this.events.push(securityEvent);

    // Mantener solo los últimos 1000 eventos en memoria
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Verificar alertas de seguridad
    checkSecurityAlerts(this.events, event.ip);
  }

  // Log de login exitoso
  logLoginSuccess(ip: string, userId: string, email: string, userAgent?: string) {
    this.log({
      type: 'login_success',
      ip,
      userId,
      email,
      userAgent,
    });
  }

  // Log de login fallido
  logLoginFailed(ip: string, email: string, error: string, userAgent?: string) {
    this.log({
      type: 'login_failed',
      ip,
      email,
      userAgent,
      details: { error },
    });
  }

  // Log de acceso no autorizado
  logUnauthorizedAccess(ip: string, path: string, userAgent?: string) {
    this.log({
      type: 'unauthorized_access',
      ip,
      userAgent,
      details: { path },
    });
  }

  // Log de rate limit excedido
  logRateLimitExceeded(ip: string, endpoint: string, userAgent?: string) {
    this.log({
      type: 'rate_limit_exceeded',
      ip,
      userAgent,
      details: { endpoint },
    });
  }

  // Log de webhook recibido
  logWebhookReceived(ip: string, type: string, dataId: string, userAgent?: string) {
    this.log({
      type: 'webhook_received',
      ip,
      userAgent,
      details: { webhookType: type, dataId },
    });
  }

  // Log de actividad sospechosa
  logSuspiciousActivity(ip: string, activity: string, details?: any, userAgent?: string) {
    this.log({
      type: 'suspicious_activity',
      ip,
      userAgent,
      details: { activity, ...details },
    });
  }

  // Obtener eventos recientes (últimas 24 horas)
  getRecentEvents(hours: number = 24): SecurityEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.events.filter(event => new Date(event.timestamp) > cutoff);
  }

  // Obtener eventos por tipo
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  // Obtener eventos por IP
  getEventsByIP(ip: string): SecurityEvent[] {
    return this.events.filter(event => event.ip === ip);
  }

  // Detectar actividad sospechosa
  detectSuspiciousActivity(ip: string, timeWindow: number = 15 * 60 * 1000): boolean {
    const cutoff = new Date(Date.now() - timeWindow);
    const recentEvents = this.events.filter(
      event => event.ip === ip && new Date(event.timestamp) > cutoff
    );

    // Detectar múltiples intentos de login fallidos
    const failedLogins = recentEvents.filter(event => event.type === 'login_failed');
    if (failedLogins.length >= 5) {
      this.logSuspiciousActivity(ip, 'multiple_failed_logins', { count: failedLogins.length });
      return true;
    }

    // Detectar múltiples accesos no autorizados
    const unauthorizedAccess = recentEvents.filter(event => event.type === 'unauthorized_access');
    if (unauthorizedAccess.length >= 10) {
      this.logSuspiciousActivity(ip, 'multiple_unauthorized_access', { count: unauthorizedAccess.length });
      return true;
    }

    return false;
  }

  // Obtener estadísticas de eventos
  getEventStats(hours: number = 24) {
    const recentEvents = this.getRecentEvents(hours);
    
    return {
      total: recentEvents.length,
      loginSuccess: recentEvents.filter(e => e.type === 'login_success').length,
      loginFailed: recentEvents.filter(e => e.type === 'login_failed').length,
      unauthorizedAccess: recentEvents.filter(e => e.type === 'unauthorized_access').length,
      rateLimitExceeded: recentEvents.filter(e => e.type === 'rate_limit_exceeded').length,
      suspiciousActivity: recentEvents.filter(e => e.type === 'suspicious_activity').length,
      webhookReceived: recentEvents.filter(e => e.type === 'webhook_received').length,
    };
  }

  // Obtener IPs más activas
  getTopIPs(hours: number = 24, limit: number = 10) {
    const recentEvents = this.getRecentEvents(hours);
    const ipActivity = recentEvents.reduce((acc, event) => {
      acc[event.ip] = (acc[event.ip] || 0) + 1;
      return acc;
    }, {} as { [ip: string]: number });

    return Object.entries(ipActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([ip, count]) => ({ ip, count }));
  }
}

export const securityLogger = SecurityLogger.getInstance();

// Función helper para obtener User-Agent
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined;
}

// Función helper para validar IP
export function isValidIP(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip) || ip === 'unknown';
} 