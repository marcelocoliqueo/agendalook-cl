'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

interface PlanCardProps {
  name: string;
  price: string;
  users: string;
  branches: string;
  whatsapp: string;
  features: string[];
  highlighted?: boolean;
  actionUrl: string;
}

export function PlanCard({
  name,
  price,
  users,
  branches,
  whatsapp,
  features,
  highlighted = false,
  actionUrl
}: PlanCardProps) {
  return (
    <div className={`lift rounded-3xl border p-6 shadow-sm flex flex-col relative ${
      highlighted 
        ? 'border-2 border-sky-500 bg-white shadow-md' 
        : 'border-slate-200 bg-slate-50'
    }`}>
      {/* Badge destacado */}
      {highlighted && (
        <span className="absolute -top-3 right-6 rounded-full bg-sky-500 text-white text-xs px-3 py-1 font-semibold">
          Recomendado
        </span>
      )}

      {/* Header del plan */}
      <div className="text-center">
        <div className={`text-sm font-semibold ${
          highlighted ? 'text-slate-700' : 'text-slate-600'
        }`}>
          {name}
        </div>
        <div className="mt-2 text-4xl font-extrabold text-slate-900">
          {price}
        </div>
        <div className="text-sm text-slate-500">/mes</div>
        <div className="mt-2 text-xs text-emerald-600 font-medium">
          30 días gratis
        </div>
      </div>

      {/* Características principales */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Usuarios:</span>
          <span className="font-semibold text-slate-900">{users}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Sucursales:</span>
          <span className="font-semibold text-slate-900">{branches}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">WhatsApp:</span>
          <span className="font-semibold text-slate-900">{whatsapp}</span>
        </div>
      </div>

      {/* Lista de características */}
      <ul className="mt-6 space-y-3 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
            <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Botón de acción */}
      <Link
        href={actionUrl}
        className={`mt-6 w-full inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition-all duration-300 focus-ring ${
          highlighted
            ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
            : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        Suscribirme
      </Link>
    </div>
  );
}
