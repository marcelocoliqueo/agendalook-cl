"use client";

import Link from 'next/link';
import { Search, BookOpen, MessageCircle, Settings, CreditCard, Calendar, Users } from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

export default function HelpCenter() {
  return (
    <MarketingLayout>
      <div className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Centro de Ayuda
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Encuentra respuestas rápidas a todas tus preguntas sobre Agendalook
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Busca en el centro de ayuda..."
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Getting Started */}
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Primeros Pasos</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Guías paso a paso para configurar tu cuenta y comenzar a usar Agendalook
              </p>
              <ul className="space-y-2">
                <li><a href="#setup" className="text-sky-600 hover:text-sky-700">Configurar tu perfil</a></li>
                <li><a href="#services" className="text-sky-600 hover:text-sky-700">Crear servicios</a></li>
                <li><a href="#availability" className="text-sky-600 hover:text-sky-700">Configurar horarios</a></li>
              </ul>
            </div>

            {/* Bookings */}
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Reservas</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Todo sobre la gestión de reservas y citas de tus clientes
              </p>
              <ul className="space-y-2">
                <li><a href="#manage-bookings" className="text-sky-600 hover:text-sky-700">Gestionar reservas</a></li>
                <li><a href="#notifications" className="text-sky-600 hover:text-sky-700">Notificaciones</a></li>
                <li><a href="#cancellations" className="text-sky-600 hover:text-sky-700">Cancelaciones</a></li>
              </ul>
            </div>

            {/* Account & Billing */}
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Cuenta y Pagos</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Información sobre tu cuenta, facturación y planes de suscripción
              </p>
              <ul className="space-y-2">
                <li><a href="#plans" className="text-sky-600 hover:text-sky-700">Planes y precios</a></li>
                <li><a href="#billing" className="text-sky-600 hover:text-sky-700">Facturación</a></li>
                <li><a href="#account" className="text-sky-600 hover:text-sky-700">Configuración</a></li>
              </ul>
            </div>

            {/* Technical Support */}
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Soporte Técnico</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Solución de problemas técnicos y optimización de la plataforma
              </p>
              <ul className="space-y-2">
                <li><a href="#troubleshooting" className="text-sky-600 hover:text-sky-700">Solución de problemas</a></li>
                <li><a href="#errors" className="text-sky-600 hover:text-sky-700">Errores comunes</a></li>
                <li><a href="#performance" className="text-sky-600 hover:text-sky-700">Optimización</a></li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Funcionalidades</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Descubre todas las características y herramientas disponibles
              </p>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sky-600 hover:text-sky-700">Características</a></li>
                <li><a href="#integrations" className="text-sky-600 hover:text-sky-700">Integraciones</a></li>
                <li><a href="#customization" className="text-sky-600 hover:text-sky-700">Personalización</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Contacto</h3>
              </div>
              <p className="text-slate-600 mb-6">
                ¿No encontraste lo que buscabas? Contáctanos directamente
              </p>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-sky-600 hover:text-sky-700">Formulario de contacto</Link></li>
                <li><a href="mailto:soporte@agendalook.cl" className="text-sky-600 hover:text-sky-700">Email de soporte</a></li>
                <li><a href="tel:+56912345678" className="text-sky-600 hover:text-sky-700">Teléfono</a></li>
              </ul>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Guía de Inicio Rápido
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Configura tu Perfil
                </h3>
                <p className="text-slate-600">
                  Completa tu información personal y de negocio para personalizar tu experiencia
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Crea tus Servicios
                </h3>
                <p className="text-slate-600">
                  Define los servicios que ofreces, precios y duración de cada sesión
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Configura Horarios
                </h3>
                <p className="text-slate-600">
                  Establece tu disponibilidad y horarios de trabajo para recibir reservas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 