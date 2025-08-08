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

    // Marcar verified=true en metadata (y opcionalmente email_confirm)
    const { data: userResp } = await (service as any).auth.admin.listUsers({ email });
    const user = userResp?.users?.[0];
    if (user) {
      await (service as any).auth.admin.updateUserById(user.id, { email_confirm: true, user_metadata: { ...(user.user_metadata || {}), verified: true } });
    }

    // Enviar bienvenida post-verificación (si se desea mantener bienvenida)
    // await ResendService.sendWelcomeEmail(email, `${process.env.NEXT_PUBLIC_APP_URL}/welcome`, '');

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}


