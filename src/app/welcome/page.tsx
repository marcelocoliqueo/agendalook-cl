'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Sparkles, Calendar, Users, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseClient } from '@/contexts/SupabaseContext';
import { useProfessional } from '@/hooks/useProfessional';

export default function WelcomePage() {
  const [loading, setLoading] = useState(true);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getProfessionalByUserId, createProfessional } = useProfessional();
  const supabase = useSupabaseClient();

  const slugify = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // 1) En el primer montaje, intenta establecer sesión desde la URL
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        // Hash tokens (magic link)
        if (url.hash && url.hash.includes('access_token')) {
          const params = new URLSearchParams(url.hash.replace(/^#/, ''));
          const access_token = params.get('access_token') || '';
          const refresh_token = params.get('refresh_token') || '';
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
            history.replaceState({}, '', url.pathname + url.search);
          }
        }
        // PKCE code
        const code = url.searchParams.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          url.searchParams.delete('code');
          url.searchParams.delete('type');
          history.replaceState({}, '', url.toString());
        }
      } catch (e) {
        console.warn('No se pudo establecer sesión desde la URL:', e);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [supabase]);

  // 2) Cuando termine el bootstrapping y la sesión esté resuelta, continuar
  useEffect(() => {
    const proceed = async () => {
      if (bootstrapping || authLoading) return;
      
      // Verificar si viene de verificación exitosa
      const url = new URL(window.location.href);
      const verified = url.searchParams.get('verified');
      const email = url.searchParams.get('email');
      
      if (!user && !verified) {
        router.push('/login');
        return;
      }
      
      // Si viene de verificación pero no hay usuario, intentar establecer sesión
      if (!user && verified) {
        console.log('Verificación exitosa detectada, esperando sesión...');
        
        // Si tenemos el email, intentar hacer login automático
        if (email) {
          console.log('Intentando login automático con email:', email);
          // Aquí podríamos intentar hacer un login automático si tenemos las credenciales
          // Por ahora, redirigir al login con mensaje de verificación
          setTimeout(() => {
            if (!user) {
              router.push(`/login?message=verification-complete&email=${encodeURIComponent(email)}`);
            }
          }, 3000);
        } else {
          setTimeout(() => {
            if (!user) {
              router.push('/login?message=verification-complete');
            }
          }, 2000);
        }
        return;
      }
      
      try {
        if (!user) {
          console.error('No hay usuario disponible');
          router.push('/login');
          return;
        }
        
        // Verificar si ya tiene perfil profesional
        let prof = await getProfessionalByUserId(user.id);
        
        // Si ya tiene perfil Y completó onboarding, redirigir al dashboard
        if (prof && 'onboarding_completed' in prof && prof.onboarding_completed) {
          router.push('/dashboard');
          return;
        }
        
        // Si tiene perfil pero no completó onboarding, verificar en qué paso está
        if (prof) {
          if (!prof.business_slug) {
            router.push('/setup/business-slug');
            return;
          }
          if (!('trial_start_date' in prof) || !prof.trial_start_date) {
            router.push('/setup/business-info');
            return;
          }
        }
        
        // Si no tiene perfil, guardar datos mínimos para continuar el flujo
        setProfessional(prof || { email: user.email });
      } catch (error) {
        console.error('Error fetching professional:', error);
      } finally {
        setLoading(false);
      }
    };
    proceed();
  }, [bootstrapping, authLoading, user, router, getProfessionalByUserId, supabase]);

  const handleContinue = () => {
    router.push('/select-plan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Configurando tu cuenta...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                ¡Bienvenido a Agendalook!
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Tu cuenta ha sido creada exitosamente. Ahora es momento de configurar tu negocio y elegir el plan perfecto.
              </p>
            </div>

            {/* User Info */}
            {professional && professional.email && (
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-sky-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      {professional.email}
                    </h2>
                    <p className="text-slate-600">
                      ¡Cuenta verificada exitosamente!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                ¿Qué quieres hacer ahora?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={handleContinue}
                  className="group p-6 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl text-white text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Elegir Plan</h3>
                      <p className="text-sky-100">Desbloquear funcionalidades avanzadas</p>
                    </div>
                  </div>
                  <p className="text-sky-100 text-sm">
                    Compara nuestros planes y elige el que mejor se adapte a tu negocio
                  </p>
                  <div className="flex items-center mt-4 text-sky-100 group-hover:text-white transition-colors">
                    <span className="font-medium">Continuar</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <div className="group p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl text-slate-500 text-left border-2 border-dashed border-slate-300">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-600">Paso siguiente</h3>
                      <p className="text-slate-500">Después de elegir tu plan</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">
                    Completarás la configuración de tu negocio paso a paso
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                💡 Consejos para empezar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-sky-600 font-bold">1</span>
                  </div>
                  <p className="text-slate-600">Elige el plan que mejor se adapte a tus necesidades</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-emerald-600 font-bold">2</span>
                  </div>
                  <p className="text-slate-600">Configura tus servicios y horarios disponibles</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <p className="text-slate-600">Comparte tu enlace público con clientes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 