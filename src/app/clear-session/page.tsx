'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearSessionPage() {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const clearSession = async () => {
    setIsClearing(true);
    setMessage('Limpiando sesión...');

    try {
      // Llamar al endpoint de limpieza
      const response = await fetch('/api/auth/clear-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Sesión limpiada correctamente. Redirigiendo...');
        
        // Limpiar localStorage también
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirigir a la página principal
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage('❌ Error limpiando sesión: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Error de conexión: ' + (error as Error).message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Limpiar Sesión
          </h1>
          <p className="text-gray-600">
            Esto limpiará todas las cookies y datos de sesión del navegador.
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={clearSession}
            disabled={isClearing}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {isClearing ? 'Limpiando...' : 'Limpiar Sesión'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Si sigues teniendo problemas, también puedes:</p>
          <ul className="mt-2 space-y-1">
            <li>• Limpiar cookies manualmente en el navegador</li>
            <li>• Usar modo incógnito</li>
            <li>• Reiniciar el navegador</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
