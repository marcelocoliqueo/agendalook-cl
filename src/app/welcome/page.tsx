'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Sparkles, Calendar, Users, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase';
import { useProfessional } from '@/hooks/useProfessional';

export default function WelcomePage() {
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { getProfessionalByUserId, createProfessional } = useProfessional();
  const supabase = createClient();

  const slugify = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  useEffect(() => {
    // Establecer sesión si venimos de magic link (#access_token) o ?code (PKCE)
    (async () => {
      try {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        // Hash tokens
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
      }
    })();

    const checkUser = async () => {
      // Esperar a que se resuelva la sesión para evitar redirección temprana
      if (authLoading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        let prof = await getProfessionalByUserId(user.id);
        if (!prof) {
          const businessName = (user as any)?.user_metadata?.business_name || user.email?.split('@')[0] || 'Mi negocio';
          const business_slug = slugify(businessName);
          prof = await createProfessional({
            user_id: user.id,
            business_name: businessName,
            business_slug,
            phone: '',
            email: user.email || '',
            description: '',
            address: '',
            plan: 'free',
            role: 'owner',
            subscription_status: 'none',
          } as any);
          // Marcar onboarding completado en metadata
          try {
            const supabase = (await import('@/lib/supabase')).createClient();
            await supabase.auth.updateUser({ data: { ...(user as any)?.user_metadata, onboarded: true } });
          } catch {}
        }
        setProfessional(prof);
      } catch (error) {
        console.error('Error fetching professional:', error);
        router.push('/dashboard');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user, authLoading, router, getProfessionalByUserId]);

  const handleContinue = () => {
    router.push('/plans');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Agendalook"
              width={160}
              height={45}
              className="w-40 h-11 object-contain"
            />
          </Link>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
              <h1 className="text-4xl font-playfair font-bold text-gray-800">
                ¡Bienvenido a Agendalook!
              </h1>
            </div>
            
            <p className="text-xl text-gray-700 mb-8">
              Tu cuenta ha sido confirmada exitosamente. Ahora vamos a configurar tu negocio para que puedas comenzar a gestionar tus citas de manera profesional.
            </p>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Hola, {professional?.business_name || (user as any)?.user_metadata?.business_name || 'Profesional'}!
              </h2>
              
              <p className="text-gray-600 text-lg">
                Estás a solo unos pasos de tener tu agenda profesional funcionando
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Gestión de Citas</h3>
                <p className="text-gray-600 text-sm">
                  Organiza tu agenda de manera profesional y eficiente
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Clientes</h3>
                <p className="text-gray-600 text-sm">
                  Gestiona tu base de datos de clientes y su historial
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Automatización</h3>
                <p className="text-gray-600 text-sm">
                  Confirmaciones automáticas y recordatorios inteligentes
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary-50 to-coral-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                ¿Qué sigue?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Elegir tu plan</h4>
                    <p className="text-gray-600 text-sm">Selecciona el plan que mejor se adapte a tus necesidades</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-coral-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Configurar tu negocio</h4>
                    <p className="text-gray-600 text-sm">Personaliza servicios, horarios y preferencias</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">¡Comenzar!</h4>
                    <p className="text-gray-600 text-sm">Recibe tu primera cita y gestiona tu agenda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-primary-500 to-coral-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
            >
              Elegir mi plan
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <p className="text-gray-500 text-sm mt-4">
              Puedes cambiar tu plan en cualquier momento desde tu dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 