import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { ResendService } from '@/lib/resend-service';

function slugify(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const { name, businessName, email, password } = await request.json();

    if (!name || !businessName || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase config faltante' }, { status: 500 });
    }

    const service = createServiceClient(supabaseUrl, serviceKey);

    // 1) Crear usuario sin enviar email de Supabase
    const { data: userData, error: createUserError } = await (service as any).auth.admin.createUser({
      email,
      password,
      user_metadata: { name, business_name: businessName },
      email_confirm: false,
    });

    if (createUserError || !userData?.user) {
      return NextResponse.json({ error: createUserError?.message || 'No se pudo crear el usuario' }, { status: 500 });
    }

    const userId = userData.user.id as string;

    // 2) Crear profesional
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
        plan: 'free',
      },
    ]);

    if (profError) {
      return NextResponse.json({ error: `No se pudo crear el perfil profesional: ${profError.message}` }, { status: 500 });
    }

    // 3) Generar action_link de verificación
    const redirectTo = `${appUrl}/verify-email`;
    const { data: linkData, error: linkError } = await (service as any).auth.admin.generateLink({
      type: 'signup',
      email,
      options: { redirectTo },
    });
    if (linkError) {
      return NextResponse.json({ error: `No se pudo generar el enlace de verificación: ${linkError.message}` }, { status: 500 });
    }
    const actionLink = (linkData as any)?.properties?.action_link || (linkData as any)?.action_link || redirectTo;

    // 4) Enviar email elegante con Resend apuntando al action_link
    await ResendService.sendWelcomeEmail(email, actionLink, businessName);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en registro server-side:', error);
    return NextResponse.json({ error: error?.message || 'Error interno' }, { status: 500 });
  }
}


