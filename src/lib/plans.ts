export type PlanType = 'free' | 'pro' | 'studio';
export type SubscriptionStatus = 'active' | 'pending_payment' | 'grace_period' | 'suspended' | 'cancelled' | 'past_due';

export interface PlanLimits {
  maxServices: number | null;
  maxBookingsPerMonth: number | null;
  whatsappReminders: boolean;
  customSubdomain: boolean;
  clientHistory: boolean;
  priceCLP: number;
}

export interface PlanDetails {
  name: string;
  price: number;
  description: string;
  features: string[];
  limits: PlanLimits;
  color: string;
}

export interface SubscriptionState {
  status: SubscriptionStatus;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  gracePeriodStart?: Date;
  suspensionDate?: Date;
  cancellationDate?: Date;
  daysSinceLastPayment: number;
  totalPaymentsReceived: number;
  totalAmountPaid: number;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxServices: 3,
    maxBookingsPerMonth: 10,
    whatsappReminders: false,
    customSubdomain: false,
    clientHistory: false,
    priceCLP: 0,
  },
  pro: {
    maxServices: null,
    maxBookingsPerMonth: null,
    whatsappReminders: false,
    customSubdomain: true,
    clientHistory: true,
    priceCLP: 9990,
  },
  studio: {
    maxServices: null,
    maxBookingsPerMonth: null,
    whatsappReminders: true,
    customSubdomain: true,
    clientHistory: true,
    priceCLP: 19990,
  },
};

export const PLANS: Record<PlanType, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Perfecto para empezar',
    color: 'text-gray-600',
    features: [
      'Hasta 10 reservas por mes',
      'Máximo 3 servicios',
      'Página pública personalizada',
      'Notificaciones por email',
      'Soporte por email'
    ],
    limits: PLAN_LIMITS.free,
  },
  pro: {
    name: 'Pro',
    price: 9990,
    description: 'Para profesionales establecidos',
    color: 'text-lavender-600',
    features: [
      'Reservas ilimitadas',
      'Servicios ilimitados',
      'Subdominio personalizado',
      'Historial de clientes',
      'Analytics avanzados',
      'Soporte prioritario',
      'Sin marca de Agendalook'
    ],
    limits: PLAN_LIMITS.pro,
  },
  studio: {
    name: 'Studio',
    price: 19990,
    description: 'Para estudios y equipos',
    color: 'text-coral-600',
    features: [
      'Todo de Pro',
      'Recordatorios WhatsApp',
      'Múltiples usuarios',
      'Gestión de equipo',
      'Personalización completa',
      'API personalizada',
      'Soporte dedicado'
    ],
    limits: PLAN_LIMITS.studio,
  },
};

// Función para obtener límites de un plan
export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLAN_LIMITS[plan];
}

// Función para verificar si un plan tiene una característica
export function hasFeature(plan: PlanType, feature: keyof PlanLimits): boolean {
  const value = PLAN_LIMITS[plan][feature];
  return typeof value === 'boolean' ? value : false;
}

// Función para obtener el plan actual (con fallback a free)
export function getCurrentPlan(plan?: string | null): PlanType {
  if (!plan || !(plan in PLAN_LIMITS)) {
    return 'free';
  }
  return plan as PlanType;
}

// Función para formatear precio
export function formatPlanPrice(price: number): string {
  if (price === 0) return 'Gratis';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
}

// Función para verificar si se puede crear más reservas
export function canCreateBooking(
  plan: PlanType,
  currentBookingsThisMonth: number
): boolean {
  const limits = getPlanLimits(plan);
  return limits.maxBookingsPerMonth === null || 
         currentBookingsThisMonth < limits.maxBookingsPerMonth;
}

// Función para verificar si se puede crear más servicios
export function canCreateService(
  plan: PlanType,
  currentServices: number
): boolean {
  const limits = getPlanLimits(plan);
  return limits.maxServices === null || 
         currentServices < limits.maxServices;
}

// Función para obtener el progreso de uso
export function getUsageProgress(
  plan: PlanType,
  currentBookings: number,
  currentServices: number
): {
  bookings: { current: number; limit: number | null; percentage: number };
  services: { current: number; limit: number | null; percentage: number };
} {
  const limits = getPlanLimits(plan);
  
  const bookingsProgress = {
    current: currentBookings,
    limit: limits.maxBookingsPerMonth,
    percentage: limits.maxBookingsPerMonth === null 
      ? 0 
      : Math.min((currentBookings / limits.maxBookingsPerMonth) * 100, 100)
  };
  
  const servicesProgress = {
    current: currentServices,
    limit: limits.maxServices,
    percentage: limits.maxServices === null 
      ? 0 
      : Math.min((currentServices / limits.maxServices) * 100, 100)
  };
  
  return { bookings: bookingsProgress, services: servicesProgress };
}

// Función para obtener mensaje de alerta
export function getAlertMessage(
  plan: PlanType,
  currentBookings: number,
  currentServices: number
): string | null {
  const limits = getPlanLimits(plan);
  
  // Alerta por reservas
  if (limits.maxBookingsPerMonth !== null && 
      currentBookings >= limits.maxBookingsPerMonth * 0.8) {
    return `Has usado ${currentBookings}/${limits.maxBookingsPerMonth} reservas este mes. Considera actualizar tu plan.`;
  }
  
  // Alerta por servicios
  if (limits.maxServices !== null && 
      currentServices >= limits.maxServices * 0.8) {
    return `Has usado ${currentServices}/${limits.maxServices} servicios. Considera actualizar tu plan.`;
  }
  
  return null;
}

