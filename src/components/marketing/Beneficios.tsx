'use client';

import { Bell, CreditCard, Users, TrendingUp } from 'lucide-react';

export function Beneficios() {
  return (
    <section id="beneficios" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Todo lo que necesitas para hacer crecer tu negocio</h2>
          <p className="mt-3 text-slate-600">Herramientas profesionales para gestionar tu agenda, cobrar y confirmar sin estrés.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Agenda Inteligente</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">Gestiona horarios, bloqueos y recordatorios automáticos que reducen ausencias.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Página Profesional</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">Comparte tu link o QR, muestra servicios y recibe reservas 24/7.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Pagos y Confirmaciones</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">Confirma citas por WhatsApp y cobra online con MercadoPago.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Reportes y Análisis</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">Administra todo desde un solo panel con estadísticas y reportes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
