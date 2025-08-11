"use client";

import { useState, useMemo } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { isMercadoPagoSandbox } from '@/lib/mercadopago';

interface SubscriptionButtonProps {
  plan: 'pro' | 'studio';
  currentPlan: string;
  className?: string;
}

export default function SubscriptionButton({ 
  plan, 
  currentPlan, 
  className = '' 
}: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const isSandbox = useMemo(() => isMercadoPagoSandbox(), []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Crear preferencia de pago
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}/dashboard/settings?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/settings?canceled=true`,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        console.error('Create preference error payload:', payload);
        const mode = payload?.mode || (isSandbox ? 'sandbox' : 'real');
        alert(`No se pudo crear la preferencia (${mode}). ${payload?.detail || payload?.error || 'Inténtalo de nuevo.'}`);
        return;
      }
      const { initPoint } = payload;
      window.location.href = initPoint;
    } catch (error) {
      console.error('Error creating Mercado Pago preference:', error);
      alert('Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan = currentPlan === plan;
  const isUpgrade = currentPlan === 'free' || (currentPlan === 'pro' && plan === 'studio');

  return (
    <div className="inline-flex flex-col">
      <button
      onClick={handleSubscribe}
      disabled={loading || isCurrentPlan}
      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isCurrentPlan
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : isUpgrade
          ? 'bg-gradient-to-r from-lavender-500 to-coral-500 text-white hover:shadow-lg hover:scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Procesando...
        </>
      ) : isCurrentPlan ? (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Plan Actual
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          {isUpgrade ? 'Suscribirse' : 'Cambiar Plan'}
        </>
      )}
      </button>
      {isSandbox && (
        <div className="mt-2 inline-flex items-center px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 border border-yellow-200 self-center">
          Modo Prueba
        </div>
      )}
    </div>
  );
} 