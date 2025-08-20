'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('marcelo.coliqueo@gmail.com');
  const [type, setType] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, error: data.error || 'Error desconocido' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Error de red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
            🧪 Test de Emails Elegantes
          </h1>
          <p className="text-gray-600">
            Prueba los emails de Agendalook con Resend
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>⚠️ Importante:</strong> Resend solo permite enviar emails de prueba a tu propia dirección de email. 
              Para enviar a otros destinatarios, necesitas verificar un dominio en Resend.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email de prueba
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="tu@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Usa tu email verificado en Resend: marcelo.coliqueo@gmail.com
              </p>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de email
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              >
                <option value="welcome">Email de Bienvenida</option>
                <option value="booking">Confirmación de Reserva</option>
                <option value="notification">Notificación al Profesional</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-coral-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Email de Prueba'}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="font-medium">
                {result.success ? '✅ Éxito' : '❌ Error'}
              </p>
              <p className="text-sm mt-1">
                {result.message || result.error}
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <a 
              href="/register" 
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Volver al registro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 