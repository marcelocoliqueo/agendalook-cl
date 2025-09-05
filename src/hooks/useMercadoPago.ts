'use client';
import { useState, useCallback, useEffect } from 'react';
import { MercadoPagoConfig, CardToken } from '@mercadopago/sdk-js';

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
          throw new Error('MERCADOPAGO_PUBLIC_KEY no está configurado');
        }

        // Configurar MercadoPago
        const mpConfig = new MercadoPagoConfig({
          publicKey: publicKey,
          options: {
            locale: 'es-CL',
            advancedFraudPrevention: true,
          }
        });

        // Verificar que la configuración es válida
        if (!mpConfig) {
          throw new Error('Error al configurar MercadoPago');
        }

        setIsInitialized(true);
        console.log('✅ MercadoPago SDK inicializado correctamente');
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

      const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('MERCADOPAGO_PUBLIC_KEY no está configurado');
      }

      const mpConfig = new MercadoPagoConfig({
        publicKey: publicKey,
        options: {
          locale: 'es-CL',
          advancedFraudPrevention: true,
        }
      });

      const cardToken = new CardToken(mpConfig);

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

      const result = await cardToken.create({ body: tokenData });
      
      if (!result.id) {
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
