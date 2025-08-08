import { supabase } from './supabase';

export interface CreateNotificationParams {
  professionalId: string;
  type: 'new_booking' | 'booking_confirmed' | 'booking_cancelled' | 'payment_reminder' | 'subscription_grace_period' | 'subscription_suspended' | 'subscription_expired' | 'system_maintenance' | 'welcome_message' | 'service_created' | 'availability_updated';
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: Date;
}

export class NotificationService {
  /**
   * Crear una notificación usando la función de la base de datos
   */
  static async createNotification(params: CreateNotificationParams): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_professional_id: params.professionalId,
        p_type: params.type,
        p_title: params.title,
        p_message: params.message,
        p_data: params.data || {},
        p_priority: params.priority || 'normal',
        p_expires_at: params.expiresAt?.toISOString() || null
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Notificación de nueva reserva
   */
  static async notifyNewBooking(professionalId: string, bookingData: {
    customerName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'new_booking',
      title: 'Nueva reserva recibida',
      message: `${bookingData.customerName} ha reservado ${bookingData.serviceName} para el ${bookingData.bookingDate} a las ${bookingData.bookingTime}`,
      data: bookingData,
      priority: 'high'
    });
  }

  /**
   * Notificación de reserva confirmada
   */
  static async notifyBookingConfirmed(professionalId: string, bookingData: {
    customerName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'booking_confirmed',
      title: 'Reserva confirmada',
      message: `La reserva de ${bookingData.customerName} para ${bookingData.serviceName} ha sido confirmada`,
      data: bookingData,
      priority: 'normal'
    });
  }

  /**
   * Notificación de reserva cancelada
   */
  static async notifyBookingCancelled(professionalId: string, bookingData: {
    customerName: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'booking_cancelled',
      title: 'Reserva cancelada',
      message: `La reserva de ${bookingData.customerName} para ${bookingData.serviceName} ha sido cancelada`,
      data: bookingData,
      priority: 'normal'
    });
  }

  /**
   * Notificación de recordatorio de pago
   */
  static async notifyPaymentReminder(professionalId: string, paymentData: {
    amount: number;
    dueDate: string;
    daysOverdue: number;
  }) {
    const priority = paymentData.daysOverdue > 7 ? 'urgent' : 'high';
    const message = paymentData.daysOverdue > 7 
      ? `Pago vencido hace ${paymentData.daysOverdue} días. Monto: $${paymentData.amount.toLocaleString('es-CL')}`
      : `Recordatorio de pago: $${paymentData.amount.toLocaleString('es-CL')} vence el ${paymentData.dueDate}`;

    return this.createNotification({
      professionalId,
      type: 'payment_reminder',
      title: 'Recordatorio de pago',
      message,
      data: paymentData,
      priority
    });
  }

  /**
   * Notificación de período de gracia
   */
  static async notifyGracePeriod(professionalId: string, subscriptionData: {
    plan: string;
    daysInGrace: number;
    gracePeriodEnd: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'subscription_grace_period',
      title: 'Período de gracia activo',
      message: `Tu suscripción ${subscriptionData.plan} está en período de gracia. Tienes ${subscriptionData.daysInGrace} días restantes.`,
      data: subscriptionData,
      priority: 'high',
      expiresAt: new Date(subscriptionData.gracePeriodEnd)
    });
  }

  /**
   * Notificación de suspensión
   */
  static async notifySuspension(professionalId: string, subscriptionData: {
    plan: string;
    suspensionDate: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'subscription_suspended',
      title: 'Suscripción suspendida',
      message: `Tu suscripción ${subscriptionData.plan} ha sido suspendida por falta de pago.`,
      data: subscriptionData,
      priority: 'urgent'
    });
  }

  /**
   * Notificación de expiración
   */
  static async notifyExpiration(professionalId: string, subscriptionData: {
    plan: string;
    expirationDate: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'subscription_expired',
      title: 'Suscripción expirada',
      message: `Tu suscripción ${subscriptionData.plan} ha expirado.`,
      data: subscriptionData,
      priority: 'urgent'
    });
  }

  /**
   * Notificación de mantenimiento del sistema
   */
  static async notifySystemMaintenance(professionalId: string, maintenanceData: {
    scheduledDate: string;
    duration: string;
    description: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'system_maintenance',
      title: 'Mantenimiento programado',
      message: `Mantenimiento del sistema programado para ${maintenanceData.scheduledDate}. Duración estimada: ${maintenanceData.duration}`,
      data: maintenanceData,
      priority: 'normal',
      expiresAt: new Date(maintenanceData.scheduledDate)
    });
  }

  /**
   * Notificación de bienvenida
   */
  static async notifyWelcome(professionalId: string, welcomeData: {
    businessName: string;
    plan: string;
  }) {
    return this.createNotification({
      professionalId,
      type: 'welcome_message',
      title: '¡Bienvenido a Agendalook!',
      message: `¡Hola ${welcomeData.businessName}! Tu cuenta ha sido activada con el plan ${welcomeData.plan}. Comienza a configurar tus servicios.`,
      data: welcomeData,
      priority: 'normal'
    });
  }

  /**
   * Notificación de servicio creado
   */
  static async notifyServiceCreated(professionalId: string, serviceData: {
    serviceName: string;
    price: number;
  }) {
    return this.createNotification({
      professionalId,
      type: 'service_created',
      title: 'Servicio creado',
      message: `El servicio "${serviceData.serviceName}" ha sido creado exitosamente. Precio: $${serviceData.price.toLocaleString('es-CL')}`,
      data: serviceData,
      priority: 'low'
    });
  }

  /**
   * Notificación de disponibilidad actualizada
   */
  static async notifyAvailabilityUpdated(professionalId: string, availabilityData: {
    dayOfWeek: string;
    timeSlots: string[];
  }) {
    return this.createNotification({
      professionalId,
      type: 'availability_updated',
      title: 'Disponibilidad actualizada',
      message: `Tu disponibilidad para ${availabilityData.dayOfWeek} ha sido actualizada con ${availabilityData.timeSlots.length} franjas horarias.`,
      data: availabilityData,
      priority: 'low'
    });
  }

  /**
   * Obtener contador de notificaciones no leídas
   */
  static async getUnreadCount(professionalId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_unread_notifications_count', {
        p_professional_id: professionalId
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Marcar notificación como leída
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('mark_notification_read', {
        p_notification_id: notificationId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  static async markAllAsRead(professionalId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('mark_all_notifications_read', {
        p_professional_id: professionalId
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return 0;
    }
  }

  /**
   * Limpiar notificaciones expiradas
   */
  static async cleanupExpiredNotifications(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_notifications');

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      return 0;
    }
  }
} 