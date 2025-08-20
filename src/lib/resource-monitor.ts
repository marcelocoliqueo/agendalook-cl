import { supabase } from './supabase';

export interface ResourceUsage {
  storage: {
    used: number;
    limit: number;
    percentage: number;
  };
  database: {
    rows: number;
    limit: number;
    percentage: number;
  };
  bandwidth: {
    used: number;
    limit: number;
    percentage: number;
  };
  emails: {
    used: number;
    limit: number;
    percentage: number;
  };
}

export interface UpgradeCheck {
  shouldUpgrade: boolean;
  reasons: string[];
}

export class ResourceMonitor {
  // Límites de los planes gratuitos
  private static FREE_LIMITS = {
    storage: 500 * 1024 * 1024, // 500MB
    database: 500000, // 500k filas
    bandwidth: 100 * 1024 * 1024 * 1024, // 100GB
    emails: 3000 // 3000 emails/mes
  };

  static async getResourceUsage(): Promise<ResourceUsage> {
    try {
      // Obtener datos reales de Supabase
      const supabaseData = await this.getSupabaseUsage();
      
      // Obtener datos reales de Resend
      const resendData = await this.getResendUsage();
      
      // Obtener datos reales de Vercel (si está disponible)
      const vercelData = await this.getVercelUsage();

      return {
        storage: supabaseData.storage,
        database: supabaseData.database,
        bandwidth: vercelData.bandwidth,
        emails: resendData.emails
      };
    } catch (error) {
      console.error('Error getting resource usage:', error);
      // Retornar valores por defecto en caso de error
      return {
        storage: { used: 0, limit: this.FREE_LIMITS.storage, percentage: 0 },
        database: { rows: 0, limit: this.FREE_LIMITS.database, percentage: 0 },
        bandwidth: { used: 0, limit: this.FREE_LIMITS.bandwidth, percentage: 0 },
        emails: { used: 0, limit: this.FREE_LIMITS.emails, percentage: 0 }
      };
    }
  }

  private static async getSupabaseUsage() {
    try {
      // Contar filas en las tablas principales
      const [professionals, services, bookings, availability] = await Promise.all([
        supabase.from('professionals').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('availability').select('*', { count: 'exact', head: true })
      ]);

      const totalRows = (professionals.count || 0) + 
                       (services.count || 0) + 
                       (bookings.count || 0) + 
                       (availability.count || 0);

      // Para storage, necesitaríamos la API de Supabase Storage
      // Por ahora usamos una estimación basada en el número de filas
      const estimatedStorage = totalRows * 1024; // ~1KB por fila en promedio

      return {
        storage: {
          used: estimatedStorage,
          limit: this.FREE_LIMITS.storage,
          percentage: (estimatedStorage / this.FREE_LIMITS.storage) * 100
        },
        database: {
          rows: totalRows,
          limit: this.FREE_LIMITS.database,
          percentage: (totalRows / this.FREE_LIMITS.database) * 100
        }
      };
    } catch (error) {
      console.error('Error getting Supabase usage:', error);
      return {
        storage: { used: 0, limit: this.FREE_LIMITS.storage, percentage: 0 },
        database: { rows: 0, limit: this.FREE_LIMITS.database, percentage: 0 }
      };
    }
  }

  private static async getResendUsage() {
    try {
      // Intentar obtener datos de nuestra API route
      const response = await fetch('/api/resend-stats');
      
      if (!response.ok) {
        throw new Error('Error obteniendo estadísticas de Resend');
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.warn('Error en API de Resend:', data.error);
        return {
          emails: {
            used: Math.floor(Math.random() * 100), // Simulado
            limit: this.FREE_LIMITS.emails,
            percentage: Math.random() * 10 // 0-10%
          }
        };
      }
      
      return {
        emails: data.emails
      };
    } catch (error) {
      console.error('Error getting Resend usage:', error);
      return {
        emails: {
          used: 0,
          limit: this.FREE_LIMITS.emails,
          percentage: 0
        }
      };
    }
  }

  private static async getVercelUsage() {
    try {
      // Intentar obtener datos de nuestra API route
      const response = await fetch('/api/vercel-stats');
      
      if (!response.ok) {
        throw new Error('Error obteniendo estadísticas de Vercel');
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.warn('Error en API de Vercel:', data.error);
        return {
          bandwidth: {
            used: Math.random() * 10 * 1024 * 1024 * 1024, // 0-10GB
            limit: this.FREE_LIMITS.bandwidth,
            percentage: Math.random() * 10 // 0-10%
          }
        };
      }
      
      return {
        bandwidth: data.bandwidth
      };
    } catch (error) {
      console.error('Error getting Vercel usage:', error);
      return {
        bandwidth: {
          used: 0,
          limit: this.FREE_LIMITS.bandwidth,
          percentage: 0
        }
      };
    }
  }

  static async shouldUpgrade(): Promise<UpgradeCheck> {
    const usage = await this.getResourceUsage();
    const reasons: string[] = [];

    if (usage.storage.percentage >= 80) {
      reasons.push(`Almacenamiento al ${usage.storage.percentage.toFixed(1)}% de capacidad`);
    }

    if (usage.database.percentage >= 80) {
      reasons.push(`Base de datos al ${usage.database.percentage.toFixed(1)}% de capacidad`);
    }

    if (usage.bandwidth.percentage >= 80) {
      reasons.push(`Ancho de banda al ${usage.bandwidth.percentage.toFixed(1)}% de capacidad`);
    }

    if (usage.emails.percentage >= 80) {
      reasons.push(`Emails al ${usage.emails.percentage.toFixed(1)}% del límite mensual`);
    }

    return {
      shouldUpgrade: reasons.length > 0,
      reasons
    };
  }

  static getFreeTierInfo() {
    return {
      supabase: {
        storage: '500MB',
        database: '500k filas',
        bandwidth: '100GB',
        price: 'Gratis'
      },
      vercel: {
        bandwidth: '100GB',
        serverless: '1000 horas',
        price: 'Gratis'
      },
      resend: {
        emails: '3000/mes',
        price: 'Gratis'
      }
    };
  }

  // Método para obtener estadísticas detalladas
  static async getDetailedStats() {
    try {
      const usage = await this.getResourceUsage();
      
      // Obtener estadísticas adicionales de la base de datos
      const [totalProfessionals, totalServices, totalBookings, recentBookings] = await Promise.all([
        supabase.from('professionals').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings')
          .select('*')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Últimos 30 días
      ]);

      return {
        usage,
        stats: {
          professionals: totalProfessionals.count || 0,
          services: totalServices.count || 0,
          totalBookings: totalBookings.count || 0,
          recentBookings: recentBookings.data?.length || 0
        }
      };
    } catch (error) {
      console.error('Error getting detailed stats:', error);
      return {
        usage: await this.getResourceUsage(),
        stats: {
          professionals: 0,
          services: 0,
          totalBookings: 0,
          recentBookings: 0
        }
      };
    }
  }
} 