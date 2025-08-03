'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus, 
  Clock, 
  Users, 
  ChevronDown,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { Professional } from '@/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { getProfessionalByUserId } = useProfessional();

  useEffect(() => {
    const loadProfessional = async () => {
      if (user) {
        try {
          const profData = await getProfessionalByUserId(user.id);
          setProfessional(profData);
        } catch (error) {
          console.error('Error loading professional:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfessional();
  }, [user, getProfessionalByUserId]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No tienes acceso al dashboard</p>
          <Link href="/login" className="text-lavender-600 hover:text-lavender-700 mt-2 inline-block">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-playfair font-bold text-gray-800">
                Agendalook
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-coral-500"></span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {professional?.business_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block">
                    {professional?.business_name || user?.email}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Configuración
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActiveRoute('/dashboard')
                    ? 'bg-lavender-50 text-lavender-700 border border-lavender-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Vista General</span>
              </Link>
              
              <Link
                href="/dashboard/services"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActiveRoute('/dashboard/services')
                    ? 'bg-lavender-50 text-lavender-700 border border-lavender-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Servicios</span>
              </Link>
              
              <Link
                href="/dashboard/bookings"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActiveRoute('/dashboard/bookings')
                    ? 'bg-lavender-50 text-lavender-700 border border-lavender-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Reservas</span>
              </Link>
              
                                   <Link
                       href="/dashboard/availability"
                       className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                         isActiveRoute('/dashboard/availability')
                           ? 'bg-lavender-50 text-lavender-700 border border-lavender-200'
                           : 'text-gray-600 hover:bg-gray-50'
                       }`}
                     >
                       <Clock className="w-5 h-5" />
                       <span>Disponibilidad</span>
                     </Link>
                     
                     {/* Dashboard de Seguridad - Solo para administradores */}
                     {professional?.role === 'admin' && (
                       <Link
                         href="/dashboard/security"
                         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                           isActiveRoute('/dashboard/security')
                             ? 'bg-lavender-50 text-lavender-700 border border-lavender-200'
                             : 'text-gray-600 hover:bg-gray-50'
                         }`}
                       >
                         <Shield className="w-5 h-5" />
                         <span>Seguridad</span>
                       </Link>
                     )}
                     
                     <Link
                       href="/dashboard/bookings"
                       className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                         isActiveRoute('/dashboard/bookings')
                           ? 'bg-lavender-50 text-lavender-700 border border-lavender-200'
                           : 'text-gray-600 hover:bg-gray-50'
                       }`}
                     >
                       <Users className="w-5 h-5" />
                       <span>Reservas</span>
                     </Link>
                     
                     <Link
                       href="/dashboard/settings"
                       className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                         isActiveRoute('/dashboard/settings')
                           ? 'bg-lavender-50 text-lavender-700 border border-lavender-200'
                           : 'text-gray-600 hover:bg-gray-50'
                       }`}
                     >
                       <Settings className="w-5 h-5" />
                       <span>Configuración</span>
                     </Link>
            </nav>

            <div className="mt-8 p-4 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Tu página pública</h3>
              <p className="text-sm opacity-90 mb-3">
                Comparte este enlace con tus clientes
              </p>
              <div className="bg-white/20 rounded p-2 text-sm font-mono">
                agendalook.cl/{professional?.business_slug || 'tu-negocio'}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 