"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
              Política de Privacidad
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
                  1. Introducción
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Agendalook SpA ("nosotros", "nuestro", "la Compañía") se compromete a proteger tu privacidad. 
                  Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tu información 
                  personal cuando utilizas nuestro servicio Agendalook.cl.
                </p>
                <p className="text-gray-600 font-poppins">
                  Esta política cumple con la Ley de Protección de Datos Personales de Chile (Ley N° 19.628) 
                  y el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  2. Información que Recopilamos
                </h2>
                
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3">
                  2.1 Información de Profesionales
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Cuando te registras como profesional, recopilamos:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Nombre completo y apellidos</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Información del negocio (nombre, descripción, dirección)</li>
                  <li>Información de servicios y precios</li>
                  <li>Horarios de trabajo y disponibilidad</li>
                  <li>Información de pago y facturación</li>
                </ul>

                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3 mt-6">
                  2.2 Información de Clientes
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Cuando los clientes realizan reservas, recopilamos:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Información de la reserva (servicio, fecha, hora)</li>
                  <li>Notas o comentarios sobre la reserva</li>
                </ul>

                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-3 mt-6">
                  2.3 Información Automática
                </h3>
                <p className="text-gray-600 font-poppins mb-4">
                  Recopilamos automáticamente:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Dirección IP y datos de ubicación</li>
                  <li>Información del navegador y dispositivo</li>
                  <li>Datos de uso y actividad en la plataforma</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  3. Cómo Usamos tu Información
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Utilizamos tu información para:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Proporcionar y mantener nuestro servicio</li>
                  <li>Procesar reservas y gestionar citas</li>
                  <li>Enviar notificaciones y confirmaciones</li>
                  <li>Procesar pagos y facturación</li>
                  <li>Proporcionar soporte al cliente</li>
                  <li>Mejorar y personalizar nuestro servicio</li>
                  <li>Cumplir con obligaciones legales</li>
                  <li>Prevenir fraudes y abusos</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  4. Compartir Información
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Con tu consentimiento:</strong> Solo cuando nos autorices explícitamente</li>
                  <li><strong>Proveedores de servicios:</strong> Para procesar pagos, enviar emails, etc.</li>
                  <li><strong>Requerimientos legales:</strong> Cuando la ley lo exija</li>
                  <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos y seguridad</li>
                  <li><strong>Transferencias empresariales:</strong> En caso de fusión o venta de la empresa</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  5. Almacenamiento y Seguridad
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Encriptación SSL/TLS para transmisión de datos</li>
                  <li>Encriptación de datos sensibles en reposo</li>
                  <li>Acceso restringido a datos personales</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Copias de seguridad regulares</li>
                  <li>Actualizaciones regulares de seguridad</li>
                </ul>
                <p className="text-gray-600 font-poppins mt-4">
                  Los datos se almacenan en servidores seguros ubicados en Chile y la Unión Europea.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  6. Cookies y Tecnologías Similares
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Utilizamos cookies y tecnologías similares para:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Recordar tus preferencias y configuraciones</li>
                  <li>Analizar el uso de nuestro servicio</li>
                  <li>Mejorar la funcionalidad y rendimiento</li>
                  <li>Proporcionar contenido personalizado</li>
                  <li>Garantizar la seguridad de la plataforma</li>
                </ul>
                <p className="text-gray-600 font-poppins mt-4">
                  Puedes controlar las cookies a través de la configuración de tu navegador. 
                  Sin embargo, deshabilitar ciertas cookies puede afectar la funcionalidad del servicio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  7. Tus Derechos
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Tienes los siguientes derechos sobre tus datos personales:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li><strong>Acceso:</strong> Solicitar información sobre los datos que tenemos</li>
                  <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                  <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos</li>
                  <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                  <li><strong>Limitación:</strong> Restringir el procesamiento de tus datos</li>
                  <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                  <li><strong>Retirada del consentimiento:</strong> Revocar el consentimiento otorgado</li>
                </ul>
                <p className="text-gray-600 font-poppins mt-4">
                  Para ejercer estos derechos, contáctanos en privacidad@agendalook.cl
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  8. Retención de Datos
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Conservamos tu información personal durante el tiempo necesario para:
                </p>
                <ul className="list-disc pl-6 text-gray-600 font-poppins space-y-2">
                  <li>Proporcionar nuestros servicios</li>
                  <li>Cumplir con obligaciones legales</li>
                  <li>Resolver disputas</li>
                  <li>Hacer cumplir nuestros acuerdos</li>
                </ul>
                <p className="text-gray-600 font-poppins mt-4">
                  Los datos se eliminan automáticamente después de 5 años de inactividad, 
                  a menos que la ley requiera un período de retención más largo.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  9. Transferencias Internacionales
                </h2>
                <p className="text-gray-600 font-poppins">
                  Tus datos pueden ser transferidos y procesados en países fuera de Chile, 
                  incluyendo la Unión Europea y Estados Unidos. Estas transferencias se realizan 
                  con las garantías adecuadas y en cumplimiento de las leyes aplicables.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  10. Menores de Edad
                </h2>
                <p className="text-gray-600 font-poppins">
                  Nuestro servicio no está dirigido a menores de 18 años. No recopilamos 
                  intencionalmente información personal de menores. Si eres padre o tutor y 
                  crees que tu hijo nos ha proporcionado información personal, contáctanos 
                  inmediatamente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  11. Cambios a esta Política
                </h2>
                <p className="text-gray-600 font-poppins">
                  Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos 
                  sobre cambios significativos por email o a través de nuestro servicio. 
                  Te recomendamos revisar esta política periódicamente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                  12. Contacto
                </h2>
                <p className="text-gray-600 font-poppins mb-4">
                  Si tienes preguntas sobre esta Política de Privacidad o sobre el manejo de tus datos, contáctanos:
                </p>
                <div className="text-gray-600 font-poppins">
                  <p><strong>Email:</strong> privacidad@agendalook.cl</p>
                  <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                  <p><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
                  <p><strong>Oficial de Protección de Datos:</strong> dpo@agendalook.cl</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 