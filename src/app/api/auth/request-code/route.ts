import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { ResendService } from '@/lib/resend-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const service = createServiceClient(supabaseUrl, serviceKey);

    // Obtener usuario por email
    const { data: userResp, error: userError } = await (service as any).auth.admin.listUsers({ email });
    if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });
    const user = userResp?.users?.[0];
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    // Generar código y guardar hash
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = crypto.randomBytes(8).toString('hex');
    const code_hash = crypto.createHash('sha256').update(code + salt).digest('hex');
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Borrar códigos anteriores no consumidos
    await service.from('email_verification_codes').delete().eq('user_id', user.id).is('consumed_at', null);

    const { error: insertError } = await service.from('email_verification_codes').insert({
      user_id: user.id,
      code_hash,
      code_salt: salt,
      expires_at,
    });
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

    // Enviar email
    await ResendService.sendVerificationCode(email, code);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error interno del servidor' }, { status: 500 });
  }
}


