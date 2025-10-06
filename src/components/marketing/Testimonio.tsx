'use client';

export function Testimonio() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 border border-slate-200 p-8 lg:p-12">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <p className="text-slate-700 text-lg leading-relaxed">
                "Desde que uso Agendalook, mis clientes <span className="font-semibold">agendan solos</span>, reciben recordatorios y <span className="font-semibold">ya no pierdo citas</span>. Mi agenda está siempre al día."
              </p>
              <div className="mt-4 font-semibold">Carla, Psicóloga</div>
            </div>
            <div className="lg:justify-self-end">
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Ausencias</span>
                  <span className="font-semibold text-green-600">−15%</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-600">Reservas al mes</span>
                  <span className="font-semibold text-blue-600">+20%</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-600">Tiempo ahorrado</span>
                  <span className="font-semibold text-blue-600">2 h/sem</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
