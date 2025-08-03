"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Cuenta y Registro",
      items: [
        {
          question: "¿Cómo creo mi cuenta en Agendalook?",
          answer: "Ve a la página principal y haz clic en 'Registrarse'. Completa tu información personal y de negocio. Recibirás un email de confirmación para activar tu cuenta."
        },
        {
          question: "¿Puedo cambiar mi información de negocio después del registro?",
          answer: "Sí, puedes editar toda tu información desde Configuración > Perfil. Los cambios se reflejan inmediatamente en tu página de reservas."
        },
        {
          question: "¿Cómo recupero mi contraseña?",
          answer: "En la página de login, haz clic en '¿Olvidaste tu contraseña?'. Ingresa tu email y recibirás un enlace para restablecer tu contraseña."
        }
      ]
    },
    {
      category: "Servicios",
      items: [
        {
          question: "¿Cuántos servicios puedo crear?",
          answer: "Depende de tu plan: Free (3 servicios), Pro (ilimitado), Studio (ilimitado). Puedes actualizar tu plan en cualquier momento."
        },
        {
          question: "¿Puedo agregar imágenes a mis servicios?",
          answer: "Sí, puedes agregar imágenes a tus servicios para que tus clientes vean ejemplos de tu trabajo. Esto está disponible en todos los planes."
        },
        {
          question: "¿Cómo organizo mis servicios por categorías?",
          answer: "Al crear un servicio, puedes asignarle una categoría (ej: 'Corte', 'Color', 'Tratamiento'). Esto ayuda a organizar tu oferta."
        }
      ]
    },
    {
      category: "Reservas y Citas",
      items: [
        {
          question: "¿Cómo recibo las notificaciones de nuevas reservas?",
          answer: "Recibes notificaciones automáticas por email. También puedes configurar notificaciones push en tu navegador desde Configuración > Notificaciones."
        },
        {
          question: "¿Puedo cancelar una reserva?",
          answer: "Sí, puedes cancelar reservas desde tu dashboard. El cliente recibirá una notificación automática de la cancelación."
        },
        {
          question: "¿Los clientes pueden modificar sus reservas?",
          answer: "Los clientes pueden cancelar sus reservas, pero no modificarlas directamente. Deben contactarte para cambios."
        }
      ]
    },
    {
      category: "Horarios y Disponibilidad",
      items: [
        {
          question: "¿Cómo configuro mis horarios de trabajo?",
          answer: "Ve a Configuración > Horarios y define tu disponibilidad por día de la semana. Puedes crear múltiples bloques de tiempo por día."
        },
        {
          question: "¿Puedo tomar días libres?",
          answer: "Sí, puedes marcar días específicos como no disponibles. También puedes configurar vacaciones o días festivos."
        },
        {
          question: "¿Cómo funcionan los bloques de tiempo?",
          answer: "Defines intervalos de tiempo (ej: 9:00-12:00, 14:00-18:00) y los clientes solo pueden reservar en esos horarios."
        }
      ]
    },
    {
      category: "Página Personalizada",
      items: [
        {
          question: "¿Cómo personalizo mi página de reservas?",
          answer: "Ve a Configuración > Página Personalizada. Puedes agregar tu logo, colores, descripción y fotos de tu negocio."
        },
        {
          question: "¿Cuál será mi URL personalizada?",
          answer: "Tu URL será: agendalook.cl/tunombre. Puedes personalizar el 'tunombre' en la configuración de tu perfil."
        },
        {
          question: "¿Puedo cambiar los colores de mi página?",
          answer: "Sí, puedes personalizar los colores principales de tu página para que coincidan con tu marca."
        }
      ]
    },
    {
      category: "Planes y Facturación",
      items: [
        {
          question: "¿Cuáles son las diferencias entre los planes?",
          answer: "Free: 3 servicios, 10 reservas/mes. Pro: servicios ilimitados, reservas ilimitadas, $9.990/mes. Studio: todo de Pro + múltiples usuarios, $19.990/mes."
        },
        {
          question: "¿Puedo cambiar mi plan en cualquier momento?",
          answer: "Sí, puedes cambiar tu plan desde Configuración > Plan. Los cambios se aplican inmediatamente y se prorratean en la facturación."
        },
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos tarjetas de crédito/débito, transferencias bancarias y Mercado Pago. Todos los pagos son seguros y encriptados."
        }
      ]
    },
    {
      category: "Soporte y Ayuda",
      items: [
        {
          question: "¿Cómo contacto al soporte técnico?",
          answer: "Puedes contactarnos por email a soporte@agendalook.cl, por teléfono al +56 9 1234 5678, o usar el formulario de contacto en nuestra web."
        },
        {
          question: "¿Ofrecen capacitación para usar la plataforma?",
          answer: "Sí, tenemos tutoriales en video y guías paso a paso disponibles en la sección Tutoriales. También ofrecemos soporte personalizado."
        },
        {
          question: "¿Los datos de mis clientes están seguros?",
          answer: "Absolutamente. Utilizamos encriptación de nivel bancario y cumplimos con todas las regulaciones de protección de datos de Chile."
        }
      ]
    }
  ];

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
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Encuentra respuestas rápidas a las preguntas más comunes sobre Agendalook
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Busca en las preguntas frecuentes..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent font-poppins"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={itemIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-800 font-poppins pr-4">
                          {item.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 font-poppins leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-gray-600 font-poppins mb-6">
              Nuestro equipo de soporte está aquí para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-gradient-to-r from-lavender-500 to-coral-500 text-white px-6 py-3 rounded-xl font-semibold font-poppins hover:from-lavender-600 hover:to-coral-600 transition-all duration-300"
              >
                Contactar Soporte
              </Link>
              <Link 
                href="/help"
                className="border border-lavender-500 text-lavender-600 px-6 py-3 rounded-xl font-semibold font-poppins hover:bg-lavender-50 transition-colors"
              >
                Centro de Ayuda
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 