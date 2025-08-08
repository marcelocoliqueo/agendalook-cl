import { NextRequest, NextResponse } from 'next/server';
import { ResendService } from '@/lib/resend-service';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, businessName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase config missing' }, { status: 500 });
    }

    const redirectTo = `${appUrl}/verify-email`;
    const service = createServiceClient(supabaseUrl, serviceKey);

    // Generar enlace de verificación (sin enviar correo desde Supabase)
    const { data: linkData, error: linkError } = await (service as any).auth.admin.generateLink({
      type: 'signup',
      email,
      options: { redirectTo }
    });

    if (linkError) {
      console.error('Error generando action_link:', linkError);
      return NextResponse.json({ error: 'No se pudo generar el enlace de verificación' }, { status: 500 });
    }

    const actionLink = (linkData as any)?.properties?.action_link || (linkData as any)?.action_link || redirectTo;

    // Enviar email de bienvenida con CTA al action_link
    await ResendService.sendWelcomeEmail(email, actionLink, businessName);

    return NextResponse.json({
      success: true,
      message: 'Email de bienvenida enviado exitosamente'
    });

  } catch (error) {
    console.error('Error enviando email de bienvenida:', error);
    return NextResponse.json(
      { error: 'Error enviando email de bienvenida' },
      { status: 500 }
    );
  }
}