"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      setError('Error al enviar el email de recuperación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <div className="w-32 h-9 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Agendalook"
                  width={128}
                  height={36}
                  className="w-32 h-9 object-contain"
                />
              </div>
            </Link>
            <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
              Email enviado
            </h1>
            <p className="text-gray-600">
              Revisa tu bandeja de entrada
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ¡Email de recuperación enviado!
              </h2>
              <p className="text-gray-600 mb-6">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full bg-gradient-to-r from-lavender-500 to-coral-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 inline-block text-center"
                >
                  Volver al login
                </Link>
                <p className="text-sm text-gray-500">
                  ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-lavender-600 hover:text-lavender-700 font-semibold"
                  >
                    intenta de nuevo
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-32 h-9 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Agendalook"
                width={128}
                height={36}
                className="w-32 h-9 object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
            Recuperar contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu email para recibir instrucciones
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-lavender-500 to-coral-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar email de recuperación'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 