import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { verifyCode } from '@/lib/verification';
import { ResendService } from '@/lib/resend-service';

export async function POST(request: NextRequest) {
  try {
    const { email, code, purpose } = await request.json();
    if (!email || !code || purpose !== 'signup') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

    const result = await verifyCode({ email, code, purpose });
    if (result !== 'ok') return NextResponse.json({ ok: false, reason: result }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const service = createServiceClient(supabaseUrl, serviceKey);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Marcar verified=true en metadata (y opcionalmente email_confirm)
    const { data: userResp } = await (service as any).auth.admin.listUsers({ email });
    const user = userResp?.users?.[0];
    if (user) {
      await (service as any).auth.admin.updateUserById(user.id, { email_confirm: true, user_metadata: { ...(user.user_metadata || {}), verified: true } });
    }

    // Generar magic link de login para establecer sesión automáticamente y redirigir a /welcome
    const { data: linkData, error: linkError } = await (service as any).auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${appUrl}/welcome` }
    });
    
    if (linkError) {
      console.error('Error generando magic link:', linkError);
      // Si falla, redirigir directamente a welcome con parámetro de verificación exitosa
      return NextResponse.json({ ok: true, loginUrl: `${appUrl}/welcome?verified=true` });
    }
    
    const actionLink = (linkData as any)?.properties?.action_link || (linkData as any)?.action_link;
    if (!actionLink) {
      console.error('No se pudo obtener action_link del magic link');
      return NextResponse.json({ ok: true, loginUrl: `${appUrl}/welcome?verified=true` });
    }

    return NextResponse.json({ ok: true, loginUrl: actionLink });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}


