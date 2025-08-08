interface CacheItem {
  value: any;
  timestamp: number;
  ttl: number;
}

export class CacheManager {
  private static cache = new Map<string, CacheItem>();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutos

  static set(key: string, value: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  // Eliminar por prefijo (para invalidaciones amplias)
  static deleteByPrefix(prefix: string): number {
    let deleted = 0;
    for (const key of Array.from(this.cache.keys())) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    return deleted;
  }

  static getStats() {
    const keys = Array.from(this.cache.keys());
    const now = Date.now();
    
    // Limpiar elementos expirados
    keys.forEach(key => {
      const item = this.cache.get(key);
      if (item && now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    });

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private static estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const [key, item] of this.cache.entries()) {
      // Estimación aproximada del tamaño en bytes
      totalSize += key.length * 2; // UTF-16
      totalSize += JSON.stringify(item.value).length * 2;
      totalSize += 24; // Timestamp y TTL (8 bytes cada uno)
    }
    
    return totalSize;
  }

  // Métodos específicos para datos comunes
  static cacheProfessional(userId: string, data: any): void {
    this.set(`professional_${userId}`, data, 10 * 60 * 1000); // 10 minutos
  }

  static getCachedProfessional(userId: string): any | null {
    return this.get(`professional_${userId}`);
  }

  // Cache de profesional por slug
  static cacheProfessionalBySlug(slug: string, data: any): void {
    this.set(`professional_slug_${slug}`, data, 10 * 60 * 1000);
  }

  static getCachedProfessionalBySlug(slug: string): any | null {
    return this.get(`professional_slug_${slug}`);
  }

  static cacheBookings(professionalId: string, data: any): void {
    this.set(`bookings_${professionalId}`, data, 5 * 60 * 1000); // 5 minutos
  }

  static getCachedBookings(professionalId: string): any | null {
    return this.get(`bookings_${professionalId}`);
  }

  static cacheServices(professionalId: string, data: any): void {
    this.set(`services_${professionalId}`, data, 10 * 60 * 1000); // 10 minutos
  }

  static getCachedServices(professionalId: string): any | null {
    return this.get(`services_${professionalId}`);
  }

  // Cache de disponibilidad
  static cacheAvailability(professionalId: string, data: any): void {
    this.set(`availability_${professionalId}`, data, 10 * 60 * 1000);
  }

  static getCachedAvailability(professionalId: string): any | null {
    return this.get(`availability_${professionalId}`);
  }
} 