'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoUploader } from '@/components/setup/LogoUploader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowRight, ArrowLeft, Building2 } from 'lucide-react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';

const BUSINESS_CATEGORIES = [
  'Belleza y Estética',
  'Salud y Bienestar',
  'Fitness y Deporte',
  'Consultoría',
  'Educación',
  'Terapias',
  'Otro'
];

interface FormData {
  businessName: string;
  whatsapp: string;
  website: string;
  instagram: string;
  businessCategory: string;
  branchCount: number;
  staffCount: number;
  address: string;
  description: string;
}

export default function BusinessInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    whatsapp: '',
    website: '',
    instagram: '',
    businessCategory: '',
    branchCount: 1,
    staffCount: 1,
    address: '',
    description: ''
  });

  const supabase = useSupabaseClient();

  // Verificar sesión y cargar datos
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
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profError || !professional) {
          router.push('/setup/business-slug');
          return;
        }

        // Verificar que tiene business_slug
        if (!professional.business_slug) {
          router.push('/setup/business-slug');
          return;
        }

        setProfessionalId(professional.id);

        // Prellenar formulario si hay datos
        setFormData({
          businessName: professional.business_name || '',
          whatsapp: professional.whatsapp || '',
          website: professional.website || '',
          instagram: professional.instagram || '',
          businessCategory: professional.business_category || '',
          branchCount: professional.branch_count || 1,
          staffCount: professional.staff_count || 1,
          address: professional.address || '',
          description: professional.description || ''
        });

        setLogoUrl(professional.logo_url || null);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar datos');
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Manejar cambios en el formulario
  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejar upload de logo
  const handleLogoUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch('/api/upload/logo', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir logo');
    }

    const data = await response.json();
    setLogoUrl(data.url);
    return data.url;
  };

  // Validar formulario
  const isFormValid = () => {
    return (
      formData.businessName.trim().length >= 3 &&
      formData.businessCategory &&
      formData.branchCount >= 1 &&
      formData.staffCount >= 1
    );
  };

  // Guardar y continuar
  const handleContinue = async () => {
    if (!isFormValid() || !professionalId) return;

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          business_name: formData.businessName,
          whatsapp: formData.whatsapp || null,
          website: formData.website || null,
          instagram: formData.instagram || null,
          business_category: formData.businessCategory,
          branch_count: formData.branchCount,
          staff_count: formData.staffCount,
          address: formData.address || null,
          description: formData.description || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', professionalId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Redirigir a siguiente paso
      router.push('/setup/tutorial');
    } catch (err: any) {
      console.error('Error saving business info:', err);
      setError(err.message || 'Error al guardar información');
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/setup/business-slug');
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B35] rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Información de tu negocio
          </h1>
          <p className="text-gray-600 text-lg">
            Completa los datos para personalizar tu agenda
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-[#FF6B35] rounded-full" />
          <div className="h-2 w-12 bg-gray-300 rounded-full" />
          <div className="h-2 w-12 bg-gray-300 rounded-full" />
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de tu negocio
            </label>
            <LogoUploader
              onUpload={handleLogoUpload}
              currentLogo={logoUrl || undefined}
            />
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del negocio *
              </label>
              <Input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Ej: Peluquería María"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rubro / Categoría *
              </label>
              <select
                value={formData.businessCategory}
                onChange={(e) => handleChange('businessCategory', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                required
              >
                <option value="">Selecciona una categoría</option>
                {BUSINESS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <Input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+56912345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio web
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <Input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="@tunegocio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuántas sucursales tienes? *
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.branchCount.toString()}
                onChange={(e) => handleChange('branchCount', parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuánto personal necesita agenda? *
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.staffCount.toString()}
                onChange={(e) => handleChange('staffCount', parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección física
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Calle Principal 123, Santiago"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del negocio
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe brevemente tu negocio..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
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
              disabled={!isFormValid() || isSaving}
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

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Paso 2 de 4 - Configuración inicial</p>
        </div>
      </div>
    </div>
  );
}



