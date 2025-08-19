'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, AlertCircle, Info, Clock, Calendar, DollarSign, Shield } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types';
import { Button } from './Button';

interface NotificationBellProps {
  professionalId?: string;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'new_booking':
    case 'booking_confirmed':
    case 'booking_cancelled':
      return <Calendar className="w-4 h-4" />;
    case 'payment_reminder':
    case 'subscription_grace_period':
    case 'subscription_suspended':
    case 'subscription_expired':
      return <DollarSign className="w-4 h-4" />;
    case 'system_maintenance':
      return <Shield className="w-4 h-4" />;
    case 'welcome_message':
      return <Info className="w-4 h-4" />;
    case 'service_created':
    case 'availability_updated':
      return <Clock className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const getNotificationColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'normal':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'low':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getPriorityLabel = (priority: Notification['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'Urgente';
    case 'high':
      return 'Alta';
    case 'normal':
      return 'Normal';
    case 'low':
      return 'Baja';
    default:
      return 'Normal';
  }
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
};

export function NotificationBell({ professionalId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, counts, markAsRead, markAllAsRead } = useNotifications(professionalId || null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };



  const unreadCount = counts.unread;
  const hasUrgentNotifications = counts.urgent > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6" />
        
        {/* Indicador de notificaciones no leídas */}
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full ${
            hasUrgentNotifications ? 'bg-red-500' : 'bg-coral-500'
          }`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-hidden">
          <div className="max-h-80 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {unreadCount} sin leer
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="ghost"
                  size="sm"
                  className="text-lavender-600 hover:text-lavender-700"
                >
                  Eliminar todas
                </Button>
              )}
            </div>
          </div>

                    {/* Lista de notificaciones */}
          <div className="flex-1 overflow-y-auto pb-4">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icono */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        getNotificationColor(notification.priority)
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <p className={`text-sm font-medium ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2 ml-2">
                            {notification.priority !== 'normal' && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {getPriorityLabel(notification.priority)}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>

                                             {/* Acciones */}
                       <div className="flex items-center space-x-1">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             markAsRead(notification.id);
                           }}
                           className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                           title="Eliminar notificación"
                         >
                           <Check className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 mt-auto">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {counts.total} notificación{counts.total !== 1 ? 'es' : ''}
                </span>
                <div className="flex items-center space-x-2">
                  {counts.urgent > 0 && (
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{counts.urgent} urgente{counts.urgent !== 1 ? 's' : ''}</span>
                    </span>
                  )}
                  {counts.high > 0 && (
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{counts.high} alta{counts.high !== 1 ? 's' : ''}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
} 