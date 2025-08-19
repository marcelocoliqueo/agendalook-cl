'use client';

import { useState, useCallback, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useSupabaseClient } from '@/contexts/SupabaseContext';
import { Notification } from '@/types';

export function useNotifications(professionalId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    unread: 0,
    urgent: 0,
    high: 0,
    normal: 0,
    low: 0
  });
  const [loading, setLoading] = useState(true);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);
  
  const supabase = useSupabaseClient();

  // Cargar notificaciones
  const loadNotifications = useCallback(async () => {
    if (!professionalId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      updateCounts(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  // Actualizar contadores
  const updateCounts = useCallback((notifications: Notification[]) => {
    const unread = notifications.filter(n => !n.is_read).length;
    const urgent = notifications.filter(n => n.priority === 'urgent' && !n.is_read).length;
    const high = notifications.filter(n => n.priority === 'high' && !n.is_read).length;
    const normal = notifications.filter(n => n.priority === 'normal' && !n.is_read).length;
    const low = notifications.filter(n => n.priority === 'low' && !n.is_read).length;

    setCounts({
      total: notifications.length,
      unread,
      urgent,
      high,
      normal,
      low
    });
  }, []);

  // Marcar notificación como leída y eliminarla
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      // Remover de la lista local y actualizar contadores
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== notificationId);
        updateCounts(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [updateCounts]);

  // Marcar todas como leídas y eliminarlas
  const markAllAsRead = useCallback(async () => {
    if (!professionalId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('professional_id', professionalId)
        .eq('is_read', false);

      if (error) throw error;

      // Limpiar lista local y contadores
      setNotifications([]);
      setCounts({
        total: 0,
        unread: 0,
        urgent: 0,
        high: 0,
        normal: 0,
        low: 0
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [professionalId]);

  // Archivar notificación
  const archiveNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_archived: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Remover de la lista local
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // Recargar contadores
      loadNotifications();
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  }, [loadNotifications]);

  // Configurar tiempo real
  useEffect(() => {
    if (!professionalId) return;

    // Suscribirse a cambios en notificaciones
    const channel = supabase
      .channel(`notifications:${professionalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `professional_id=eq.${professionalId}`
        },
        (payload) => {
          console.log('Notification change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Nueva notificación
            const newNotification = payload.new as Notification;
            setNotifications(prev => {
              const updated = [newNotification, ...prev];
              updateCounts(updated);
              return updated;
            });
          } else if (payload.eventType === 'UPDATE') {
            // Notificación actualizada
            const updatedNotification = payload.new as Notification;
            setNotifications(prev => {
              const updated = prev.map(n => 
                n.id === updatedNotification.id ? updatedNotification : n
              );
              updateCounts(updated);
              return updated;
            });
          } else if (payload.eventType === 'DELETE') {
            // Notificación eliminada
            const deletedNotification = payload.old as Notification;
            setNotifications(prev => {
              const updated = prev.filter(n => n.id !== deletedNotification.id);
              updateCounts(updated);
              return updated;
            });
          }
        }
      )
      .subscribe();

    setRealtimeChannel(channel);

    // Limpiar suscripción
    return () => {
      channel.unsubscribe();
    };
  }, [professionalId, updateCounts]);

  // Cargar notificaciones al montar
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Limpiar suscripción al desmontar
  useEffect(() => {
    return () => {
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
      }
    };
  }, [realtimeChannel]);

  return {
    notifications,
    counts,
    loading,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    loadNotifications
  };
} 