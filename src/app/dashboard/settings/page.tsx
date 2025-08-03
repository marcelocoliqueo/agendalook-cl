'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { Professional } from '@/types';
import { Settings, Crown, Sparkles, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PLANS, getCurrentPlan, getUsageProgress, formatPlanPrice } from '@/lib/plans';
import SubscriptionButton from '@/components/SubscriptionButton';

export default function SettingsPage() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBookings, setCurrentBookings] = useState(0);
  const [currentServices, setCurrentServices] = useState(0);
  
  const { user } = useAuth();
  const { getProfessionalByUserId } = useProfessional();
  const { getBookingsByProfessionalId } = useBookings();
  const { getServicesByProfessionalId } = useServices();

  useEffect(() => {
    const loadData = async () => {
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
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user, getProfessionalByUserId, getBookingsByProfessionalId, getServicesByProfessionalId]);

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

  if (!user || !professional) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No tienes acceso a la configuración</p>
        </div>
      </div>
    );
  }

  const currentPlan = getCurrentPlan(professional.plan);
  const planDetails = PLANS[currentPlan];
  const usage = getUsageProgress(currentPlan, currentBookings, currentServices);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-gray-800">
          Configuración
        </h1>
        <p className="text-gray-600 mt-2 font-poppins">
          Gestiona tu cuenta y plan de suscripción
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Plan Actual */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 font-playfair">
                Plan Actual
              </h2>
              <div className="flex items-center space-x-2">
                <Crown className={`w-5 h-5 ${planDetails.color}`} />
                <span className={`font-semibold ${planDetails.color}`}>
                  {planDetails.name}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">{planDetails.description}</p>
              <div className="text-2xl font-bold text-gray-800">
                {formatPlanPrice(planDetails.price)}
                <span className="text-sm font-normal text-gray-500">/mes</span>
              </div>
            </div>

            {/* Uso actual */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">Uso actual:</h3>
              
              {usage.bookings.limit !== Infinity && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reservas este mes</span>
                    <span className="font-medium">
                      {usage.bookings.current}/{usage.bookings.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        usage.bookings.percentage >= 100 
                          ? 'bg-red-500' 
                          : usage.bookings.percentage >= 80 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${usage.bookings.percentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              {usage.services.limit !== Infinity && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Servicios</span>
                    <span className="font-medium">
                      {usage.services.current}/{usage.services.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        usage.services.percentage >= 100 
                          ? 'bg-red-500' 
                          : usage.services.percentage >= 80 
                            ? 'bg-amber-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${usage.services.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Características del plan */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Características incluidas:</h3>
              <div className="space-y-2">
                {planDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Planes Disponibles */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 font-playfair">
            Planes Disponibles
          </h2>
          
          {Object.entries(PLANS).map(([planKey, planInfo]) => {
            const isCurrentPlan = planKey === currentPlan;
            
            return (
              <div 
                key={planKey}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
                  isCurrentPlan 
                    ? 'border-lavender-300 bg-lavender-50' 
                    : 'border-gray-200 hover:border-lavender-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold text-lg ${planInfo.color}`}>
                      {planInfo.name}
                    </h3>
                    <p className="text-sm text-gray-600">{planInfo.description}</p>
                  </div>
                  {isCurrentPlan && (
                    <div className="bg-lavender-100 text-lavender-700 px-2 py-1 rounded-full text-xs font-medium">
                      Actual
                    </div>
                  )}
                </div>

                <div className="text-2xl font-bold text-gray-800 mb-4">
                  {formatPlanPrice(planInfo.price)}
                  <span className="text-sm font-normal text-gray-500">/mes</span>
                </div>

                <div className="space-y-2 mb-4">
                  {planInfo.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {planKey !== 'free' && (
                  <SubscriptionButton
                    plan={planKey as 'pro' | 'studio'}
                    currentPlan={currentPlan}
                    className="w-full"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 