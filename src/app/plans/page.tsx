'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePlanManagement } from '@/hooks/usePlanManagement';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { 
  Check, 
  Zap, 
  Star, 
  Crown, 
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react';

// Planes disponibles con información completa
const plans = [
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
      'Soporte por email',
      'Dashboard básico'
    ],
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: Zap,
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9990,
    description: 'Para profesionales establecidos',
    features: [
      'Reservas ilimitadas',
      'Servicios ilimitados',
      'Historial de clientes',
      'Estadísticas básicas',
      'Soporte prioritario',
      'Sin marca de Agendalook',
      'Filtros avanzados',
      'Recordatorios por WhatsApp'
    ],
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    icon: Star,
    popular: true
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 19990,
    description: 'Para estudios y equipos',
    features: [
      'Todo de Pro',
      'Reportes detallados',
      'Exportación de datos',
      'Personalización avanzada',
      'Soporte dedicado',
      'Funciones premium',
      'Múltiples usuarios',
      'API de integración'
    ],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: Crown,
    popular: false
  }
];

export default function PlansPage() {
  const { user, loading: authLoading } = useAuth();
  const { selectPlan, isLoading } = usePlanManagement();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando...</p>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              Elige tu plan perfecto
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Comienza gratis y escala según crezca tu negocio. Sin contratos largos, sin sorpresas.
            </p>
            
            {/* Indicadores de confianza */}
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Activación inmediata</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Planes */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isSelected 
                      ? `${plan.borderColor} shadow-2xl scale-105` 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Badge popular */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        ⭐ Más Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header del plan */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`w-8 h-8 ${plan.color}`} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {plan.name}
                      </h3>
                      
                      <p className="text-slate-600 mb-4">
                        {plan.description}
                      </p>

                      <div className="mb-6">
                        <div className="text-4xl font-bold text-slate-800">
                          {plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString()}`}
                        </div>
                        {plan.price > 0 && (
                          <p className="text-slate-500">por mes</p>
                        )}
                      </div>
                    </div>

                    {/* Características */}
                    <div className="mb-8">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span className="text-slate-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botón de selección */}
                    <button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Plan Seleccionado' : 'Seleccionar Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón continuar */}
          {selectedPlan && (
            <div className="text-center mt-12">
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    Continuar con {plans.find(p => p.id === selectedPlan)?.name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
              
              <p className="text-sm text-slate-500 mt-4">
                {selectedPlan === 'free' 
                  ? 'Serás redirigido a la configuración inicial'
                  : 'Serás redirigido a la página de pago seguro'
                }
              </p>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-20 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                ¿Tienes preguntas sobre los planes?
              </h3>
              <p className="text-slate-600 mb-6">
                Nuestro equipo está aquí para ayudarte a elegir el plan perfecto para tu negocio.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Comparar planes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Prueba gratuita</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Funciones premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 