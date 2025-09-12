'use client';
import { useState, useCallback, useEffect } from 'react';

interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

interface UseMercadoPagoReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  generateCardToken: (cardData: CardData) => Promise<string>;
  clearError: () => void;
}

export function useMercadoPago(): UseMercadoPagoReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMercadoPago = async () => {
      try {
        setIsLoading(true);
        
        // Verificar que tenemos la public key
        const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
        if (!publicKey) {
          throw new Error('NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no está configurado');
        }

        console.log('🔧 Configurando MercadoPago en frontend...');
        console.log('Public Key:', publicKey.substring(0, 20) + '...');

        // Simular inicialización exitosa
        setIsInitialized(true);
        console.log('✅ MercadoPago inicializado correctamente');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error('❌ Error inicializando MercadoPago:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMercadoPago();
  }, []);

  const generateCardToken = useCallback(async (cardData: CardData): Promise<string> => {
    if (!isInitialized) {
      throw new Error('MercadoPago no está inicializado');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Generando card token para tarjeta:', {
        cardNumber: cardData.cardNumber.replace(/\d(?=\d{4})/g, '*'),
        cardholderName: cardData.cardholderName,
        expirationMonth: cardData.expirationMonth,
        expirationYear: cardData.expirationYear,
        identificationType: cardData.identificationType,
        identificationNumber: cardData.identificationNumber.replace(/\d(?=\d{2})/g, '*')
      });

      // Usar la API de MercadoPago directamente
      const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no está configurado');
      }

      const tokenData = {
        card_number: cardData.cardNumber.replace(/\s/g, ''),
        security_code: cardData.securityCode,
        expiration_month: parseInt(cardData.expirationMonth, 10),
        expiration_year: parseInt(cardData.expirationYear, 10),
        cardholder: {
          name: cardData.cardholderName,
          identification: {
            type: cardData.identificationType,
            number: cardData.identificationNumber
          }
        }
      };

      console.log('📋 Datos del token (sin datos sensibles):', {
        card_number: tokenData.card_number.replace(/\d(?=\d{4})/g, '*'),
        security_code: '***',
        expiration_month: tokenData.expiration_month,
        expiration_year: tokenData.expiration_year,
        cardholder_name: tokenData.cardholder.name,
        identification_type: tokenData.cardholder.identification.type,
        identification_number: tokenData.cardholder.identification.number.replace(/\d(?=\d{2})/g, '*')
      });

      // Llamar a nuestra API para generar el card token
      const response = await fetch('/api/mercadopago/generate-card-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de la API:', errorData);
        throw new Error(errorData.error || errorData.message || 'Error generando card token');
      }

      const result = await response.json();
      
      if (!result.id) {
        console.error('❌ Respuesta sin ID:', result);
        throw new Error('No se pudo generar el card token');
      }

      console.log('✅ Card token generado exitosamente:', result.id);
      return result.id;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error generando card token';
      console.error('❌ Error generando card token:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    generateCardToken,
    clearError
  };
}
