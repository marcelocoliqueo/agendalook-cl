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
  Shield,
  Activity
} from 'lucide-react';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { Toast } from '@/components/ui/Toast';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { Professional } from '@/types';
import { AuthProvider } from '@/contexts/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </AuthProvider>
  );
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { getProfessionalByUserId } = useProfessional();

  // Detectar si es el usuario admin
  const isAdmin = user?.email === 'admin@agendalook.cl';

  useEffect(() => {
    const loadProfessional = async () => {
      if (user?.id) {
        try {
          // Cargar profesional de forma asíncrona
          const profData = await getProfessionalByUserId(user.id);
          
          // Para admin, crear un perfil temporal si no existe
          if (!profData && isAdmin) {
            console.log('🔧 Creando perfil temporal para admin');
            setProfessional({
              id: 'admin-temp',
              user_id: user.id,
              business_name: 'Agendalook Admin',
              business_slug: 'admin',
              email: 'admin@agendalook.cl',
              phone: '',
              description: 'Panel de administración del sistema',
              address: '',
              plan: 'studio',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          } else {
            setProfessional(profData);
          }
        } catch (error) {
          console.error('Error loading professional:', error);
          // Para admin, crear perfil temporal en caso de error
          if (isAdmin) {
            console.log('🔧 Creando perfil temporal para admin debido a error');
            setProfessional({
              id: 'admin-temp',
              user_id: user.id,
              business_name: 'Agendalook Admin',
              business_slug: 'admin',
              email: 'admin@agendalook.cl',
              phone: '',
              description: 'Panel de administración del sistema',
              address: '',
              plan: 'studio',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      }
      setLoading(false);
    };

    // Cargar inmediatamente si ya tenemos el user
    if (user?.id) {
      loadProfessional();
    } else {
      setLoading(false);
    }
  }, [user?.id, getProfessionalByUserId, isAdmin]);

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

  const handleCopyLink = async () => {
    if (!professional?.business_slug) return;
    
    // Usar localhost en desarrollo, dominio real en producción
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://agendalook.cl';
    
    const url = `${baseUrl}/${professional.business_slug}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setToastMessage('¡Enlace copiado al portapapeles!');
      setShowToast(true);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setToastMessage('Error al copiar el enlace');
      setShowToast(true);
    }
  };

  if (loading) {
    return <FullPageLoader text="Cargando..." />;
  }

  if (!user) {
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
                {isAdmin ? 'Agendalook Admin' : 'Agendalook'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {!isAdmin && <NotificationBell professionalId={professional?.id} />}
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block">
                    {user?.email}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {!isAdmin && (
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Configuración
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/dashboard/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
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
                <span>{isAdmin ? 'Panel Admin' : 'Vista General'}</span>
              </Link>
              
              {!isAdmin && (
                <>
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
                    <Clock className="w-5 h-5" />
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
                    <Users className="w-5 h-5" />
                    <span>Disponibilidad</span>
                  </Link>
                  
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
                </>
              )}
            </nav>

            {/* Página pública solo para usuarios normales */}
            {!isAdmin && professional?.business_slug && (
              <div className="mt-8 p-4 bg-gradient-to-r from-lavender-500 to-coral-500 rounded-xl text-white">
                <h3 className="font-semibold mb-2">Tu página pública</h3>
                <p className="text-sm opacity-90 mb-3">
                  Comparte este enlace con tus clientes
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://agendalook.cl'}/${professional.business_slug}`}
                    readOnly
                    className="flex-1 bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-3 py-2 text-sm transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </div>
  );
} 