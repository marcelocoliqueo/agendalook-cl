'use client';
import { useState, useCallback } from 'react';
import { useMercadoPago } from '@/hooks/useMercadoPago';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface CardFormProps {
  onTokenGenerated: (token: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  planName: string;
  planPrice: number;
}

interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

const IDENTIFICATION_TYPES = [
  { value: 'RUT', label: 'RUT' },
  { value: 'DNI', label: 'DNI' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'CI', label: 'Cédula de Identidad' }
];

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') };
});

const YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: year.toString(), label: year.toString() };
});

export function CardForm({ onTokenGenerated, onError, isLoading = false, planName, planPrice }: CardFormProps) {
  const { isInitialized, generateCardToken, error: mpError, clearError } = useMercadoPago();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardholderName: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    identificationType: 'RUT',
    identificationNumber: ''
  });
  const [errors, setErrors] = useState<Partial<CardData>>({});

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espacios
  };

  const formatRUT = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 1) return cleaned;
    
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    if (body.length <= 7) {
      return body.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
    }
    
    return body.slice(0, 7).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
  };

  const validateCardData = (): boolean => {
    const newErrors: Partial<CardData> = {};

    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    if (!cardData.cardholderName || cardData.cardholderName.length < 2) {
      newErrors.cardholderName = 'Nombre del titular es requerido';
    }

    if (!cardData.expirationMonth) {
      newErrors.expirationMonth = 'Mes de vencimiento es requerido';
    }

    if (!cardData.expirationYear) {
      newErrors.expirationYear = 'Año de vencimiento es requerido';
    }

    if (!cardData.securityCode || cardData.securityCode.length < 3) {
      newErrors.securityCode = 'Código de seguridad inválido';
    }

    if (!cardData.identificationNumber || cardData.identificationNumber.length < 7) {
      newErrors.identificationNumber = 'Número de identificación inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInitialized) {
      onError('MercadoPago no está inicializado');
      return;
    }

    if (!validateCardData()) {
      return;
    }

    setIsProcessing(true);
    clearError();

    try {
      console.log('🔍 Generando card token para plan:', planName);
      const token = await generateCardToken(cardData);
      console.log('✅ Card token generado exitosamente');
      onTokenGenerated(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generando token de tarjeta';
      console.error('❌ Error generando card token:', errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [isInitialized, cardData, planName, generateCardToken, onTokenGenerated, onError, clearError]);

  const handleInputChange = (field: keyof CardData, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'identificationNumber' && cardData.identificationType === 'RUT') {
      formattedValue = formatRUT(value);
    } else if (field === 'securityCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'cardholderName') {
      formattedValue = value.toUpperCase();
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isInitialized) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Inicializando MercadoPago...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-sky-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Completar Suscripción
        </h3>
        <p className="text-slate-600">
          Plan <span className="font-semibold text-sky-600">{planName}</span> - ${planPrice.toLocaleString()}/mes
        </p>
      </div>

      {(mpError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error de validación</p>
              <p className="text-red-700 text-sm mt-1">
                {mpError}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Número de tarjeta */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Número de tarjeta
          </label>
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
              errors.cardNumber ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            maxLength={19}
          />
          {errors.cardNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Nombre del titular */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre del titular
          </label>
          <input
            type="text"
            value={cardData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="JUAN PEREZ"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
              errors.cardholderName ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
          />
          {errors.cardholderName && (
            <p className="text-red-600 text-sm mt-1">{errors.cardholderName}</p>
          )}
        </div>

        {/* Fecha de vencimiento */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mes
            </label>
            <select
              value={cardData.expirationMonth}
              onChange={(e) => handleInputChange('expirationMonth', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                errors.expirationMonth ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            >
              <option value="">MM</option>
              {MONTHS.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            {errors.expirationMonth && (
              <p className="text-red-600 text-sm mt-1">{errors.expirationMonth}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Año
            </label>
            <select
              value={cardData.expirationYear}
              onChange={(e) => handleInputChange('expirationYear', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                errors.expirationYear ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            >
              <option value="">AAAA</option>
              {YEARS.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
            {errors.expirationYear && (
              <p className="text-red-600 text-sm mt-1">{errors.expirationYear}</p>
            )}
          </div>
        </div>

        {/* Código de seguridad */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Código de seguridad
          </label>
          <input
            type="text"
            value={cardData.securityCode}
            onChange={(e) => handleInputChange('securityCode', e.target.value)}
            placeholder="123"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
              errors.securityCode ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            maxLength={4}
          />
          {errors.securityCode && (
            <p className="text-red-600 text-sm mt-1">{errors.securityCode}</p>
          )}
        </div>

        {/* Identificación */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de identificación
            </label>
            <select
              value={cardData.identificationType}
              onChange={(e) => handleInputChange('identificationType', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            >
              {IDENTIFICATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Número de identificación
            </label>
            <input
              type="text"
              value={cardData.identificationNumber}
              onChange={(e) => handleInputChange('identificationNumber', e.target.value)}
              placeholder={cardData.identificationType === 'RUT' ? '12.345.678-9' : '12345678'}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                errors.identificationNumber ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.identificationNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.identificationNumber}</p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isProcessing || isLoading}
          className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Procesando...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-3" />
              Confirmar Suscripción
            </>
          )}
        </button>

        {/* Información de seguridad */}
        <div className="text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            Tus datos están protegidos con encriptación SSL
          </p>
        </div>
      </form>
    </div>
  );
}
