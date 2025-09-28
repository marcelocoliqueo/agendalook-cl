import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSubscriptionPreference, createMPCustomer, isMercadoPagoSandbox } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API MercadoPago: Solicitud recibida');
    
    // Verificar token de autorización si está configurado
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      console.log('🔍 API MercadoPago: Header de autorización:', authHeader ? 'Presente' : 'Faltante');
      console.log('🔍 API MercadoPago: Token esperado:', expectedToken ? 'Configurado' : 'No configurado');
    }

    const body = await request.json();
    console.log('🔍 API MercadoPago: Datos de la solicitud:', body);

    // Usar service role key para acceso completo a la base de datos
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('🔍 API MercadoPago: Cliente Supabase creado con service role key');

    // Verificar que tenemos userId en el body
    if (!body.userId) {
      console.log('🔍 API MercadoPago: No se proporcionó userId en el cuerpo de la solicitud');
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    console.log('🔍 API MercadoPago: Usando userId del cuerpo de la solicitud:', body.userId);
    const verifiedUserId = body.userId;

    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', verifiedUserId)
      .single();
    
    if (professionalError || !professional) {
      console.log('🔍 API MercadoPago: Profesional no encontrado:', professionalError);
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
    }

    console.log('🔍 API MercadoPago: Profesional encontrado:', professional.id);

    const plan = body.plan;
    if (!plan || !['free', 'pro', 'premium'].includes(plan)) {
      console.log('🔍 API MercadoPago: Plan inválido:', plan);
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    if (plan === 'free') {
      console.log('🔍 API MercadoPago: Plan gratuito seleccionado, no se requiere pago');
      return NextResponse.json({ 
        message: 'Plan gratuito seleccionado',
        plan: 'free',
        redirect: '/onboarding'
      });
    }

    console.log('🔍 API MercadoPago: Verificación de variables de entorno:', {
      hasAccessToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
      accessTokenPrefix: process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 10),
      isSandbox: process.env.MERCADOPAGO_IS_SANDBOX,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    console.log('🔍 API MercadoPago: Creando plan de suscripción de MercadoPago para el plan:', plan);

    try {
      // Crear el plan de suscripción usando el nuevo flujo
      const subscriptionPlan = await createSubscriptionPreference({
        customerId: professional.id,
        plan,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://agendalook.cl'}/dashboard`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://agendalook.cl'}/plans`,
        payerEmail: body.userEmail
      });

      console.log('🔍 API MercadoPago: Plan de suscripción creado exitosamente:', subscriptionPlan);

      if (!subscriptionPlan) {
        console.log('🔍 API MercadoPago: No se devolvió plan de suscripción');
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
      console.error('🔍 API MercadoPago: Error creando plan de suscripción:', preferenceError);
      console.error('🔍 API MercadoPago: Detalles del error:', {
        message: preferenceError instanceof Error ? preferenceError.message : 'Error desconocido',
        stack: preferenceError instanceof Error ? preferenceError.stack : 'Sin stack trace',
        error: preferenceError,
        errorType: preferenceError?.constructor?.name || 'Tipo desconocido',
        errorKeys: preferenceError ? Object.keys(preferenceError) : 'Sin claves'
      });
      return NextResponse.json({ 
        error: 'Error creando plan de suscripción de MercadoPago', 
        details: preferenceError instanceof Error ? preferenceError.message : 'Error desconocido', 
        errorType: preferenceError?.constructor?.name || 'Tipo desconocido'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🔍 API MercadoPago: Error inesperado:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}