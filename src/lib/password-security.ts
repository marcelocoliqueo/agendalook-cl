/**
 * Sistema de validación de contraseñas comprometidas
 * Mitiga el warning "Leaked Password Protection Disabled"
 */

// Lista de contraseñas comunes comprometidas
const COMMON_COMPROMISED_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'qwerty123', 'dragon', 'master', 'hello', 'freedom', 'whatever',
  'qazwsx', 'trustno1', '654321', 'jordan23', 'harley', 'password12',
  'superman', 'qwertyuiop', 'michael', 'football', 'shadow', 'monkey123',
  '1234567', '12345678', '123456789', '1234567890', 'qwerty123456',
  'agendalook', 'agendalook123', 'agenda', 'booking', 'appointment'
];

// Patrones de contraseñas débiles
const WEAK_PATTERNS = [
  /^.{1,7}$/, // Menos de 8 caracteres
  /^[0-9]+$/, // Solo números
  /^[a-zA-Z]+$/, // Solo letras
  /^(.)\1+$/, // Caracteres repetidos
  /^[a-z]+$/, // Solo minúsculas
  /^[A-Z]+$/, // Solo mayúsculas
  /123456/, // Secuencias numéricas
  /qwerty/, // Secuencias de teclado
  /password/i, // Palabra "password"
  /admin/i, // Palabra "admin"
  /user/i, // Palabra "user"
  /test/i, // Palabra "test"
  /demo/i, // Palabra "demo"
];

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  suggestions: string[];
}

export function validatePasswordSecurity(password: string): PasswordValidationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Verificar contraseñas comprometidas comunes
  if (COMMON_COMPROMISED_PASSWORDS.includes(password.toLowerCase())) {
    issues.push('Contraseña comúnmente comprometida');
    score -= 50;
    suggestions.push('Usa una contraseña única y compleja');
  }

  // Verificar patrones débiles
  for (const pattern of WEAK_PATTERNS) {
    if (pattern.test(password)) {
      if (pattern.source === '^.{1,7}$') {
        issues.push('Muy corta (mínimo 8 caracteres)');
        score -= 20;
        suggestions.push('Usa al menos 8 caracteres');
      } else if (pattern.source === '^[0-9]+$') {
        issues.push('Solo contiene números');
        score -= 15;
        suggestions.push('Incluye letras y símbolos');
      } else if (pattern.source === '^[a-zA-Z]+$') {
        issues.push('Solo contiene letras');
        score -= 15;
        suggestions.push('Incluye números y símbolos');
      } else if (pattern.source === '^(.)\\1+$') {
        issues.push('Caracteres repetidos');
        score -= 10;
        suggestions.push('Usa caracteres variados');
      } else if (pattern.source === '^[a-z]+$') {
        issues.push('Solo minúsculas');
        score -= 10;
        suggestions.push('Incluye mayúsculas');
      } else if (pattern.source === '^[A-Z]+$') {
        issues.push('Solo mayúsculas');
        score -= 10;
        suggestions.push('Incluye minúsculas');
      } else if (pattern.source === '123456') {
        issues.push('Secuencia numérica común');
        score -= 15;
        suggestions.push('Evita secuencias numéricas');
      } else if (pattern.source === 'qwerty') {
        issues.push('Secuencia de teclado común');
        score -= 15;
        suggestions.push('Evita secuencias de teclado');
      } else if (pattern.source === 'password/i') {
        issues.push('Contiene palabra "password"');
        score -= 20;
        suggestions.push('No uses la palabra "password"');
      } else if (pattern.source === 'admin/i') {
        issues.push('Contiene palabra "admin"');
        score -= 20;
        suggestions.push('No uses la palabra "admin"');
      }
    }
  }

  // Verificar fortaleza positiva
  if (password.length >= 12) {
    score += 10;
  }
  if (/[A-Z]/.test(password)) {
    score += 5;
  }
  if (/[a-z]/.test(password)) {
    score += 5;
  }
  if (/[0-9]/.test(password)) {
    score += 5;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 10;
  }

  // Asegurar que el score esté entre 0 y 100
  score = Math.max(0, Math.min(100, score));

  // Sugerencias adicionales si el score es bajo
  if (score < 70) {
    suggestions.push('Usa una combinación de mayúsculas, minúsculas, números y símbolos');
    suggestions.push('Evita información personal como nombres o fechas');
    suggestions.push('Considera usar una frase de contraseña única');
  }

  return {
    isValid: score >= 70 && issues.length === 0,
    score,
    issues,
    suggestions
  };
}

export function getPasswordStrengthText(score: number): string {
  if (score >= 90) return 'Muy fuerte';
  if (score >= 70) return 'Fuerte';
  if (score >= 50) return 'Moderada';
  if (score >= 30) return 'Débil';
  return 'Muy débil';
}

export function getPasswordStrengthColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}


