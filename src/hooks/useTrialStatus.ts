'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSupabaseClient } from '@/contexts/SupabaseContext';

export interface TrialStatus {
  isTrial: boolean;
  isExpired: boolean;
  daysRemaining: number;
  trialEndDate: string | null;
  professional: any | null;
  loading: boolean;
}

export function useTrialStatus() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrial: false,
    isExpired: false,
    daysRemaining: 0,
    trialEndDate: null,
    professional: null,
    loading: true
  });

  const { user, loading: authLoading } = useAuth();
  const supabase = useSupabaseClient();

  const checkTrialStatus = useCallback(async () => {
    if (!user || authLoading) {
      setTrialStatus(prev => ({ ...prev, loading: authLoading }));
      return;
    }

    try {
      setTrialStatus(prev => ({ ...prev, loading: true }));

      const { data: professional, error } = await supabase
        .from('professionals')
        .select('plan, trial_end_date, subscription_status')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('❌ Error consultando profesional en useTrialStatus:', error);
        setTrialStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      if (!professional) {
        setTrialStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      const isTrial = professional.plan === 'trial';
      let isExpired = false;
      let daysRemaining = 0;

      if (isTrial && professional.trial_end_date) {
        const now = new Date();
        const trialEndDate = new Date(professional.trial_end_date);
        isExpired = now > trialEndDate;
        daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }

      setTrialStatus({
        isTrial,
        isExpired,
        daysRemaining: Math.max(0, daysRemaining),
        trialEndDate: professional.trial_end_date,
        professional,
        loading: false
      });

    } catch (error) {
      console.error('💥 Error inesperado en useTrialStatus:', error);
      setTrialStatus(prev => ({ ...prev, loading: false }));
    }
  }, [user, authLoading, supabase]);

  useEffect(() => {
    checkTrialStatus();
  }, [checkTrialStatus]);

  const refreshTrialStatus = useCallback(() => {
    checkTrialStatus();
  }, [checkTrialStatus]);

  return {
    ...trialStatus,
    refreshTrialStatus
  };
}
