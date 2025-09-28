'use client';

import { useState, useCallback } from 'react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';
import { Availability, AvailabilityFormData } from '@/types';
import { CacheManager } from '@/lib/cache-manager';

export function useAvailability(professionalId: string | null) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  const getAvailabilityByProfessionalId = useCallback(async (professionalId: string) => {
    try {
      // Intentar cache
      const cached = CacheManager.getCachedAvailability(professionalId);
      if (cached) return cached;

      const { data, error } = await supabase
        .from('availability')
        .select('id, professional_id, day_of_week, start_time, end_time, is_available, created_at, updated_at')
        .eq('professional_id', professionalId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      CacheManager.cacheAvailability(professionalId, data || []);
      return data || [];
    } catch (error) {
      console.error('Error obteniendo disponibilidad:', error);
      return [];
    }
  }, [supabase]);

  const createAvailability = async (professionalId: string, availabilityData: AvailabilityFormData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('availability')
        .insert([{
          professional_id: professionalId,
          day_of_week: availabilityData.day_of_week,
          start_time: availabilityData.start_time,
          end_time: availabilityData.end_time,
          is_available: availabilityData.is_available,
        }])
        .select()
        .single();

      if (error) throw error;
      // invalidar cache
      CacheManager.delete(`availability_${professionalId}`);
      return data;
    } catch (error) {
      console.error('Error creating availability:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (availabilityId: string, updates: Partial<AvailabilityFormData>) => {
    try {
      setLoading(true);
      const updateData: any = {};
      
      if (updates.day_of_week !== undefined) updateData.day_of_week = updates.day_of_week;
      if (updates.start_time) updateData.start_time = updates.start_time;
      if (updates.end_time) updateData.end_time = updates.end_time;
      if (updates.is_available !== undefined) updateData.is_available = updates.is_available;

      const { data, error } = await supabase
        .from('availability')
        .update(updateData)
        .eq('id', availabilityId)
        .select()
        .single();

      if (error) throw error;
      // invalidar cache por prefijo si tenemos professionalId en updates
      if (updates && (updates as any).professional_id) {
        CacheManager.delete(`availability_${(updates as any).professional_id}`);
      }
      return data;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (availabilityId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', availabilityId);

      if (error) throw error;
      // No sabemos el professionalId; invalidamos por prefijo globalmente
      CacheManager.deleteByPrefix('availability_');
      return true;
    } catch (error) {
      console.error('Error deleting availability:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityBySlug = async (businessSlug: string) => {
    try {
      // Primero obtener el profesional por slug
      const { data: professional, error: profError } = await supabase
        .from('professionals')
        .select('id')
        .eq('business_slug', businessSlug)
        .single();

      if (profError) throw profError;
      if (!professional) return [];

      // Luego obtener la disponibilidad del profesional
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('professional_id', professional.id)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching availability by slug:', error);
      return [];
    }
  };

  return {
    loading,
    getAvailabilityByProfessionalId,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getAvailabilityBySlug,
  };
} 