"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, BookOpen, Calendar, Settings, Users, CreditCard, CheckCircle } from 'lucide-react';

export default function Tutorials() {
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
                src="/logo-main.png"
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
            Tutoriales
          </h1>
          <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Aprende a usar Agendalook con nuestras guías paso a paso
          </p>
        </div>

        {/* Tutorial Categories */}
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
              Configura tu cuenta y comienza a usar Agendalook en minutos
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Crear cuenta</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Configurar perfil</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Primer servicio</span>
              </div>
            </div>
            <Link 
              href="#getting-started"
              className="inline-flex items-center mt-6 text-lavender-600 hover:text-lavender-700 font-poppins font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Ver tutorial
            </Link>
          </div>

          {/* Services Management */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Gestionar Servicios</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Aprende a crear y gestionar tus servicios de belleza
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Crear servicios</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Editar precios</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Organizar categorías</span>
              </div>
            </div>
            <Link 
              href="#services"
              className="inline-flex items-center mt-6 text-lavender-600 hover:text-lavender-700 font-poppins font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Ver tutorial
            </Link>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Configurar Horarios</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Define tu disponibilidad y horarios de trabajo
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Horarios semanales</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Bloques de tiempo</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Días libres</span>
              </div>
            </div>
            <Link 
              href="#availability"
              className="inline-flex items-center mt-6 text-lavender-600 hover:text-lavender-700 font-poppins font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Ver tutorial
            </Link>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Gestionar Reservas</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Aprende a gestionar las reservas de tus clientes
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Ver reservas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Confirmar citas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Cancelar reservas</span>
              </div>
            </div>
            <Link 
              href="#bookings"
              className="inline-flex items-center mt-6 text-lavender-600 hover:text-lavender-700 font-poppins font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Ver tutorial
            </Link>
          </div>

          {/* Customization */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Personalizar Página</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Personaliza tu página de reservas para tus clientes
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Información del negocio</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Logo y colores</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">URL personalizada</span>
              </div>
            </div>
            <Link 
              href="#customization"
              className="inline-flex items-center mt-6 text-lavender-600 hover:text-lavender-700 font-poppins font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Ver tutorial
            </Link>
          </div>

          {/* Billing */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-playfair font-bold text-gray-800">Planes y Facturación</h3>
            </div>
            <p className="text-gray-600 font-poppins mb-6">
              Entiende los planes y la facturación de Agendalook
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Cambiar plan</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Ver facturas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-poppins">Métodos de pago</span>
              </div>
            </div>
            <Link 
              href="#billing"
              className="inline-flex items-center mt-6 text-lavender-600 hover:text-lavender-700 font-poppins font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Ver tutorial
            </Link>
          </div>
        </div>

        {/* Featured Tutorial */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center mr-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-playfair font-bold text-gray-800">Tutorial Completo: Configurar tu Negocio</h2>
                <p className="text-gray-600 font-poppins">Aprende todo lo necesario para comenzar con Agendalook</p>
              </div>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-poppins">Video tutorial próximamente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 font-poppins">En este tutorial aprenderás:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-poppins">Crear tu cuenta profesional</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-poppins">Configurar tu información de negocio</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-poppins">Crear tus primeros servicios</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-poppins">Configurar tu disponibilidad</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-poppins">Personalizar tu página de reservas</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 font-poppins">Duración:</h3>
                <p className="text-gray-700 font-poppins mb-4">15 minutos</p>
                
                <h3 className="font-semibold text-gray-800 mb-3 font-poppins">Nivel:</h3>
                <p className="text-gray-700 font-poppins mb-4">Principiante</p>
                
                <h3 className="font-semibold text-gray-800 mb-3 font-poppins">Requisitos:</h3>
                <ul className="space-y-1">
                  <li className="text-gray-700 font-poppins text-sm">• Cuenta de Agendalook</li>
                  <li className="text-gray-700 font-poppins text-sm">• Información de tu negocio</li>
                  <li className="text-gray-700 font-poppins text-sm">• Lista de servicios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 