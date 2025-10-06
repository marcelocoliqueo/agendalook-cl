'use client';

import Link from 'next/link';
import { CTAPrimaryButton } from '@/components/ui/AuthButtons';

export function Precios() {
  return (
    <section id="precios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Elige tu plan y pruébalo gratis por 30 días</h2>
          <p className="mt-3 text-slate-600">Sin compromiso. Cancela cuando quieras.</p>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/pricing"
            className="lift rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-600">Lite</div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">Desde $9.990</div>
              <div className="text-sm text-slate-500">/mes</div>
              <div className="text-sm text-slate-500 mt-2 leading-relaxed">
                Todo lo esencial para profesionales individuales que recién comienzan.
              </div>
            </div>
          </Link>
          <Link 
            href="/pricing"
            className="lift rounded-2xl border-2 border-sky-500 bg-white hover:bg-sky-50 px-8 py-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative"
          >
            <span className="absolute -top-2 right-4 rounded-full bg-sky-500 text-white text-xs px-2 py-1">Recomendado</span>
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-700">Pro</div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">Desde $16.990</div>
              <div className="text-sm text-slate-500">/mes</div>
              <div className="text-sm text-slate-500 mt-2 leading-relaxed">
                Herramientas para equipos: reportes, comisiones y ficha avanzada.
              </div>
            </div>
          </Link>
          <Link 
            href="/pricing"
            className="lift rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-600">Studio</div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">Desde $24.990</div>
              <div className="text-sm text-slate-500">/mes</div>
              <div className="text-sm text-slate-500 mt-2 leading-relaxed">
                Pensado para clínicas, spas y cadenas con múltiples sucursales.
              </div>
            </div>
          </Link>
        </div>
        {/* CTA Principal */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Agendalook simplifica tu día a día
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Agenda, cobra y confirma sin estrés.
          </p>
          <CTAPrimaryButton />
        </div>
        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-extrabold">Preguntas frecuentes</h3>
          <div className="mt-6 space-y-3">
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="font-medium cursor-pointer flex justify-between items-center">
                ¿Puedo cancelar cuando quiera?
                <span className="text-sky-500 group-open:rotate-45 transition">＋</span>
              </summary>
              <p className="mt-2 text-slate-600">Sí, sin amarras. Puedes cambiar de plan o cancelar en cualquier momento.</p>
            </details>
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="font-medium cursor-pointer flex justify-between items-center">
                ¿Tienen prueba gratuita?
                <span className="text-sky-500 group-open:rotate-45 transition">＋</span>
              </summary>
              <p className="mt-2 text-slate-600">Sí, todos los planes incluyen 30 días gratis sin tarjeta de crédito.</p>
            </details>
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="font-medium cursor-pointer flex justify-between items-center">
                ¿Envían recordatorios por WhatsApp?
                <span className="text-sky-500 group-open:rotate-45 transition">＋</span>
              </summary>
              <p className="mt-2 text-slate-600">Sí, en todos los planes puedes automatizar confirmaciones y recordatorios por WhatsApp.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
