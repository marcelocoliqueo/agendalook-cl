'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ResourceMonitor, ResourceUsage } from '@/lib/resource-monitor';
import { CacheManager } from '@/lib/cache-manager';
import { 
  Database, 
  HardDrive, 
  Mail, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage | null>(null);
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [shouldUpgrade, setShouldUpgrade] = useState(false);
  const [upgradeReasons, setUpgradeReasons] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Verificar que sea admin
    if (!user) {
      // Esperar a que se cargue el usuario
      setUserLoading(true);
      return;
    }

    setUserLoading(false);

    if (user.email !== 'admin@agendalook.cl') {
      router.push('/dashboard');
      return;
    }

    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar uso de recursos
      const usage = await ResourceMonitor.getResourceUsage();
      setResourceUsage(usage);
      
      // Cargar estadísticas detalladas
      const detailed = await ResourceMonitor.getDetailedStats();
      setDetailedStats(detailed);
      
      // Verificar si necesita upgrade
      const upgradeCheck = await ResourceMonitor.shouldUpgrade();
      setShouldUpgrade(upgradeCheck.shouldUpgrade);
      setUpgradeReasons(upgradeCheck.reasons);
      
      // Cargar estadísticas de cache
      setCacheStats(CacheManager.getStats());
    } catch (error) {
      console.error('Error cargando datos de administración:', error);
      setError('Error al cargar los datos de administración. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="w-5 h-5" />;
    if (percentage >= 80) return <AlertTriangle className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Monitoreo de recursos y optimización del sistema
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-red-800">Error</h3>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Upgrade Alert */}
        {shouldUpgrade && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-red-800">Upgrade Recomendado</h3>
            </div>
            <ul className="mt-2 text-sm text-red-700">
              {upgradeReasons.map((reason, index) => (
                <li key={index}>• {reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Métricas de Recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Storage */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Almacenamiento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resourceUsage?.storage ? `${((resourceUsage.storage.used / (1024 * 1024))).toFixed(1)} MB` : '0 MB'}
                </p>
              </div>
              <HardDrive className={`w-8 h-8 ${getStatusColor(resourceUsage?.storage?.percentage || 0)}`} />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  (resourceUsage?.storage?.percentage || 0) >= 90 
                    ? 'bg-red-500' 
                    : (resourceUsage?.storage?.percentage || 0) >= 80 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`}
                style={{ width: `${resourceUsage?.storage?.percentage || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {resourceUsage?.storage?.percentage.toFixed(1)}% de 500 MB
            </p>
          </div>

          {/* Database */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Base de Datos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resourceUsage?.database ? `${resourceUsage.database.rows.toLocaleString()}` : '0'} filas
                </p>
              </div>
              <Database className={`w-8 h-8 ${getStatusColor(resourceUsage?.database?.percentage || 0)}`} />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  (resourceUsage?.database?.percentage || 0) >= 90 
                    ? 'bg-red-500' 
                    : (resourceUsage?.database?.percentage || 0) >= 80 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`}
                style={{ width: `${resourceUsage?.database?.percentage || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {resourceUsage?.database?.percentage.toFixed(1)}% de 500k filas
            </p>
          </div>

          {/* Bandwidth */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Ancho de Banda</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resourceUsage?.bandwidth ? `${((resourceUsage.bandwidth.used / (1024 * 1024 * 1024))).toFixed(1)} GB` : '0 GB'}
                </p>
              </div>
              <Wifi className={`w-8 h-8 ${getStatusColor(resourceUsage?.bandwidth?.percentage || 0)}`} />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  (resourceUsage?.bandwidth?.percentage || 0) >= 90 
                    ? 'bg-red-500' 
                    : (resourceUsage?.bandwidth?.percentage || 0) >= 80 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`}
                style={{ width: `${resourceUsage?.bandwidth?.percentage || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {resourceUsage?.bandwidth?.percentage.toFixed(1)}% de 100 GB
            </p>
          </div>

          {/* Emails */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resourceUsage?.emails ? `${resourceUsage.emails.used.toLocaleString()}` : '0'} enviados
                </p>
              </div>
              <Mail className={`w-8 h-8 ${getStatusColor(resourceUsage?.emails?.percentage || 0)}`} />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  (resourceUsage?.emails?.percentage || 0) >= 90 
                    ? 'bg-red-500' 
                    : (resourceUsage?.emails?.percentage || 0) >= 80 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`}
                style={{ width: `${resourceUsage?.emails?.percentage || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {resourceUsage?.emails?.percentage.toFixed(1)}% de 3000/mes
            </p>
          </div>
        </div>

        {/* Estadísticas Detalladas */}
        {detailedStats && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Estadísticas de la Aplicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{detailedStats.stats.professionals}</p>
                <p className="text-sm text-blue-600">Profesionales</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{detailedStats.stats.services}</p>
                <p className="text-sm text-green-600">Servicios</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{detailedStats.stats.totalBookings}</p>
                <p className="text-sm text-purple-600">Reservas Totales</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{detailedStats.stats.recentBookings}</p>
                <p className="text-sm text-orange-600">Últimos 30 días</p>
              </div>
            </div>
          </div>
        )}

        {/* Cache Statistics */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Estadísticas de Cache
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {cacheStats?.size || 0}
              </div>
              <p className="text-sm text-gray-600">Elementos en Cache</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {cacheStats?.keys?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Claves Únicas</p>
            </div>
            <div className="text-center">
              <button 
                onClick={() => {
                  CacheManager.clear();
                  setCacheStats(CacheManager.getStats());
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Limpiar Cache
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Acciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={loadData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Actualizar Datos
            </button>
            <button
              onClick={() => {
                CacheManager.clear();
                setCacheStats(CacheManager.getStats());
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
            >
              <Activity className="w-4 h-4 mr-2" />
              Limpiar Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 