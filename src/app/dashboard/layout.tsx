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
  Activity,
  Home,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { Toast } from '@/components/ui/Toast';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useProfessional } from '@/hooks/useProfessional';
import { Professional } from '@/types';

export default function DashboardLayout({
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
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleCopyLink = () => {
    const link = `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://agendalook.cl'}/${professional?.business_slug}`;
    navigator.clipboard.writeText(link);
    setToastMessage('Enlace copiado al portapapeles');
    setShowToast(true);
  };

  const isActiveRoute = (route: string) => {
    return pathname === route;
  };

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold text-lg shadow-lg">
                A
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Agendalook
                </h1>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <NotificationBell />
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-900">{user.email}</p>
                    <p className="text-xs text-slate-500">
                      {isAdmin ? 'Administrador' : professional?.business_name || 'Usuario'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user.email}</p>
                      <p className="text-xs text-slate-500">
                        {isAdmin ? 'Administrador' : professional?.plan || 'Usuario'}
                      </p>
                    </div>
                    
                    {isAdmin && (
                      <Link
                        href="/dashboard/admin"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors duration-200"
                      >
                        <Activity className="w-4 h-4 mr-2 text-sky-500" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4 mr-2 text-slate-500" />
                      Configuración
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
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
            <nav className="space-y-3">
              <Link
                href="/dashboard"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
                  isActiveRoute('/dashboard')
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25'
                    : 'text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 border border-transparent hover:border-slate-200'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">{isAdmin ? 'Panel Admin' : 'Vista General'}</span>
              </Link>
              
              {!isAdmin && (
                <>
                  <Link
                    href="/dashboard/services"
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
                      isActiveRoute('/dashboard/services')
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Servicios</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/bookings"
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
                      isActiveRoute('/dashboard/bookings')
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25'
                        : 'text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Reservas</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/availability"
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
                      isActiveRoute('/dashboard/availability')
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Disponibilidad</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/security"
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
                      isActiveRoute('/dashboard/security')
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25'
                        : 'text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Seguridad</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Página pública solo para usuarios normales */}
            {!isAdmin && professional?.business_slug && (
              <div className="mt-8 p-6 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 rounded-2xl text-white shadow-xl shadow-sky-500/25">
                <div className="flex items-center space-x-3 mb-3">
                  <UserCheck className="w-5 h-5 text-sky-100" />
                  <h3 className="font-semibold">Tu página pública</h3>
                </div>
                <p className="text-sm text-sky-100 mb-4">
                  Comparte este enlace con tus clientes para que puedan reservar
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://agendalook.cl'}/${professional.business_slug}`}
                    readOnly
                    className="w-full bg-white/20 text-white placeholder-white/70 rounded-xl px-3 py-2 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Tu enlace público"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="w-full bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
                  >
                    Copiar enlace
                  </button>
                </div>
              </div>
            )}

            {/* Plan Info */}
            {!isAdmin && professional?.plan && (
              <div className="mt-6 p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/25">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-100" />
                  <span className="text-sm font-medium">Plan {professional.plan.toUpperCase()}</span>
                </div>
                <p className="text-xs text-emerald-100">
                  Acceso completo a todas las funcionalidades
                </p>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
              {children}
            </div>
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