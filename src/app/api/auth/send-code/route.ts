import { NextRequest, NextResponse } from 'next/server';
import { issueCode } from '@/lib/verification';
import { ResendService } from '@/lib/resend-service';

export async function POST(request: NextRequest) {
  try {
    const { email, purpose } = await request.json();
    if (!email || purpose !== 'signup') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

    const { expiresAt, code } = await issueCode({ request, email, purpose, ttlMinutes: 15 });
    await ResendService.sendVerificationCode(email, code);
    return NextResponse.json({ ok: true, expiresAt });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}