// Función para verificar si se alcanzó algún límite
export function hasReachedLimit(
  plan: PlanType,
  currentBookings: number,
  currentServices: number
): boolean {
  const limits = getPlanLimits(plan);
  
  const bookingsLimit = limits.maxBookingsPerMonth !== null && 
                       currentBookings >= limits.maxBookingsPerMonth;
  
  const servicesLimit = limits.maxServices !== null && 
                       currentServices >= limits.maxServices;
  
  return bookingsLimit || servicesLimit;
}

// ===== NUEVAS FUNCIONES PARA SISTEMA DE SUSCRIPCIONES =====

// Función para obtener el estado de suscripción
export function getSubscriptionStatus(status?: string | null): SubscriptionStatus {
  if (!status || !['active', 'pending_payment', 'grace_period', 'suspended', 'cancelled', 'past_due'].includes(status)) {
    return 'active';
  }
  return status as SubscriptionStatus;
}

// Función para verificar si la suscripción está activa
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === 'active';
}

// Función para verificar si la suscripción está en período de gracia
export function isInGracePeriod(status: SubscriptionStatus): boolean {
  return status === 'grace_period';
}

// Función para verificar si la suscripción está suspendida
export function isSuspended(status: SubscriptionStatus): boolean {
  return status === 'suspended';
}

// Función para verificar si la suscripción está cancelada
export function isCancelled(status: SubscriptionStatus): boolean {
  return status === 'cancelled';
}

// Función para obtener el color del estado de suscripción
export function getSubscriptionStatusColor(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'pending_payment':
      return 'text-yellow-600 bg-yellow-100';
    case 'grace_period':
      return 'text-orange-600 bg-orange-100';
    case 'suspended':
      return 'text-red-600 bg-red-100';
    case 'cancelled':
      return 'text-gray-600 bg-gray-100';
    case 'past_due':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Función para obtener el texto del estado de suscripción
export function getSubscriptionStatusText(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'Activa';
    case 'pending_payment':
      return 'Pago Pendiente';
    case 'grace_period':
      return 'Período de Gracia';
    case 'suspended':
      return 'Suspendida';
    case 'cancelled':
      return 'Cancelada';
    case 'past_due':
      return 'Vencida';
    default:
      return 'Desconocido';
  }
}

// Función para calcular días hasta el próximo pago
export function getDaysUntilNextPayment(nextPaymentDate?: Date): number {
  if (!nextPaymentDate) return 0;
  const now = new Date();
  const diffTime = nextPaymentDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Función para verificar si necesita renovación
export function needsRenewal(daysUntilNextPayment: number): boolean {
  return daysUntilNextPayment <= 7;
}

// Función para obtener el progreso del período de gracia
export function getGracePeriodProgress(gracePeriodStart?: Date): number {
  if (!gracePeriodStart) return 0;
  const now = new Date();
  const gracePeriodEnd = new Date(gracePeriodStart.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 días
  const totalGracePeriod = 7 * 24 * 60 * 60 * 1000; // 7 días en ms
  const elapsed = now.getTime() - gracePeriodStart.getTime();
  const progress = Math.min((elapsed / totalGracePeriod) * 100, 100);
  return Math.max(0, progress);
}

// Función para formatear cantidad de dinero
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
}

// Función para calcular ingresos mensuales
export function calculateMonthlyRevenue(professionals: any[]): number {
  return professionals.reduce((total, prof) => {
    if (prof.subscription_status === 'active' && prof.plan !== 'free') {
      const planPrice = PLAN_LIMITS[prof.plan as PlanType]?.priceCLP || 0;
      return total + planPrice;
    }
    return total;
  }, 0);
}

// Función para calcular tasa de cancelación (churn rate)
export function calculateChurnRate(professionals: any[]): number {
  const totalPaidUsers = professionals.filter(p => p.plan !== 'free').length;
  const cancelledUsers = professionals.filter(p => p.subscription_status === 'cancelled').length;
  
  if (totalPaidUsers === 0) return 0;
  return (cancelledUsers / totalPaidUsers) * 100;
}

// Función para obtener estadísticas de suscripciones
export function getSubscriptionStats(professionals: any[]): {
  totalUsers: number;
  activeSubscriptions: number;
  gracePeriodUsers: number;
  suspendedUsers: number;
  cancelledUsers: number;
  monthlyRevenue: number;
  churnRate: number;
  usersByPlan: Record<PlanType, number>;
} {
  const stats = {
    totalUsers: professionals.length,
    activeSubscriptions: professionals.filter(p => p.subscription_status === 'active').length,
    gracePeriodUsers: professionals.filter(p => p.subscription_status === 'grace_period').length,
    suspendedUsers: professionals.filter(p => p.subscription_status === 'suspended').length,
    cancelledUsers: professionals.filter(p => p.subscription_status === 'cancelled').length,
    monthlyRevenue: calculateMonthlyRevenue(professionals),
    churnRate: calculateChurnRate(professionals),
    usersByPlan: {
      free: professionals.filter(p => p.plan === 'free').length,
      pro: professionals.filter(p => p.plan === 'pro').length,
      studio: professionals.filter(p => p.plan === 'studio').length,
    }
  };
  
  return stats;
} 