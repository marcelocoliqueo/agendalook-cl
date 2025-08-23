'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  color: string;
  gradient: string;
  bgColor: string;
  borderColor: string;
  icon: any;
  popular: boolean;
}

export interface PaymentData {
  plan: Plan;
  userEmail: string;
  userId: string;
}

export interface SubscriptionPlanResponse {
  id: string;
  plan_id: string;
  type: string;
  message: string;
  next_step: string;
}

export function usePlanManagement() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlanResponse | null>(null);
  const router = useRouter();

  const selectPlan = useCallback(async (plan: Plan) => {
    setSelectedPlan(plan);
    setIsLoading(true);
    try {
      if (plan.id === 'free') {
        console.log('Plan gratuito seleccionado');
        router.push('/onboarding');
      } else {
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
      console.log('🔍 Iniciando proceso de suscripción para plan:', paymentData.plan.id);
      
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: paymentData.plan.id,
          userEmail: paymentData.userEmail,
          userId: paymentData.userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear plan de suscripción');
      }

      const subscriptionData: SubscriptionPlanResponse = await response.json();
      console.log('🔍 Plan de suscripción creado:', subscriptionData);
      
      setSubscriptionPlan(subscriptionData);

      if (subscriptionData.type === 'subscription_plan') {
        // El plan se creó exitosamente, ahora necesitamos validar tarjeta
        console.log('✅ Plan de suscripción creado. Próximo paso: validación de tarjeta');
        
        // Por ahora, redirigir al dashboard con mensaje de éxito
        // En el futuro, aquí iría la lógica de validación de tarjeta
        router.push('/dashboard?subscription=success&plan=' + paymentData.plan.id);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }

    } catch (error) {
      console.error('Error al procesar la suscripción:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [router]);

  const createSubscriptionWithCard = useCallback(async (cardTokenId: string) => {
    if (!subscriptionPlan || !selectedPlan) {
      throw new Error('Plan de suscripción no disponible');
    }

    setIsProcessing(true);
    try {
      console.log('🔍 Creando suscripción con tarjeta:', cardTokenId);
      
      // Aquí iría la llamada a la API para crear la suscripción con el card_token_id
      // Por ahora, simulamos el éxito
      console.log('✅ Suscripción creada exitosamente');
      
      // Redirigir al dashboard
      router.push('/dashboard?subscription=active&plan=' + selectedPlan.id);
      
    } catch (error) {
      console.error('Error al crear la suscripción con tarjeta:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [subscriptionPlan, selectedPlan, router]);

  return { 
    selectedPlan, 
    isProcessing, 
    isLoading, 
    subscriptionPlan,
    selectPlan, 
    processPayment,
    createSubscriptionWithCard
  };
}
