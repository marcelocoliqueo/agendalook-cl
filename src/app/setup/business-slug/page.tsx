'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessSlugInput } from '@/components/setup/BusinessSlugInput';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowRight, ArrowLeft, Link2 } from 'lucide-react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';

export default function BusinessSlugPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  const supabase = useSupabaseClient();

  // Verificar sesión y obtener datos del usuario
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/login');
          return;
        }

        // Obtener professional del usuario
        const { data: professional, error: profError } = await supabase
          .from('professionals')
          .select('id, business_slug, onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profError) {
          console.error('Error loading professional:', profError);
          setError('Error al cargar datos del usuario');
          setIsLoading(false);
          return;
        }

        // Si no tiene professional, crear uno básico
        if (!professional) {
          const { data: newProfessional, error: createError } = await supabase
            .from('professionals')
            .insert({
              user_id: user.id,
              business_name: 'Mi Negocio',
              business_slug: '', // Se llenará en este paso
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating professional:', createError);
            setError('Error al crear perfil profesional');
            setIsLoading(false);
            return;
          }

          setProfessionalId(newProfessional.id);
        } else {
          setProfessionalId(professional.id);

          // Si ya tiene slug definido y completó onboarding, redirigir
          if (professional.business_slug && professional.onboarding_completed) {
            router.push('/dashboard');
            return;
          }

          // Si ya tiene slug pero no completó onboarding, prellenar
          if (professional.business_slug) {
            setSlug(professional.business_slug);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error in checkSession:', err);
        setError('Error al verificar sesión');
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  // Manejar continuar
  const handleContinue = async () => {
    if (!isValid || !slug || !professionalId) return;

    setIsSaving(true);
    setError(null);

    try {
      // Actualizar business_slug
      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          business_slug: slug,
          updated_at: new Date().toISOString()
        })
        .eq('id', professionalId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Redirigir a siguiente paso
      router.push('/setup/business-info');
    } catch (err: any) {
      console.error('Error saving slug:', err);
      setError(err.message || 'Error al guardar el link de tu agenda');
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/select-plan');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B35] rounded-full mb-4">
            <Link2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Crea el link de tu agenda
          </h1>
          <p className="text-gray-600 text-lg">
            Este será el enlace que compartirás con tus clientes
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-gray-300 rounded-full" />
          <div className="h-2 w-12 bg-gray-300 rounded-full" />
          <div className="h-2 w-12 bg-gray-300 rounded-full" />
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Input de slug */}
          <BusinessSlugInput
            value={slug}
            onChange={setSlug}
            onValidate={setIsValid}
          />

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Ejemplos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">
              💡 Ejemplos de buenos links:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'maria-peluqueria',
                'spa-relax',
                'dr-gonzalez',
                'studio-fitness',
                'salon-belleza'
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setSlug(example)}
                  className="px-3 py-1.5 text-sm bg-white border border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-100 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isValid || isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF5722] text-white"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  Guardando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Paso 1 de 4 - Configuración inicial</p>
        </div>
      </div>
    </div>
  );
}



