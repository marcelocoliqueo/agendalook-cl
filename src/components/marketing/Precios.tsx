'use client';

import Link from 'next/link';
import { CTAPrimaryButton, RegisterButton } from '@/components/ui/AuthButtons';

export function Precios() {
  return (
    <section id="precios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Planes simples para crecer</h2>
          <p className="mt-3 text-slate-600">Comienza gratis. Cambia o cancela cuando quieras.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6 items-stretch">
          {/* Free */}
          <div className="lift rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm flex flex-col">
            <div className="text-sm font-semibold text-slate-600">Free</div>
            <div className="mt-2 text-4xl font-extrabold">$0</div>
            <div className="text-sm text-slate-500">/mes</div>
            <ul className="mt-6 space-y-2 text-slate-700">
              <li>• Agenda básica</li>
              <li>• Página pública /tu-negocio</li>
              <li>• 1 usuario</li>
            </ul>
            <RegisterButton className="mt-auto w-full" />
          </div>
          {/* Pro */}
          <div className="lift rounded-3xl border-2 border-sky-500 bg-white p-6 shadow-md flex flex-col relative">
            <span className="absolute -top-3 right-6 rounded-full bg-sky-500 text-white text-xs px-3 py-1">Recomendado</span>
            <div className="text-sm font-semibold text-slate-700">Pro</div>
            <div className="mt-2 text-4xl font-extrabold">$9.990</div>
            <div className="text-sm text-slate-500">/mes</div>
            <ul className="mt-6 space-y-2 text-slate-700">
              <li>• Todo lo del Free</li>
              <li>• Recordatorios por WhatsApp</li>
              <li>• Confirmaciones automáticas</li>
              <li>• 3 usuarios</li>
            </ul>
            <RegisterButton className="mt-auto w-full" />
          </div>
          {/* Studio */}
          <div className="lift rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm flex flex-col">
            <div className="text-sm font-semibold text-slate-600">Studio</div>
            <div className="mt-2 text-4xl font-extrabold">$19.990</div>
            <div className="text-sm text-slate-500">/mes</div>
            <ul className="mt-6 space-y-2 text-slate-700">
              <li>• Todo lo del Pro</li>
              <li>• Multi-sucursal</li>
              <li>• Roles y permisos</li>
              <li>• Soporte prioritario</li>
            </ul>
            <RegisterButton className="mt-auto w-full" />
          </div>
        </div>
        {/* CTA Principal */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            ¿Listo para empezar?
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Únete a más de 100 profesionales que ya están agendando con Agendalook. 
            Configuración en menos de 5 minutos.
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
              <p className="mt-2 text-slate-600">El plan Free te permite probar todas las bases sin costo.</p>
            </details>
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="font-medium cursor-pointer flex justify-between items-center">
                ¿Envían recordatorios por WhatsApp?
                <span className="text-sky-500 group-open:rotate-45 transition">＋</span>
              </summary>
              <p className="mt-2 text-slate-600">Sí, en los planes Pro y Studio puedes automatizar confirmaciones y recordatorios.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
