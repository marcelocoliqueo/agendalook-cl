'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { formatPlanPrice } from '@/lib/plans';
import { Check, Sparkles, Zap, Crown, ArrowRight, Clock, Users, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Definir los planes correctos
const PLANS = {
  look: {
    name: 'Look',
    price: 9990,
    description: 'Para profesionales y negocios pequeños',
    color: 'text-sky-600',
    features: [
      'Agenda online ilimitada',
      'Recordatorios por WhatsApp',
      'Pagos online con MercadoPago',
      'Página pública de reservas',
      'Reportes básicos',
      'CRM básico',
      'Soporte por email'
    ],
    limits: { maxServices: null, maxBookingsPerMonth: null, whatsappReminders: true, customSubdomain: false, clientHistory: true, priceCLP: 9990 }
  },
  pro: {
    name: 'Pro',
    price: 16990,
    description: 'Para equipos que buscan más control',
    color: 'text-purple-600',
    features: [
      'Todo lo del Plan Look',
      'Reportes avanzados',
      'Ficha de cliente avanzada',
      'Automatizaciones personalizadas',
      'Integraciones avanzadas',
      'Soporte prioritario',
      'Sin marca de Agendalook'
    ],
    limits: { maxServices: null, maxBookingsPerMonth: null, whatsappReminders: true, customSubdomain: false, clientHistory: true, priceCLP: 16990 }
  },
  studio: {
    name: 'Studio',
    price: 19990,
    description: 'Para estudios y equipos grandes',
    color: 'text-emerald-600',
    features: [
      'Todo lo del Plan Pro',
      'Múltiples sucursales',
      'Usuarios ilimitados',
      'Reportes empresariales',
      'API personalizada',
      'Soporte dedicado',
      'Funciones premium'
    ],
    limits: { maxServices: null, maxBookingsPerMonth: null, whatsappReminders: true, customSubdomain: true, clientHistory: true, priceCLP: 19990 }
  }
};

type PlanType = 'look' | 'pro' | 'studio';

export default function SelectPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('look');
  const [loading, setLoading] = useState(false);
  const [professional, setProfessional] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { getProfessionalByUserId, updateProfessional } = useProfessional();

  // Obtener plan sugerido desde URL
  const suggestedPlan = searchParams?.get('plan') as PlanType || 'look';

  useEffect(() => {
    if (suggestedPlan && ['look', 'pro', 'studio'].includes(suggestedPlan)) {
      setSelectedPlan(suggestedPlan);
    }
  }, [suggestedPlan]);

  useEffect(() => {
    const loadProfessional = async () => {
      if (!user) return;
      
      try {
        const prof = await getProfessionalByUserId(user.id);
        setProfessional(prof);
      } catch (error) {
        console.error('Error loading professional:', error);
      }
    };

    loadProfessional();
  }, [user, getProfessionalByUserId]);

  const handlePlanSelect = async (plan: PlanType) => {
    setSelectedPlan(plan);
    
    // Todos los planes son pagados, ir a la página de pago
    setLoading(true);
    try {
      router.push(`/payment?plan=${plan}`);
    } catch (error) {
      console.error('Error navigating to payment:', error);
      setLoading(false);
    }
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'look':
        return <Zap className="w-6 h-6" />;
      case 'pro':
        return <Sparkles className="w-6 h-6" />;
      case 'studio':
        return <Crown className="w-6 h-6" />;
    }
  };

  const getPlanGradient = (plan: PlanType) => {
    switch (plan) {
      case 'look':
        return 'from-sky-500 to-sky-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'studio':
        return 'from-emerald-500 to-emerald-600';
    }
  };

  const getPlanBadge = (plan: PlanType) => {
    switch (plan) {
      case 'look':
        return { text: 'Más Popular', color: 'bg-sky-100 text-sky-800' };
      case 'pro':
        return { text: 'Recomendado', color: 'bg-purple-100 text-purple-800' };
      case 'studio':
        return { text: 'Para Equipos', color: 'bg-emerald-100 text-emerald-800' };
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
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-32 h-9 flex items-center justify-center">
              <Image
                src="/logo-main.png"
                alt="Agendalook"
                width={128}
                height={36}
                className="w-32 h-9 object-contain"
              />
            </div>
          </Link>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            ¡Elige tu plan perfecto!
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a las necesidades de tu negocio
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(PLANS).map(([planKey, planInfo]) => {
            const plan = planKey as PlanType;
            const isSelected = selectedPlan === plan;
            const badge = getPlanBadge(plan);
            const isPopular = plan === 'look';

            return (
              <div
                key={plan}
                className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-sky-500 shadow-sky-500/25 scale-105' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                } ${isPopular ? 'ring-2 ring-sky-500/20' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {/* Badge */}
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                  {badge.text}
                </div>

                {/* Header */}
                <div className={`p-8 rounded-t-3xl bg-gradient-to-br ${getPlanGradient(plan)} text-white`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      {getPlanIcon(plan)}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center mb-2">
                    {planInfo.name}
                  </h3>
                  
                  <div className="text-center">
                    <span className="text-4xl font-bold">
                      {formatPlanPrice(planInfo.price)}
                    </span>
                    {planInfo.price > 0 && (
                      <span className="text-white/80 text-sm">/mes</span>
                    )}
                  </div>
                  
                  <p className="text-white/90 text-center mt-2">
                    {planInfo.description}
                  </p>
                </div>

                {/* Features */}
                <div className="p-8">
                  <ul className="space-y-4">
                    {planInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={() => handlePlanSelect(selectedPlan)}
            disabled={loading}
            className={`px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>
                  Continuar con Plan {PLANS[selectedPlan].name}
                </span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </button>

          {selectedPlan && (
            <p className="text-sm text-slate-500">
              Serás redirigido a MercadoPago para completar el pago
            </p>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-800">Configuración Rápida</h4>
            <p className="text-slate-600 text-sm">Comienza a recibir reservas en menos de 5 minutos</p>
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800">Sin Compromiso</h4>
            <p className="text-slate-600 text-sm">Cancela cuando quieras, sin penalizaciones</p>
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-800">Soporte 24/7</h4>
            <p className="text-slate-600 text-sm">Nuestro equipo está aquí para ayudarte</p>
          </div>
        </div>
      </div>
    </div>
  );
}
