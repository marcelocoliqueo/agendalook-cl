'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useAvailability } from '@/hooks/useAvailability';
import { useProfessional } from '@/hooks/useProfessional';
import { Availability, AvailabilityFormData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Edit, Trash2, Plus, Check, X, Loader2, Clock } from 'lucide-react';

// Esquema de validación para una franja horaria
const timeSlotSchema = z.object({
  start_time: z.string().min(1, 'Hora de inicio es obligatoria'),
  end_time: z.string().min(1, 'Hora de fin es obligatoria'),
}).refine((data) => {
  const start = new Date(`2000-01-01T${data.start_time}`);
  const end = new Date(`2000-01-01T${data.end_time}`);
  return end > start;
}, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['end_time'],
});

// Esquema de validación para un día completo
const daySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  is_available: z.boolean(),
  time_slots: z.array(timeSlotSchema).min(1, 'Debe tener al menos una franja horaria'),
}).refine((data) => {
  if (!data.is_available) return true;
  
  // Validar que no haya solapamientos en las franjas horarias
  const slots = data.time_slots.sort((a, b) => 
    new Date(`2000-01-01T${a.start_time}`).getTime() - 
    new Date(`2000-01-01T${b.start_time}`).getTime()
  );
  
  for (let i = 0; i < slots.length - 1; i++) {
    const currentEnd = new Date(`2000-01-01T${slots[i].end_time}`);
    const nextStart = new Date(`2000-01-01T${slots[i + 1].start_time}`);
    if (currentEnd >= nextStart) {
      return false;
    }
  }
  
  return true;
}, {
  message: 'Las franjas horarias no pueden solaparse',
  path: ['time_slots'],
});

// Esquema de validación para toda la semana
const weekSchema = z.object({
  days: z.array(daySchema),
});

