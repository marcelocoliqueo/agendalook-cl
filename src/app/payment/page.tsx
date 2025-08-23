'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePlanManagement, Plan, PaymentData } from '@/hooks/usePlanManagement';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { 
  Check, 
  Shield, 
  Zap, 
  Users, 
  CreditCard, 
  Lock,
  ArrowLeft,
  Sparkles,
  Star,
  Crown
} from 'lucide-react';
import Link from 'next/link';

// Planes disponibles
const PLANS: Plan[] = [
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
    gradient: 'from-slate-500 to-slate-600'
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
    popular: true,
    color: 'text-sky-600',
    gradient: 'from-sky-500 to-sky-600'
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
    gradient: 'from-emerald-500 to-emerald-600'
  }
];

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { processPayment, isProcessing } = usePlanManagement();
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const planId = searchParams.get('plan');
    if (!planId) {
      router.push('/plans');
      return;
    }

    const plan = PLANS.find(p => p.id === planId);
    if (!plan) {
      router.push('/plans');
      return;
    }

    setSelectedPlan(plan);
  }, [searchParams, router]);

  useEffect(() => {
    if (!user) {
      console.log('🔍 Payment page: No user found, redirecting to login');
      router.push('/login');
    } else {
      console.log('🔍 Payment page: User authenticated:', {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at
      });
    }
  }, [user, router]);

  const handlePayment = async () => {
    if (!selectedPlan || !user) {
      console.log('🔍 Payment: Missing plan or user:', { selectedPlan, user });
      return;
    }

    console.log('🔍 Payment: Starting payment process for:', {
      plan: selectedPlan.id,
      userEmail: user.email,
      userId: user.id
    });

    const paymentData: PaymentData = {
      plan: selectedPlan,
      userEmail: user.email || '',
      userId: user.id
    };

    await processPayment(paymentData);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-8 h-8" />;
      case 'pro':
        return <Star className="w-8 h-8" />;
      case 'studio':
        return <Crown className="w-8 h-8" />;
      default:
        return <Sparkles className="w-8 h-8" />;
    }
  };

  if (!selectedPlan || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Header con navegación */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link 
          href="/plans"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a planes</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-semibold">
                1
              </div>
              <span className="text-slate-600">Seleccionar Plan</span>
            </div>
            <div className="w-16 h-1 bg-sky-200 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-semibold">
                2
              </div>
              <span className="text-slate-600">Confirmar Pago</span>
            </div>
            <div className="w-16 h-1 bg-sky-200 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-semibold">
                3
              </div>
              <span className="text-slate-400">¡Listo!</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header del plan */}
          <div className={`bg-gradient-to-br ${selectedPlan.gradient} p-8 text-white text-center relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                {getPlanIcon(selectedPlan.id)}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">
                Plan {selectedPlan.name}
              </h1>
              
              <p className="text-xl opacity-90 mb-6">
                {selectedPlan.description}
              </p>

              {selectedPlan.popular && (
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Más Popular</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            {/* Precio y características */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-slate-800 mb-2">
                {selectedPlan.price === 0 ? 'Gratis' : `$${selectedPlan.price.toLocaleString()}`}
              </div>
              {selectedPlan.price > 0 && (
                <p className="text-slate-600 text-lg">por mes</p>
              )}
            </div>

            {/* Características del plan */}
            <div className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl p-6 mb-8 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">
                Todo lo que incluye tu plan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficios adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">100% Seguro</h4>
                <p className="text-sm text-slate-600">Pagos encriptados y protegidos</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Activación Inmediata</h4>
                <p className="text-sm text-slate-600">Acceso instantáneo a todas las funciones</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Soporte Premium</h4>
                <p className="text-sm text-slate-600">Ayuda personalizada cuando la necesites</p>
              </div>
            </div>

            {/* Botón de pago */}
            <div className="text-center">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full max-w-md bg-gradient-to-r ${selectedPlan.gradient} text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Procesando pago...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-3" />
                    {selectedPlan.price === 0 ? 'Activar Plan Gratuito' : `Pagar $${selectedPlan.price.toLocaleString()}`}
                  </>
                )}
              </button>
              
              <p className="text-sm text-slate-500 mt-4 flex items-center justify-center">
                <Lock className="w-4 h-4 mr-2" />
                Tus datos están protegidos con encriptación SSL
              </p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-4">
            ¿Tienes preguntas sobre tu plan?
          </p>
          <Link 
            href="/contact"
            className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <MarketingLayout>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando...</p>
          </div>
        </div>
      }>
        <PaymentPageContent />
      </Suspense>
    </MarketingLayout>
  );
}
