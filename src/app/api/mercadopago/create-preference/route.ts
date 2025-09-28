import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSubscriptionPreference, createMPCustomer, isMercadoPagoSandbox } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 MercadoPago API: Request received');
    
    // Verificar token de autorización si está configurado
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      console.log('🔍 MercadoPago API: Auth header:', authHeader ? 'Present' : 'Missing');
      console.log('🔍 MercadoPago API: Expected token:', expectedToken ? 'Configured' : 'Not configured');
    }

    const body = await request.json();
    console.log('🔍 MercadoPago API: Request body:', body);

    // Usar service role key para acceso completo a la base de datos
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('🔍 MercadoPago API: Supabase client created with service role key');

    // Verificar que tenemos userId en el body
    if (!body.userId) {
      console.log('🔍 MercadoPago API: No userId provided in request body');
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    console.log('🔍 MercadoPago API: Using userId from request body:', body.userId);
    const verifiedUserId = body.userId;

    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', verifiedUserId)
      .single();
    
    if (professionalError || !professional) {
      console.log('🔍 MercadoPago API: Professional not found:', professionalError);
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
    }

    console.log('🔍 MercadoPago API: Professional found:', professional.id);

    const plan = body.plan;
    if (!plan || !['free', 'pro', 'premium'].includes(plan)) {
      console.log('🔍 MercadoPago API: Invalid plan:', plan);
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    if (plan === 'free') {
      console.log('🔍 MercadoPago API: Free plan selected, no payment needed');
      return NextResponse.json({ 
        message: 'Plan gratuito seleccionado',
        plan: 'free',
        redirect: '/onboarding'
      });
    }

    console.log('🔍 MercadoPago API: Environment variables check:', {
      hasAccessToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
      accessTokenPrefix: process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 10),
      isSandbox: process.env.MERCADOPAGO_IS_SANDBOX,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    console.log('🔍 MercadoPago API: Creating MercadoPago subscription plan for plan:', plan);

    try {
      // Crear el plan de suscripción usando el nuevo flujo
      const subscriptionPlan = await createSubscriptionPreference({
        customerId: professional.id,
        plan,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://agendalook.cl'}/dashboard`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://agendalook.cl'}/plans`,
        payerEmail: body.userEmail
      });

      console.log('🔍 MercadoPago API: Subscription plan created successfully:', subscriptionPlan);

      if (!subscriptionPlan) {
        console.log('🔍 MercadoPago API: No subscription plan returned');
        return NextResponse.json({ error: 'Error creando plan de suscripción' }, { status: 500 });
      }

      // Retornar información del plan para que el frontend pueda continuar
      return NextResponse.json({
        id: subscriptionPlan.id,
        plan_id: subscriptionPlan.plan_id,
        type: subscriptionPlan.type,
        message: 'Plan de suscripción creado. El usuario debe completar el proceso de suscripción con tarjeta.',
        next_step: 'card_validation'
      });

    } catch (preferenceError) {
      console.error('🔍 MercadoPago API: Error creating subscription plan:', preferenceError);
      console.error('🔍 MercadoPago API: Error details:', {
        message: preferenceError instanceof Error ? preferenceError.message : 'Unknown error',
        stack: preferenceError instanceof Error ? preferenceError.stack : 'No stack trace',
        error: preferenceError,
        errorType: preferenceError?.constructor?.name || 'Unknown type',
        errorKeys: preferenceError ? Object.keys(preferenceError) : 'No keys'
      });
      return NextResponse.json({ 
        error: 'Error creando plan de suscripción de MercadoPago', 
        details: preferenceError instanceof Error ? preferenceError.message : 'Unknown error', 
        errorType: preferenceError?.constructor?.name || 'Unknown type' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🔍 MercadoPago API: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 