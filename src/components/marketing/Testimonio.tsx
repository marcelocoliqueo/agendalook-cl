'use client';

export function Testimonio() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 border border-slate-200 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-slate-700 text-lg leading-relaxed">
                "Desde que uso Agendalook, mis clientes <span className="font-semibold">agendan solos</span>, reciben recordatorios y <span className="font-semibold">ya no pierdo citas</span>. Mi agenda está siempre al día."
              </p>
              <div className="mt-4 font-semibold">Carla, Psicóloga</div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg text-sm min-w-[240px]">
                <div className="text-center mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Resultados con Agendalook</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600 font-medium">Ausencias</span>
                    </div>
                    <span className="font-bold text-green-600 text-lg">−15%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-600 font-medium">Reservas al mes</span>
                    </div>
                    <span className="font-bold text-blue-600 text-lg">+20%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-600 font-medium">Tiempo ahorrado</span>
                    </div>
                    <span className="font-bold text-purple-600 text-lg">2 h/sem</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 text-center">
                    Datos reales de usuarios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
