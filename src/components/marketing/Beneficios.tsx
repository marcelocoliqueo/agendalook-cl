'use client';

export function Beneficios() {
  return (
    <section id="beneficios" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Todo lo que necesitas para agendar sin fricción</h2>
          <p className="mt-3 text-slate-600">Simplifica reservas, confirma por WhatsApp y mantén tu calendario bajo control.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">📅</div>
            <h3 className="mt-4 font-semibold text-lg">Agenda en línea</h3>
            <p className="mt-1 text-slate-600">Tus clientes reservan desde un enlace único. Sin llamadas, sin enredos.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">💬</div>
            <h3 className="mt-4 font-semibold text-lg">Recordatorios automáticos</h3>
            <p className="mt-1 text-slate-600">Confirmaciones por WhatsApp y correo para reducir ausencias.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">🗂️</div>
            <h3 className="mt-4 font-semibold text-lg">Gestión de clientes</h3>
            <p className="mt-1 text-slate-600">Historial, próximas citas y notas a un clic. Todo en un mismo lugar.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">⏱️</div>
            <h3 className="mt-4 font-semibold text-lg">Disponibilidad inteligente</h3>
            <p className="mt-1 text-slate-600">Evita choques de horario con reglas simples y bloques personalizados.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">🔗</div>
            <h3 className="mt-4 font-semibold text-lg">Enlaces por profesional</h3>
            <p className="mt-1 text-slate-600">Crea páginas públicas por cada negocio o profesional: <span className="font-mono text-xs">/tu-negocio</span>.</p>
          </div>
          <div className="lift g-border rounded-2xl bg-white/90 p-6 shadow-sm relative">
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">🔒</div>
            <h3 className="mt-4 font-semibold text-lg">Seguro y confiable</h3>
            <p className="mt-1 text-slate-600">Autenticación, permisos y copias de seguridad para operar tranquilo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
