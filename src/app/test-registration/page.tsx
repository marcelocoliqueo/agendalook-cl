'use client';

import { useState } from 'react';
import { ResendService } from '@/lib/resend-service';

export default function TestRegistrationPage() {
  const [formData, setFormData] = useState({
    email: 'marcelo.coliqueo@gmail.com',
    businessName: 'Salón de Belleza Elegante',
    password: 'test123456',
    confirmPassword: 'test123456'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Simular URL de confirmación alineada al nuevo flujo
      const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email`;

      // Enviar email elegante de bienvenida
      await ResendService.sendWelcomeEmail(
        formData.email,
        confirmationUrl,
        formData.businessName
      );

      setResult({
        type: 'success',
        message: `¡Email enviado exitosamente! Se ha enviado un email elegante a ${formData.email} con las instrucciones para confirmar tu cuenta.`
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setResult({
        type: 'error',
        message: `Error al enviar email: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
            🧪 Prueba de Registro
          </h1>
          <p className="text-gray-600">
            Simula el flujo completo de registro con email elegante
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Negocio
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {result && (
              <div className={`border px-4 py-3 rounded-lg ${
                result.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {result.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-coral-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando email...' : 'Simular Registro'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">¿Qué hace esta prueba?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Simula el proceso de registro completo</li>
              <li>✅ Envía el email elegante de bienvenida</li>
              <li>✅ Usa los datos reales del formulario</li>
              <li>✅ Maneja errores y éxitos</li>
              <li>✅ Muestra feedback al usuario</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 