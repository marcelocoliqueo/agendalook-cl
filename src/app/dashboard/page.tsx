'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { Professional, Booking } from '@/types';
import { Calendar, Clock, TrendingUp, Sparkles, Activity, Settings, Shield, Plus } from 'lucide-react';
import { PlanAlert } from '@/components/ui/PlanAlert';
import { TrialBanner } from '@/components/ui/TrialBanner';
import { PeriodFilter, PeriodType } from '@/components/ui/PeriodFilter';
import { getCurrentPlan, getUsageProgress } from '@/lib/plans';
import { downloadPDF } from '@/lib/pdf-generator';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { format, isWithinInterval, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [currentServices, setCurrentServices] = useState(0);
  const [services, setServices] = useState<any[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodType>('month');
  const [periodStart, setPeriodStart] = useState<Date>(new Date());
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null);
  const [showTrialBanner, setShowTrialBanner] = useState(false);
  
  const { user } = useAuth();
  const { getProfessionalByUserId } = useProfessional();
  const { getBookingsByProfessionalId } = useBookings(professional?.id || null);
  const { getServicesByProfessionalId } = useServices(professional?.id || null);
  const router = useRouter();

  // Detectar si es el usuario admin
  const isAdmin = user?.email === 'admin@agendalook.cl';

  useEffect(() => {
    const loadProfessional = async () => {
      if (!user?.id) {
        console.log('No user found, skipping data load');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading professional for user:', user.id);
        const profData = await getProfessionalByUserId(user.id);
        console.log('Professional data:', profData);
        
        // Para admin, crear un perfil temporal si no existe
        if (!profData && isAdmin) {
          console.log('Creating temporary admin profile');
          setProfessional({
            id: 'admin-temp',
            user_id: user.id,
            business_name: 'Agendalook Admin',
            business_slug: 'admin',
            email: 'admin@agendalook.cl',
            phone: '',
            description: 'Panel de administración del sistema',
            address: '',
            plan: 'studio',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            trial_start_date: new Date().toISOString(),
            onboarding_completed: true
          });
          setAllBookings([]);
          setServices([]);
          setCurrentServices(0);
          setError(null);
          setLoading(false);
          return;
        }
        
        if (!profData) {
          console.log('No professional found for user');
          // Redirigir al setup si no tiene perfil
          router.push('/setup/business-slug');
          return;
        }

        // Verificar que completó el setup
        if (!profData.business_slug || !('trial_start_date' in profData && profData.trial_start_date)) {
          console.log('Setup incomplete, redirecting...');
          if (!profData.business_slug) {
            router.push('/setup/business-slug');
          } else if (!('trial_start_date' in profData && profData.trial_start_date)) {
            router.push('/setup/business-info');
          }
          return;
        }

        setProfessional(profData);
        
        // Calcular días restantes del trial si está en trial
        if ('subscription_status' in profData && profData.subscription_status === 'trial' && 'trial_end_date' in profData && profData.trial_end_date) {
          const now = new Date();
          const endDate = new Date(profData.trial_end_date);
          const daysLeft = differenceInDays(endDate, now);
          
          if (daysLeft >= 0) {
            setTrialDaysRemaining(daysLeft);
            setShowTrialBanner(true);
          } else {
            // Trial expirado, redirigir a pago
            router.push(`/payment?plan=${profData.plan || 'look'}`);
            return;
          }
        }
        
        // Cargar estadísticas de uso
        console.log('Loading bookings and services for professional:', profData.id);
        const [bookings, services] = await Promise.all([
          getBookingsByProfessionalId(profData.id),
          getServicesByProfessionalId(profData.id)
        ]);
        
        console.log('Bookings loaded:', bookings?.length || 0);
        console.log('Services loaded:', services?.length || 0);
        
        setAllBookings(bookings || []);
        setServices(services || []);
        setCurrentServices(services?.length || 0);
        setError(null);
      } catch (error) {
        console.error('Error loading professional data:', error);
        setError('Error al cargar los datos del negocio. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadProfessional();
  }, [user?.id, isAdmin, getProfessionalByUserId, getBookingsByProfessionalId, getServicesByProfessionalId]); // Agregar todas las dependencias

  // Filtrar reservas por período
  useEffect(() => {
    const filtered = allBookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return isWithinInterval(bookingDate, { start: periodStart, end: periodEnd });
    });
    setFilteredBookings(filtered);
  }, [allBookings, periodStart, periodEnd]);

  // Calcular estadísticas del período
  const stats = {
    totalBookings: filteredBookings.length,
    thisWeek: filteredBookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));
      return isWithinInterval(bookingDate, { start: startOfWeek, end: endOfWeek });
    }).length,
    totalRevenue: filteredBookings.reduce((total, booking) => {
      const service = services.find(s => s.id === booking.service_id);
      return total + (service?.price || 0);
    }, 0),
    averageRating: '4.8',
    confirmedBookings: filteredBookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: filteredBookings.filter(b => b.status === 'pending').length,
    cancelledBookings: filteredBookings.filter(b => b.status === 'cancelled').length,
  };

  const handlePeriodChange = (period: PeriodType, startDate: Date, endDate: Date) => {
    setCurrentPeriod(period);
    setPeriodStart(startDate);
    setPeriodEnd(endDate);
  };

  const handleExportPDF = async (period: PeriodType, startDate: Date, endDate: Date) => {
    try {
      // Preparar datos para el PDF
      const bookingData = filteredBookings.map(booking => {
        const service = services.find(s => s.id === booking.service_id);
        return {
          id: booking.id,
          customer_name: booking.customer_name,
          customer_phone: booking.customer_phone,
          service_name: service?.name || 'Servicio',
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          status: booking.status,
          price: service?.price || 0,
        };
      });

      const periodLabels = {
        week: 'Esta Semana',
        month: 'Este Mes',
        year: 'Este Año'
      };

      const reportData = {
        businessName: professional?.business_name || 'Negocio',
        period: periodLabels[period],
        startDate,
        endDate,
        bookings: bookingData,
        totalRevenue: stats.totalRevenue,
        totalBookings: stats.totalBookings,
        confirmedBookings: stats.confirmedBookings,
        pendingBookings: stats.pendingBookings,
        cancelledBookings: stats.cancelledBookings,
      };

      downloadPDF(reportData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al exportar PDF. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  // Dashboard especial para admin
  if (isAdmin) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 font-poppins">
            Bienvenido al panel de administración de Agendalook
          </p>
        </div>

        {/* Acciones rápidas para admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/admin" className="block">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Monitoreo de Recursos</h3>
                  <p className="text-sm text-gray-600">Ver uso de servicios gratuitos</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/settings" className="block">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Configuración</h3>
                  <p className="text-sm text-gray-600">Ajustes del sistema</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/security" className="block">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Seguridad</h3>
                  <p className="text-sm text-gray-600">Configuración de seguridad</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Información del sistema */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Versión</p>
              <p className="font-semibold">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entorno</p>
              <p className="font-semibold">{process.env.NODE_ENV === 'production' ? 'Producción' : 'Desarrollo'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan Actual</p>
              <p className="font-semibold">Studio (Admin)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Última Actualización</p>
              <p className="font-semibold">{new Date().toLocaleDateString('es-CL')}</p>
            </div>
          </div>
        </div>

        {/* Enlace a pruebas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Herramientas de Desarrollo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/test" className="inline-block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🧪</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Página de Pruebas</h3>
                    <p className="text-sm text-blue-600">Probar funcionalidades del dashboard</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/test-resources" className="inline-block">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Prueba de Recursos</h3>
                    <p className="text-sm text-green-600">Probar ResourceMonitor</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/test-mercadopago" className="inline-block">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">💳</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800">Prueba de MercadoPago</h3>
                    <p className="text-sm text-purple-600">Probar integración de pagos</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard normal para usuarios regulares
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Trial Banner */}
      {showTrialBanner && trialDaysRemaining !== null && (
        <TrialBanner
          daysRemaining={trialDaysRemaining}
          onUpgrade={() => router.push(`/payment?plan=${professional?.plan || 'look'}`)}
          plan={professional?.plan || 'look'}
        />
      )}

      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {isAdmin ? 'Panel de Administración' : '¡Hola de vuelta!'}
        </h1>
        <p className="mt-2 text-slate-600 text-lg">
          {isAdmin 
            ? 'Gestiona el sistema Agendalook desde aquí' 
            : `Bienvenido de vuelta, ${professional?.business_name || 'Usuario'}`
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white shadow-lg shadow-sky-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sky-100 text-sm font-medium">Total Reservas</p>
              <p className="text-3xl font-bold">{filteredBookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sky-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Este período</span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Servicios Activos</p>
              <p className="text-3xl font-bold">{currentServices}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-100 text-sm">
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Disponibles</span>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-6 text-white shadow-lg shadow-slate-600/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-100 text-sm font-medium">Reservas Recientes</p>
              <p className="text-3xl font-bold">
                {filteredBookings.filter(booking => 
                  isWithinInterval(new Date(booking.booking_date), { start: new Date(), end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
                ).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-slate-100 text-sm">
            <span>Próximos 7 días</span>
          </div>
        </div>

        {/* Plan Status */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Plan Actual</p>
              <p className="text-3xl font-bold">{professional?.plan?.toUpperCase() || 'FREE'}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-100 text-sm">
            <span>Activo</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/services"
            className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                <Plus className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Crear Servicio</p>
                <p className="text-sm text-slate-500">Añadir nuevo servicio</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/bookings"
            className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Ver Reservas</p>
                <p className="text-sm text-slate-500">Gestionar citas</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/availability"
            className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                <Clock className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Disponibilidad</p>
                <p className="text-sm text-slate-500">Configurar horarios</p>
              </div>
            </div>
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard/settings"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <Settings className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Configuración</p>
                  <p className="text-sm text-slate-500">Ajustar preferencias</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      {filteredBookings.length > 0 && (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Reservas Recientes</h2>
            <Link
              href="/dashboard/bookings"
              className="text-sky-600 hover:text-sky-700 font-medium text-sm hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          
          <div className="space-y-4">
            {filteredBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{booking.customer_name}</p>
                    <p className="text-sm text-slate-500">
                      {format(new Date(booking.booking_date), 'EEEE, d MMMM', { locale: es })} a las {booking.booking_time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{booking.service_id}</p>
                  <p className="text-sm text-slate-500">
                    {format(new Date(booking.booking_date), 'EEEE, d MMMM', { locale: es })} a las {booking.booking_time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Alert */}
      {professional?.plan === 'look' && (
        <PlanAlert 
          plan={professional.plan}
          currentBookings={filteredBookings.length}
          currentServices={currentServices}
          onUpgrade={() => router.push('/plans')}
        />
      )}
    </div>
  );
} 