'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, X, Crown } from 'lucide-react';
import { useTrialStatus } from '@/hooks/useTrialStatus';

interface TrialAlertProps {
  className?: string;
}

export function TrialAlert({ className = '' }: TrialAlertProps) {
  const { isTrial, isExpired, daysRemaining, loading } = useTrialStatus();
  const [dismissed, setDismissed] = useState(false);

  // No mostrar si no es trial, está expirado, cargando o fue descartado
  if (!isTrial || isExpired || loading || dismissed) {
    return null;
  }

  // Solo mostrar alerta si quedan 7 días o menos
  if (daysRemaining > 7) {
    return null;
  }

  const getAlertConfig = () => {
    if (daysRemaining <= 0) {
      return {
        type: 'error' as const,
        icon: AlertTriangle,
        title: '¡Tu período de prueba ha expirado!',
        message: 'Elige un plan para continuar usando Agendalook.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      };
    } else if (daysRemaining <= 3) {
      return {
        type: 'warning' as const,
        icon: AlertTriangle,
        title: `¡Solo quedan ${daysRemaining} días de prueba!`,
        message: 'No pierdas acceso a tus datos. Elige un plan ahora.',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        iconColor: 'text-orange-600'
      };
    } else {
      return {
        type: 'info' as const,
        icon: Clock,
        title: `Tu período de prueba expira en ${daysRemaining} días`,
        message: 'Considera elegir un plan para no perder acceso a tus datos.',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      };
    }
  };

  const config = getAlertConfig();
  const IconComponent = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 mb-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className={`${config.textColor} font-semibold text-sm mb-1`}>
              {config.title}
            </h3>
            <p className={`${config.textColor} text-sm mb-3`}>
              {config.message}
            </p>
            <div className="flex items-center space-x-3">
              <Link
                href="/plans"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  config.type === 'error'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : config.type === 'warning'
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Crown className="w-4 h-4 mr-2" />
                Ver Planes
              </Link>
              <Link
                href="/pricing"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  config.type === 'error'
                    ? 'border-red-300 text-red-700 hover:bg-red-100'
                    : config.type === 'warning'
                    ? 'border-orange-300 text-orange-700 hover:bg-orange-100'
                    : 'border-blue-300 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Comparar Precios
              </Link>
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
