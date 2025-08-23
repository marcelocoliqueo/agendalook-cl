'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Star, ArrowRight, Zap, Shield, Users, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { usePlanManagement } from '@/hooks/usePlanManagement';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

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
    color: 'sky',
    gradient: 'from-sky-500 to-emerald-500'
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
    color: 'emerald',
    gradient: 'from-emerald-500 to-sky-500'
  }
];

export default function PlansPage() {
  const { user, loading: authLoading } = useAuth();
  const { selectPlan, isLoading } = usePlanManagement();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    // Exigir verificación de email a nivel de app
    if (!user.email_confirmed_at) {
      router.push('/verify-email');
      return;
    }
  }, [authLoading, user, router]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;
    
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    await selectPlan(plan);
  };

  if (authLoading) {
    return (
      <MarketingLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando...</p>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Elige tu Plan
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Selecciona el plan que mejor se adapte a tus necesidades. Puedes cambiar en cualquier momento.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-lg p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                  selectedPlan === plan.id
                    ? 'ring-4 ring-sky-500 scale-105'
                    : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Más Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString()}`}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-slate-500">por mes</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          {selectedPlan && (
            <div className="text-center">
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isLoading ? (
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
            </div>
          )}

          {/* Features Comparison */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Comparación de Características
            </h2>
            
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Rápido</h3>
                  <p className="text-slate-600 text-sm">Configuración en menos de 5 minutos</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Seguro</h3>
                  <p className="text-slate-600 text-sm">Datos encriptados y respaldados</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Colaborativo</h3>
                  <p className="text-slate-600 text-sm">Gestiona equipos y múltiples usuarios</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Soporte</h3>
                  <p className="text-slate-600 text-sm">Ayuda disponible 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Preguntas Frecuentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">¿Puedo cambiar de plan?</h3>
                <p className="text-slate-600">
                  Sí, puedes cambiar tu plan en cualquier momento desde tu panel de configuración. 
                  Los cambios se aplican inmediatamente.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">¿Hay contratos a largo plazo?</h3>
                <p className="text-slate-600">
                  No, todos nuestros planes son mensuales sin contratos a largo plazo. 
                  Puedes cancelar en cualquier momento.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">¿Qué métodos de pago aceptan?</h3>
                <p className="text-slate-600">
                  Aceptamos tarjetas de crédito/débito, transferencias bancarias y MercadoPago 
                  para clientes en Chile.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">¿Ofrecen reembolsos?</h3>
                <p className="text-slate-600">
                  Sí, ofrecemos reembolsos completos dentro de los primeros 30 días 
                  si no estás satisfecho con nuestro servicio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 