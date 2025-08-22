"use client";

import Link from 'next/link';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <div className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Política de Privacidad
            </h1>
            <p className="text-xl text-slate-600">
              Última actualización: {new Date().toLocaleDateString('es-CL')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Información que Recopilamos
              </h2>
              <p className="text-slate-600 mb-4">
                Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, 
                configuras tu perfil o te comunicas con nosotros.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Información Personal
              </h3>
              <p className="text-slate-600 mb-4">
                Incluye tu nombre, dirección de email, información de contacto y detalles de tu negocio.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Información de Uso
              </h3>
              <p className="text-slate-600 mb-4">
                Recopilamos información sobre cómo utilizas nuestro servicio, incluyendo páginas visitadas, 
                funciones utilizadas y tiempo de uso.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Información de Dispositivo
              </h3>
              <p className="text-slate-600 mb-4">
                Podemos recopilar información sobre tu dispositivo, incluyendo tipo de navegador, 
                sistema operativo y dirección IP.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Cómo Utilizamos tu Información
              </h2>
              <p className="text-slate-600 mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Proporcionar y mantener nuestro servicio</li>
                <li>Procesar pagos y gestionar tu cuenta</li>
                <li>Enviar notificaciones y comunicaciones</li>
                <li>Mejorar y personalizar tu experiencia</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Compartir Información
              </h2>
              <p className="text-slate-600 mb-4">
                No vendemos, alquilamos ni compartimos tu información personal con terceros, 
                excepto en las siguientes circunstancias:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Con tu consentimiento explícito</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Con proveedores de servicios confiables</li>
                <li>Para proteger nuestros derechos y seguridad</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Seguridad de Datos
              </h2>
              <p className="text-slate-600 mb-4">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
                tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Retención de Datos
              </h2>
              <p className="text-slate-600 mb-4">
                Retenemos tu información personal solo durante el tiempo necesario para cumplir 
                con los propósitos descritos en esta política, a menos que la ley requiera un período más largo.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Tus Derechos
              </h2>
              <p className="text-slate-600 mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de datos</li>
                <li>Portabilidad de datos</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Cookies y Tecnologías Similares
              </h2>
              <p className="text-slate-600 mb-4">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia. 
                Para más detalles, consulta nuestra Política de Cookies.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Transferencias Internacionales
              </h2>
              <p className="text-slate-600 mb-4">
                Tu información puede ser transferida y procesada en países fuera de Chile. 
                Nos aseguramos de que estas transferencias cumplan con las leyes de protección de datos aplicables.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Menores de Edad
              </h2>
              <p className="text-slate-600 mb-4">
                Nuestro servicio no está dirigido a menores de 18 años. No recopilamos intencionalmente 
                información personal de menores. Si eres padre o tutor y crees que tu hijo nos ha proporcionado 
                información personal, contáctanos inmediatamente.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Cambios en esta Política
              </h2>
              <p className="text-slate-600 mb-4">
                Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos 
                a través de nuestro sitio web o por email.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Contacto
              </h2>
              <p className="text-slate-600 mb-4">
                Si tienes preguntas sobre esta política o quieres ejercer tus derechos, contáctanos:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:privacy@agendalook.cl" className="text-sky-600 hover:text-sky-700">privacy@agendalook.cl</a></li>
                <li><strong>Teléfono:</strong> <a href="tel:+56912345678" className="text-sky-600 hover:text-sky-700">+56 9 1234 5678</a></li>
                <li><strong>Formulario:</strong> <Link href="/contact" className="text-sky-600 hover:text-sky-700">Formulario de contacto</Link></li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Enlaces Relacionados
              </h2>
              <p className="text-slate-600 mb-4">
                Para más información sobre privacidad y protección de datos:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><Link href="/cookies" className="text-sky-600 hover:text-sky-700">Política de Cookies</Link></li>
                <li><Link href="/terms" className="text-sky-600 hover:text-sky-700">Términos y Condiciones</Link></li>
                <li><Link href="/help" className="text-sky-600 hover:text-sky-700">Centro de Ayuda</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 