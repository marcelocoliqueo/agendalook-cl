'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Star, ArrowRight, Zap, Shield, Users, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  gradient: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfecto para empezar',
    features: [
      'Hasta 10 reservas por mes',
      'Máximo 3 servicios',
      'Página pública personalizada',
      'Notificaciones por email',
      'Soporte por email'
    ],
    color: 'gray',
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9990,
    description: 'Para profesionales establecidos',
    features: [
      'Reservas ilimitadas',
      'Servicios ilimitados',
      'Analytics avanzados',
      'Personalización de colores',
      'Soporte prioritario',
      'Sin marca de Agendalook'
    ],
    popular: true,
    color: 'primary',
    gradient: 'from-primary-500 to-coral-500'
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 19990,
    description: 'Para estudios y equipos',
    features: [
      'Todo de Pro',
      'Múltiples usuarios',
      'Gestión de equipo',
      'Personalización completa',
      'API personalizada',
      'Soporte dedicado'
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500'
  }
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { getProfessionalByUserId, updateProfessional } = useProfessional();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Exigir verificación de email a nivel de app
    if (!user.email_confirmed_at) {
      router.push('/verify-email');
      return;
    }
  }, [user, router]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      // Actualizar el plan del profesional
      if (user) {
        const prof = await getProfessionalByUserId(user.id);
        if (prof) {
          await updateProfessional(prof.id, { plan: selectedPlan });
        }
      }

      // Redirigir según el plan
      if (selectedPlan === 'free') {
        router.push('/onboarding');
      } else {
        // Para planes pagos (pro, studio), redirigir a checkout
        router.push(`/checkout?plan=${selectedPlan}`);
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

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
          
          <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
            Elige tu plan
          </h1>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a las necesidades de tu negocio. 
            Puedes cambiar tu plan en cualquier momento.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 ${
                  selectedPlan === plan.id 
                    ? 'ring-4 ring-primary-500 scale-105' 
                    : 'hover:shadow-2xl hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-coral-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Más Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-gray-800">
                      {formatPrice(plan.price)}
                    </p>
                    {plan.price > 0 && (
                      <p className="text-gray-500 text-sm">por mes</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-primary-500 to-coral-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedPlan || loading}
              className="bg-gradient-to-r from-primary-500 to-coral-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
            
            <p className="text-gray-500 text-sm mt-4">
              {selectedPlan === 'free' 
                ? 'Comenzarás con la configuración básica'
                : selectedPlan === 'pro'
                ? 'Serás redirigido al proceso de pago seguro'
                : 'Serás redirigido al proceso de pago seguro'
              }
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Preguntas Frecuentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">¿Puedo cambiar de plan?</h3>
              <p className="text-gray-600">
                Sí, puedes cambiar tu plan en cualquier momento desde tu dashboard sin penalizaciones.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">¿Hay período de prueba?</h3>
              <p className="text-gray-600">
                El plan Free es completamente gratuito. Los planes pagos incluyen 7 días de prueba gratuita.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">¿Qué métodos de pago aceptan?</h3>
              <p className="text-gray-600">
                Aceptamos tarjetas de crédito/débito, transferencias bancarias y MercadoPago.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">¿Ofrecen soporte técnico?</h3>
              <p className="text-gray-600">
                Sí, todos los planes incluyen soporte. Pro y Premium incluyen soporte prioritario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 