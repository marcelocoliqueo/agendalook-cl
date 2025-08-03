'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Professional } from '@/types';

export function useProfessional() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const getProfessionalByUserId = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching professional:', error);
      return null;
    }
  };

  const createProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating professional:', error);
      throw error;
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating professional:', error);
      throw error;
    }
  };

  const getProfessionalBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching professional by slug:', error);
      return null;
    }
  };

  return {
    professional,
    loading,
    getProfessionalByUserId,
    createProfessional,
    updateProfessional,
    getProfessionalBySlug,
  };
} 