"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfessional } from '@/hooks/useProfessional';
import { PLANS, getCurrentPlan, formatPlanPrice } from '@/lib/plans';
import { Button } from '@/components/ui/Button';
import { Check, Star, Crown, Zap } from 'lucide-react';

export default function UpgradePage() {
  const router = useRouter();
  const { professional } = useProfessional();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = getCurrentPlan(professional?.plan);

  const handleUpgrade = async (plan: string) => {
    setLoading(true);
    try {
      // Aquí iría la lógica de pago con Mercado Pago
      console.log('Upgrading to plan:', plan);
      
      // Por ahora, redirigir a settings
      router.push('/dashboard/settings');
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planKey: string) => {
    switch (planKey) {
      case 'free':
        return <Zap className="w-6 h-6" />;
      case 'pro':
        return <Star className="w-6 h-6" />;
      case 'studio':
        return <Crown className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planKey: string) => {
    switch (planKey) {
      case 'free':
        return 'border-gray-200 bg-gray-50';
      case 'pro':
        return 'border-lavender-300 bg-lavender-50';
      case 'studio':
        return 'border-coral-300 bg-coral-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Actualiza tu plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan perfecto para hacer crecer tu negocio de belleza
          </p>
        </div>

        {/* Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(PLANS).map(([planKey, plan]) => (
            <div
              key={planKey}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                planKey === currentPlan 
                  ? 'ring-2 ring-lavender-500 shadow-lg' 
                  : getPlanColor(planKey)
              }`}
            >
              {/* Badge para plan actual */}
              {planKey === currentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-lavender-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Plan Actual
                  </span>
                </div>
              )}

              {/* Header del plan */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    planKey === 'free' ? 'bg-gray-200' :
                    planKey === 'pro' ? 'bg-lavender-200' :
                    'bg-coral-200'
                  }`}>
                    {getPlanIcon(planKey)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-2 ${plan.color}`}>
                  {formatPlanPrice(plan.price)}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Características */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Botón de acción */}
              <div className="text-center">
                {planKey === currentPlan ? (
                  <Button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    Plan Actual
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(planKey)}
                    disabled={loading}
                    className={`w-full ${
                      planKey === 'pro' 
                        ? 'bg-gradient-to-r from-lavender-500 to-coral-500 text-white' 
                        : 'bg-gradient-to-r from-coral-500 to-lavender-500 text-white'
                    } hover:shadow-lg transition-all duration-300`}
                  >
                    {loading ? 'Procesando...' : `Actualizar a ${plan.name}`}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¿Por qué actualizar?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-lavender-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Sin límites</h4>
                <p className="text-gray-600 text-sm">
                  Crea tantos servicios y reservas como necesites
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-coral-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Más herramientas</h4>
                <p className="text-gray-600 text-sm">
                  Accede a analytics, personalización y más
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-gold-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Soporte premium</h4>
                <p className="text-gray-600 text-sm">
                  Atención prioritaria y soporte dedicado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="mr-4"
          >
            Volver al Dashboard
          </Button>
          <Button
            onClick={() => router.push('/dashboard/settings')}
            className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white"
          >
            Ver Configuración
          </Button>
        </div>
      </div>
    </div>
  );
} 