'use client';

import { CTAPrimaryButton } from '@/components/ui/AuthButtons';

export function Contacto() {
  return (
    <section id="contacto" className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <h3 className="text-2xl font-extrabold">¿Quieres una demo?</h3>
          <p className="mt-2 text-slate-600">Déjanos tu correo y agenda una llamada con nuestro equipo.</p>
          <form className="mt-6 grid sm:grid-cols-[1fr_auto] gap-3">
            <label className="sr-only" htmlFor="email">Correo</label>
            <input 
              id="email" 
              type="email" 
              required 
              placeholder="tu@email.com" 
              className="w-full rounded-2xl border border-slate-300 bg-white text-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500" 
            />
            <button className="rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Solicitar demo
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-500">Al continuar aceptas nuestros términos y política de privacidad.</p>
          
          {/* CTA Alternativo */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600 mb-4">
              ¿O prefieres empezar directamente?
            </p>
            <CTAPrimaryButton />
          </div>
        </div>
      </div>
    </section>
  );
}
