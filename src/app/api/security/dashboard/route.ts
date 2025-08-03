import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { securityLogger } from '@/lib/security-logger';
import { securityAlertSystem } from '@/lib/security-alerts';
import { runSecurityAudit, generateSecurityReport } from '@/lib/code-auditor';
import { runDependencyAudit, generateDependencyReport } from '@/lib/dependency-monitor';
import { getSubscriptionStats, calculateMonthlyRevenue, calculateChurnRate } from '@/lib/plans';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación (solo administradores)
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador (implementar lógica según tu modelo)
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profError || !professional || professional.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Obtener datos de seguridad
    const recentEvents = securityLogger.getRecentEvents(24); // Últimas 24 horas
    const activeAlerts = securityAlertSystem.getActiveAlerts();
    const alertStats = securityAlertSystem.getAlertStats();

    // Obtener datos de suscripciones
    const { data: allProfessionals, error: profsError } = await supabase
      .from('professionals')
      .select('*');

    if (profsError) {
      console.error('Error fetching professionals:', profsError);
      return NextResponse.json(
        { error: 'Error al obtener datos de suscripciones' },
        { status: 500 }
      );
    }

    // Ejecutar auditorías
    const codeAuditResult = await runSecurityAudit();
    const dependencyAuditResult = await runDependencyAudit();

    // Generar reportes
    const codeReport = generateSecurityReport(codeAuditResult);
    const dependencyReport = generateDependencyReport(dependencyAuditResult);

    // Estadísticas de eventos de seguridad
    const eventStats = {
      total: recentEvents.length,
      loginSuccess: recentEvents.filter(e => e.type === 'login_success').length,
      loginFailed: recentEvents.filter(e => e.type === 'login_failed').length,
      unauthorizedAccess: recentEvents.filter(e => e.type === 'unauthorized_access').length,
      rateLimitExceeded: recentEvents.filter(e => e.type === 'rate_limit_exceeded').length,
      suspiciousActivity: recentEvents.filter(e => e.type === 'suspicious_activity').length,
      webhookReceived: recentEvents.filter(e => e.type === 'webhook_received').length,
    };

    // IPs más activas (potencialmente sospechosas)
    const ipActivity = recentEvents.reduce((acc, event) => {
      acc[event.ip] = (acc[event.ip] || 0) + 1;
      return acc;
    }, {} as { [ip: string]: number });

    const topIPs = Object.entries(ipActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    // Vulnerabilidades críticas
    const criticalVulnerabilities = codeAuditResult.vulnerabilities.filter(v => v.severity === 'critical');
    const criticalDependencies = dependencyAuditResult.criticalVulnerabilities;

    // Estadísticas de suscripciones
    const subscriptionStats = getSubscriptionStats(allProfessionals || []);
    const monthlyRevenue = calculateMonthlyRevenue(allProfessionals || []);
    const churnRate = calculateChurnRate(allProfessionals || []);

    // Usuarios por estado de suscripción
    const usersBySubscriptionStatus = {
      active: allProfessionals?.filter(p => p.subscription_status === 'active').length || 0,
      pending_payment: allProfessionals?.filter(p => p.subscription_status === 'pending_payment').length || 0,
      grace_period: allProfessionals?.filter(p => p.subscription_status === 'grace_period').length || 0,
      suspended: allProfessionals?.filter(p => p.subscription_status === 'suspended').length || 0,
      cancelled: allProfessionals?.filter(p => p.subscription_status === 'cancelled').length || 0,
      past_due: allProfessionals?.filter(p => p.subscription_status === 'past_due').length || 0,
    };

    // Usuarios que necesitan atención (en período de gracia o suspendidos)
    const usersNeedingAttention = usersBySubscriptionStatus.grace_period + usersBySubscriptionStatus.suspended;

    // Ingresos por plan (calculados dinámicamente)
    const revenueByPlan = {
      pro: 0, // TODO: Calcular dinámicamente
      studio: 0, // TODO: Calcular dinámicamente
    };

    const dashboardData = {
      timestamp: new Date().toISOString(),
      
      // Datos de seguridad
      eventStats,
      alertStats,
      activeAlerts: activeAlerts.slice(0, 10), // Últimas 10 alertas
      topIPs,
      codeAudit: {
        summary: codeAuditResult.summary,
        criticalVulnerabilities: criticalVulnerabilities.length,
        report: codeReport,
      },
      dependencyAudit: {
        summary: dependencyAuditResult,
        criticalVulnerabilities: criticalDependencies,
        report: dependencyReport,
      },
      securityScore: calculateSecurityScore(
        eventStats,
        alertStats,
        codeAuditResult,
        dependencyAuditResult
      ),

      // Datos de suscripciones
      subscriptionStats: {
        totalUsers: subscriptionStats.totalUsers,
        activeSubscriptions: subscriptionStats.activeSubscriptions,
        gracePeriodUsers: subscriptionStats.gracePeriodUsers,
        suspendedUsers: subscriptionStats.suspendedUsers,
        cancelledUsers: subscriptionStats.cancelledUsers,
        monthlyRevenue,
        churnRate,
        usersByPlan: subscriptionStats.usersByPlan,
        usersBySubscriptionStatus,
        usersNeedingAttention,
        revenueByPlan,
      },

      // Métricas generales del negocio
      businessMetrics: {
        totalRevenue: monthlyRevenue,
        averageRevenuePerUser: subscriptionStats.activeSubscriptions > 0 ? monthlyRevenue / subscriptionStats.activeSubscriptions : 0,
        conversionRate: subscriptionStats.totalUsers > 0 ? (subscriptionStats.activeSubscriptions / subscriptionStats.totalUsers) * 100 : 0,
        retentionRate: 100 - churnRate,
        growthRate: 0, // Se calcularía con datos históricos
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error getting security dashboard data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para calcular puntuación de seguridad
function calculateSecurityScore(
  eventStats: any,
  alertStats: any,
  codeAudit: any,
  dependencyAudit: any
): number {
  let score = 100;

  // Penalizar por eventos de seguridad
  score -= eventStats.loginFailed * 2;
  score -= eventStats.unauthorizedAccess * 3;
  score -= eventStats.suspiciousActivity * 5;

  // Penalizar por alertas activas
  score -= alertStats.critical * 10;
  score -= alertStats.warning * 5;

  // Penalizar por vulnerabilidades de código
  score -= codeAudit.summary.critical * 15;
  score -= codeAudit.summary.high * 10;
  score -= codeAudit.summary.medium * 5;

  // Penalizar por vulnerabilidades de dependencias
  score -= dependencyAudit.criticalVulnerabilities * 10;
  score -= dependencyAudit.highVulnerabilities * 5;

  return Math.max(0, Math.min(100, score));
} 