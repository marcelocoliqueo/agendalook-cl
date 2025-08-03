"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Sparkles, Users, Star, Heart, Check, Menu, X } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-32 h-9 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Agendalook"
                  width={128}
                  height={36}
                  className="w-32 h-9 object-contain"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
              >
                Características
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
              >
                Cómo funciona
              </Link>
              <Link
                href="#pricing"
                className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
              >
                Precios
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
              >
                Testimonios
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-poppins text-sm font-medium"
              >
                Crear cuenta
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-lavender-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4 pt-4">
                <Link
                  href="#features"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
                >
                  Características
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
                >
                  Cómo funciona
                </Link>
                <Link
                  href="#pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
                >
                  Precios
                </Link>
                <Link
                  href="#testimonials"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium"
                >
                  Testimonios
                </Link>
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-700 hover:text-lavender-600 transition-colors font-poppins text-sm font-medium mb-3"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-poppins text-sm font-medium inline-block"
                  >
                    Crear cuenta
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-playfair font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
            Tu cita,{' '}
            <span className="bg-gradient-to-r from-lavender-500 to-coral-500 bg-clip-text text-transparent">
              tu estilo
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto font-poppins leading-relaxed">
            La plataforma más elegante para agendar servicios de belleza. 
            Conecta con tus clientes de manera profesional y organizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/register"
              className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-poppins"
            >
              Comenzar gratis
            </Link>
            <Link
              href="#features"
              className="border-2 border-lavender-500 text-lavender-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-lavender-50 transition-all duration-300 font-poppins"
            >
              Conoce más
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-center text-gray-800 mb-8 md:mb-16">
            Todo lo que necesitas para tu negocio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-lavender-100">
              <div className="flex justify-center mb-6">
                <Image
                  src="/schedule-icon.png"
                  alt="Agenda Inteligente"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 font-playfair">
                Agenda Inteligente
              </h3>
              <p className="text-gray-600 font-poppins">
                Gestiona tu disponibilidad y recibe reservas automáticamente. 
                Sin más llamadas perdidas.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-coral-100">
              <div className="flex justify-center mb-6">
                <Image
                  src="/website-icon.png"
                  alt="Página Personalizada"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 font-playfair">
                Página Personalizada
              </h3>
              <p className="text-gray-600 font-poppins">
                Cada profesional tiene su propia página web elegante 
                para mostrar servicios y recibir reservas.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gold-100">
              <div className="flex justify-center mb-6">
                <Image
                  src="/star-icon.png"
                  alt="Experiencia Premium"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 font-playfair">
                Experiencia Premium
              </h3>
              <p className="text-gray-600 font-poppins">
                Diseño moderno y elegante que refleja la calidad 
                de tus servicios de belleza.
              </p>
            </div>
          </div>
        </div>

        {/* Cómo Funciona */}
        <div id="how-it-works" className="mt-24">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center text-gray-800 mb-16">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-playfair">
                Crea tu cuenta
              </h3>
              <p className="text-gray-600 font-poppins text-sm">
                Regístrate gratis y configura tu perfil profesional
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-playfair">
                Agrega tus servicios
              </h3>
              <p className="text-gray-600 font-poppins text-sm">
                Define servicios, precios y duración
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-playfair">
                Configura disponibilidad
              </h3>
              <p className="text-gray-600 font-poppins text-sm">
                Define tus horarios de trabajo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-playfair">
                Recibe reservas
              </h3>
              <p className="text-gray-600 font-poppins text-sm">
                Los clientes reservan automáticamente
              </p>
            </div>
          </div>
        </div>

        {/* Planes y Precios */}
        <section id="pricing" className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-center text-gray-800 mb-8 md:mb-16">
            Planes que se adaptan a ti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Plan Free */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-800 mb-2">$0</div>
                <p className="text-gray-600">Perfecto para empezar</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Hasta 10 reservas por mes</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Máximo 3 servicios</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Página pública personalizada</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Notificaciones por email</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Soporte por email</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center"
              >
                Empezar gratis
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-lavender-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Más Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-lavender-600 mb-2">$9.990</div>
                <p className="text-gray-600">Para profesionales establecidos</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Reservas ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Servicios ilimitados</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Analytics avanzados</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Personalización de colores</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Soporte prioritario</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Sin marca de Agendalook</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gradient-to-r from-lavender-500 to-coral-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 block text-center"
              >
                Empezar con Pro
              </Link>
            </div>

            {/* Plan Studio */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-coral-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Studio</h3>
                <div className="text-4xl font-bold text-coral-600 mb-2">$19.990</div>
                <p className="text-gray-600">Para estudios y equipos</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Todo de Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Múltiples usuarios</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Gestión de equipo</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Personalización completa</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">API personalizada</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Soporte dedicado</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gradient-to-r from-coral-500 to-lavender-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 block text-center"
              >
                Empezar con Studio
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="mt-16 md:mt-24 text-center">
          <div className="bg-gradient-to-r from-lavender-500 via-coral-500 to-gold-500 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-4 md:mb-6">
              ¿Quieres transformar tu negocio?
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 font-poppins">
              Únete a cientos de profesionales que ya confían en Agendalook
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-lavender-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:shadow-lg transition-all duration-300 inline-block font-poppins"
              >
                Crear cuenta gratis
              </Link>
              <Link
                href="#pricing"
                className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-white hover:text-lavender-600 transition-all duration-300 inline-block font-poppins"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonials" className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-center text-gray-800 mb-8 md:mb-16">
            Lo que dicen los profesionales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 font-poppins">
                "Agendalook transformó mi negocio. Ahora recibo reservas automáticamente y mis clientes están más satisfechos."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  MC
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">María Carmen</h4>
                  <p className="text-sm text-gray-600">Estilista, Santiago</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 font-poppins">
                "La página personalizada es increíble. Mis clientes pueden reservar fácilmente y yo tengo todo organizado."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  AP
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Ana Paula</h4>
                  <p className="text-sm text-gray-600">Manicurista, Valparaíso</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 font-poppins">
                "Desde que uso Agendalook, mi agenda está siempre llena. Es la mejor inversión que hice para mi negocio."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  VG
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Valentina González</h4>
                  <p className="text-sm text-gray-600">Esteticista, Concepción</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-gradient-to-r from-lavender-50 to-coral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo y descripción */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
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
              <p className="text-gray-600 font-poppins mb-4 max-w-md">
                La plataforma más completa para profesionales de belleza. Gestiona tu agenda, 
                recibe reservas automáticas y haz crecer tu negocio.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-lavender-600 hover:text-lavender-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-lavender-600 hover:text-lavender-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-lavender-600 hover:text-lavender-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h3 className="font-playfair font-bold text-gray-800 mb-4">Plataforma</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">Características</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">Precios</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">Testimonios</a></li>
                <li><a href="/register" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">Registrarse</a></li>
              </ul>
            </div>

                         {/* Soporte */}
             <div>
               <h3 className="font-playfair font-bold text-gray-800 mb-4">Soporte</h3>
               <ul className="space-y-2">
                 <li><Link href="/help" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">Centro de ayuda</Link></li>
                 <li><Link href="/contact" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">Contacto</Link></li>
                 <li><Link href="/tutorials" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">Tutoriales</Link></li>
                 <li><Link href="/faq" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins">FAQ</Link></li>
               </ul>
             </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-lavender-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 font-poppins mb-4 md:mb-0">
                © 2025 Agendalook.cl - Tu cita, tu estilo
              </p>
                             <div className="flex space-x-6">
                 <Link href="/terms" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins text-sm">Términos de servicio</Link>
                 <Link href="/privacy" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins text-sm">Política de privacidad</Link>
                 <Link href="/cookies" className="text-gray-600 hover:text-lavender-600 transition-colors font-poppins text-sm">Cookies</Link>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
