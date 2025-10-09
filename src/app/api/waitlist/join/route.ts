import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, name, businessName, motivation, referralCode } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Email y nombre son requeridos' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase config faltante' }, { status: 500 });
    }

    const service = createServiceClient(supabaseUrl, serviceKey);

    // Verificar si ya existe en la waitlist
    const { data: existingUser } = await service
      .from('waitlist')
      .select('id, position')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Ya estás en la lista de espera',
        position: existingUser.position 
      }, { status: 409 });
    }

    // Verificar código de referido si se proporciona
    let referredBy = null;
    if (referralCode) {
      const { data: referrer } = await service
        .from('waitlist')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Insertar en waitlist
    const { data: newUser, error: insertError } = await service
      .from('waitlist')
      .insert([
        {
          email,
          name,
          business_name: businessName || null,
          motivation: motivation || null,
          referred_by: referredBy,
        },
      ])
      .select('position, referral_code')
      .single();

    if (insertError) {
      console.error('Error inserting into waitlist:', insertError);
      return NextResponse.json({ 
        error: 'Error al unirse a la lista de espera' 
      }, { status: 500 });
    }

    // Enviar email de confirmación (opcional)
    try {
      // Aquí podrías integrar con Resend para enviar email de confirmación
      console.log(`✅ User ${email} added to waitlist at position ${newUser.position}`);
    } catch (emailError) {
      console.warn('Email notification failed:', emailError);
      // No fallar por error de email
    }

    return NextResponse.json({ 
      success: true, 
      position: newUser.position,
      referralCode: newUser.referral_code,
      message: 'Te has unido exitosamente a la lista de espera'
    });

  } catch (error: any) {
    console.error('Error in waitlist join:', error);
    return NextResponse.json({ 
      error: error?.message || 'Error interno' 
    }, { status: 500 });
  }
}

