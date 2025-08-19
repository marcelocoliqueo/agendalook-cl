'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';
import { Professional } from '@/types';
import { CacheManager } from '@/lib/cache-manager';

// Cache simple para evitar consultas repetidas
const professionalCache = new Map<string, Professional>();

export function useProfessional() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  const getProfessionalByUserId = useCallback(async (userId: string) => {
    // Verificar cache global primero
    const cached = CacheManager.getCachedProfessional(userId) as Professional | null;
    if (cached) {
      return cached;
    }
    // Fallback al cache local (transitorio)
    if (professionalCache.has(userId)) {
      return professionalCache.get(userId) as Professional | null;
    }

    try {
      console.log('🔍 Buscando profesional con user_id:', userId);
      console.log('🔧 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const { data, error } = await supabase
        .from('professionals')
        .select('id, user_id, business_name, business_slug, phone, email, description, address, plan, role, subscription_status, created_at, updated_at')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('❌ Error completo:', JSON.stringify(error, null, 2));
        
        // No lanzar error si no encuentra el registro, solo log
        if (error.code === 'PGRST116') {
          console.log('ℹ️ No se encontró perfil profesional para user_id:', userId);
          return null;
        }
        
        // Para otros errores, log pero no lanzar excepción
        console.error('❌ Error en consulta:', error);
        return null;
      }
      
      console.log('✅ Datos encontrados:', data);
      
      // Guardar en cache global y local
      if (data) {
        CacheManager.cacheProfessional(userId, data);
        professionalCache.set(userId, data);
      }
      
      return data;
    } catch (error) {
      console.error('💥 Error inesperado en getProfessionalByUserId:', error);
      return null;
    }
  }, [supabase]);

  const getProfessionalBySlug = useCallback(async (slug: string) => {
    // Verificar cache global por slug
    const cached = CacheManager.getCachedProfessionalBySlug(slug) as Professional | null;
    if (cached) {
      return cached;
    }
    // Fallback cache local
    const cacheKey = `slug_${slug}`;
    if (professionalCache.has(cacheKey)) {
      return professionalCache.get(cacheKey) as Professional | null;
    }

    try {
      console.log('🔍 Buscando profesional con slug:', slug);
      if (slug === 'plans' || slug === 'checkout') {
        // Evitar consultar con slug reservado de ruta
        return null;
      }
      
      const { data, error } = await supabase
        .from('professionals')
        .select('id, user_id, business_name, business_slug, phone, email, description, address, plan, role, subscription_status, created_at, updated_at')
        .eq('business_slug', slug)
        .single();

      if (error) {
        console.error('❌ Error en consulta:', error);
        throw error;
      }
      
      // Guardar en cache global y local
      if (data) {
        CacheManager.cacheProfessionalBySlug(slug, data);
        professionalCache.set(cacheKey, data);
      }
      
      console.log('✅ Profesional encontrado:', data?.business_name);
      return data;
    } catch (error) {
      console.error('Error fetching professional by slug:', error);
      return null;
    }
  }, [supabase]);

  const createProfessional = useCallback(async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('🔧 Creando profesional con datos:', professionalData);
      
      // Validar datos requeridos
      if (!professionalData.user_id) {
        throw new Error('user_id es requerido');
      }
      if (!professionalData.business_name) {
        throw new Error('business_name es requerido');
      }
      if (!professionalData.business_slug) {
        throw new Error('business_slug es requerido');
      }
      if (!professionalData.email) {
        throw new Error('email es requerido');
      }

      const { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select('id, user_id, business_name, business_slug, phone, email, description, address, plan, role, subscription_status, created_at, updated_at')
        .single();

      // Mejorar el manejo de errores
      if (error) {
        console.error('❌ Error de Supabase:', error);
        
        // Si el error es sobre RLS o permisos, puede ser un falso positivo
        if (error.code === '42501' || error.message.includes('policy')) {
          console.log('⚠️ Error de política RLS, verificando si la inserción fue exitosa...');
          // Verificar si el registro se creó de todas formas
          const { data: checkData } = await supabase
            .from('professionals')
            .select('*')
            .eq('user_id', professionalData.user_id)
            .single();
          
          if (checkData) {
            console.log('✅ Registro encontrado a pesar del error de política');
            return checkData;
          }
        }
        
        throw error;
      }
      
      console.log('✅ Profesional creado exitosamente:', data);
      
      // Actualizar cache global y local
      if (data) {
        CacheManager.cacheProfessional(data.user_id, data);
        CacheManager.cacheProfessionalBySlug(data.business_slug, data);
        professionalCache.set(data.user_id, data);
        professionalCache.set(`slug_${data.business_slug}`, data);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating professional:', error);
      throw error;
    }
  }, [supabase]);

  const updateProfessional = useCallback(async (id: string, updates: Partial<Professional>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select('id, user_id, business_name, business_slug, phone, email, description, address, plan, role, subscription_status, created_at, updated_at')
        .single();

      if (error) throw error;
      
      // Actualizar cache global y local
      if (data) {
        CacheManager.cacheProfessional(data.user_id, data);
        CacheManager.cacheProfessionalBySlug(data.business_slug, data);
        professionalCache.set(data.user_id, data);
        professionalCache.set(`slug_${data.business_slug}`, data);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating professional:', error);
      throw error;
    }
  }, [supabase]);

  // Limpiar cache cuando el componente se desmonta
  useEffect(() => {
    return () => {
      // Opcional: limpiar cache después de un tiempo
      setTimeout(() => {
        professionalCache.clear();
      }, 5 * 60 * 1000); // 5 minutos
    };
  }, []);

  return {
    professional,
    loading,
    getProfessionalByUserId,
    createProfessional,
    updateProfessional,
    getProfessionalBySlug,
  };
} 