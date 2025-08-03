"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function Cookies() {
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
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Política de Cookies
            </h1>
            <p className="text-xl text-gray-600 font-poppins">
              Última actualización: Enero 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  1. ¿Qué son las Cookies?
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora, 
                  tablet o smartphone) cuando visitas un sitio web. Estas cookies permiten que el sitio web 
                  "recuerde" tus acciones y preferencias durante un período de tiempo.
                </p>
                <p className="text-gray-600 font-poppins">
                  En Agendalook.cl, utilizamos cookies para mejorar tu experiencia, analizar el tráfico del 
                  sitio y personalizar el contenido.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  2. Tipos de Cookies que Utilizamos
                </h2>
                
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                  2.1 Cookies Esenciales
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Estas cookies son necesarias para el funcionamiento básico del sitio web. Incluyen:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Cookies de sesión:</strong> Mantienen tu sesión activa mientras navegas</li>
                  <li><strong>Cookies de seguridad:</strong> Protegen contra ataques y fraudes</li>
                  <li><strong>Cookies de autenticación:</strong> Recuerdan que has iniciado sesión</li>
                  <li><strong>Cookies de preferencias:</strong> Guardan configuraciones básicas</li>
                </ul>

                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3 mt-6">
                  2.2 Cookies de Funcionalidad
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Estas cookies mejoran la funcionalidad y personalización:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Cookies de idioma:</strong> Recuerdan tu idioma preferido</li>
                  <li><strong>Cookies de tema:</strong> Mantienen tus preferencias de diseño</li>
                  <li><strong>Cookies de formularios:</strong> Recuerdan información que has ingresado</li>
                  <li><strong>Cookies de notificaciones:</strong> Controlan las notificaciones que recibes</li>
                </ul>

                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3 mt-6">
                  2.3 Cookies de Análisis
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Estas cookies nos ayudan a entender cómo se usa nuestro sitio:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Google Analytics:</strong> Analizan el tráfico y comportamiento de usuarios</li>
                  <li><strong>Cookies de rendimiento:</strong> Miden la velocidad de carga de páginas</li>
                  <li><strong>Cookies de errores:</strong> Registran errores para mejoras</li>
                  <li><strong>Cookies de uso:</strong> Analizan patrones de navegación</li>
                </ul>

                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3 mt-6">
                  2.4 Cookies de Marketing
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Estas cookies se utilizan para publicidad y marketing:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Cookies de publicidad:</strong> Muestran anuncios relevantes</li>
                  <li><strong>Cookies de redes sociales:</strong> Integran contenido de redes sociales</li>
                  <li><strong>Cookies de seguimiento:</strong> Rastrean efectividad de campañas</li>
                  <li><strong>Cookies de remarketing:</strong> Muestran anuncios personalizados</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  3. Cookies de Terceros
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  También utilizamos servicios de terceros que pueden establecer cookies:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Google Analytics:</strong> Para análisis de tráfico web</li>
                  <li><strong>Mercado Pago:</strong> Para procesamiento de pagos</li>
                  <li><strong>Resend:</strong> Para envío de emails</li>
                  <li><strong>Supabase:</strong> Para base de datos y autenticación</li>
                  <li><strong>Redes sociales:</strong> Para botones de compartir</li>
                </ul>
                <p className="text-gray-600 font-poppins mt-4">
                  Estos servicios tienen sus propias políticas de privacidad y cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  4. Duración de las Cookies
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Las cookies tienen diferentes duraciones:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Cookies de sesión:</strong> Se eliminan cuando cierras el navegador</li>
                  <li><strong>Cookies persistentes:</strong> Permanecen hasta que las elimines o expiren</li>
                  <li><strong>Cookies de autenticación:</strong> Duran hasta que cierres sesión</li>
                  <li><strong>Cookies de análisis:</strong> Pueden durar hasta 2 años</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  5. Cómo Controlar las Cookies
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Tienes varias opciones para controlar las cookies:
                </p>
                
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                  5.1 Configuración del Navegador
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Puedes configurar tu navegador para:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Bloquear todas las cookies</li>
                  <li>Permitir solo cookies de sitios confiables</li>
                  <li>Eliminar cookies al cerrar el navegador</li>
                  <li>Recibir notificaciones cuando se establezcan cookies</li>
                </ul>

                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3 mt-6">
                  5.2 Configuración Específica por Navegador
                </h3>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies</li>
                  <li><strong>Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt; Cookies</li>
                  <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Cookies</li>
                  <li><strong>Edge:</strong> Configuración &gt; Cookies y permisos del sitio</li>
                </ul>

                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3 mt-6">
                  5.3 Panel de Control de Cookies
                </h3>
                <p className="text-gray-600 font-poppins">
                  Próximamente implementaremos un panel de control de cookies en nuestro sitio 
                  que te permitirá gestionar tus preferencias de cookies de manera más fácil.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  6. Consecuencias de Deshabilitar Cookies
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Si deshabilitas las cookies, algunas funciones del sitio pueden no funcionar correctamente:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>No podrás iniciar sesión en tu cuenta</li>
                  <li>Las preferencias no se guardarán</li>
                  <li>Algunas funciones de personalización no estarán disponibles</li>
                  <li>El análisis de uso será limitado</li>
                  <li>Algunos servicios de terceros pueden no funcionar</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  7. Cookies y Menores de Edad
                </h2>
                <p className="text-gray-600 font-poppins">
                  Nuestro sitio no está dirigido a menores de 18 años. No recopilamos intencionalmente 
                  información personal de menores a través de cookies. Si eres padre o tutor y crees 
                  que tu hijo nos ha proporcionado información personal, contáctanos inmediatamente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  8. Actualizaciones de esta Política
                </h2>
                <p className="text-gray-600 font-poppins">
                  Podemos actualizar esta Política de Cookies ocasionalmente. Te notificaremos sobre 
                  cambios significativos por email o a través de nuestro sitio web. Te recomendamos 
                  revisar esta política periódicamente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  9. Contacto
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Si tienes preguntas sobre nuestra Política de Cookies, contáctanos:
                </p>
                <div className="text-gray-600 font-poppins">
                  <p><strong>Email:</strong> privacidad@agendalook.cl</p>
                  <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                  <p><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  10. Enlaces Relacionados
                </h2>
                <div className="space-y-2">
                  <Link href="/privacy" className="text-lavender-600 hover:text-lavender-700 font-poppins block">
                    → Política de Privacidad
                  </Link>
                  <Link href="/terms" className="text-lavender-600 hover:text-lavender-700 font-poppins block">
                    → Términos de Servicio
                  </Link>
                  <Link href="/help" className="text-lavender-600 hover:text-lavender-700 font-poppins block">
                    → Centro de Ayuda
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 