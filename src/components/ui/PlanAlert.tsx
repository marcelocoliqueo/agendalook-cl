'use client';

import { useState } from 'react';
import { AlertTriangle, X, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { PLANS, getCurrentPlan, getUsageProgress, getAlertMessage, hasReachedLimit } from '@/lib/plans';

interface PlanAlertProps {
  plan: string;
  currentBookings: number;
  currentServices: number;
  onUpgrade?: () => void;
}

export function PlanAlert({ plan, currentBookings, currentServices, onUpgrade }: PlanAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const currentPlan = getCurrentPlan(plan);
  const planDetails = PLANS[currentPlan];
  const usage = getUsageProgress(currentPlan, currentBookings, currentServices);
  const alertMessage = getAlertMessage(currentPlan, currentBookings, currentServices);

  if (!isVisible || !alertMessage) {
    return null;
  }

  const isNearLimit = usage.bookings.percentage >= 80 || usage.services.percentage >= 80;
  const isAtLimit = hasReachedLimit(currentPlan, currentBookings, currentServices);

  return (
    <div className={`rounded-lg border p-4 mb-6 ${
      isAtLimit 
        ? 'bg-red-50 border-red-200 text-red-800' 
        : 'bg-amber-50 border-amber-200 text-amber-800'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${
            isAtLimit ? 'text-red-500' : 'text-amber-500'
          }`} />
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${
              isAtLimit ? 'text-red-800' : 'text-amber-800'
            }`}>
              {isAtLimit ? 'Límite alcanzado' : 'Límite próximo'}
            </h3>
            <p className="text-sm mb-3">
              {alertMessage}
            </p>
            
            {/* Progreso de uso */}
            <div className="space-y-2 mb-4">
              {usage.bookings.limit !== null && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Reservas este mes</span>
                    <span>{usage.bookings.current}/{usage.bookings.limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        usage.bookings.percentage >= 100 
                          ? 'bg-red-500' 
                          : usage.bookings.percentage >= 80 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${usage.bookings.percentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              {usage.services.limit !== null && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Servicios</span>
                    <span>{usage.services.current}/{usage.services.limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        usage.services.percentage >= 100 
                          ? 'bg-red-500' 
                          : usage.services.percentage >= 80 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${usage.services.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Planes disponibles */}
            <div className="bg-white rounded-lg p-3 border">
              <h4 className="font-medium text-gray-800 mb-2">Planes disponibles:</h4>
              <div className="space-y-2">
                {Object.entries(PLANS).map(([planKey, planInfo]) => {
                  if (planKey === currentPlan) return null;
                  
                  return (
                    <div key={planKey} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className={`font-medium ${planInfo.color}`}>
                          {planInfo.name}
                        </span>
                        <p className="text-xs text-gray-600">
                          {planInfo.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.location.href = '/upgrade'}
                        className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Actualizar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 