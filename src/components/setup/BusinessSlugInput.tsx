'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface BusinessSlugInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: (isValid: boolean) => void;
  className?: string;
}

interface SlugCheckResponse {
  available: boolean;
  reason?: string;
  error?: string;
  message?: string;
  suggestions?: string[];
  preview?: string;
}

export function BusinessSlugInput({
  value,
  onChange,
  onValidate,
  className = ''
}: BusinessSlugInputProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<SlugCheckResponse | null>(null);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounce del valor
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  // Verificar disponibilidad cuando cambia el valor debounced
  const checkAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setCheckResult(null);
      onValidate(false);
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch(`/api/slug/check?slug=${encodeURIComponent(slug)}`);
      const data: SlugCheckResponse = await response.json();

      setCheckResult(data);
      onValidate(data.available);
    } catch (error) {
      console.error('Error checking slug:', error);
      setCheckResult({
        available: false,
        error: 'Error al verificar disponibilidad'
      });
      onValidate(false);
    } finally {
      setIsChecking(false);
    }
  }, [onValidate]);

  useEffect(() => {
    if (debouncedValue) {
      checkAvailability(debouncedValue);
    }
  }, [debouncedValue, checkAvailability]);

  // Normalizar input (lowercase, sin espacios, solo guiones)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.toLowerCase();
    // Reemplazar espacios por guiones
    newValue = newValue.replace(/\s+/g, '-');
    // Solo permitir letras, números y guiones
    newValue = newValue.replace(/[^a-z0-9-]/g, '');
    // Evitar guiones múltiples
    newValue = newValue.replace(/--+/g, '-');
    
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input principal */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm md:text-base whitespace-nowrap">
            agendalook.cl/
          </span>
          <div className="relative flex-1">
            <Input
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="tu-negocio"
              className="pr-10"
            />
            {/* Indicador de estado */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isChecking && (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              )}
              {!isChecking && checkResult && (
                <>
                  {checkResult.available ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {checkResult && !isChecking && (
        <div className="space-y-2">
          {checkResult.available ? (
            <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{checkResult.message || '¡Disponible!'}</p>
                {checkResult.preview && (
                  <p className="text-green-700 mt-1 text-xs">
                    Tu agenda: <span className="font-mono">{checkResult.preview}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{checkResult.message || checkResult.error}</p>
              </div>

              {/* Sugerencias */}
              {checkResult.suggestions && checkResult.suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">
                    Intenta con estas opciones:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {checkResult.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ayuda */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Mínimo 3 caracteres, máximo 50</p>
        <p>• Solo letras, números y guiones</p>
        <p>• Sin espacios ni caracteres especiales</p>
      </div>
    </div>
  );
}



