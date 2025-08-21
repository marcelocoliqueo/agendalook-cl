"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

export default function Contact() {
  return (
    <MarketingLayout>
      <div className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Contáctanos
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos en menos de 24 horas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Envíanos un mensaje
              </h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Tu nombre"
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Tu apellido"
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Asunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="support">Soporte técnico</option>
                    <option value="billing">Facturación</option>
                    <option value="feature">Sugerencia de función</option>
                    <option value="partnership">Alianza comercial</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 focus-ring"
                >
                  <Send className="w-5 h-5" />
                  <span>Enviar mensaje</span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Información de contacto
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Email</h3>
                      <p className="text-slate-600">soporte@agendalook.cl</p>
                      <p className="text-slate-600">ventas@agendalook.cl</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Teléfono</h3>
                      <p className="text-slate-600">+56 9 1234 5678</p>
                      <p className="text-slate-600">Lun - Vie: 9:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Oficina</h3>
                      <p className="text-slate-600">Santiago, Chile</p>
                      <p className="text-slate-600">Av. Providencia 1234</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Horarios</h3>
                      <p className="text-slate-600">Lunes - Viernes: 9:00 - 18:00</p>
                      <p className="text-slate-600">Sábado: 9:00 - 14:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  ¿Buscas ayuda rápida?
                </h2>
                
                <div className="space-y-4">
                  <Link 
                    href="/help" 
                    className="block p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-semibold text-slate-800 mb-1">Centro de Ayuda</h3>
                    <p className="text-slate-600 text-sm">Encuentra respuestas a preguntas frecuentes</p>
                  </Link>

                  <Link 
                    href="/tutorials" 
                    className="block p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-semibold text-slate-800 mb-1">Tutoriales</h3>
                    <p className="text-slate-600 text-sm">Guías paso a paso para usar Agendalook</p>
                  </Link>

                  <Link 
                    href="/faq" 
                    className="block p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-semibold text-slate-800 mb-1">Preguntas Frecuentes</h3>
                    <p className="text-slate-600 text-sm">Respuestas rápidas a dudas comunes</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 