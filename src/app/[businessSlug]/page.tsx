'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Check, 
  Star,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useProfessional } from '@/hooks/useProfessional';
import { useServices } from '@/hooks/useServices';
import { useBookings } from '@/hooks/useBookings';
import { useAvailability } from '@/hooks/useAvailability';
import { Professional, Service, TimeSlot } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { sendClientConfirmationEmail, sendProfessionalNotificationEmail } from '@/lib/email';

interface PageProps {
  params: Promise<{ businessSlug: string }>;
}

interface BookingConfirmation {
  service: Service;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  price: number;
}

export default function BusinessPage({ params }: PageProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessSlug, setBusinessSlug] = useState<string>('');
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  const { getProfessionalBySlug } = useProfessional();
  const { getServicesBySlug } = useServices();
  const { createBooking, checkAvailability } = useBookings();
  const { getAvailabilityBySlug } = useAvailability();

  // Resolver los parámetros cuando el componente se monta
  useEffect(() => {
    params.then((resolvedParams) => {
      setBusinessSlug(resolvedParams.businessSlug);
    });
  }, [params]);

  // Cargar datos del profesional, servicios y disponibilidad
  useEffect(() => {
    const loadData = async () => {
      if (!businessSlug) return;

      try {
        setLoading(true);
        
        // Cargar profesional
        const profData = await getProfessionalBySlug(businessSlug);
        if (!profData) {
          setError('Negocio no encontrado');
          return;
        }
        setProfessional(profData);

        // Cargar servicios
        const servicesData = await getServicesBySlug(businessSlug);
        setServices(servicesData);

        // Cargar disponibilidad
        const availabilityData = await getAvailabilityBySlug(businessSlug);
        setAvailability(availabilityData);

      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [businessSlug, getProfessionalBySlug, getServicesBySlug, getAvailabilityBySlug]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    setError('');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(3);
    setError('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
    setError('');
  };

  const validateForm = () => {
    if (!selectedService) {
      setError('Por favor selecciona un servicio');
      return false;
    }
    if (!selectedDate) {
      setError('Por favor selecciona una fecha');
      return false;
    }
    if (!selectedTime) {
      setError('Por favor selecciona una hora');
      return false;
    }
    if (!clientName.trim()) {
      setError('Por favor ingresa tu nombre');
      return false;
    }
    if (!clientPhone.trim()) {
      setError('Por favor ingresa tu número de teléfono');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    if (!professional || !selectedService) {
      setError('Datos incompletos');
      setIsSubmitting(false);
      return;
    }

    try {
      // Verificar disponibilidad
      const isAvailable = await checkAvailability(
        professional.id,
        selectedDate,
        selectedTime,
        selectedService.duration
      );

      if (!isAvailable) {
        setError('Este horario ya no está disponible. Por favor selecciona otro.');
        setIsSubmitting(false);
        return;
      }

                   // Crear la reserva
             const bookingData = {
               professional_id: professional.id,
               service_id: selectedService.id,
               customer_name: clientName.trim(),
               customer_phone: clientPhone.trim(),
               booking_date: selectedDate,
               booking_time: selectedTime,
               status: 'pending' as const,
             };

             const newBooking = await createBooking(bookingData, professional.plan);

      if (newBooking) {
        // Enviar emails de notificación
        try {
          // Email al cliente (si tiene email)
          if (clientEmail) {
            await sendClientConfirmationEmail(clientEmail, {
              clientName: clientName.trim(),
              serviceName: selectedService.name,
              date: selectedDate,
              time: selectedTime,
              price: selectedService.price,
              businessName: professional.business_name,
              businessAddress: professional.address,
            });
          }

          // Email al profesional
          await sendProfessionalNotificationEmail(professional.email, {
            clientName: clientName.trim(),
            serviceName: selectedService.name,
            date: selectedDate,
            time: selectedTime,
            price: selectedService.price,
            clientPhone: clientPhone.trim(),
            duration: selectedService.duration,
          });
        } catch (emailError) {
          console.error('Error sending emails:', emailError);
          // No fallar la reserva si los emails fallan
        }

        // Mostrar confirmación
        setBookingConfirmation({
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          price: selectedService.price,
        });
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Error al crear la reserva. Por favor inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price / 100); // Convertir de centavos
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  // Generar fechas disponibles (próximos 7 días)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayOfWeek = date.getDay();
      
      // Verificar si hay disponibilidad para este día
      const dayAvailability = availability.filter(a => a.day_of_week === dayOfWeek);
      const isAvailable = dayAvailability.length > 0;
      
      dates.push({
        date: date.toISOString().split('T')[0],
        day: dayNames[dayOfWeek],
        available: isAvailable,
      });
    }
    
    return dates;
  };

  // Generar horarios disponibles basados en la disponibilidad
  const generateTimeSlots = (selectedDate: string) => {
    if (!selectedDate || !availability.length) return [];

    const selectedDay = new Date(selectedDate).getDay();
    const dayAvailability = availability.filter(a => a.day_of_week === selectedDay);
    
    if (dayAvailability.length === 0) return [];

    const slots: TimeSlot[] = [];
    
    // Generar slots de 1 hora entre 9:00 y 18:00
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      
      // Verificar si este horario está dentro de alguna franja disponible
      const isAvailable = dayAvailability.some(slot => {
        const slotStart = new Date(`2000-01-01T${slot.start_time}`);
        const slotEnd = new Date(`2000-01-01T${slot.end_time}`);
        const timeSlot = new Date(`2000-01-01T${time}`);
        
        return timeSlot >= slotStart && timeSlot < slotEnd;
      });
      
      slots.push({
        time,
        available: isAvailable,
      });
    }
    
    return slots;
  };

  const availableDates = generateAvailableDates();
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-lavender-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error && !professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
            Negocio no encontrado
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-playfair font-bold text-gray-800">
                Agendalook
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Business Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
            {professional?.business_name}
          </h1>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            {professional?.description || 'Servicios profesionales de belleza'}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-gold-500 fill-current" />
              <span>4.8</span>
              <span>(127 reseñas)</span>
            </div>
            <span>•</span>
            <span>{professional?.address || 'Ubicación no especificada'}</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-lavender-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-lavender-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 mt-2 text-sm text-gray-600">
            <span>Servicio</span>
            <span>Fecha</span>
            <span>Hora</span>
            <span>Datos</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 text-center">
              Selecciona tu servicio
            </h2>
            {services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay servicios disponibles en este momento.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-lavender-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                      <span className="text-xl font-bold text-lavender-600">{formatPrice(service.price)}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 text-center">
              Selecciona una fecha
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableDates.map((dateInfo) => (
                <button
                  key={dateInfo.date}
                  onClick={() => handleDateSelect(dateInfo.date)}
                  disabled={!dateInfo.available}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    dateInfo.available
                      ? 'border-gray-200 hover:border-lavender-300 hover:shadow-md'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="text-sm text-gray-500">{dateInfo.day}</div>
                  <div className="text-lg font-semibold">
                    {new Date(dateInfo.date).getDate()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 text-center">
              Selecciona una hora
            </h2>
            {timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay horarios disponibles para esta fecha.</p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 text-lavender-600 hover:text-lavender-700"
                >
                  Seleccionar otra fecha
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      slot.available
                        ? 'border-gray-200 hover:border-lavender-300 hover:shadow-md'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 text-center">
              Completa tus datos
            </h2>
            
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Resumen de tu reserva</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('es-CL', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-bold text-lavender-600">{formatPrice(selectedService?.price || 0)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="clientName"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de teléfono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="clientPhone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (opcional)
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lavender-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Para recibir confirmación por email
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-lavender-500 to-coral-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Confirmando reserva...
                  </>
                ) : (
                  'Confirmar reserva'
                )}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="¡Reserva Confirmada!"
        showCloseButton={false}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <p className="text-gray-600 mb-6">
            Tu cita ha sido reservada exitosamente. Recibirás un correo de confirmación con todos los detalles.
          </p>
          
          {bookingConfirmation && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Detalles de tu cita</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{bookingConfirmation.service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {new Date(bookingConfirmation.date).toLocaleDateString('es-CL', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{bookingConfirmation.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-bold text-lavender-600">{formatPrice(bookingConfirmation.price)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowConfirmation(false)}
              variant="outline"
              className="flex-1"
            >
              Cerrar
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-lavender-500 to-coral-500 text-white">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
} 