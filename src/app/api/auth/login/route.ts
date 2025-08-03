import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { authRateLimiter, getClientIP } from '@/lib/rate-limit';
import { securityLogger, getUserAgent } from '@/lib/security-logger';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    // Rate limiting para login
    const rateLimitResult = await authRateLimiter.check(ip);
    if (!rateLimitResult.success) {
      securityLogger.logRateLimitExceeded(ip, '/api/auth/login', userAgent);
      console.warn('Login rate limit exceeded:', ip);
      return NextResponse.json(
        { error: 'Demasiados intentos de login. Inténtalo de nuevo en 15 minutos.' },
        { status: 429 }
      );
    }

    const { email, password, rememberMe } = await request.json();

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Intentar login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log de intento fallido
      securityLogger.logLoginFailed(ip, email, error.message, userAgent);
      console.warn('Failed login attempt:', {
        email,
        ip,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Log de login exitoso
    securityLogger.logLoginSuccess(ip, data.user?.id || '', email, userAgent);
    console.log('Successful login:', {
      email,
      ip,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      user: data.user,
      session: data.session,
      rateLimitRemaining: rateLimitResult.remaining,
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 