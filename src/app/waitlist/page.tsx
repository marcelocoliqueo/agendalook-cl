'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Users, Clock, Gift, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface WaitlistFormData {
  email: string;
  name: string;
  businessName: string;
  motivation: string;
  referralCode?: string;
}

export default function WaitlistPage() {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: '',
    name: '',
    businessName: '',
    motivation: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (field: keyof WaitlistFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al unirse a la lista de espera');
      }

      setSuccess(true);
      setPosition(data.position);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            ¡Te has unido a la lista de espera!
          </h1>
          
          <div className="bg-sky-50 rounded-2xl p-6 mb-6">
            <div className="text-3xl font-bold text-sky-600 mb-2">
              #{position}
            </div>
            <p className="text-slate-600">
              Tu posición en la lista de espera
            </p>
          </div>
          
          <div className="space-y-4 text-sm text-slate-600">
            <p>📧 Te enviaremos actualizaciones por email</p>
            <p>🚀 Acceso prioritario cuando esté listo</p>
            <p>🎁 Descuentos especiales para early adopters</p>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="w-full mt-6 bg-sky-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-sky-600 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="w-32 h-9 flex items-center justify-center">
            <Image
              src="/logo-main.png"
              alt="Agendalook"
              width={128}
              height={36}
              className="w-32 h-9 object-contain"
            />
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-slate-600 hover:text-slate-800 transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Clock className="w-4 h-4 mr-2" />
              Próximamente disponible
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Únete a la lista de espera
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Sé de los primeros en acceder a Agendalook cuando esté completamente listo. 
              Acceso prioritario, descuentos especiales y características exclusivas te esperan.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-200">
              <Users className="w-8 h-8 text-sky-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-800 mb-1">1,247</div>
              <div className="text-slate-600">Personas esperando</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-200">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-800 mb-1">2-3</div>
              <div className="text-slate-600">Semanas estimadas</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-200">
              <Gift className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-800 mb-1">50%</div>
              <div className="text-slate-600">Descuento early bird</div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                Reserva tu lugar
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Tu nombre *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Ej: María González"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de tu negocio
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Ej: Nails by Carla"
                  />
                </div>
                
                <div>
                  <label htmlFor="motivation" className="block text-sm font-medium text-slate-700 mb-2">
                    ¿Por qué te interesa Agendalook?
                  </label>
                  <textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder="Cuéntanos qué te motiva a usar Agendalook..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="referralCode" className="block text-sm font-medium text-slate-700 mb-2">
                    Código de referido (opcional)
                  </label>
                  <input
                    id="referralCode"
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange('referralCode', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="REF-12345678"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Unirme a la lista de espera</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-8">
              ¿Qué obtienes al unirte?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Acceso prioritario</h4>
                <p className="text-sm text-slate-600">Sé de los primeros en acceder cuando esté listo</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Descuentos exclusivos</h4>
                <p className="text-sm text-slate-600">Hasta 50% de descuento en el primer año</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Comunidad exclusiva</h4>
                <p className="text-sm text-slate-600">Acceso a grupo privado de early adopters</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Updates regulares</h4>
                <p className="text-sm text-slate-600">Recibe noticias sobre el progreso del desarrollo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


