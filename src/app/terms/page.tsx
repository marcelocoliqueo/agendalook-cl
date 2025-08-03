"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
              Términos de Servicio
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
                  1. Aceptación de los Términos
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Al acceder y utilizar Agendalook.cl ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio ("Términos"). 
                  Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.
                </p>
                <p className="text-gray-600 font-poppins">
                  Agendalook.cl es operado por Agendalook SpA, una empresa registrada en Chile.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  2. Descripción del Servicio
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Agendalook.cl es una plataforma de gestión de citas y reservas para profesionales de belleza y estética. 
                  Nuestro servicio incluye:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Gestión de reservas y citas</li>
                  <li>Páginas web personalizadas para profesionales</li>
                  <li>Sistema de notificaciones automáticas</li>
                  <li>Gestión de servicios y horarios</li>
                  <li>Herramientas de comunicación con clientes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  3. Registro y Cuentas de Usuario
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Para usar nuestro servicio, debes crear una cuenta proporcionando información precisa y completa. 
                  Eres responsable de:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Mantener la confidencialidad de tu contraseña</li>
                  <li>Todas las actividades que ocurran bajo tu cuenta</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado</li>
                  <li>Proporcionar información veraz y actualizada</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  4. Uso Aceptable
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Te comprometes a usar el servicio solo para fines legales y de acuerdo con estos términos. 
                  Está prohibido:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Usar el servicio para actividades ilegales</li>
                  <li>Intentar acceder sin autorización a nuestros sistemas</li>
                  <li>Interferir con el funcionamiento del servicio</li>
                  <li>Transmitir virus o código malicioso</li>
                  <li>Violar derechos de propiedad intelectual</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  5. Planes y Facturación
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Ofrecemos diferentes planes de suscripción con características y límites específicos:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Plan Free:</strong> 3 servicios, 10 reservas por mes</li>
                  <li><strong>Plan Pro:</strong> $9.990/mes - Servicios y reservas ilimitados</li>
                  <li><strong>Plan Studio:</strong> $19.990/mes - Todo de Pro + múltiples usuarios</li>
                </ul>
                <p className="text-gray-600 font-poppins mt-4">
                  Los pagos se procesan mensualmente. Puedes cancelar tu suscripción en cualquier momento 
                  desde tu panel de configuración.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  6. Privacidad y Protección de Datos
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Tu privacidad es importante para nosotros. Recopilamos y procesamos datos personales 
                  de acuerdo con nuestra Política de Privacidad, que cumple con la Ley de Protección 
                  de Datos Personales de Chile.
                </p>
                <p className="text-gray-600 font-poppins">
                  Los datos de tus clientes son responsabilidad tuya y debes obtener su consentimiento 
                  para su procesamiento.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  7. Propiedad Intelectual
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  El servicio y su contenido son propiedad de Agendalook SpA y están protegidos por 
                  leyes de propiedad intelectual. Te otorgamos una licencia limitada para usar el 
                  servicio según estos términos.
                </p>
                <p className="text-gray-600 font-poppins">
                  Conservas los derechos sobre el contenido que subas a la plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  8. Limitación de Responsabilidad
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  En la máxima medida permitida por la ley, Agendalook SpA no será responsable por:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Daños indirectos, incidentales o consecuentes</li>
                  <li>Pérdida de datos o interrupciones del servicio</li>
                  <li>Acciones de terceros o usuarios</li>
                  <li>Eventos fuera de nuestro control razonable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  9. Terminación
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Podemos terminar o suspender tu cuenta inmediatamente, sin previo aviso, por:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Violación de estos términos</li>
                  <li>Uso fraudulento o abusivo del servicio</li>
                  <li>Incumplimiento de obligaciones de pago</li>
                  <li>Actividades ilegales</li>
                </ul>
                <p className="text-gray-600 font-poppins mt-4">
                  Puedes cancelar tu cuenta en cualquier momento desde tu panel de configuración.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  10. Modificaciones
                </h2>
                <p className="text-gray-600 font-poppins">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                  Las modificaciones entrarán en vigor inmediatamente después de su publicación. 
                  Tu uso continuado del servicio constituye aceptación de los términos modificados.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  11. Ley Aplicable y Jurisdicción
                </h2>
                <p className="text-gray-600 font-poppins">
                  Estos términos se rigen por las leyes de Chile. Cualquier disputa será resuelta 
                  en los tribunales competentes de Santiago, Chile.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  12. Contacto
                </h2>
                <p className="text-gray-600 font-poppins">
                  Si tienes preguntas sobre estos términos, contáctanos en:
                </p>
                <div className="mt-4 text-gray-600 font-poppins">
                  <p><strong>Email:</strong> legal@agendalook.cl</p>
                  <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                  <p><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 