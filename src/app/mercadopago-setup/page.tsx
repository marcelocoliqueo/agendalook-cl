'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TestResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  config?: any;
  error?: string;
  details?: string;
}

export default function MercadoPagoSetupPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    accessToken: '',
    publicKey: '',
    proPriceId: '',
    studioPriceId: ''
  });

  const runTest = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mercadopago/${endpoint}`);
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Error al conectar con el servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
              Configuración de MercadoPago
            </h1>
            <p className="text-gray-600">
              Configura y prueba la integración con MercadoPago
            </p>
          </div>

          {/* Configuración */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Variables de Entorno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MERCADOPAGO_ACCESS_TOKEN
                </label>
                <Input
                  type="password"
                  placeholder="APP_USR_..."
                  value={config.accessToken}
                  onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Obtén tu access token desde el dashboard de MercadoPago
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
                </label>
                <Input
                  type="text"
                  placeholder="APP_USR_..."
                  value={config.publicKey}
                  onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Clave pública para el frontend
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MP_PRO_PRICE_ID
                  </label>
                  <Input
                    type="text"
                    placeholder="MLB_..."
                    value={config.proPriceId}
                    onChange={(e) => setConfig({ ...config, proPriceId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MP_STUDIO_PRICE_ID
                  </label>
                  <Input
                    type="text"
                    placeholder="MLB_..."
                    value={config.studioPriceId}
                    onChange={(e) => setConfig({ ...config, studioPriceId: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Test Básico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Verifica la configuración básica sin conectar con MercadoPago
                </p>
                <Button
                  onClick={() => runTest('simple-test')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Ejecutar Test Básico
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Prueba la conexión real con MercadoPago (requiere access token)
                </p>
                <Button
                  onClick={() => runTest('test')}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Ejecutar Test Completo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          {testResult && (
            <Card className={`${getStatusColor(testResult.status)}`}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(testResult.status)}
                  <CardTitle>Resultado del Test</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {testResult.message}
                    </h4>
                    {testResult.error && (
                      <p className="text-red-600 text-sm">{testResult.error}</p>
                    )}
                    {testResult.details && (
                      <p className="text-gray-600 text-sm">{testResult.details}</p>
                    )}
                  </div>

                  {testResult.config && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Configuración:</h5>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(testResult.config, null, 2)}
                      </pre>
                    </div>
                  )}

                  {testResult.status === 'warning' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h5 className="font-medium text-yellow-800 mb-2">Instrucciones:</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>1. Configura MERCADOPAGO_ACCESS_TOKEN en tu .env</li>
                        <li>2. Obtén tu access token desde el dashboard de MercadoPago</li>
                        <li>3. Para pruebas, puedes usar el sandbox de MercadoPago</li>
                      </ul>
                    </div>
                  )}

                  {testResult.status === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-800 mb-2">Próximos pasos:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>1. Configura los Product IDs si quieres usar productos específicos</li>
                        <li>2. Configura el webhook URL en tu dashboard de MercadoPago</li>
                        <li>3. Prueba la integración completa</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información adicional */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Información de MercadoPago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Credenciales de Prueba</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Para pruebas, puedes usar las siguientes credenciales de sandbox:
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <p><strong>Access Token:</strong> APP_USR-...</p>
                    <p><strong>Public Key:</strong> APP_USR-...</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tarjetas de Prueba</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Usa estas tarjetas para probar los pagos:
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <p><strong>Visa:</strong> 4509 9535 6623 3704</p>
                    <p><strong>Mastercard:</strong> 5031 4332 1540 6351</p>
                    <p><strong>CVV:</strong> 123</p>
                    <p><strong>Fecha:</strong> 11/25</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Webhook URL</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Configura esta URL en tu dashboard de MercadoPago:
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <code>https://tu-dominio.vercel.app/api/mercadopago/webhook</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 