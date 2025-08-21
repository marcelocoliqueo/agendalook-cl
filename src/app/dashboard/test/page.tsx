'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { downloadPDF } from '@/lib/pdf-generator';
import { CacheManager } from '@/lib/cache-manager';
import { ResourceMonitor } from '@/lib/resource-monitor';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPDF = () => {
    try {
      const testData = {
        businessName: 'Test Business',
        period: 'Este Mes',
        startDate: new Date(),
        endDate: new Date(),
        bookings: [
          {
            id: '1',
            customer_name: 'Juan Pérez',
            customer_phone: '+56912345678',
            service_name: 'Corte de Pelo',
            booking_date: '2024-01-15',
            booking_time: '14:00',
            status: 'confirmed',
            price: 15000
          }
        ],
        totalRevenue: 15000,
        totalBookings: 1,
        confirmedBookings: 1,
        pendingBookings: 0,
        cancelledBookings: 0
      };

      downloadPDF(testData, 'test-report.pdf');
      addResult('✅ PDF generado correctamente');
    } catch (error) {
      addResult(`❌ Error en PDF: ${error}`);
    }
  };

  const testCache = () => {
    try {
      // Probar cache
      CacheManager.set('test', { data: 'test' });
      const cached = CacheManager.get('test');
      if (cached) {
        addResult('✅ Cache funcionando correctamente');
      } else {
        addResult('❌ Cache no funciona');
      }
    } catch (error) {
      addResult(`❌ Error en cache: ${error}`);
    }
  };

  const testResourceMonitor = async () => {
    try {
      const usage = await ResourceMonitor.getResourceUsage();
      addResult(`✅ Resource Monitor: Storage ${usage.storage.percentage.toFixed(1)}%`);
    } catch (error) {
      addResult(`❌ Error en Resource Monitor: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Página de Pruebas</h1>
        <p className="text-gray-600">Prueba las funcionalidades del dashboard</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pruebas Disponibles</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={testPDF}>
            Probar PDF
          </Button>
          <Button onClick={testCache} variant="outline">
            Probar Cache
          </Button>
          <Button onClick={testResourceMonitor} variant="outline">
            Probar Resource Monitor
          </Button>
          <Button onClick={clearResults} variant="outline">
            Limpiar Resultados
          </Button>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resultados de Pruebas</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 