type WeekFormValues = z.infer<typeof weekSchema>;

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const { professional } = useProfessional();
  const { 
    loading, 
    getAvailabilityByProfessionalId, 
    createAvailability, 
    updateAvailability, 
    deleteAvailability 
  } = useAvailability();
  
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WeekFormValues>({
    resolver: zodResolver(weekSchema),
    defaultValues: {
      days: DAYS_OF_WEEK.map(day => ({
        day_of_week: day.value,
        is_available: false,
        time_slots: [{ start_time: '09:00', end_time: '17:00' }],
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'days',
  });

  // Cargar disponibilidad al montar el componente
  useEffect(() => {
    if (professional?.id) {
      loadAvailability();
    }
  }, [professional?.id]);

  const loadAvailability = async () => {
    if (!professional?.id) return;
    
    try {
      const data = await getAvailabilityByProfessionalId(professional.id);
      setAvailability(data || []);
      
      // Convertir datos de BD al formato del formulario
      const daysData = DAYS_OF_WEEK.map(day => {
        const dayAvailability = data?.filter(a => a.day_of_week === day.value) || [];
        return {
          day_of_week: day.value,
          is_available: dayAvailability.length > 0,
          time_slots: dayAvailability.length > 0 
            ? dayAvailability.map(a => ({
                start_time: a.start_time,
                end_time: a.end_time,
              }))
            : [{ start_time: '09:00', end_time: '17:00' }],
        };
      });
      
      reset({ days: daysData });
    } catch (error) {
      showFeedback('error', 'Error al cargar la disponibilidad');
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: '' });
    }, 3000);
  };

  const onSubmit = async (data: WeekFormValues) => {
    if (!professional?.id) return;

    try {
      // Eliminar disponibilidad existente
      for (const existing of availability) {
        await deleteAvailability(existing.id);
      }

      // Crear nueva disponibilidad
      for (const day of data.days) {
        if (day.is_available) {
          for (const slot of day.time_slots) {
            await createAvailability(professional.id, {
              day_of_week: day.day_of_week,
              start_time: slot.start_time,
              end_time: slot.end_time,
              is_available: true,
            });
          }
        }
      }

      showFeedback('success', 'Disponibilidad guardada correctamente');
      await loadAvailability();
    } catch (error) {
      showFeedback('error', 'Error al guardar la disponibilidad');
    }
  };

  const addTimeSlot = (dayIndex: number) => {
    const currentSlots = watch(`days.${dayIndex}.time_slots`);
    const newSlot = { start_time: '09:00', end_time: '17:00' };
    
    // Encontrar un horario disponible
    const usedTimes = currentSlots.map(slot => ({
      start: new Date(`2000-01-01T${slot.start_time}`).getTime(),
      end: new Date(`2000-01-01T${slot.end_time}`).getTime(),
    }));
    
    // Ordenar por hora de inicio
    usedTimes.sort((a, b) => a.start - b.start);
    
    // Buscar un hueco disponible
    let newStart = new Date('2000-01-01T09:00').getTime();
    for (const time of usedTimes) {
      if (newStart + 60 * 60 * 1000 <= time.start) {
        break;
      }
      newStart = time.end;
    }
    
    const newStartTime = new Date(newStart).toTimeString().slice(0, 5);
    const newEndTime = new Date(newStart + 60 * 60 * 1000).toTimeString().slice(0, 5);
    
    const updatedSlots = [...currentSlots, { start_time: newStartTime, end_time: newEndTime }];
    
    // Actualizar el formulario
    const formData = watch();
    formData.days[dayIndex].time_slots = updatedSlots;
    reset(formData);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const currentSlots = watch(`days.${dayIndex}.time_slots`);
    const updatedSlots = currentSlots.filter((_, index) => index !== slotIndex);
    
    const formData = watch();
    formData.days[dayIndex].time_slots = updatedSlots;
    reset(formData);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user || !professional) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-lavender-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-gray-800">
          Configurar Disponibilidad
        </h1>
        <p className="text-gray-600 mt-2 font-poppins">
          Define tus horarios de trabajo para cada día de la semana
        </p>
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 font-playfair">
              Horarios Semanales
            </h2>
          </div>

          <div className="p-6">
            {fields.map((day, dayIndex) => {
              const dayData = DAYS_OF_WEEK.find(d => d.value === day.day_of_week);
              const isAvailable = watch(`days.${dayIndex}.is_available`);
              
              return (
                <div key={day.id} className="mb-8 last:mb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => {
                          const formData = watch();
                          formData.days[dayIndex].is_available = e.target.checked;
                          reset(formData);
                        }}
                        className="w-4 h-4 text-lavender-600 border-gray-300 rounded focus:ring-lavender-500"
                      />
                      <h3 className="text-lg font-semibold text-gray-800 font-playfair">
                        {dayData?.label}
                      </h3>
                    </div>
                  </div>

                  {isAvailable && (
                    <div className="space-y-4">
                      {watch(`days.${dayIndex}.time_slots`)?.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 font-poppins">
                              Franja {slotIndex + 1}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                                Hora de inicio
                              </label>
                              <Input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) => {
                                  const formData = watch();
                                  formData.days[dayIndex].time_slots[slotIndex].start_time = e.target.value;
                                  reset(formData);
                                }}
                                className="w-full"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                                Hora de fin
                              </label>
                              <Input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) => {
                                  const formData = watch();
                                  formData.days[dayIndex].time_slots[slotIndex].end_time = e.target.value;
                                  reset(formData);
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>

                          {watch(`days.${dayIndex}.time_slots`).length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addTimeSlot(dayIndex)}
                        className="text-lavender-600 border-lavender-200 hover:bg-lavender-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Franja
                      </Button>
                    </div>
                  )}

                  {!isAvailable && (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-500 font-poppins">
                        No disponible este día
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => loadAvailability()}
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
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Check className="w-5 h-5 mr-2" />
            )}
            Guardar Disponibilidad
          </Button>
        </div>
      </form>

      {/* Vista previa de disponibilidad actual */}
      {availability.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 font-playfair">
              Disponibilidad Actual
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAYS_OF_WEEK.map(day => {
                const dayAvailability = availability.filter(a => a.day_of_week === day.value);
                return (
                  <div key={day.value} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 font-playfair">
                      {day.label}
                    </h4>
                    {dayAvailability.length > 0 ? (
                      <div className="space-y-1">
                        {dayAvailability.map((slot, index) => (
                          <div key={index} className="text-sm text-gray-600 font-poppins">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 font-poppins">No disponible</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 