'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useServices } from '@/hooks/useServices';
import { useProfessional } from '@/hooks/useProfessional';
import { Service, ServiceFormData, Professional } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { LoadingSpinner, ButtonLoader } from '@/components/ui/LoadingSpinner';

// Esquema de validación
const serviceSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  duration: z.number()
    .min(10, 'La duración mínima es 10 minutos')
    .max(180, 'La duración máxima es 180 minutos'),
  price: z.number()
    .min(1000, 'El precio mínimo es $1.000 CLP'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const { user } = useAuth();
  const { getProfessionalByUserId } = useProfessional();
  const { 
    loading, 
    getServicesByProfessionalId, 
    createService, 
    updateService, 
    deleteService 
  } = useServices();

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [professionalLoading, setProfessionalLoading] = useState(true);

  // Cargar profesional
  useEffect(() => {
    const loadProfessional = async () => {
      if (!user?.id) {
        setProfessionalLoading(false);
        return;
      }
      
      try {
        const profData = await getProfessionalByUserId(user.id);
        setProfessional(profData);
      } catch (error) {
        console.error('Error loading professional:', error);
      } finally {
        setProfessionalLoading(false);
      }
    };

    loadProfessional();
  }, [user?.id, getProfessionalByUserId]);
  
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      duration: 60,
      price: 0,
    },
  });

  // Cargar servicios al montar el componente
  useEffect(() => {
    console.log('🔍 Debug - Services useEffect:', { professional, professionalId: professional?.id });
    
    const loadServices = async () => {
      if (!professional?.id) {
        console.log('🔍 Debug - No professional ID, returning');
        return;
      }
      
      try {
        console.log('🔍 Debug - Loading services for professional:', professional.id);
          const data = await getServicesByProfessionalId(professional!.id);
        console.log('🔍 Debug - Services loaded:', data);
        setServices(data || []);
      } catch (error) {
        console.error('🔍 Debug - Error loading services:', error);
        showFeedback('error', 'Error al cargar los servicios');
      }
    };

    loadServices();
  }, [professional?.id]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: '' });
    }, 3000);
  };

  const onSubmit = async (data: ServiceFormValues) => {
          if (!professional?.id) return;

          try {
            if (editingService) {
              // Actualizar servicio existente
              await updateService(editingService.id, {
                name: data.name,
                description: '',
                duration: data.duration,
                price: data.price,
              });
              showFeedback('success', 'Servicio actualizado correctamente');
            } else {
              // Crear nuevo servicio
              await createService(professional.id, {
                name: data.name,
                description: '',
                duration: data.duration,
                price: data.price,
              }, professional.plan);
              showFeedback('success', 'Servicio creado correctamente');
            }

      // Limpiar formulario y recargar servicios
      reset();
      setEditingService(null);
      setIsFormOpen(false);
      // Recargar servicios
      const refreshed = await getServicesByProfessionalId(professional!.id);
      setServices(refreshed || []);
    } catch (error) {
      showFeedback('error', 'Error al guardar el servicio');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setValue('name', service.name);
    setValue('duration', service.duration);
    setValue('price', service.price / 100); // Convertir de centavos a pesos
    setIsFormOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;

    try {
      await deleteService(serviceId);
      showFeedback('success', 'Servicio eliminado correctamente');
      // Recargar servicios
      const data = await getServicesByProfessionalId(professional!.id);
      setServices(data || []);
    } catch (error) {
      showFeedback('error', 'Error al eliminar el servicio');
    }
  };

  const handleCancel = () => {
    reset();
    setEditingService(null);
    setIsFormOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price / 100);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (!user || !professional || professionalLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-800">
            Mis Servicios
          </h1>
          <p className="text-gray-600 mt-2 font-poppins">
            Gestiona los servicios que ofreces a tus clientes
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Servicio
        </Button>
      </div>

      {/* Feedback */}
      {feedback.type && (
        <div className={`mb-6 p-4 rounded-lg ${
          feedback.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {feedback.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <X className="w-5 h-5 mr-2" />
            )}
            {feedback.message}
          </div>
        </div>
      )}

      {/* Formulario */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-lavender-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 font-playfair">
            {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Nombre del Servicio *
                </label>
                <Input
                  {...register('name')}
                  placeholder="Ej: Manicure básico"
                  error={errors.name?.message}
                />
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Duración (minutos) *
                </label>
                <Input
                  {...register('duration', { valueAsNumber: true })}
                  type="number"
                  min="10"
                  max="180"
                  placeholder="60"
                  error={errors.duration?.message}
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Precio (CLP) *
                </label>
                <Input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min="1000"
                  placeholder="15000"
                  error={errors.price?.message}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
              >
                {isSubmitting || loading ? (
                  <ButtonLoader size="sm" />
                ) : (
                  <Check className="w-5 h-5 mr-2" />
                )}
                {editingService ? 'Actualizar' : 'Crear'} Servicio
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Servicios */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 font-playfair">
            Servicios Activos ({services.length})
          </h3>
        </div>

        {services.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-lavender-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 font-playfair">
              No tienes servicios aún
            </h3>
            <p className="text-gray-600 mb-4 font-poppins">
              Comienza agregando tu primer servicio para que los clientes puedan reservar
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Primer Servicio
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 font-playfair">
                      {service.name}
                    </h4>
                    <div className="flex items-center space-x-6 text-sm text-gray-600 font-poppins">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-lavender-500 rounded-full mr-2"></span>
                        {formatDuration(service.duration)}
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-coral-500 rounded-full mr-2"></span>
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="text-lavender-600 border-lavender-200 hover:bg-lavender-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 