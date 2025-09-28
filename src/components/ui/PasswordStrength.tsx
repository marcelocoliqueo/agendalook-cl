'use client';

import { useState, useEffect } from 'react';
import { validatePasswordSecurity, getPasswordStrengthText, getPasswordStrengthColor } from '@/lib/password-security';

interface PasswordStrengthProps {
  password: string;
  showDetails?: boolean;
}

export function PasswordStrength({ password, showDetails = false }: PasswordStrengthProps) {
  const [validation, setValidation] = useState(validatePasswordSecurity(password));

  useEffect(() => {
    setValidation(validatePasswordSecurity(password));
  }, [password]);

  if (!password) return null;

  const strengthText = getPasswordStrengthText(validation.score);
  const strengthColor = getPasswordStrengthColor(validation.score);

  return (
    <div className="space-y-2">
      {/* Barra de progreso */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              validation.score >= 70 ? 'bg-green-500' :
              validation.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${validation.score}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${strengthColor}`}>
          {strengthText}
        </span>
      </div>

      {/* Detalles si se solicitan */}
      {showDetails && (
        <div className="space-y-1">
          {validation.issues.length > 0 && (
            <div className="text-sm text-red-600">
              <strong>Problemas:</strong>
              <ul className="list-disc list-inside ml-2">
                {validation.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validation.suggestions.length > 0 && (
            <div className="text-sm text-blue-600">
              <strong>Sugerencias:</strong>
              <ul className="list-disc list-inside ml-2">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


