"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Search, BookOpen, MessageCircle, Settings, CreditCard, Calendar, Users } from 'lucide-react';

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-lavender-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-poppins">Volver al inicio</span>
            </Link>
            <div className="w-28 h-8 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Agendalook"
                width={112}
                height={31}
                className="w-28 h-8 object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Encuentra respuestas rápidas a todas tus preguntas sobre Agendalook
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Busca en el centro de ayuda..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent font-poppins"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Getting Started */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Primeros Pasos</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Guías paso a paso para configurar tu cuenta y comenzar a usar Agendalook
            </p>
            <ul className="space-y-2">
              <li><a href="#setup" className="text-lavender-600 hover:text-lavender-700 font-poppins">Configurar tu perfil</a></li>
              <li><a href="#services" className="text-lavender-600 hover:text-lavender-700 font-poppins">Crear servicios</a></li>
              <li><a href="#availability" className="text-lavender-600 hover:text-lavender-700 font-poppins">Configurar horarios</a></li>
            </ul>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Reservas</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Todo sobre la gestión de reservas y citas de tus clientes
            </p>
            <ul className="space-y-2">
              <li><a href="#manage-bookings" className="text-lavender-600 hover:text-lavender-700 font-poppins">Gestionar reservas</a></li>
              <li><a href="#notifications" className="text-lavender-600 hover:text-lavender-700 font-poppins">Notificaciones</a></li>
              <li><a href="#cancellations" className="text-lavender-600 hover:text-lavender-700 font-poppins">Cancelaciones</a></li>
            </ul>
          </div>

          {/* Account & Billing */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Cuenta y Pagos</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Información sobre planes, facturación y configuración de cuenta
            </p>
            <ul className="space-y-2">
              <li><a href="#plans" className="text-lavender-600 hover:text-lavender-700 font-poppins">Planes y precios</a></li>
              <li><a href="#billing" className="text-lavender-600 hover:text-lavender-700 font-poppins">Facturación</a></li>
              <li><a href="#account" className="text-lavender-600 hover:text-lavender-700 font-poppins">Configuración</a></li>
            </ul>
          </div>

          {/* Technical Support */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Soporte Técnico</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Solución de problemas técnicos y errores comunes
            </p>
            <ul className="space-y-2">
              <li><a href="#troubleshooting" className="text-lavender-600 hover:text-lavender-700 font-poppins">Solución de problemas</a></li>
              <li><a href="#errors" className="text-lavender-600 hover:text-lavender-700 font-poppins">Errores comunes</a></li>
              <li><a href="#performance" className="text-lavender-600 hover:text-lavender-700 font-poppins">Optimización</a></li>
            </ul>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Funcionalidades</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Descubre todas las características y herramientas disponibles
            </p>
            <ul className="space-y-2">
              <li><a href="#features" className="text-lavender-600 hover:text-lavender-700 font-poppins">Características</a></li>
              <li><a href="#integrations" className="text-lavender-600 hover:text-lavender-700 font-poppins">Integraciones</a></li>
              <li><a href="#customization" className="text-lavender-600 hover:text-lavender-700 font-poppins">Personalización</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Contacto</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              ¿No encuentras lo que buscas? Contáctanos directamente
            </p>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-lavender-600 hover:text-lavender-700 font-poppins">Formulario de contacto</Link></li>
              <li><a href="mailto:soporte@agendalook.cl" className="text-lavender-600 hover:text-lavender-700 font-poppins">Email de soporte</a></li>
              <li><a href="tel:+56912345678" className="text-lavender-600 hover:text-lavender-700 font-poppins">Teléfono</a></li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-playfair font-bold text-center text-gray-800 mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-4">
                ¿Cómo configuro mi página personalizada?
              </h3>
              <p className="text-gray-600 font-poppins">
                Ve a Configuración → Página Personalizada y completa tu información de negocio. 
                Tu URL será automáticamente: agendalook.cl/tunombre
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-4">
                ¿Cómo recibo las notificaciones de reservas?
              </h3>
              <p className="text-gray-600 font-poppins">
                Las notificaciones se envían automáticamente por email. También puedes configurar 
                notificaciones push en tu navegador desde Configuración → Notificaciones.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-4">
                ¿Puedo cambiar mi plan en cualquier momento?
              </h3>
              <p className="text-gray-600 font-poppins">
                Sí, puedes cambiar tu plan en cualquier momento desde Configuración → Plan. 
                Los cambios se aplican inmediatamente y se prorratean en la facturación.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-4">
                ¿Cómo cancelo una reserva?
              </h3>
              <p className="text-gray-600 font-poppins">
                Ve a Reservas → Selecciona la reserva → Acciones → Cancelar. 
                El cliente recibirá una notificación automática de la cancelación.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-playfair font-bold text-gray-800 mb-4">
                ¿Los datos de mis clientes están seguros?
              </h3>
              <p className="text-gray-600 font-poppins">
                Absolutamente. Utilizamos encriptación de nivel bancario y cumplimos con todas 
                las regulaciones de protección de datos. Tu información está completamente segura.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 