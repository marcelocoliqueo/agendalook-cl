'use client';

export function Profesionales() {
  return (
    <section id="profesionales" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Creado para distintos profesionales como tú</h2>
          <p className="mt-3 text-slate-600">Elige tu rubro y comienza en minutos.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lift rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-white hover:shadow-md transition">
            <div className="text-3xl">✂️</div>
            <h3 className="mt-3 font-semibold">Belleza & Estética</h3>
            <p className="text-sm text-slate-600 mt-1">Peluquerías, barbershop, depilación, spa.</p>
          </div>
          <div className="lift rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-white hover:shadow-md transition">
            <div className="text-3xl">🧠</div>
            <h3 className="mt-3 font-semibold">Psicología & Terapias</h3>
            <p className="text-sm text-slate-600 mt-1">Consulta privada, terapia online o presencial.</p>
          </div>
          <div className="lift rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-white hover:shadow-md transition">
            <div className="text-3xl">💼</div>
            <h3 className="mt-3 font-semibold">Coaching & Consultoría</h3>
            <p className="text-sm text-slate-600 mt-1">Mentorías, asesorías, sesiones 1:1.</p>
          </div>
          <div className="lift rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-white hover:shadow-md transition">
            <div className="text-3xl">💅</div>
            <h3 className="mt-3 font-semibold">Manicure & Estilistas</h3>
            <p className="text-sm text-slate-600 mt-1">Uñas, maquillaje, peinados y más.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
