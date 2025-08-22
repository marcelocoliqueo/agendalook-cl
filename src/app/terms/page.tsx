"use client";

import Link from 'next/link';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

export default function TermsPage() {
  return (
    <MarketingLayout>
      <div className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Términos y Condiciones
            </h1>
            <p className="text-xl text-slate-600">
              Última actualización: {new Date().toLocaleDateString('es-CL')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Aceptación de los Términos
              </h2>
              <p className="text-slate-600 mb-4">
                Al acceder y utilizar Agendalook, aceptas estar sujeto a estos términos y condiciones. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Descripción del Servicio
              </h3>
              <p className="text-slate-600 mb-4">
                Agendalook es una plataforma de gestión de agenda online que permite a profesionales 
                y negocios gestionar reservas, citas y clientes de manera eficiente.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Uso Aceptable
              </h3>
              <p className="text-slate-600 mb-4">
                Te comprometes a usar el servicio solo para fines legales y apropiados. 
                No debes usar el servicio para:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Actividades ilegales o fraudulentas</li>
                <li>Spam o contenido malicioso</li>
                <li>Violar derechos de propiedad intelectual</li>
                <li>Interferir con el funcionamiento del servicio</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Cuentas de Usuario
              </h3>
              <p className="text-slate-600 mb-4">
                Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. 
                Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Privacidad y Datos
              </h3>
              <p className="text-slate-600 mb-4">
                Tu privacidad es importante. Nuestro uso de la información personal está 
                gobernado por nuestra Política de Privacidad, que forma parte de estos términos.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Propiedad Intelectual
              </h3>
              <p className="text-slate-600 mb-4">
                El servicio y su contenido original son propiedad de Agendalook y están 
                protegidos por leyes de propiedad intelectual.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Limitación de Responsabilidad
              </h3>
              <p className="text-slate-600 mb-4">
                En ningún caso Agendalook será responsable por daños indirectos, incidentales, 
                especiales o consecuentes que resulten del uso del servicio.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Modificaciones del Servicio
              </h3>
              <p className="text-slate-600 mb-4">
                Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento, 
                con o sin previo aviso.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Terminación
              </h3>
              <p className="text-slate-600 mb-4">
                Podemos terminar o suspender tu acceso al servicio en cualquier momento, 
                por cualquier razón, sin previo aviso.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Ley Aplicable
              </h3>
              <p className="text-slate-600 mb-4">
                Estos términos se rigen por las leyes de Chile. Cualquier disputa será 
                resuelta en los tribunales competentes de Santiago, Chile.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">
                Contacto
              </h3>
              <p className="text-slate-600 mb-4">
                Si tienes preguntas sobre estos términos, contáctanos:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:legal@agendalook.cl" className="text-sky-600 hover:text-sky-700">legal@agendalook.cl</a></li>
                <li><strong>Teléfono:</strong> <a href="tel:+56912345678" className="text-sky-600 hover:text-sky-700">+56 9 1234 5678</a></li>
                <li><strong>Formulario:</strong> <Link href="/contact" className="text-sky-600 hover:text-sky-700">Formulario de contacto</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 