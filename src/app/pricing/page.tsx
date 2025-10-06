'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MinusCircle, CircleDashed, Check } from 'lucide-react';

function PricingPageContent() {
  const searchParams = useSearchParams();
  
  // Verificar si viene de trial expirado
  const trialExpired = searchParams.get('trial-expired') === 'true';
  const trialMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
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

      {/* Encabezado */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Elige el plan ideal para tu negocio
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Prueba cualquier plan gratis por 30 días. Sin compromisos.
          </p>
        </div>
      </section>

      {/* Grid de planes */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Plan Look */}
            <div className="bg-white/60 backdrop-blur border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <h2 className="text-2xl font-semibold mb-1 text-slate-900">Plan Look</h2>
              <p className="text-sm text-slate-500 mb-4">Para profesionales y negocios pequeños.</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                $9.990 <span className="text-base font-normal text-slate-500">/mes</span>
              </p>
              <p className="text-sm text-slate-500 mb-6">3 usuarios • 1 sucursal • 80 WhatsApp</p>
              
              {/* Características */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Agenda online ilimitada</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Recordatorios y confirmaciones por WhatsApp</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Pagos online con MercadoPago</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Página pública de reservas (link o QR)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Reportes básicos (reservas, ingresos)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>CRM básico (clientes y contactos)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Soporte por email</span>
                </li>
              </ul>

              {/* Extras opcionales */}
              <div className="border-t border-slate-200 pt-4 mb-6">
                <p className="font-medium text-slate-900 mb-2">Extras opcionales:</p>
                <ul className="space-y-1 text-sm text-slate-500">
                  <li>👤 Usuario adicional → $1.990/mes</li>
                  <li>🏢 Sucursal adicional → $3.990/mes</li>
                </ul>
              </div>

              {/* CTAs */}
              <Link 
                href="/register" 
                className="w-full inline-flex items-center justify-center rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring"
              >
                Suscribirme
              </Link>
              <Link 
                href="/register" 
                className="text-sm text-sky-600 hover:text-sky-700 hover:underline block text-center mt-3"
              >
                Prueba 30 días gratis
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="bg-white/60 backdrop-blur border-2 border-sky-500 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 relative">
              <span className="absolute -top-3 right-6 rounded-full bg-sky-500 text-white text-xs px-3 py-1 font-semibold">
                Recomendado
              </span>
              
              <h2 className="text-2xl font-semibold mb-1 text-slate-900">Plan Pro</h2>
              <p className="text-sm text-slate-500 mb-4">Para equipos que buscan más control y automatización.</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                $16.990 <span className="text-base font-normal text-slate-500">/mes</span>
              </p>
              <p className="text-sm text-slate-500 mb-6">8 usuarios • 1 sucursal • 180 WhatsApp</p>
              
              {/* Características */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Todo lo del Plan Look</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Reportes avanzados (cancelaciones, ingresos por servicio)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Ficha de cliente/paciente avanzada (historial, notas, archivos)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Comisiones por profesional</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Automatizaciones simples (recordatorios extra, mensajes post-servicio)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Integración con Google Calendar</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Soporte prioritario nivel medio</span>
                </li>
              </ul>

              {/* Extras opcionales */}
              <div className="border-t border-slate-200 pt-4 mb-6">
                <p className="font-medium text-slate-900 mb-2">Extras opcionales:</p>
                <ul className="space-y-1 text-sm text-slate-500">
                  <li>👤 Usuario adicional → $1.490/mes</li>
                  <li>🏢 Sucursal adicional → $2.990/mes</li>
                </ul>
              </div>

              {/* CTAs */}
              <Link 
                href="/register" 
                className="w-full inline-flex items-center justify-center rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring"
              >
                Suscribirme
              </Link>
              <Link 
                href="/register" 
                className="text-sm text-sky-600 hover:text-sky-700 hover:underline block text-center mt-3"
              >
                Prueba 30 días gratis
              </Link>
            </div>

            {/* Plan Studio */}
            <div className="bg-white/60 backdrop-blur border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <h2 className="text-2xl font-semibold mb-1 text-slate-900">Plan Studio</h2>
              <p className="text-sm text-slate-500 mb-4">Para clínicas, spas y cadenas con múltiples profesionales.</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                $24.990 <span className="text-base font-normal text-slate-500">/mes</span>
              </p>
              <p className="text-sm text-slate-500 mb-6">20 usuarios • 2 sucursales • 300 WhatsApp</p>
              
              {/* Características */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Todo lo del Plan Pro</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Roles y permisos (administrador, recepcionista, profesional)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Consentimientos digitales (PDF o firma)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Giftcards, bonos y paquetes de sesiones</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Multi-sucursal con panel unificado</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Personalización de marca (logo, colores)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Soporte prioritario (email + WhatsApp)</span>
                </li>
              </ul>

              {/* Extras opcionales */}
              <div className="border-t border-slate-200 pt-4 mb-6">
                <p className="font-medium text-slate-900 mb-2">Extras opcionales:</p>
                <ul className="space-y-1 text-sm text-slate-500">
                  <li>👤 Usuario adicional → $990/mes</li>
                  <li>🏢 Sucursal adicional → $2.490/mes</li>
                </ul>
              </div>

              {/* CTAs */}
              <Link 
                href="/register" 
                className="w-full inline-flex items-center justify-center rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring"
              >
                Suscribirme
              </Link>
              <Link 
                href="/register" 
                className="text-sm text-sky-600 hover:text-sky-700 hover:underline block text-center mt-3"
              >
                Prueba 30 días gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Comparación de planes
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-6 font-semibold text-slate-900">Característica</th>
                  <th className="text-center p-6 font-semibold text-slate-900">Look</th>
                  <th className="text-center p-6 font-semibold text-sky-600">Pro</th>
                  <th className="text-center p-6 font-semibold text-slate-900">Studio</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="p-6 font-medium text-slate-700">Usuarios incluidos</td>
                  <td className="p-6 text-center text-slate-600">3</td>
                  <td className="p-6 text-center text-slate-600">8</td>
                  <td className="p-6 text-center text-slate-600">20</td>
                </tr>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="p-6 font-medium text-slate-700">Sucursales incluidas</td>
                  <td className="p-6 text-center text-slate-600">1</td>
                  <td className="p-6 text-center text-slate-600">1</td>
                  <td className="p-6 text-center text-slate-600">2</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-6 font-medium text-slate-700">WhatsApp/mes</td>
                  <td className="p-6 text-center text-slate-600">80</td>
                  <td className="p-6 text-center text-slate-600">180</td>
                  <td className="p-6 text-center text-slate-600">300</td>
                </tr>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="p-6 font-medium text-slate-700">Reportes avanzados</td>
                  <td className="p-6 text-center">
                    <MinusCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-6 font-medium text-slate-700">Comisiones automáticas</td>
                  <td className="p-6 text-center">
                    <MinusCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="p-6 font-medium text-slate-700">Consentimientos digitales</td>
                  <td className="p-6 text-center">
                    <MinusCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <MinusCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-6 font-medium text-slate-700">Roles y permisos</td>
                  <td className="p-6 text-center">
                    <MinusCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <MinusCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="p-6 font-medium text-slate-700">Soporte prioritario</td>
                  <td className="p-6 text-center">
                    <MinusCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CircleDashed className="h-5 w-5 text-blue-500 mx-auto" />
                  </td>
                  <td className="p-6 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sección de contacto */}
      <section className="py-16 bg-slate-50">
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
      </section>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center">
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