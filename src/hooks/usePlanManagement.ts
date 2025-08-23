'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  gradient: string;
}

export interface PaymentData {
  plan: Plan;
  userEmail: string;
  userId: string;
}

export function usePlanManagement() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const selectPlan = useCallback(async (plan: Plan) => {
    setSelectedPlan(plan);
    setIsLoading(true);
    
    try {
      if (plan.id === 'free') {
        // Plan gratuito - ir directo a onboarding
        console.log('Plan gratuito seleccionado');
        router.push('/onboarding');
      } else {
        // Plan de pago - ir a página de pago premium
        console.log(`Plan ${plan.name} seleccionado`);
        router.push(`/payment?plan=${plan.id}`);
      }
    } catch (error) {
      console.error('Error al seleccionar el plan:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const processPayment = useCallback(async (paymentData: PaymentData) => {
    setIsProcessing(true);
    
    try {
      // 1. Crear preferencia en MercadoPago
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: paymentData.plan.id,
          userEmail: paymentData.userEmail,
          userId: paymentData.userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago');
      }

      const { init_point } = await response.json();
      
      // 2. Redirigir a MercadoPago
      window.location.href = init_point;
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      console.error('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getCurrentPlan = useCallback(() => {
    return selectedPlan;
  }, [selectedPlan]);

  const resetSelection = useCallback(() => {
    setSelectedPlan(null);
    setIsProcessing(false);
    setIsLoading(false);
  }, []);

  return {
    selectedPlan,
    isProcessing,
    isLoading,
    selectPlan,
    processPayment,
    getCurrentPlan,
    resetSelection,
  };
}
