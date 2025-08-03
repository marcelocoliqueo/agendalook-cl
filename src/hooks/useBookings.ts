'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Booking } from '@/types';
import { canCreateBooking, getCurrentPlan } from '@/lib/plans';

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const getBookingsByProfessionalId = async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services(name, duration, price)
        `)
        .eq('professional_id', professionalId)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  };

  const createBooking = async (bookingData: {
    professional_id: string;
    service_id: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    booking_date: string;
    booking_time: string;
    notes?: string;
  }, professionalPlan?: string) => {
    try {
      setLoading(true);
      
      // Validar límites del plan
      if (professionalPlan) {
        const plan = getCurrentPlan(professionalPlan);
        
        // Obtener reservas del mes actual
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const { data: monthlyBookings, error: countError } = await supabase
          .from('bookings')
          .select('id')
          .eq('professional_id', bookingData.professional_id)
          .gte('booking_date', startOfMonth.toISOString().split('T')[0])
          .lte('booking_date', endOfMonth.toISOString().split('T')[0]);
        
        if (countError) throw countError;
        
        const currentBookingsThisMonth = monthlyBookings?.length || 0;
        
        if (!canCreateBooking(plan, currentBookingsThisMonth)) {
          throw new Error('Has alcanzado el límite de reservas de tu plan. Considera actualizar a Pro o Studio.');
        }
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByDate = async (professionalId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services(name, duration, price)
        `)
        .eq('professional_id', professionalId)
        .eq('booking_date', date)
        .order('booking_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bookings by date:', error);
      return [];
    }
  };

  const checkAvailability = async (
    professionalId: string,
    date: string,
    time: string,
    duration: number
  ) => {
    try {
      // Obtener reservas existentes para esa fecha y hora
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select(`
          booking_time,
          services(duration)
        `)
        .eq('professional_id', professionalId)
        .eq('booking_date', date)
        .eq('status', 'confirmed');

      if (error) throw error;

      // Verificar si hay conflictos de horario
      const requestedTime = new Date(`${date}T${time}`);
      const requestedEndTime = new Date(requestedTime.getTime() + duration * 60000);

      const hasConflict = existingBookings?.some((booking) => {
        const bookingTime = new Date(`${date}T${booking.booking_time}`);
        const bookingEndTime = new Date(bookingTime.getTime() + (booking.services as any).duration * 60000);

        return (
          (requestedTime >= bookingTime && requestedTime < bookingEndTime) ||
          (requestedEndTime > bookingTime && requestedEndTime <= bookingEndTime) ||
          (requestedTime <= bookingTime && requestedEndTime >= bookingEndTime)
        );
      });

      return !hasConflict;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const getBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user authenticated');
      
      return await getBookingsByProfessionalId(user.id);
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  };

  return {
    loading,
    getBookings,
    getBookingsByProfessionalId,
    createBooking,
    updateBookingStatus,
    getBookingsByDate,
    checkAvailability,
  };
} 