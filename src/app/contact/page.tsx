"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
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
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
              Envíanos un mensaje
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent font-poppins"
                    placeholder="Tu nombre"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent font-poppins"
                    placeholder="Tu apellido"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent font-poppins"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Asunto
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent font-poppins"
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent font-poppins resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-lavender-500 to-coral-500 text-white py-4 px-8 rounded-xl font-semibold font-poppins hover:from-lavender-600 hover:to-coral-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar mensaje</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
                Información de contacto
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-poppins">Email</h3>
                    <p className="text-gray-600 font-poppins">soporte@agendalook.cl</p>
                    <p className="text-gray-600 font-poppins">ventas@agendalook.cl</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-poppins">Teléfono</h3>
                    <p className="text-gray-600 font-poppins">+56 9 1234 5678</p>
                    <p className="text-gray-600 font-poppins">Lun - Vie: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-poppins">Oficina</h3>
                    <p className="text-gray-600 font-poppins">Santiago, Chile</p>
                    <p className="text-gray-600 font-poppins">Av. Providencia 1234</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-poppins">Horarios</h3>
                    <p className="text-gray-600 font-poppins">Lunes - Viernes: 9:00 - 18:00</p>
                    <p className="text-gray-600 font-poppins">Sábado: 9:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
                ¿Buscas ayuda rápida?
              </h2>
              
              <div className="space-y-4">
                <Link 
                  href="/help" 
                  className="block p-4 border border-lavender-200 rounded-xl hover:bg-lavender-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 font-poppins mb-1">Centro de Ayuda</h3>
                  <p className="text-gray-600 font-poppins text-sm">Encuentra respuestas a preguntas frecuentes</p>
                </Link>

                <Link 
                  href="/tutorials" 
                  className="block p-4 border border-lavender-200 rounded-xl hover:bg-lavender-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 font-poppins mb-1">Tutoriales</h3>
                  <p className="text-gray-600 font-poppins text-sm">Guías paso a paso para usar Agendalook</p>
                </Link>

                <Link 
                  href="/faq" 
                  className="block p-4 border border-lavender-200 rounded-xl hover:bg-lavender-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 font-poppins mb-1">Preguntas Frecuentes</h3>
                  <p className="text-gray-600 font-poppins text-sm">Respuestas rápidas a dudas comunes</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 