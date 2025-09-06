'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight, ArrowLeft, Settings, Calendar, Users, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'business-info',
      title: 'Información del Negocio',
      description: 'Completa los datos básicos de tu negocio',
      icon: Settings,
      completed: false
    },
    {
      id: 'services',
      title: 'Configurar Servicios',
      description: 'Agrega los servicios que ofreces',
      icon: Calendar,
      completed: false
    },
    {
      id: 'availability',
      title: 'Horarios de Trabajo',
      description: 'Define cuándo estás disponible',
      icon: Users,
      completed: false
    },
    {
      id: 'finish',
      title: '¡Listo para Comenzar!',
      description: 'Tu negocio está configurado',
      icon: Zap,
      completed: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { getProfessionalByUserId } = useProfessional();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Marcar paso actual como completado
      const updatedSteps = [...steps];
      updatedSteps[currentStep].completed = true;
      setSteps(updatedSteps);
      
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar onboarding
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Marcar onboarding como completado
      if (user) {
        const prof = await getProfessionalByUserId(user.id);
        if (prof) {
          // Aquí podrías actualizar el estado de onboarding en la base de datos
          console.log('Onboarding completado');
        }
      }
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Información del Negocio
            </h3>
            <p className="text-gray-600 mb-8">
              Vamos a completar los datos básicos de tu negocio para que tus clientes puedan encontrarte.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del negocio
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe tu negocio, especialidades, experiencia..."
                  />
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de contacto
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Av. Providencia 123, Santiago"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Configurar Servicios
            </h3>
            <p className="text-gray-600 mb-8">
              Agrega los servicios que ofreces con sus precios y duración.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del servicio
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Corte de cabello"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio (CLP)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="15000"
                    />
                  </div>
                </div>
                
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  + Agregar otro servicio
                </button>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Horarios de Trabajo
            </h3>
            <p className="text-gray-600 mb-8">
              Define cuándo estás disponible para recibir citas.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de trabajo
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                      <button
                        key={day}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition-colors"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de inicio
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      defaultValue="09:00"
                    />
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de fin
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      defaultValue="18:00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Listo para Comenzar!
            </h3>
            <p className="text-gray-600 mb-8">
              Tu negocio está configurado y listo para recibir citas. Puedes personalizar más opciones desde tu dashboard.
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg mb-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Información del negocio completada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Servicios configurados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Horarios definidos</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Image
              src="/logo-main.png"
              alt="Agendalook"
              width={160}
              height={45}
              className="w-40 h-11 object-contain"
            />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Paso {currentStep + 1} de {steps.length}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].title}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {getStepContent()}
          
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>
            
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Saltar por ahora
            </button>
            
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-gradient-to-r from-primary-500 to-coral-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  ¡Comenzar!
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 