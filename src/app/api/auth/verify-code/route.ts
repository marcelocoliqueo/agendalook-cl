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
      await (service as any).auth.admin.updateUserById(user.id, { 
        email_confirm: true, 
        user_metadata: { ...(user.user_metadata || {}), verified: true } 
      });
    }

    // En lugar de magic link, crear una sesión temporal y redirigir directamente
    // Generar un token temporal para establecer sesión
    const { data: sessionData, error: sessionError } = await (service as any).auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { 
        redirectTo: `${appUrl}/welcome`,
        createUser: false
      }
    });
    
    if (sessionError) {
      console.error('Error generando sesión:', sessionError);
      // Si falla, redirigir directamente a welcome con parámetro de verificación exitosa
      return NextResponse.json({ ok: true, loginUrl: `${appUrl}/welcome?verified=true&email=${encodeURIComponent(email)}` });
    }

    const actionLink = (sessionData as any)?.properties?.action_link || (sessionData as any)?.action_link;
    if (!actionLink) {
      console.error('No se pudo obtener action_link de la sesión');
      return NextResponse.json({ ok: true, loginUrl: `${appUrl}/welcome?verified=true&email=${encodeURIComponent(email)}` });
    }

    console.log('Enlace mágico generado exitosamente:', actionLink);
    return NextResponse.json({ ok: true, loginUrl: actionLink });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error interno del servidor' }, { status: 500 });
  }
}


