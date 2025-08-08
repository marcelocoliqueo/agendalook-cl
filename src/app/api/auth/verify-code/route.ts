import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const service = createServiceClient(supabaseUrl, serviceKey);

    // Obtener usuario
    const { data: userResp, error: userError } = await (service as any).auth.admin.listUsers({ email });
    if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });
    const user = userResp?.users?.[0];
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    // Buscar código vigente
    const { data: codeRows, error: codeError } = await service
      .from('email_verification_codes')
      .select('id, code_hash, code_salt, expires_at, consumed_at')
      .eq('user_id', user.id)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1);
    if (codeError) return NextResponse.json({ error: codeError.message }, { status: 500 });

    const row = codeRows?.[0];
    if (!row) return NextResponse.json({ error: 'Código inválido o expirado' }, { status: 400 });
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'Código expirado' }, { status: 400 });
    }

    const check_hash = crypto.createHash('sha256').update(code + row.code_salt).digest('hex');
    if (check_hash !== row.code_hash) return NextResponse.json({ error: 'Código incorrecto' }, { status: 400 });

    // Marcar consumido y confirmar email
    await service.from('email_verification_codes').update({ consumed_at: new Date().toISOString() }).eq('id', row.id);
    const { error: confirmError } = await (service as any).auth.admin.updateUserById(user.id, { email_confirm: true });
    if (confirmError) return NextResponse.json({ error: confirmError.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}


