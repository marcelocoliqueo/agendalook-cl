'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Users, Lock, Eye, CreditCard, TrendingUp, DollarSign, UserCheck } from 'lucide-react';
import { getSubscriptionStatusColor, getSubscriptionStatusText, formatMoney } from '@/lib/plans';

interface SecurityDashboardData {
  timestamp: string;
  eventStats: {
    total: number;
    loginSuccess: number;
    loginFailed: number;
    unauthorizedAccess: number;
    rateLimitExceeded: number;
    suspiciousActivity: number;
    webhookReceived: number;
  };
  alertStats: {
    total: number;
    active: number;
    critical: number;
    warning: number;
    info: number;
  };
  activeAlerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
  }>;
  topIPs: Array<{
    ip: string;
    count: number;
  }>;
  codeAudit: {
    summary: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    criticalVulnerabilities: number;
  };
  dependencyAudit: {
    totalDependencies: number;
    outdatedDependencies: number;
    vulnerableDependencies: number;
    criticalVulnerabilities: number;
    highVulnerabilities: number;
  };
  securityScore: number;
  subscriptionStats: {
    totalUsers: number;
    activeSubscriptions: number;
    gracePeriodUsers: number;
    suspendedUsers: number;
    cancelledUsers: number;
    monthlyRevenue: number;
    churnRate: number;
    usersByPlan: {
      free: number;
      pro: number;
      studio: number;
    };
    usersBySubscriptionStatus: {
      active: number;
      pending_payment: number;
      grace_period: number;
      suspended: number;
      cancelled: number;
      past_due: number;
    };
    usersNeedingAttention: number;
    revenueByPlan: {
      pro: number;
      studio: number;
    };
  };
  businessMetrics: {
    totalRevenue: number;
    averageRevenuePerUser: number;
    conversionRate: number;
    retentionRate: number;
    growthRate: number;
  };
}

