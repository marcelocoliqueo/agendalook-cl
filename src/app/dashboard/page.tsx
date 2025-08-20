'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { Professional, Booking } from '@/types';
import { Calendar, Clock, TrendingUp, Sparkles, Activity, Settings, Shield } from 'lucide-react';
import { PlanAlert } from '@/components/ui/PlanAlert';
import { PeriodFilter, PeriodType } from '@/components/ui/PeriodFilter';
import { getCurrentPlan, getUsageProgress } from '@/lib/plans';
import { downloadPDF } from '@/lib/pdf-generator';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { format, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

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
  
  const { user } = useAuth();
  const { getProfessionalByUserId } = useProfessional();
  const { getBookingsByProfessionalId } = useBookings(professional?.id || null);
  const { getServicesByProfessionalId } = useServices(professional?.id || null);

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
            updated_at: new Date().toISOString()
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
          setError('No se encontró el perfil profesional. Por favor, completa tu registro.');
          setLoading(false);
          return;
        }

        setProfessional(profData);
        
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
          Vista General
        </h1>
        <p className="text-gray-600 font-poppins">
          ¡Hola {professional?.business_name || 'Usuario'}! Aquí tienes un resumen de tu negocio.
        </p>
      </div>

      {/* Filtros de período */}
      <PeriodFilter
        currentPeriod={currentPeriod}
        onPeriodChange={handlePeriodChange}
        onExportPDF={handleExportPDF}
      />

      {/* Alerta de plan */}
      {professional && (
        <PlanAlert
          plan={professional.plan}
          currentBookings={stats.totalBookings}
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

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 font-poppins">Confirmadas</p>
            <p className="text-3xl font-bold text-green-600">{stats.confirmedBookings}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 font-poppins">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 font-poppins">Canceladas</p>
            <p className="text-3xl font-bold text-red-600">{stats.cancelledBookings}</p>
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
            {filteredBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {booking.customer_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 font-poppins">{booking.customer_name}</p>
                    <p className="text-sm text-gray-600 font-poppins">{booking.service_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 font-poppins">
                    {format(new Date(booking.booking_date), 'dd/MM/yyyy', { locale: es })} a las {booking.booking_time}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmada' : 
                     booking.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                  </span>
                </div>
              </div>
            ))}
            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-poppins">No hay reservas en este período</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 