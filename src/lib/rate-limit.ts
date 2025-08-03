interface RateLimitConfig {
  interval: number; // en milisegundos
  uniqueTokenPerInterval: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(token: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now();
    const key = token;
    
    // Limpiar entradas expiradas
    this.cleanup(now);

    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.config.interval,
      };
    }

    const entry = this.store[key];

    // Si el intervalo ha expirado, resetear
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.config.interval;
    }

    // Incrementar contador
    entry.count++;

    const success = entry.count <= this.config.uniqueTokenPerInterval;
    const remaining = Math.max(0, this.config.uniqueTokenPerInterval - entry.count);

    return {
      success,
      limit: this.config.uniqueTokenPerInterval,
      remaining,
      reset: entry.resetTime,
    };
  }

  private cleanup(now: number): void {
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }
}

// Configuraciones predefinidas
export const rateLimitConfigs = {
  // Rate limit estricto para login/registro
  auth: {
    interval: 15 * 60 * 1000, // 15 minutos
    uniqueTokenPerInterval: 5, // 5 intentos por 15 minutos
  },
  // Rate limit moderado para APIs
  api: {
    interval: 60 * 1000, // 1 minuto
    uniqueTokenPerInterval: 30, // 30 requests por minuto
  },
  // Rate limit para webhooks
  webhook: {
    interval: 60 * 1000, // 1 minuto
    uniqueTokenPerInterval: 10, // 10 webhooks por minuto
  },
};

// Instancias de rate limiters
export const authRateLimiter = new RateLimiter(rateLimitConfigs.auth);
export const apiRateLimiter = new RateLimiter(rateLimitConfigs.api);
export const webhookRateLimiter = new RateLimiter(rateLimitConfigs.webhook);

// Función helper para obtener IP del cliente
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0] || realIP || cfConnectingIP || 'unknown';
}

// Función helper para aplicar rate limiting
export async function applyRateLimit(
  request: Request, 
  limiter: RateLimiter,
  identifier?: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const ip = getClientIP(request);
  const token = identifier || ip;
  
  return await limiter.check(token);
} 