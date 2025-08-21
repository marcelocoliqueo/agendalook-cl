'use client';

import Link from 'next/link';
import { useParallax } from '@/hooks/useParallax';

export function Hero() {
  const blob1Ref = useParallax({ speed: 0.02, direction: 'up' });
  const blob2Ref = useParallax({ speed: 0.02, direction: 'down' });
  const blob3Ref = useParallax({ speed: 0.01, direction: 'up' });

  return (
    <section className="relative overflow-hidden">
      {/* Blobs exactos del HTML */}
      <div 
        ref={blob1Ref}
        className="pointer-events-none absolute -top-24 -left-16 h-96 w-96 rounded-full bg-sky-300 blob contrast-125 mix-blend-overlay" 
        data-parallax="-0.02"
      ></div>
      <div 
        ref={blob2Ref}
        className="pointer-events-none absolute top-16 -right-20 h-[28rem] w-[28rem] rounded-full bg-emerald-300 blob blob2 mix-blend-overlay" 
        data-parallax="0.02"
      ></div>
      <div 
        ref={blob3Ref}
        className="pointer-events-none absolute bottom-[-6rem] left-1/2 -translate-x-1/2 h-[22rem] w-[44rem] rounded-full bg-sky-200 blob blob3 opacity-20" 
        data-parallax="-0.01"
      ></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-28 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-sky-200 text-sky-700 bg-sky-50">
              Nuevo · Confirmaciones por WhatsApp
            </p>
            <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight text-slate-900">
              <span className="gradient-text">Agenda simple</span> y profesional para tus clientes
            </h1>
            <p className="mt-5 text-lg text-slate-700 max-w-prose">
              La plataforma todo en uno para <span className="font-semibold">psicólogos</span>, <span className="font-semibold">estilistas</span>, <span className="font-semibold">coaches</span>, <span className="font-semibold">manicuristas</span> y más. Publica tu agenda, recibe reservas y confirma por WhatsApp.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link 
                href="#precios" 
                className="shine magnet inline-flex items-center justify-center rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 font-semibold shadow-sm focus-ring"
              >
                Empieza gratis
              </Link>
              <Link 
                href="#contacto" 
                className="inline-flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 font-semibold border border-slate-200 shadow-sm focus-ring"
              >
                Solicita una demo
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1">⭐️⭐️⭐️⭐️⭐️</span>
              <span>100+ profesionales ya agendando</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="glass rounded-3xl shadow-xl ring-1 ring-slate-200 p-5">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden g-border">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-sm font-semibold">Agenda semanal</span>
                  <span className="text-xs text-slate-500">Vista demo</span>
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-200 text-center text-xs">
                  <div className="bg-slate-50 p-3 font-semibold">Lun</div>
                  <div className="bg-slate-50 p-3 font-semibold">Mar</div>
                  <div className="bg-slate-50 p-3 font-semibold">Mié</div>
                  <div className="bg-slate-50 p-3 font-semibold">Jue</div>
                  <div className="bg-slate-50 p-3 font-semibold">Vie</div>
                  <div className="bg-slate-50 p-3 font-semibold">Sáb</div>
                  <div className="bg-slate-50 p-3 font-semibold">Dom</div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-700 font-medium">Consulta inicial</div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">Confirmada</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-slate-700 font-medium">Manicure gel</div>
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-200">Pendiente</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-slate-700 font-medium">Sesión de coaching</div>
                    <span className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded-md border border-sky-200">Reagendada</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <div className="lift inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-white text-xs font-bold">WA</span>
                  <span>Recordatorios por WhatsApp</span>
                </div>
                <div className="lift inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500 text-white text-xs font-bold">AI</span>
                  <span>Confirmaciones automáticas</span>
                </div>
                <div className="lift inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-500 text-white text-xs font-bold">API</span>
                  <span>Integración simple</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
