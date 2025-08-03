'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { Professional } from '@/types';
import { Calendar, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { PlanAlert } from '@/components/ui/PlanAlert';
import { getCurrentPlan, getUsageProgress } from '@/lib/plans';

export default function DashboardPage() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBookings, setCurrentBookings] = useState(0);
  const [currentServices, setCurrentServices] = useState(0);
  
  const { user } = useAuth();
  const { getProfessionalByUserId } = useProfessional();
  const { getBookingsByProfessionalId } = useBookings();
  const { getServicesByProfessionalId } = useServices();

  useEffect(() => {
    const loadProfessional = async () => {
      if (user) {
        try {
          const profData = await getProfessionalByUserId(user.id);
          setProfessional(profData);
          
          if (profData) {
            // Cargar estadísticas de uso
            const [bookings, services] = await Promise.all([
              getBookingsByProfessionalId(profData.id),
              getServicesByProfessionalId(profData.id)
            ]);
            
            // Contar reservas del mes actual
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const monthlyBookings = bookings?.filter(booking => 
              new Date(booking.booking_date) >= startOfMonth
            ) || [];
            
            setCurrentBookings(monthlyBookings.length);
            setCurrentServices(services?.length || 0);
          }
        } catch (error) {
          console.error('Error loading professional:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfessional();
  }, [user, getProfessionalByUserId, getBookingsByProfessionalId, getServicesByProfessionalId]);

  // Datos de ejemplo para estadísticas
  const stats = {
    totalBookings: 24,
    thisWeek: 8,
    totalRevenue: 125000,
    averageRating: 4.8,
  };

  const recentBookings = [
    {
      id: 1,
      clientName: 'María González',
      service: 'Manicure Gel',
      date: '2024-01-15',
      time: '14:00',
      status: 'confirmed',
    },
    {
      id: 2,
      clientName: 'Ana Silva',
      service: 'Pedicure Spa',
      date: '2024-01-15',
      time: '16:00',
      status: 'pending',
    },
    {
      id: 3,
      clientName: 'Carmen López',
      service: 'Manicure Clásica',
      date: '2024-01-16',
      time: '10:00',
      status: 'confirmed',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
          Vista General
        </h1>
        <p className="text-gray-600 font-poppins">
          ¡Hola {professional?.business_name || 'Usuario'}! Aquí tienes un resumen de tu negocio.
        </p>
      </div>

      {/* Alerta de plan */}
      {professional && (
        <PlanAlert
          plan={professional.plan}
          currentBookings={currentBookings}
          currentServices={currentServices}
          onUpgrade={() => {
            // TODO: Implementar actualización de plan
            console.log('Actualizar plan');
          }}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-poppins">Reservas Totales</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-lavender-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-lavender-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-poppins">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-800">{stats.thisWeek}</p>
            </div>
            <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-coral-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-poppins">Ingresos</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gold-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-poppins">Calificación</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-lavender-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-lavender-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 font-playfair">Reservas Recientes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {booking.clientName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 font-poppins">{booking.clientName}</p>
                    <p className="text-sm text-gray-600 font-poppins">{booking.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 font-poppins">
                    {new Date(booking.date).toLocaleDateString('es-CL')} a las {booking.time}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 