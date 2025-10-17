'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoomVideoPlayer } from '@/components/ui/LoomVideoPlayer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowRight, ArrowLeft, PlayCircle, SkipForward } from 'lucide-react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';

// IDs de videos de Loom para cada plan (REEMPLAZAR con tus IDs reales)
const VIDEO_IDS = {
  look: 'TU_VIDEO_ID_LOOK', // Reemplazar con ID real de Loom
  pro: 'TU_VIDEO_ID_PRO',   // Reemplazar con ID real de Loom
  studio: 'TU_VIDEO_ID_STUDIO' // Reemplazar con ID real de Loom
};

const PLAN_NAMES = {
  look: 'Look',
  pro: 'Pro',
  studio: 'Studio'
};

export default function TutorialPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'look' | 'pro' | 'studio'>('look');
  const [hasWatched, setHasWatched] = useState(false);
  const [canSkip, setCanSkip] = useState(true);

  const supabase = useSupabaseClient();

  // Cargar datos del usuario y plan seleccionado
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
          .select('id, business_slug, selected_plan, plan, tutorial_watched')
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
        
        // Determinar plan (priorizar selected_plan, luego plan)
        const plan = professional.selected_plan || professional.plan || 'look';
        setSelectedPlan(plan as 'look' | 'pro' | 'studio');
        
        // Si ya vio el tutorial, marcar como visto
        if (professional.tutorial_watched) {
          setHasWatched(true);
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

  // Manejar video completado
  const handleVideoComplete = () => {
    setHasWatched(true);
  };

  // Marcar como visto y continuar
  const handleContinue = async () => {
    if (!professionalId) return;

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          tutorial_watched: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', professionalId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Redirigir a siguiente paso
      router.push('/setup/trial-start');
    } catch (err: any) {
      console.error('Error saving tutorial status:', err);
      setError(err.message || 'Error al guardar progreso');
      setIsSaving(false);
    }
  };

  // Saltar tutorial
  const handleSkip = async () => {
    if (!professionalId) return;

    setIsSaving(true);

    try {
      await supabase
        .from('professionals')
        .update({
          tutorial_watched: false, // Marcado como no visto
          updated_at: new Date().toISOString()
        })
        .eq('id', professionalId);

      // Continuar sin esperar respuesta
      router.push('/setup/trial-start');
    } catch (err) {
      console.error('Error skipping tutorial:', err);
      // Continuar de todas formas
      router.push('/setup/trial-start');
    }
  };

  const handleBack = () => {
    router.push('/setup/business-info');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <LoadingSpinner />
      </div>
    );
  }

  const videoId = VIDEO_IDS[selectedPlan];
  const planName = PLAN_NAMES[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B35] rounded-full mb-4">
            <PlayCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tutorial de Agendalook
          </h1>
          <p className="text-gray-600 text-lg">
            Aprende a configurar y usar tu agenda - Plan {planName}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-gray-300 rounded-full" />
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Video player */}
          <LoomVideoPlayer
            videoId={videoId}
            title={`Cómo usar Agendalook - Plan ${planName}`}
            onComplete={handleVideoComplete}
          />

          {/* Información adicional */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📚 Contenido del tutorial
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B35] mt-1">✓</span>
                <span>Cómo configurar tu perfil profesional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B35] mt-1">✓</span>
                <span>Agregar servicios y definir horarios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B35] mt-1">✓</span>
                <span>Gestionar reservas de clientes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B35] mt-1">✓</span>
                <span>Personalizar tu página de reservas</span>
              </li>
              {selectedPlan !== 'look' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B35] mt-1">✓</span>
                    <span>Funciones avanzadas de tu plan {planName}</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Recordatorio */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              💡 <strong>Recordatorio:</strong> Puedes volver a ver este tutorial en cualquier momento
              desde el menú de Ayuda en tu dashboard.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>

            <div className="flex-1 flex gap-4">
              {canSkip && (
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled={isSaving}
                >
                  <SkipForward className="h-4 w-4" />
                  Ver después
                </Button>
              )}

              <Button
                onClick={handleContinue}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF5722] text-white"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Guardando...
                  </>
                ) : (
                  <>
                    {hasWatched ? 'Continuar' : 'Saltar y continuar'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Paso 3 de 4 - Configuración inicial</p>
        </div>
      </div>
    </div>
  );
}



