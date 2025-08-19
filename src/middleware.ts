import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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
      "connect-src 'self' https://api.mercadopago.com https://*.supabase.co; " +
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

  // Verificar sesión
  const { data: { session } } = await supabase.auth.getSession();

  // Si no hay sesión, redirigir al login
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Bloquear acceso al dashboard si el usuario no está verificado
  const { data: { user } } = await supabase.auth.getUser();
  const isVerified = Boolean(user?.user_metadata?.verified || user?.email_confirmed_at);
  if (!isVerified) {
    const url = request.nextUrl.clone();
    url.pathname = '/verify-code';
    if (user?.email) url.searchParams.set('email', user.email);
    return NextResponse.redirect(url);
  }

  // Si no ha completado onboarding, forzar paso por /welcome
  const isOnboarded = Boolean((user as any)?.user_metadata?.onboarded);
  if (request.nextUrl.pathname.startsWith('/dashboard') && !isOnboarded) {
    const url = request.nextUrl.clone();
    url.pathname = '/welcome';
    return NextResponse.redirect(url);
  }

  // Restricción de rutas de admin: /dashboard/admin y /dashboard/security
  if (request.nextUrl.pathname.startsWith('/dashboard/admin') || request.nextUrl.pathname.startsWith('/dashboard/security')) {
    const { data: prof } = await supabase
      .from('professionals')
      .select('role')
      .eq('user_id', user!.id)
      .maybeSingle();
    const isAdmin = prof?.role === 'admin';
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  
  // Headers de seguridad adicionales para rutas protegidas
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy más estricto para dashboard
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.mercadopago.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.mercadopago.com https://*.supabase.co; " +
    "frame-src https://www.mercadopago.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 