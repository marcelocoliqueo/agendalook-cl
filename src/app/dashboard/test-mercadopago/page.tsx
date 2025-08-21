'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, AlertTriangle, CreditCard, DollarSign } from 'lucide-react';

export default function TestMercadoPagoPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      addResult('🔍 Probando conexión con MercadoPago...');
      
      const response = await fetch('/api/mercadopago/test');
      const data = await response.json();
      
      if (data.success) {
        addResult('✅ Conexión exitosa con MercadoPago');
        addResult(`📋 Preference ID: ${data.preferenceId}`);
      } else {
        addResult(`❌ Error: ${data.error}`);
        addResult('💡 Configura las credenciales en .env.local');
      }
    } catch (error) {
      addResult(`❌ Error de conexión: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testPreferenceCreation = async () => {
    try {
      setLoading(true);
      addResult('🛍️ Creando preferencia de pago de prueba...');
      
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'pro',
          successUrl: `${window.location.origin}/dashboard/test-mercadopago?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/test-mercadopago?canceled=true`,
        }),
      });
      
      const data = await response.json();
      
      if (data.initPoint) {
        addResult('✅ Preferencia creada exitosamente');
        addResult(`🔗 URL de pago: ${data.initPoint}`);
        
        // Abrir en nueva ventana
        window.open(data.initPoint, '_blank');
      } else {
        addResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Error creando preferencia: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    try {
      setLoading(true);
      addResult('📡 Probando webhook de MercadoPago...');
      
      const testPayload = {
        type: 'payment',
        data: {
          id: 'test_payment_123',
          status: 'approved',
          transaction_amount: 9990,
          payer: {
            id: 'test_customer_123',
            email: 'test@example.com'
          },
          external_reference: 'subscription_pro_1234567890'
        }
      };
      
      const response = await fetch('/api/mercadopago/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });
      
      if (response.ok) {
        addResult('✅ Webhook procesado correctamente');
      } else {
        addResult(`❌ Error en webhook: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Error probando webhook: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Prueba de MercadoPago</h1>
        <p className="text-gray-600">Prueba la integración de pagos con MercadoPago</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Conexión</h3>
          </div>
          <p className="text-gray-600 mb-4">Prueba la conexión con la API de MercadoPago</p>
          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Probando...' : 'Probar Conexión'}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Preferencia</h3>
          </div>
          <p className="text-gray-600 mb-4">Crea una preferencia de pago de prueba</p>
          <Button 
            onClick={testPreferenceCreation} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? 'Creando...' : 'Crear Preferencia'}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Webhook</h3>
          </div>
          <p className="text-gray-600 mb-4">Prueba el procesamiento de webhooks</p>
          <Button 
            onClick={testWebhook} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? 'Probando...' : 'Probar Webhook'}
          </Button>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Resultados de Pruebas</h2>
          <Button onClick={clearResults} variant="outline" size="sm">
            Limpiar
          </Button>
        </div>
        
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Ejecuta las pruebas para ver los resultados</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-gray-50 p-3 rounded border">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Instrucciones</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>1. Configurar credenciales:</strong> Agrega MERCADOPAGO_ACCESS_TOKEN a .env.local</p>
          <p><strong>2. Probar conexión:</strong> Verifica que la API esté funcionando</p>
          <p><strong>3. Crear preferencia:</strong> Genera un enlace de pago de prueba</p>
          <p><strong>4. Probar webhook:</strong> Simula el procesamiento de pagos</p>
          <p><strong>5. Tarjetas de prueba:</strong> Usa las que te dio MercadoPago</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-semibold text-green-800 mb-2">💳 Tarjetas de Prueba</h3>
        <div className="text-sm text-green-700 space-y-2">
          <p><strong>Tarjetas que te dio MercadoPago:</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-white p-3 rounded border">
              <p className="font-semibold">Visa</p>
              <p className="font-mono text-xs">4509 9535 6623 3704</p>
              <p className="text-xs text-gray-600">Cualquier fecha futura, cualquier CVC</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="font-semibold">Mastercard</p>
              <p className="font-mono text-xs">5031 4332 1540 6351</p>
              <p className="text-xs text-gray-600">Cualquier fecha futura, cualquier CVC</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="font-semibold">American Express</p>
              <p className="font-mono text-xs">3711 8030 3257 522</p>
              <p className="text-xs text-gray-600">Cualquier fecha futura, cualquier CVC</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="font-semibold">Casos Específicos</p>
              <p className="font-mono text-xs">4000 0000 0000 0002 (Rechazada)</p>
              <p className="font-mono text-xs">4000 0000 0000 0127 (Pendiente)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 