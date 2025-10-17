'use client';

import { useState } from 'react';
import { Clock, X, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TrialBannerProps {
  daysRemaining: number;
  onUpgrade: () => void;
  onDismiss?: () => void;
  plan?: string;
}

export function TrialBanner({
  daysRemaining,
  onUpgrade,
  onDismiss,
  plan = 'Look'
}: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  // Determinar el estilo según los días restantes
  const isUrgent = daysRemaining <= 7;
  const isCritical = daysRemaining <= 3;

  const getBannerStyles = () => {
    if (isCritical) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-500',
        button: 'bg-red-600 hover:bg-red-700'
      };
    }
    if (isUrgent) {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        icon: 'text-orange-500',
        button: 'bg-orange-600 hover:bg-orange-700'
      };
    }
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700'
    };
  };

  const styles = getBannerStyles();

  const getMessage = () => {
    if (isCritical) {
      return `¡Solo ${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'} de trial!`;
    }
    if (isUrgent) {
      return `${daysRemaining} días restantes de tu trial`;
    }
    return `Estás en período de prueba - ${daysRemaining} días restantes`;
  };

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} border-b
        px-4 py-3 shadow-sm
        animate-in slide-in-from-top duration-300
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Contenido principal */}
          <div className="flex items-center gap-3 flex-1">
            {/* Icono */}
            <div className={`${styles.icon} flex-shrink-0`}>
              {isCritical ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className={`${styles.text} text-sm md:text-base font-medium`}>
                {getMessage()}
              </p>
              <p className={`${styles.text} text-xs md:text-sm opacity-80 mt-0.5`}>
                Plan {plan} - Actualiza ahora para seguir disfrutando de todas las funciones
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={onUpgrade}
              className={`
                ${styles.button} text-white
                px-4 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200
                flex items-center gap-2
              `}
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Actualizar Plan</span>
              <span className="sm:hidden">Actualizar</span>
            </Button>

            {onDismiss && !isCritical && (
              <button
                onClick={handleDismiss}
                className={`
                  ${styles.text} opacity-60 hover:opacity-100
                  p-1 rounded transition-opacity
                `}
                aria-label="Cerrar banner"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Barra de progreso */}
        {daysRemaining <= 15 && (
          <div className="mt-3">
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${isCritical ? 'bg-red-500' : isUrgent ? 'bg-orange-500' : 'bg-blue-500'} transition-all duration-500`}
                style={{ width: `${(daysRemaining / 30) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



