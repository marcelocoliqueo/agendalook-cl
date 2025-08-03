'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Service, ServiceFormData } from '@/types';
import { canCreateService, getCurrentPlan } from '@/lib/plans';

export function useServices() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const getServicesByProfessionalId = async (professionalId: string) => {
    try {
          const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  };

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
        .select()
        .single();

      if (error) throw error;
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
        .select()
        .single();

      if (error) throw error;
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
      const { error } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', serviceId);

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          professionals!inner(business_slug)
        `)
        .eq('professionals.business_slug', businessSlug)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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