export default function SecurityDashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<SecurityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'security' | 'subscriptions' | 'metrics'>('security');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/security/dashboard', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar datos de seguridad');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      setError('Error al cargar el dashboard de seguridad');
      console.error('Error fetching security dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard de seguridad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">No hay datos disponibles</h2>
          <p className="mt-2 text-gray-600">No se pudieron cargar los datos de seguridad</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Administración</h1>
          <p className="text-gray-600">
            Última actualización: {new Date(dashboardData.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Tabs de Navegación */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔒 Seguridad
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscriptions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💳 Suscripciones
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'metrics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Métricas Generales
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de Seguridad */}
        {activeTab === 'security' && (
          <>
            {/* Puntuación de Seguridad */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Puntuación de Seguridad</h2>
                  <p className="text-gray-600">Estado general de la seguridad del sistema</p>
                </div>
                <div className="flex items-center space-x-4">
                  {getSecurityScoreIcon(dashboardData.securityScore)}
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getSecurityScoreColor(dashboardData.securityScore)}`}>
                      {dashboardData.securityScore}/100
                    </div>
                    <div className="text-sm text-gray-500">
                      {dashboardData.securityScore >= 80 ? 'Excelente' : 
                       dashboardData.securityScore >= 60 ? 'Bueno' : 'Necesita atención'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Eventos de Seguridad */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Eventos de Seguridad</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.eventStats.total}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Login exitoso:</span>
                    <span className="text-green-600">{dashboardData.eventStats.loginSuccess}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Login fallido:</span>
                    <span className="text-red-600">{dashboardData.eventStats.loginFailed}</span>
                  </div>
                </div>
              </div>

              {/* Alertas Activas */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.alertStats.active}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Críticas:</span>
                    <span className="text-red-600">{dashboardData.alertStats.critical}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Advertencias:</span>
                    <span className="text-yellow-600">{dashboardData.alertStats.warning}</span>
                  </div>
                </div>
              </div>

              {/* Vulnerabilidades de Código */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vulnerabilidades</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.codeAudit.summary.total}</p>
                  </div>
                  <Lock className="w-8 h-8 text-orange-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Críticas:</span>
                    <span className="text-red-600">{dashboardData.codeAudit.summary.critical}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Altas:</span>
                    <span className="text-orange-600">{dashboardData.codeAudit.summary.high}</span>
                  </div>
                </div>
              </div>

              {/* Dependencias */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dependencias</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.dependencyAudit.totalDependencies}</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vulnerables:</span>
                    <span className="text-red-600">{dashboardData.dependencyAudit.vulnerableDependencies}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Desactualizadas:</span>
                    <span className="text-yellow-600">{dashboardData.dependencyAudit.outdatedDependencies}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertas Activas */}
            {dashboardData.activeAlerts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Alertas Activas</h2>
                <div className="space-y-4">
                  {dashboardData.activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'critical'
                          ? 'bg-red-50 border-red-400'
                          : alert.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{alert.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.type === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : alert.type === 'warning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alert.type.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IPs Más Activas */}
            {dashboardData.topIPs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">IPs Más Activas</h2>
                <div className="space-y-3">
                  {dashboardData.topIPs.map((ipData, index) => (
                    <div key={ipData.ip} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                        <span className="font-mono text-sm text-gray-700">{ipData.ip}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{ipData.count} eventos</span>
                        {ipData.count > 10 && (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Contenido de Suscripciones */}
        {activeTab === 'subscriptions' && (
          <>
            {/* Resumen de Suscripciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Usuarios Totales */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.subscriptionStats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Activos:</span>
                    <span className="text-green-600">{dashboardData.subscriptionStats.activeSubscriptions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gratis:</span>
                    <span className="text-gray-600">{dashboardData.subscriptionStats.usersByPlan.free}</span>
                  </div>
                </div>
              </div>

              {/* Ingresos Mensuales */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                    <p className="text-2xl font-bold text-gray-900">{formatMoney(dashboardData.subscriptionStats.monthlyRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pro:</span>
                    <span className="text-lavender-600">{formatMoney(dashboardData.subscriptionStats.revenueByPlan.pro)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Studio:</span>
                    <span className="text-coral-600">{formatMoney(dashboardData.subscriptionStats.revenueByPlan.studio)}</span>
                  </div>
                </div>
              </div>

              {/* Tasa de Cancelación */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tasa de Cancelación</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.subscriptionStats.churnRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cancelados:</span>
                    <span className="text-red-600">{dashboardData.subscriptionStats.cancelledUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Retención:</span>
                    <span className="text-green-600">{(100 - dashboardData.subscriptionStats.churnRate).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Necesitan Atención */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Necesitan Atención</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.subscriptionStats.usersNeedingAttention}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Período gracia:</span>
                    <span className="text-orange-600">{dashboardData.subscriptionStats.gracePeriodUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Suspendidos:</span>
                    <span className="text-red-600">{dashboardData.subscriptionStats.suspendedUsers}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estados de Suscripción */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estados de Suscripción</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(dashboardData.subscriptionStats.usersBySubscriptionStatus).map(([status, count]) => (
                  <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getSubscriptionStatusColor(status as any)}`}>
                      {getSubscriptionStatusText(status as any)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-500">usuarios</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución por Planes */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución por Planes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(dashboardData.subscriptionStats.usersByPlan).map(([plan, count]) => (
                  <div key={plan} className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">{count}</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
                    <div className="text-xs text-gray-500">
                      {dashboardData.subscriptionStats.totalUsers > 0 
                        ? `${((count / dashboardData.subscriptionStats.totalUsers) * 100).toFixed(1)}%`
                        : '0%'
                      } del total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contenido de Métricas Generales */}
        {activeTab === 'metrics' && (
          <>
            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Ingresos Totales */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{formatMoney(dashboardData.businessMetrics.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Por mes</div>
                </div>
              </div>

              {/* Ingreso Promedio por Usuario */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingreso Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{formatMoney(dashboardData.businessMetrics.averageRevenuePerUser)}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Por usuario activo</div>
                </div>
              </div>

              {/* Tasa de Conversión */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.businessMetrics.conversionRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Usuarios que pagan</div>
                </div>
              </div>

              {/* Tasa de Retención */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tasa de Retención</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.businessMetrics.retentionRate.toFixed(1)}%</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Usuarios que se mantienen</div>
                </div>
              </div>
            </div>

            {/* Resumen del Negocio */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Negocio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Usuarios</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total registrados:</span>
                      <span className="font-medium">{dashboardData.subscriptionStats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Suscripciones activas:</span>
                      <span className="font-medium text-green-600">{dashboardData.subscriptionStats.activeSubscriptions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan gratuito:</span>
                      <span className="font-medium">{dashboardData.subscriptionStats.usersByPlan.free}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Ingresos</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mensual:</span>
                      <span className="font-medium text-green-600">{formatMoney(dashboardData.subscriptionStats.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Pro:</span>
                      <span className="font-medium">{formatMoney(dashboardData.subscriptionStats.revenueByPlan.pro)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Studio:</span>
                      <span className="font-medium">{formatMoney(dashboardData.subscriptionStats.revenueByPlan.studio)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Botón de Actualización */}
        <div className="text-center">
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Actualizar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 