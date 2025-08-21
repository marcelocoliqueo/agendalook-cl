'use client';

import { useState, useEffect } from 'react';
import { ResourceMonitor } from '@/lib/resource-monitor';

export default function TestResourcesPage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testResourceMonitor();
  }, []);

  const testResourceMonitor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing ResourceMonitor...');
      const resourceUsage = await ResourceMonitor.getResourceUsage();
      console.log('Resource usage:', resourceUsage);
      setUsage(resourceUsage);
      
      const upgradeCheck = await ResourceMonitor.shouldUpgrade();
      console.log('Upgrade check:', upgradeCheck);
      
    } catch (error) {
      console.error('Error testing ResourceMonitor:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Probando ResourceMonitor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Prueba de ResourceMonitor</h1>
        <p className="text-gray-600">Verificando que el monitoreo de recursos funcione correctamente</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={testResourceMonitor}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {usage && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos de Uso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Storage</h3>
              <p className="text-sm text-blue-600">
                Usado: {((usage.storage.used / (1024 * 1024))).toFixed(1)} MB
              </p>
              <p className="text-sm text-blue-600">
                Límite: {((usage.storage.limit / (1024 * 1024))).toFixed(0)} MB
              </p>
              <p className="text-sm text-blue-600">
                Porcentaje: {usage.storage.percentage.toFixed(1)}%
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Database</h3>
              <p className="text-sm text-green-600">
                Filas: {usage.database.rows.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                Límite: {usage.database.limit.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                Porcentaje: {usage.database.percentage.toFixed(1)}%
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Bandwidth</h3>
              <p className="text-sm text-purple-600">
                Usado: {((usage.bandwidth.used / (1024 * 1024 * 1024))).toFixed(1)} GB
              </p>
              <p className="text-sm text-purple-600">
                Límite: {((usage.bandwidth.limit / (1024 * 1024 * 1024))).toFixed(0)} GB
              </p>
              <p className="text-sm text-purple-600">
                Porcentaje: {usage.bandwidth.percentage.toFixed(1)}%
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Emails</h3>
              <p className="text-sm text-orange-600">
                Enviados: {usage.emails.used.toLocaleString()}
              </p>
              <p className="text-sm text-orange-600">
                Límite: {usage.emails.limit.toLocaleString()}
              </p>
              <p className="text-sm text-orange-600">
                Porcentaje: {usage.emails.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={testResourceMonitor}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Probar Nuevamente
        </button>
      </div>
    </div>
  );
} 