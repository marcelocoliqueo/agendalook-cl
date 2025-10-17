'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckCircle2, Calendar, Rocket, Sparkles } from 'lucide-react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';

const PLAN_DETAILS = {
  look: {
    name: 'Look',
    color: 'blue',
    features: ['Agenda ilimitada', 'Gestión de reservas', 'Recordatorios automáticos']
  },
  pro: {
    name: 'Pro',
    color: 'purple',
    features: ['Todo de Look', 'Multi-sucursal', 'Reportes avanzados', 'WhatsApp integrado']
  },
  studio: {
    name: 'Studio',
    color: 'orange',
    features: ['Todo de Pro', 'Multi-profesional', 'API personalizada', 'Soporte prioritario']
  }
};

export default function TrialStartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'look' | 'pro' | 'studio'>('look');
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);

  const supabase = useSupabaseClient();

  // Cargar datos del usuario
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/login');
          return;
        }

        // Obtener professional
        const { data: professional, error: profError } = await supabase
          .from('professionals')
          .select('id, business_slug, selected_plan, plan, trial_start_date')
          .eq('user_id', user.id)
          .single();

        if (profError || !professional) {
          router.push('/setup/business-slug');
          return;
        }

        // Verificar que completó pasos anteriores
        if (!professional.business_slug) {
          router.push('/setup/business-slug');
          return;
        }

        setProfessionalId(professional.id);
        
        // Determinar plan
        const plan = professional.selected_plan || professional.plan || 'look';
        setSelectedPlan(plan as 'look' | 'pro' | 'studio');

        // Si ya tiene trial iniciado, redirigir al dashboard
        if (professional.trial_start_date) {
          router.push('/dashboard');
          return;
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar datos');
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Iniciar trial
  const handleStartTrial = async () => {
    if (!professionalId) return;

    setIsStarting(true);
    setError(null);

    try {
      // Llamar a API para iniciar trial
      const response = await fetch('/api/trial/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professionalId,
          plan: selectedPlan
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar trial');
      }

      const data = await response.json();
      
      // Guardar fecha de fin del trial
      setTrialEndDate(new Date(data.trial.endDate));

      // Marcar onboarding como completado
      await supabase
        .from('professionals')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', professionalId);

      // Esperar 2 segundos para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Error starting trial:', err);
      setError(err.message || 'Error al iniciar el trial');
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <LoadingSpinner />
      </div>
    );
  }

  const planDetails = PLAN_DETAILS[selectedPlan];
  const calculatedEndDate = new Date();
  calculatedEndDate.setDate(calculatedEndDate.getDate() + 30);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] rounded-full mb-6 shadow-xl">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¡Todo listo para comenzar!
          </h1>
          <p className="text-gray-600 text-lg">
            Tu trial de 30 días está por empezar
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Plan seleccionado */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">
                Plan {planDetails.name}
              </span>
            </div>
          </div>

          {/* Información del trial */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Trial de 30 días gratis
                </h3>
                <p className="text-gray-700 mb-4">
                  Tu trial comenzará ahora y finalizará el{' '}
                  <strong className="text-blue-600">
                    {calculatedEndDate.toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>
                </p>
                <div className="bg-white/60 rounded-lg p-3 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    No se requiere tarjeta de crédito ahora
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Acceso completo a todas las funciones del plan {planDetails.name}
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Puedes cancelar en cualquier momento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Funciones incluidas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ✨ Funciones incluidas en tu trial:
            </h3>
            <div className="grid gap-3">
              {planDetails.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qué pasa después */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h4 className="font-semibold text-amber-900 mb-2">
              🔔 ¿Qué pasa después del trial?
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              Te enviaremos recordatorios durante el trial. Al finalizar los 30 días, 
              podrás elegir un plan de pago para continuar usando Agendalook. 
              Si decides no continuar, no hay problema, no se realizará ningún cargo.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Mensaje de éxito (cuando está iniciando) */}
          {isStarting && trialEndDate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="h-6 w-6 animate-pulse" />
                <div>
                  <p className="font-semibold">¡Trial iniciado exitosamente!</p>
                  <p className="text-sm">Redirigiendo al dashboard...</p>
                </div>
              </div>
            </div>
          )}

          {/* Botón de acción */}
          <div className="pt-4">
            <Button
              onClick={handleStartTrial}
              disabled={isStarting}
              className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] hover:from-[#FF5722] hover:to-[#FF6B35] text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isStarting ? (
                <div className="flex items-center justify-center gap-3">
                  <LoadingSpinner size="sm" />
                  <span>Iniciando tu trial...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Rocket className="h-6 w-6" />
                  <span>Iniciar mi trial de 30 días</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Paso 4 de 4 - ¡Último paso!</p>
        </div>
      </div>
    </div>
  );
}



