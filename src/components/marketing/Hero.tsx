'use client';

import Link from 'next/link';
import { useParallax } from '@/hooks/useParallax';
import { Calendar, Sparkles, Users, Star } from 'lucide-react';

export function Hero() {
  const blob1Ref = useParallax({ speed: 0.3, direction: 'up' });
  const blob2Ref = useParallax({ speed: 0.2, direction: 'down' });
  const blob3Ref = useParallax({ speed: 0.4, direction: 'left' });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-lavender-50 via-white to-coral-50">
      {/* Blobs de fondo con parallax */}
      <div
        ref={blob1Ref}
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-lavender-200 to-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      <div
        ref={blob2Ref}
        className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-primary-200 to-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"
        style={{ animationDuration: '6s' }}
      />
      <div
        ref={blob3Ref}
        className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-200 to-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
        style={{ animationDuration: '5s' }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Badge superior */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 mb-8">
          <Sparkles className="w-4 h-4 text-primary-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            La agenda más simple para profesionales
          </span>
        </div>

        {/* Headline principal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
          <span className="bg-gradient-to-r from-primary-600 via-coral-500 to-sky-500 bg-clip-text text-transparent animate-gradient-x">
            Agenda simple
          </span>
          <br />
          <span className="text-gray-900">y profesional</span>
        </h1>

        {/* Descripción */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Gestiona tu agenda, clientes y recordatorios de forma simple. 
          Perfecto para psicólogos, estilistas, coaches y más profesionales.
        </p>

        {/* CTA principal */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/register"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-coral-500 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">Crear cuenta gratis</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-coral-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link
            href="#how-it-works"
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full text-lg hover:border-primary-300 hover:text-primary-600 transition-all duration-300"
          >
            Ver demo
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-coral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">10k+</div>
            <div className="text-sm text-gray-600">Citas gestionadas</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-lavender-100 to-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-lavender-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">5k+</div>
            <div className="text-sm text-gray-600">Profesionales</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.9/5</div>
            <div className="text-sm text-gray-600">Calificación</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-coral-100 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-coral-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
