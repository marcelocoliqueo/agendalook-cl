'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { User, Building, Mail, Phone, MapPin, FileText, ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';

interface OnboardingData {
  name: string;
  businessName: string;
  phone: string;
  address: string;
  description: string;
}

const onboardingSteps = [
  { id: 'personal', title: 'Información Personal', icon: User },
  { id: 'business', title: 'Información del Negocio', icon: Building },
  { id: 'contact', title: 'Información de Contacto', icon: Phone },
  { id: 'description', title: 'Descripción del Negocio', icon: FileText },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    businessName: '',
    phone: '',
    address: '',
    description: '',
  });
  
  const router = useRouter();
  const { user } = useAuth();
  const { getProfessionalByUserId, updateProfessional } = useProfessional();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Cargar datos existentes del usuario
    const loadUserData = async () => {
      try {
        const professional = await getProfessionalByUserId(user!.id);
        if (professional) {
          setOnboardingData({
            name: user.user_metadata?.name || '',
            businessName: professional.business_name || '',
            phone: professional.phone || '',
            address: professional.address || '',
            description: professional.description || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user, getProfessionalByUserId, router]);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Actualizar datos del usuario en Supabase
      const professional = await getProfessionalByUserId(user!.id);
      if (professional) {
        await updateProfessional(professional.id, {
          business_name: onboardingData.businessName,
          phone: onboardingData.phone,
          address: onboardingData.address,
          description: onboardingData.description,
        });
      }

      // Redirigir a selección de plan
      router.push('/select-plan');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal
        return onboardingData.name.trim() !== '';
      case 1: // Business
        return onboardingData.businessName.trim() !== '';
      case 2: // Contact
        return onboardingData.phone.trim() !== '';
      case 3: // Description
        return true; // Opcional
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Tu nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={onboardingData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Ej: María González"
                  autoComplete="name"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Business
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de tu negocio
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="businessName"
                  type="text"
                  value={onboardingData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Ej: Nails by Carla"
                  autoComplete="organization"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Contact
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Teléfono de contacto
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="phone"
                  type="tel"
                  value={onboardingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                Dirección (opcional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="address"
                  type="text"
                  value={onboardingData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Ej: Av. Providencia 123, Santiago"
                  autoComplete="address"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Description
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Descripción de tu negocio (opcional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <textarea
                  id="description"
                  value={onboardingData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Cuéntanos sobre tu negocio, servicios que ofreces, etc."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-32 h-9 flex items-center justify-center mx-auto mb-6">
            <Image
              src="/logo-main.png"
              alt="Agendalook"
              width={128}
              height={36}
              className="w-32 h-9 object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            ¡Completa tu perfil!
          </h1>
          <p className="text-slate-600">
            Solo necesitamos algunos datos más para personalizar tu experiencia
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-sky-600' : isCompleted ? 'text-green-600' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {onboardingSteps[currentStep].title}
            </h2>
            <p className="text-slate-600">
              {currentStep === 0 && 'Cuéntanos cómo te llamas'}
              {currentStep === 1 && '¿Cómo se llama tu negocio?'}
              {currentStep === 2 && '¿Cómo pueden contactarte tus clientes?'}
              {currentStep === 3 && 'Describe brevemente tu negocio'}
            </p>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              currentStep === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Anterior
          </button>

          {currentStep < onboardingSteps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                isStepValid()
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading || !isStepValid()}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                loading || !isStepValid()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Completando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Finalizar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}