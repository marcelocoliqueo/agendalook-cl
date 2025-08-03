interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  ip?: string;
  userId?: string;
  email?: string;
  timestamp: string;
  resolved: boolean;
  metadata?: any;
}

interface AlertRule {
  id: string;
  name: string;
  condition: (events: any[]) => boolean;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  cooldown: number; // en milisegundos
}

class SecurityAlertSystem {
  private static instance: SecurityAlertSystem;
  private alerts: SecurityAlert[] = [];
  private rules: AlertRule[] = [];
  private lastAlertTime: { [ruleId: string]: number } = {};

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): SecurityAlertSystem {
    if (!SecurityAlertSystem.instance) {
      SecurityAlertSystem.instance = new SecurityAlertSystem();
    }
    return SecurityAlertSystem.instance;
  }

  private initializeDefaultRules() {
    // Regla 1: Múltiples intentos de login fallidos
    this.addRule({
      id: 'multiple_failed_logins',
      name: 'Múltiples intentos de login fallidos',
      condition: (events) => {
        const failedLogins = events.filter(e => e.type === 'login_failed');
        return failedLogins.length >= 5;
      },
      severity: 'critical',
      message: 'Se detectaron múltiples intentos de login fallidos desde la IP {ip}',
      cooldown: 15 * 60 * 1000, // 15 minutos
    });

    // Regla 2: Múltiples accesos no autorizados
    this.addRule({
      id: 'multiple_unauthorized_access',
      name: 'Múltiples accesos no autorizados',
      condition: (events) => {
        const unauthorized = events.filter(e => e.type === 'unauthorized_access');
        return unauthorized.length >= 10;
      },
      severity: 'critical',
      message: 'Se detectaron múltiples accesos no autorizados desde la IP {ip}',
      cooldown: 15 * 60 * 1000,
    });

    // Regla 3: Rate limit excedido
    this.addRule({
      id: 'rate_limit_exceeded',
      name: 'Rate limit excedido',
      condition: (events) => {
        const rateLimit = events.filter(e => e.type === 'rate_limit_exceeded');
        return rateLimit.length >= 3;
      },
      severity: 'warning',
      message: 'Se excedió el rate limit desde la IP {ip}',
      cooldown: 5 * 60 * 1000, // 5 minutos
    });

    // Regla 4: Webhook inválido
    this.addRule({
      id: 'invalid_webhook',
      name: 'Webhook inválido recibido',
      condition: (events) => {
        const suspicious = events.filter(e => e.type === 'suspicious_activity' && 
          e.details?.activity?.includes('webhook'));
        return suspicious.length >= 2;
      },
      severity: 'critical',
      message: 'Se recibieron webhooks inválidos desde la IP {ip}',
      cooldown: 10 * 60 * 1000, // 10 minutos
    });

    // Regla 5: Actividad sospechosa
    this.addRule({
      id: 'suspicious_activity',
      name: 'Actividad sospechosa detectada',
      condition: (events) => {
        const suspicious = events.filter(e => e.type === 'suspicious_activity');
        return suspicious.length >= 3;
      },
      severity: 'warning',
      message: 'Se detectó actividad sospechosa desde la IP {ip}',
      cooldown: 10 * 60 * 1000,
    });
  }

  addRule(rule: AlertRule) {
    this.rules.push(rule);
  }

  checkAlerts(events: any[], ip: string) {
    const recentEvents = events.filter(e => e.ip === ip);
    
    for (const rule of this.rules) {
      const now = Date.now();
      const lastAlert = this.lastAlertTime[rule.id] || 0;
      
      // Verificar cooldown
      if (now - lastAlert < rule.cooldown) {
        continue;
      }

      // Verificar condición
      if (rule.condition(recentEvents)) {
        this.createAlert({
          type: rule.severity,
          title: rule.name,
          message: rule.message.replace('{ip}', ip),
          ip,
          metadata: {
            ruleId: rule.id,
            eventCount: recentEvents.length,
          },
        });

        this.lastAlertTime[rule.id] = now;
      }
    }
  }

  createAlert(alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'resolved'>) {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...alertData,
    };

    this.alerts.push(alert);

    // En desarrollo, mostrar en consola
    if (process.env.NODE_ENV === 'development') {
      console.log('🚨 Security Alert:', alert);
    }

    // En producción, aquí enviarías la alerta a:
    // - Slack/Discord webhook
    // - Email de administradores
    // - Sistema de monitoreo (DataDog, New Relic, etc.)
    this.sendAlertToExternalServices(alert);
  }

  private sendAlertToExternalServices(alert: SecurityAlert) {
    // Implementar envío a servicios externos
    // Por ahora, solo log en consola
    console.log('🔔 Alert sent to external services:', alert);
  }

  getActiveAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  getAlertsBySeverity(severity: SecurityAlert['type']): SecurityAlert[] {
    return this.alerts.filter(alert => alert.type === severity);
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  getAlertStats() {
    const active = this.getActiveAlerts();
    return {
      total: this.alerts.length,
      active: active.length,
      critical: active.filter(a => a.type === 'critical').length,
      warning: active.filter(a => a.type === 'warning').length,
      info: active.filter(a => a.type === 'info').length,
    };
  }
}

export const securityAlertSystem = SecurityAlertSystem.getInstance();

// Función helper para verificar alertas
export function checkSecurityAlerts(events: any[], ip: string) {
  securityAlertSystem.checkAlerts(events, ip);
}

// Función helper para crear alerta manual
export function createSecurityAlert(
  type: SecurityAlert['type'],
  title: string,
  message: string,
  metadata?: any
) {
  securityAlertSystem.createAlert({
    type,
    title,
    message,
    metadata,
  });
} 