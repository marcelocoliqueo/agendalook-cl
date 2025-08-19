'use client';

import { useState, useCallback } from 'react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';
import { Service, ServiceFormData } from '@/types';
import { canCreateService, getCurrentPlan } from '@/lib/plans';
import { CacheManager } from '@/lib/cache-manager';

export function useServices(professionalId: string | null) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  const getServicesByProfessionalId = useCallback(async (professionalId: string) => {
    try {
      // Intentar obtener del cache primero
      const cachedData = CacheManager.getCachedServices(professionalId);
      
      if (cachedData) {
        console.log('📦 Services loaded from cache');
        return cachedData;
      }

      const { data, error } = await supabase
        .from('services')
        .select('id, professional_id, name, description, duration, price, is_active, created_at, updated_at')
        .eq('professional_id', professionalId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Guardar en cache
      CacheManager.cacheServices(professionalId, data || []);
      console.log('💾 Services saved to cache');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }, [supabase]);

  const createService = async (professionalId: string, serviceData: ServiceFormData, professionalPlan?: string) => {
    try {
      setLoading(true);
      
      // Validar límites del plan
      if (professionalPlan) {
        const plan = getCurrentPlan(professionalPlan);
        
        // Obtener servicios actuales del profesional
        const { data: currentServices, error: countError } = await supabase
          .from('services')
          .select('id')
          .eq('professional_id', professionalId)
          .eq('is_active', true)
        
        if (countError) throw countError;
        
        const currentServicesCount = currentServices?.length || 0;
        
        if (!canCreateService(plan, currentServicesCount)) {
          throw new Error('Has alcanzado el número máximo de servicios permitidos. Considera actualizar a Pro o Studio.');
        }
      }
      
      const { data, error } = await supabase
        .from('services')
        .insert([{
          professional_id: professionalId,
          name: serviceData.name,
          description: serviceData.description,
          duration: serviceData.duration,
          price: serviceData.price * 100, // Convertir a centavos
          is_active: true,
        }])
        .select('id, professional_id, name, description, duration, price, is_active, created_at, updated_at')
        .single();

      if (error) throw error;
      
      // Invalidar cache de servicios
      CacheManager.delete(`services_${professionalId}`);
      CacheManager.delete(`professional_${professionalId}`);
      
      return data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceId: string, updates: Partial<ServiceFormData>) => {
    try {
      setLoading(true);
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.description) updateData.description = updates.description;
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.price) updateData.price = updates.price * 100; // Convertir a centavos

      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', serviceId)
        .select('id, professional_id, name, description, duration, price, is_active, created_at, updated_at')
        .single();

      if (error) throw error;
      // Invalidar cache del profesional relacionado
      if (data?.professional_id) {
        CacheManager.delete(`services_${data.professional_id}`);
      }
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', serviceId)
        .select('professional_id')
        .single();

      if (error) throw error;
      if (data?.professional_id) {
        CacheManager.delete(`services_${data.professional_id}`);
      } else {
        CacheManager.deleteByPrefix('services_');
      }
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getServicesBySlug = async (businessSlug: string) => {
    try {
      // Intentar cache de profesional por slug primero
      let professional = CacheManager.getCachedProfessionalBySlug(businessSlug) as { id: string } | null;
      if (!professional) {
        const { data: profData, error: profError } = await supabase
          .from('professionals')
          .select('id, user_id, business_name, business_slug, phone, email, description, address, plan, role, subscription_status, created_at, updated_at')
          .eq('business_slug', businessSlug)
          .single();
        if (profError) throw profError;
        if (!profData) return [];
        professional = profData;
        CacheManager.cacheProfessionalBySlug(businessSlug, profData);
      }

      // Cache de servicios por professionalId
      const cachedServices = CacheManager.getCachedServices(professional.id);
      if (cachedServices) return cachedServices;

      const { data, error } = await supabase
        .from('services')
        .select('id, professional_id, name, description, duration, price, is_active, created_at, updated_at')
        .eq('professional_id', professional.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      CacheManager.cacheServices(professional.id, data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching services by slug:', error);
      return [];
    }
  };

  return {
    loading,
    getServicesByProfessionalId,
    createService,
    updateService,
    deleteService,
    getServicesBySlug,
  };
} 