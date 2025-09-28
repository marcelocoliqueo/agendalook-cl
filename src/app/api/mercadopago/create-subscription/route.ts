import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createCompleteSubscription } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API MercadoPago Suscripción: Solicitud recibida');
    
    const body = await request.json();
    console.log('🔍 API MercadoPago Suscripción: Datos de la solicitud:', {
      planId: body.planId,
      plan: body.plan,
      cardTokenId: body.cardTokenId ? 'Presente' : 'Faltante',
      userEmail: body.userEmail
    });

    // Usar service role key para acceso completo a la base de datos
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('🔍 API MercadoPago Suscripción: Cliente Supabase creado con service role key');

    // Verificar que tenemos userId en el body
    if (!body.userId) {
      console.log('🔍 API MercadoPago Suscripción: No se proporcionó userId en el cuerpo de la solicitud');
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    console.log('🔍 API MercadoPago Suscripción: Usando userId del cuerpo de la solicitud:', body.userId);
    const verifiedUserId = body.userId;

    // Obtener información del profesional
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', verifiedUserId)
      .single();
    
    if (professionalError || !professional) {
      console.log('🔍 API MercadoPago Suscripción: Profesional no encontrado:', professionalError);
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
    }

    console.log('🔍 API MercadoPago Suscripción: Profesional encontrado:', professional.id);

    // Validar datos requeridos
    const { planId, plan, cardTokenId, userEmail } = body;
    
    if (!planId || !plan || !cardTokenId || !userEmail) {
      console.log('🔍 API MercadoPago Suscripción: Faltan campos requeridos');
      return NextResponse.json({ 
        error: 'Faltan campos requeridos',
        details: { planId: !!planId, plan: !!plan, cardTokenId: !!cardTokenId, userEmail: !!userEmail }
      }, { status: 400 });
    }

    if (!['pro', 'studio'].includes(plan)) {
      console.log('🔍 API MercadoPago Suscripción: Plan inválido:', plan);
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    console.log('🔍 API MercadoPago Suscripción: Verificación de variables de entorno:', {
      hasAccessToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
      accessTokenPrefix: process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 10),
      isSandbox: process.env.MERCADOPAGO_IS_SANDBOX,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    try {
      // Crear la suscripción completa
      const subscription = await createCompleteSubscription({
        planId,
        customerId: professional.id,
        plan,
        planName: plan === 'pro' ? 'Pro' : 'Studio',
        planPrice: plan === 'pro' ? 9990 : 19990,
        payerEmail: userEmail,
        cardTokenId
      });

      console.log('🔍 API MercadoPago Suscripción: Suscripción creada exitosamente:', subscription);

      // Actualizar el plan del profesional en la base de datos
      const { error: updateError } = await supabase
        .from('professionals')
        .update({ 
          plan: plan,
          plan_status: 'active',
          plan_updated_at: new Date().toISOString()
        })
        .eq('id', professional.id);

      if (updateError) {
        console.error('🔍 API MercadoPago Suscripción: Error actualizando plan del profesional:', updateError);
        // No fallar la operación, solo loggear el error
      } else {
        console.log('✅ Plan del profesional actualizado exitosamente');
      }

      return NextResponse.json({
        id: subscription.id,
        status: subscription.status,
        type: subscription.type,
        message: subscription.message,
        plan: plan,
        redirect: '/dashboard?subscription=success'
      });

    } catch (subscriptionError) {
      console.error('🔍 API MercadoPago Suscripción: Error creando suscripción:', subscriptionError);
      console.error('🔍 API MercadoPago Suscripción: Detalles del error:', {
        message: subscriptionError instanceof Error ? subscriptionError.message : 'Error desconocido',
        stack: subscriptionError instanceof Error ? subscriptionError.stack : 'Sin stack trace',
        error: subscriptionError,
        errorType: subscriptionError?.constructor?.name || 'Tipo desconocido'
      });
      
      return NextResponse.json({ 
        error: 'Error creando suscripción de MercadoPago', 
        details: subscriptionError instanceof Error ? subscriptionError.message : 'Error desconocido',
        errorType: subscriptionError?.constructor?.name || 'Tipo desconocido'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🔍 API MercadoPago Suscripción: Error inesperado:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
