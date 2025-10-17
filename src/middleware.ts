import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkTrialExpiration, handleTrialExpiration } from './middleware/checkTrial';
import { checkSetupCompletion, requiresSetupCompletion, isSetupRoute } from './middleware/setupCompletion';

export async function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Si no es una ruta protegida, continuar
  if (!isProtectedRoute) {
    const response = NextResponse.next();
    
    // Headers de seguridad para todas las rutas
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Content Security Policy
    response.headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.mercadopago.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://api.mercadopago.com https://*.supabase.co wss://*.supabase.co; " +
      "frame-src https://www.mercadopago.com;"
    );
    
    return response;
  }

  // Crear cliente de Supabase para el servidor (middleware)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Verificar sesión de forma más permisiva
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Middleware session error:', sessionError);
      
      // Si es error de refresh token, redirigir al login en lugar de clear-session
      if (sessionError.message?.includes('refresh_token_not_found') || 
          sessionError.message?.includes('Invalid Refresh Token')) {
        console.log('Middleware: Refresh token inválido, redirigiendo al login');
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
      
      // En caso de otros errores de sesión, permitir acceso (más permisivo)
      const response = NextResponse.next();
      setSecurityHeaders(response);
      return response;
    }
    
    // Si no hay sesión, redirigir al login
    if (!session) {
      console.log('Middleware: No session found, redirecting to login');
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Verificar usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Middleware user error:', userError);
      // En caso de error de usuario, permitir acceso (más permisivo)
      const response = NextResponse.next();
      setSecurityHeaders(response);
      return response;
    }
    
    if (!user) {
      console.log('Middleware: No user found, redirecting to login');
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Verificar si está verificado (más permisivo)
    const isVerified = Boolean(user?.email_confirmed_at);
    
    if (!isVerified) {
      console.log('Middleware: User not verified, redirecting to verify-code');
      const url = request.nextUrl.clone();
      url.pathname = '/verify-code';
      if (user?.email) url.searchParams.set('email', user.email);
      return NextResponse.redirect(url);
    }

    // Verificar completitud de setup para rutas protegidas (excepto admin)
    const isAdminUser = user.email === 'admin@agendalook.cl';
    const currentPath = request.nextUrl.pathname;
    
    if (!isAdminUser && requiresSetupCompletion(currentPath) && !isSetupRoute(currentPath)) {
      console.log('🔍 Middleware: Verificando completitud de setup para:', user.id);
      
      try {
        const setupStatus = await checkSetupCompletion(user.id);
        
        if (!setupStatus.completed) {
          console.log(`⚠️ Middleware: Setup incompleto, redirigiendo a ${setupStatus.redirect}`);
          const url = request.nextUrl.clone();
          url.pathname = setupStatus.redirect || '/setup/business-slug';
          return NextResponse.redirect(url);
        }
        
        console.log('✅ Middleware: Setup completado');
      } catch (error) {
        console.error('💥 Error verificando setup en middleware:', error);
        // En caso de error, permitir acceso (más permisivo)
      }
    }

    // Verificar expiración de trial para rutas protegidas
    if (isProtectedRoute) {
      console.log('🔍 Middleware: Verificando expiración de trial para:', user.id);
      
      try {
        // Consultar información del profesional directamente
        const { data: professional, error } = await supabase
          .from('professionals')
          .select('plan, trial_end_date, subscription_status')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('❌ Error consultando profesional en middleware:', error);
          // En caso de error, permitir acceso (más permisivo)
        } else if (professional?.plan === 'trial') {
          const isExpired = new Date() > new Date(professional.trial_end_date);
          
          if (isExpired) {
            console.log('⚠️ Middleware: Trial expirado, actualizando estado y redirigiendo');
            
            // Actualizar estado a 'expired'
            await supabase
              .from('professionals')
              .update({ subscription_status: 'expired' })
              .eq('user_id', user.id);
            
            // Redirigir a /pricing
            const url = request.nextUrl.clone();
            url.pathname = '/pricing';
            url.searchParams.set('trial-expired', 'true');
            url.searchParams.set('message', 'Tu período de prueba ha expirado. Elige un plan para continuar.');
            return NextResponse.redirect(url);
          } else {
            const daysRemaining = Math.ceil((new Date(professional.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            console.log(`ℹ️ Middleware: Trial activo, quedan ${daysRemaining} días`);
          }
        }
      } catch (error) {
        console.error('💥 Error inesperado verificando trial en middleware:', error);
        // En caso de error, permitir acceso (más permisivo)
      }
    }

    // Usuario autenticado y verificado, permitir acceso
    console.log('Middleware: User authenticated and verified, allowing access to:', request.nextUrl.pathname);

  } catch (error) {
    console.error('Middleware error:', error);
    // En caso de error, permitir acceso (más permisivo)
  }

  const response = NextResponse.next();
  setSecurityHeaders(response);
  return response;
}

// Función auxiliar para establecer headers de seguridad
function setSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.mercadopago.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.mercadopago.com https://*.supabase.co wss://*.supabase.co; " +
    "frame-src https://www.mercadopago.com;"
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (para evitar conflictos)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 