'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Availability, AvailabilityFormData } from '@/types';

export function useAvailability() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const getAvailabilityByProfessionalId = async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('professional_id', professionalId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  };

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
      const { data, error } = await supabase
        .from('availability')
        .select(`
          *,
          professionals!inner(business_slug)
        `)
        .eq('professionals.business_slug', businessSlug)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
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