import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { ResendService } from '@/lib/resend-service';
import { waitlistConfig } from '@/lib/waitlist-config';
import { issueCode } from '@/lib/verification';

function slugify(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Verificar configuración de waitlist
    const redirectMessage = waitlistConfig.getRedirectMessage(email);
    if (redirectMessage) {
      return NextResponse.json(redirectMessage, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase config faltante' }, { status: 500 });
    }

    const service = createServiceClient(supabaseUrl, serviceKey);

    // 0) Verificar si el email ya existe
    const { data: existingUsers } = await (service as any).auth.admin.listUsers();
    const existing = existingUsers?.users?.find((user: any) => user.email === email);
    if (existing) {
      // Si existe y NO está verificado, reenviar OTP y guiar al usuario
      const isVerified = Boolean(existing.email_confirmed_at || existing.user_metadata?.verified);
      if (!isVerified) {
        const { code } = await issueCode({ request, email, purpose: 'signup', ttlMinutes: 15 });
        await ResendService.sendVerificationCode(email, code);
        return NextResponse.json({ success: true, method: 'otp', message: 'Cuenta existente sin verificar. Reenviamos el código.' });
      }
      // Si ya está verificado, informar conflicto
      return NextResponse.json({ error: 'Ya existe un usuario registrado con esta dirección de email' }, { status: 409 });
    }

    // 1) Crear usuario sin enviar email de Supabase
    const { data: userData, error: createUserError } = await (service as any).auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name: email.split('@')[0], // Usar parte del email como nombre temporal
        business_name: 'Mi Negocio' // Nombre temporal, se actualizará en onboarding
      },
      email_confirm: false,
    });

    if (createUserError || !userData?.user) {
      return NextResponse.json({ error: createUserError?.message || 'No se pudo crear el usuario' }, { status: 500 });
    }

    const userId = userData.user.id as string;

    // 2) Crear profesional con datos temporales
    const businessName = 'Mi Negocio';
    const business_slug = slugify(businessName);
    const { error: profError } = await service.from('professionals').insert([
      {
        user_id: userId,
        business_name: businessName,
        business_slug,
        email,
        phone: '',
        description: '',
        address: '',
        plan: 'look', // Plan por defecto
      },
    ]);

    if (profError) {
      return NextResponse.json({ error: `No se pudo crear el perfil profesional: ${profError.message}` }, { status: 500 });
    }

    // 3) Flujo OTP: emitir código y enviarlo por correo (sin abrir pestañas)
    const { code } = await issueCode({ request, email, purpose: 'signup', ttlMinutes: 15 });
    await ResendService.sendVerificationCode(email, code);
    return NextResponse.json({ success: true, method: 'otp' });
  } catch (error: any) {
    console.error('Error en registro server-side:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}


