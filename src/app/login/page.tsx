'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { RegisterButton } from '@/components/ui/AuthButtons';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Usar directamente supabase.auth.signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Si el error es de email no confirmado, redirigir a verify-code
        const msg = error.message || '';
        if (/email\s*not\s*confirmed/i.test(msg)) {
          try { localStorage.setItem('pendingEmail', email); } catch {}
          router.push(`/verify-code?email=${encodeURIComponent(email)}`);
          return;
        }
        setError(msg || 'Error al iniciar sesión');
        return;
      }

      if (data?.user) {
        // Login exitoso, redirigir al dashboard
        console.log('Login exitoso, redirigiendo a dashboard...');
        console.log('Usuario autenticado:', data.user);
        console.log('Intentando redirección a /dashboard...');
        
        try {
          // Intentar redirección con router.push
          await router.push('/dashboard');
          console.log('Redirección con router.push completada');
        } catch (error) {
          console.error('Error con router.push:', error);
          // Fallback: redirección manual
          console.log('Usando fallback de redirección manual...');
          window.location.href = '/dashboard';
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketingLayout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-28 h-8 sm:w-32 sm:h-9 flex items-center justify-center">
                <Image
                  src="/logo-main.png"
                  alt="Agendalook"
                  width={128}
                  height={36}
                  className="w-28 h-8 sm:w-32 sm:h-9 object-contain"
                />
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              ¡Hola de nuevo!
            </h1>
            <p className="text-sm sm:text-base text-slate-700">
              Inicia sesión en tu cuenta para continuar
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-slate-700">Recordarme</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 focus-ring"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 mb-4">
                ¿No tienes una cuenta?
              </p>
              <RegisterButton className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 