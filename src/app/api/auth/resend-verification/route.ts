import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Configuración de Supabase faltante' }, { status: 500 });
    }

    // Obtener usuario autenticado desde cookies
    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    // Evitar reenviar si ya está confirmado
    if (user.email_confirmed_at) {
      return NextResponse.json({ success: true, message: 'Email ya verificado' });
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email`;

    // Usar service role para reenviar correo de verificación
    const service = createServiceClient(supabaseUrl, serviceKey);
    const { error } = await service.auth.resend({
      type: 'signup',
      email: user.email,
      options: { emailRedirectTo: redirectTo },
    } as any);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reenviando email de verificación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}


