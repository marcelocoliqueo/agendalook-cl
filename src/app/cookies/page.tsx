"use client";

import Link from 'next/link';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

export default function CookiesPage() {
  return (
    <MarketingLayout>
      <div className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Política de Cookies
            </h1>
            <p className="text-xl text-slate-600">
              Última actualización: {new Date().toLocaleDateString('es-CL')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                ¿Qué son las cookies?
              </h2>
              <p className="text-slate-600 mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
                Estas cookies nos ayudan a mejorar tu experiencia y proporcionar funcionalidades personalizadas.
              </p>
              <p className="text-slate-600">
                En Agendalook, utilizamos cookies para recordar tus preferencias, mantener tu sesión activa y 
                analizar cómo utilizas nuestro servicio.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Tipos de cookies que utilizamos
              </h3>
              <p className="text-slate-600 mb-4">
                Utilizamos diferentes tipos de cookies para diferentes propósitos:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de funcionalidad:</strong> Recuerdan tus preferencias y configuraciones</li>
                <li><strong>Cookies de rendimiento:</strong> Nos ayudan a mejorar la velocidad y funcionalidad</li>
                <li><strong>Cookies de análisis:</strong> Nos proporcionan información sobre el uso del sitio</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Cookies de terceros
              </h3>
              <p className="text-slate-600 mb-4">
                Algunos servicios que utilizamos pueden colocar cookies en tu dispositivo:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Google Analytics:</strong> Para analizar el tráfico y uso del sitio</li>
                <li><strong>MercadoPago:</strong> Para procesar pagos en Chile</li>
                <li><strong>Supabase:</strong> Para autenticación y base de datos</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Cómo gestionar las cookies
              </h3>
              <p className="text-slate-600 mb-4">
                Puedes controlar y gestionar las cookies de varias maneras:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Configuración del navegador:</strong> La mayoría de navegadores permiten bloquear o eliminar cookies</li>
                <li><strong>Configuración de privacidad:</strong> Puedes ajustar la configuración de privacidad en tu cuenta</li>
                <li><strong>Herramientas de terceros:</strong> Existen herramientas que te permiten gestionar cookies específicas</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Cookies específicas de Agendalook
              </h3>
              <p className="text-slate-600 mb-4">
                Nuestras cookies específicas incluyen:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>auth_token:</strong> Mantiene tu sesión activa de forma segura</li>
                <li><strong>user_preferences:</strong> Recuerda tus configuraciones y preferencias</li>
                <li><strong>business_settings:</strong> Almacena la configuración de tu negocio</li>
                <li><strong>notification_settings:</strong> Recuerda tus preferencias de notificaciones</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Actualizaciones de esta política
              </h3>
              <p className="text-slate-600 mb-4">
                Podemos actualizar esta política de cookies ocasionalmente. Te notificaremos sobre cualquier cambio 
                significativo a través de nuestro sitio web o por email.
              </p>
              <p className="text-slate-600">
                Te recomendamos revisar esta política regularmente para mantenerte informado sobre cómo utilizamos las cookies.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Contacto
              </h3>
              <p className="text-slate-600 mb-4">
                Si tienes preguntas sobre nuestra política de cookies o cómo utilizamos las cookies, 
                no dudes en contactarnos:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:privacy@agendalook.cl" className="text-sky-600 hover:text-sky-700">privacy@agendalook.cl</a></li>
                <li><strong>Teléfono:</strong> <a href="tel:+56912345678" className="text-sky-600 hover:text-sky-700">+56 9 1234 5678</a></li>
                <li><strong>Formulario:</strong> <Link href="/contact" className="text-sky-600 hover:text-sky-700">Formulario de contacto</Link></li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Enlaces relacionados
              </h3>
              <p className="text-slate-600 mb-4">
                Para más información sobre privacidad y protección de datos:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><Link href="/privacy" className="text-sky-600 hover:text-sky-700">Política de Privacidad</Link></li>
                <li><Link href="/terms" className="text-sky-600 hover:text-sky-700">Términos y Condiciones</Link></li>
                <li><Link href="/help" className="text-sky-600 hover:text-sky-700">Centro de Ayuda</Link></li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Consentimiento
              </h3>
              <p className="text-slate-600 mb-4">
                Al continuar utilizando nuestro sitio web, aceptas el uso de cookies según se describe en esta política. 
                Si no estás de acuerdo con el uso de cookies, puedes configurar tu navegador para bloquearlas, 
                aunque esto puede afectar la funcionalidad del sitio.
              </p>
              <p className="text-slate-600">
                Tu privacidad es importante para nosotros, y nos comprometemos a protegerla mientras te proporcionamos 
                la mejor experiencia posible en Agendalook.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 