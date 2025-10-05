'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlanCard } from '@/components/pricing/PlanCard';
import { PLANS } from '@/lib/plans';

function PricingPageContent() {
  const searchParams = useSearchParams();
  
  // Verificar si viene de trial expirado
  const trialExpired = searchParams.get('trial-expired') === 'true';
  const trialMessage = searchParams.get('message');

  // Datos de los planes según especificaciones del usuario
  const plansData = [
    {
      name: 'Lite',
      price: '$9.990',
      users: 'Hasta 3 usuarios',
      branches: '1 sucursal',
      whatsapp: '80 mensajes',
      features: [
        'Agenda básica completa',
        'Página pública personalizada',
        'Notificaciones por email',
        'Dashboard básico',
        'Soporte por email',
        'Hasta 10 reservas por mes'
      ],
      highlighted: false,
      actionUrl: '/api/mercadopago/checkout?plan=lite'
    },
    {
      name: 'Pro',
      price: '$16.990',
      users: 'Hasta 8 usuarios',
      branches: '1 sucursal',
      whatsapp: '180 mensajes',
      features: [
        'Todo lo del Lite',
        'Reservas ilimitadas',
        'Servicios ilimitados',
        'Historial de clientes',
        'Estadísticas básicas',
        'Soporte prioritario',
        'Sin marca de Agendalook',
        'Filtros avanzados'
      ],
      highlighted: true,
      actionUrl: '/api/mercadopago/checkout?plan=pro'
    },
    {
      name: 'Studio',
      price: '$24.990',
      users: 'Hasta 20 usuarios',
      branches: '2 sucursales',
      whatsapp: '300 mensajes',
      features: [
        'Todo lo del Pro',
        'Multi-sucursal',
        'Roles y permisos',
        'Reportes detallados',
        'Exportación de datos',
        'Personalización avanzada',
        'Soporte dedicado',
        'Funciones premium'
      ],
      highlighted: false,
      actionUrl: '/api/mercadopago/checkout?plan=studio'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Alerta de trial expirado */}
      {trialExpired && trialMessage && (
        <div className="bg-red-50 border-b border-red-200 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">!</span>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold text-lg">
                  Período de Prueba Expirado
                </h3>
                <p className="text-red-700 text-sm">
                  {trialMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Planes pensados para hacer crecer tu negocio
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Agendalook te ofrece la forma más simple y económica de gestionar tus reservas, clientes y pagos.
            </p>
          </div>
        </div>
      </div>

      {/* Cards de planes */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plansData.map((plan, index) => (
              <PlanCard
                key={index}
                name={plan.name}
                price={plan.price}
                users={plan.users}
                branches={plan.branches}
                whatsapp={plan.whatsapp}
                features={plan.features}
                highlighted={plan.highlighted}
                actionUrl={plan.actionUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de contacto */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            ¿Tienes dudas o necesitas un plan personalizado?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Contáctanos por WhatsApp y te ayudamos a encontrar la solución perfecta para tu negocio.
          </p>
          <a
            href="https://wa.me/56912345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Contáctanos por WhatsApp
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            <details className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer flex justify-between items-center text-slate-900">
                ¿Puedo cambiar de plan en cualquier momento?
                <span className="text-sky-500 group-open:rotate-45 transition-transform duration-200 text-xl">＋</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Sí, puedes cambiar de plan o cancelar tu suscripción en cualquier momento. Los cambios se aplicarán en tu próximo ciclo de facturación.
              </p>
            </details>
            
            <details className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer flex justify-between items-center text-slate-900">
                ¿Qué incluye la prueba gratuita de 30 días?
                <span className="text-sky-500 group-open:rotate-45 transition-transform duration-200 text-xl">＋</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Los 30 días gratis te permiten probar todas las funcionalidades del plan que elijas sin costo. No se requiere tarjeta de crédito para comenzar.
              </p>
            </details>
            
            <details className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer flex justify-between items-center text-slate-900">
                ¿Cómo funcionan los recordatorios por WhatsApp?
                <span className="text-sky-500 group-open:rotate-45 transition-transform duration-200 text-xl">＋</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Los planes Pro y Studio incluyen recordatorios automáticos por WhatsApp. Puedes configurar cuándo enviarlos y personalizar los mensajes según tus necesidades.
              </p>
            </details>
            
            <details className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer flex justify-between items-center text-slate-900">
                ¿Qué métodos de pago aceptan?
                <span className="text-sky-500 group-open:rotate-45 transition-transform duration-200 text-xl">＋</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Aceptamos todas las tarjetas de crédito y débito principales, además de transferencias bancarias a través de MercadoPago.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    }>
      <PricingPageContent />
    </Suspense>
  );
}
