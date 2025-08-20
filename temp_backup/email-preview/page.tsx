'use client';

import { useState } from 'react';

export default function EmailPreviewPage() {
  const [selectedEmail, setSelectedEmail] = useState('welcome');

  const emailTemplates = {
    welcome: {
      title: 'Email de Bienvenida',
      subject: '¡Bienvenido a Agendalook! Confirma tu cuenta',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); padding: 40px 30px; text-align: center; color: white;">
            <div style="margin-bottom: 20px;">
              <img src="/logo.png" alt="Agendalook" style="width: 120px; height: auto; margin: 0 auto 15px; display: block; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));">
              <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Agendalook</div>
              <div style="font-size: 18px; opacity: 0.95; font-weight: 300;">Tu cita, tu estilo</div>
            </div>
          </div>
          
          <div style="padding: 50px 40px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);">
            <div style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 25px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2;">¡Bienvenido a Agendalook!</div>
            <div style="font-size: 18px; color: #6b7280; line-height: 1.7; margin-bottom: 40px; max-width: 480px; margin-left: auto; margin-right: auto;">Gracias por unirte a la plataforma más elegante para agendar servicios de belleza. Para comenzar a usar tu cuenta y acceder a todas las funcionalidades, confirma tu dirección de email.</div>
            
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); color: white; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: bold; font-size: 18px; margin: 30px 0; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);">✨ Confirmar mi cuenta</a>
            
                         <div style="margin: 50px 0; padding: 0 20px;">
               <div style="text-align: center; font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 40px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Características Principales</div>
               <div style="display: flex; flex-direction: column; gap: 25px; max-width: 500px; margin: 0 auto;">
                 <div style="display: flex; align-items: center; padding: 25px; background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%); border-radius: 16px; border: 1px solid rgba(229, 231, 235, 0.8); transition: all 0.3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); min-height: 80px;">
                   <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); border-radius: 0 4px 4px 0;"></div>
                   <span style="font-size: 32px; margin-right: 20px; flex-shrink: 0; filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1)); transition: transform 0.3s ease;">📅</span>
                   <div style="flex: 1; min-width: 0;">
                     <div style="font-weight: 700; color: #1f2937; margin-bottom: 6px; font-size: 16px; line-height: 1.3;">Agenda Inteligente</div>
                     <div style="font-size: 14px; color: #6b7280; line-height: 1.5; font-weight: 400;">Gestiona tu disponibilidad y recibe reservas automáticamente</div>
                   </div>
                 </div>
                 <div style="display: flex; align-items: center; padding: 25px; background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%); border-radius: 16px; border: 1px solid rgba(229, 231, 235, 0.8); transition: all 0.3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); min-height: 80px;">
                   <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); border-radius: 0 4px 4px 0;"></div>
                   <span style="font-size: 32px; margin-right: 20px; flex-shrink: 0; filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1)); transition: transform 0.3s ease;">🌐</span>
                   <div style="flex: 1; min-width: 0;">
                     <div style="font-weight: 700; color: #1f2937; margin-bottom: 6px; font-size: 16px; line-height: 1.3;">Página Personalizada</div>
                     <div style="font-size: 14px; color: #6b7280; line-height: 1.5; font-weight: 400;">Tu negocio online con diseño elegante y profesional</div>
                   </div>
                 </div>
                 <div style="display: flex; align-items: center; padding: 25px; background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%); border-radius: 16px; border: 1px solid rgba(229, 231, 235, 0.8); transition: all 0.3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); min-height: 80px;">
                   <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); border-radius: 0 4px 4px 0;"></div>
                   <span style="font-size: 32px; margin-right: 20px; flex-shrink: 0; filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1)); transition: transform 0.3s ease;">⭐</span>
                   <div style="flex: 1; min-width: 0;">
                     <div style="font-weight: 700; color: #1f2937; margin-bottom: 6px; font-size: 16px; line-height: 1.3;">Experiencia Premium</div>
                     <div style="font-size: 14px; color: #6b7280; line-height: 1.5; font-weight: 400;">Diseño moderno que refleja la calidad de tus servicios</div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 40px 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
            <div style="margin: 20px 0;">
              <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none; font-size: 16px;">🌐 Sitio Web</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none; font-size: 16px;">📧 Soporte</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none; font-size: 16px;">📱 Instagram</a>
            </div>
            <p>¿Tienes preguntas? Contáctanos en <a href="#" style="color: #8b5cf6; text-decoration: none; font-weight: 500;">soporte@agendalook.cl</a></p>
            <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <a href="#" style="color: #9ca3af; text-decoration: none;">Darse de baja</a>
            </div>
          </div>
        </div>
      `
    },
    booking: {
      title: 'Confirmación de Reserva',
      subject: '✨ Tu cita está confirmada - Agendalook',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); padding: 40px 30px; text-align: center; color: white;">
            <div style="margin-bottom: 20px;">
              <img src="/logo.png" alt="Agendalook" style="width: 120px; height: auto; margin: 0 auto 15px; display: block; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));">
              <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Agendalook</div>
              <div style="font-size: 18px; opacity: 0.95; font-weight: 300;">Tu cita, tu estilo</div>
            </div>
          </div>
          
          <div style="padding: 50px 40px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);">
            <div style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 25px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2;">✨ ¡Tu cita está confirmada!</div>
            <div style="font-size: 18px; color: #6b7280; line-height: 1.7; margin-bottom: 40px; max-width: 480px; margin-left: auto; margin-right: auto;">Tu reserva ha sido confirmada exitosamente. Te esperamos en el horario agendado.</div>
            
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 40px; border-radius: 20px; margin: 40px 0; border: 1px solid #e5e7eb; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                <span style="font-weight: 600; color: #374151;">Servicio:</span>
                <span style="color: #6b7280; font-weight: 500;">Manicure Clásica</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                <span style="font-weight: 600; color: #374151;">Fecha:</span>
                <span style="color: #6b7280; font-weight: 500;">15 de Enero, 2025</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                <span style="font-weight: 600; color: #374151;">Hora:</span>
                <span style="color: #6b7280; font-weight: 500;">14:30</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                <span style="font-weight: 600; color: #374151;">Precio:</span>
                <span style="color: #6b7280; font-weight: 500;">$25,000</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; font-size: 16px;">
                <span style="font-weight: 600; color: #374151;">Profesional:</span>
                <span style="color: #6b7280; font-weight: 500;">Carla Estética</span>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 40px 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
            <div style="margin: 20px 0;">
              <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none; font-size: 16px;">🌐 Sitio Web</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none; font-size: 16px;">📧 Soporte</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none; font-size: 16px;">📱 Instagram</a>
            </div>
            <p>¿Tienes preguntas? Contáctanos en <a href="#" style="color: #8b5cf6; text-decoration: none; font-weight: 500;">soporte@agendalook.cl</a></p>
            <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <a href="#" style="color: #9ca3af; text-decoration: none;">Darse de baja</a>
            </div>
          </div>
        </div>
      `
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-2">
            📧 Preview de Emails Elegantes
          </h1>
          <p className="text-gray-600">
            Visualiza cómo se ven los emails de Agendalook antes de enviarlos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selector de Email */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tipo de Email</h2>
              <div className="space-y-3">
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEmail(key)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedEmail === key
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{template.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{template.subject}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Características</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Logo de Agendalook</li>
                  <li>✅ Diseño responsivo</li>
                  <li>✅ Gradientes elegantes</li>
                  <li>✅ Headers anti-spam</li>
                  <li>✅ Links de contacto</li>
                  <li>✅ Opción de baja</li>
                </ul>
              </div>

              <div className="mt-6">
                <a 
                  href="/test-email" 
                  className="w-full bg-gradient-to-r from-primary-500 to-coral-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 block text-center"
                >
                  🧪 Probar Email
                </a>
              </div>
            </div>
          </div>

          {/* Preview del Email */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Preview: {emailTemplates[selectedEmail as keyof typeof emailTemplates].title}
                </h2>
                <div className="text-sm text-gray-500">
                  Asunto: {emailTemplates[selectedEmail as keyof typeof emailTemplates].subject}
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: emailTemplates[selectedEmail as keyof typeof emailTemplates].preview 
                  }}
                  className="email-preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 