'use client';

import { useState } from 'react';
import { Shield, Lock, Key, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
  const [securityStatus, setSecurityStatus] = useState({
    rlsEnabled: false,
    policiesActive: false,
    sslEnabled: true,
    backupsEnabled: true
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
          Configuración de Seguridad
        </h1>
        <p className="text-gray-600 font-poppins">
          Monitoreo y configuración de seguridad del sistema
        </p>
      </div>

      {/* Estado de Seguridad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RLS Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Row Level Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">RLS Deshabilitado</span>
              </div>
              <p className="text-sm text-red-700">
                Las políticas de seguridad están temporalmente deshabilitadas debido a problemas de recursión.
              </p>
              <p className="text-xs text-red-600 mt-2">
                Se requiere reconfigurar las políticas RLS en Supabase.
              </p>
            </div>
          </div>
        </div>

        {/* SSL Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Conexión SSL</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">SSL Habilitado</span>
              </div>
              <p className="text-sm text-green-700">
                Todas las conexiones están protegidas con SSL/TLS.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">API Keys</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Keys Configuradas</span>
              </div>
              <p className="text-sm text-blue-700">
                Las claves de API están configuradas correctamente.
              </p>
            </div>
          </div>
        </div>

        {/* Backups */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Backups</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Backups Activos</span>
              </div>
              <p className="text-sm text-purple-700">
                Los backups automáticos están configurados y funcionando.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones de Seguridad */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones de Seguridad</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Reconfigurar RLS</h4>
              <p className="text-sm text-gray-600">Arreglar políticas de seguridad</p>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Key className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Rotar API Keys</h4>
              <p className="text-sm text-gray-600">Generar nuevas claves</p>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <div className="text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Auditoría</h4>
              <p className="text-sm text-gray-600">Revisar logs de seguridad</p>
            </div>
          </button>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Nota Importante</h3>
            <p className="text-sm text-yellow-700 mb-2">
              El sistema está funcionando con RLS deshabilitado temporalmente. Esto es necesario para resolver los problemas de recursión infinita en las políticas de seguridad.
            </p>
            <p className="text-xs text-yellow-600">
              Una vez que se resuelvan los problemas de RLS, se habilitarán nuevamente las políticas de seguridad para mantener la integridad de los datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 