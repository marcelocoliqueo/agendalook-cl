import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createCompleteSubscription } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 MercadoPago Subscription API: Request received');
    
    const body = await request.json();
    console.log('🔍 MercadoPago Subscription API: Request body:', {
      planId: body.planId,
      plan: body.plan,
      cardTokenId: body.cardTokenId ? 'Present' : 'Missing',
      userEmail: body.userEmail
    });

    // Usar service role key para acceso completo a la base de datos
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('🔍 MercadoPago Subscription API: Supabase client created with service role key');

    // Verificar que tenemos userId en el body
    if (!body.userId) {
      console.log('🔍 MercadoPago Subscription API: No userId provided in request body');
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    console.log('🔍 MercadoPago Subscription API: Using userId from request body:', body.userId);
    const verifiedUserId = body.userId;

    // Obtener información del profesional
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', verifiedUserId)
      .single();
    
    if (professionalError || !professional) {
      console.log('🔍 MercadoPago Subscription API: Professional not found:', professionalError);
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
    }

    console.log('🔍 MercadoPago Subscription API: Professional found:', professional.id);

    // Validar datos requeridos
    const { planId, plan, cardTokenId, userEmail } = body;
    
    if (!planId || !plan || !cardTokenId || !userEmail) {
      console.log('🔍 MercadoPago Subscription API: Missing required fields');
      return NextResponse.json({ 
        error: 'Faltan campos requeridos',
        details: { planId: !!planId, plan: !!plan, cardTokenId: !!cardTokenId, userEmail: !!userEmail }
      }, { status: 400 });
    }

    if (!['pro', 'studio'].includes(plan)) {
      console.log('🔍 MercadoPago Subscription API: Invalid plan:', plan);
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    console.log('🔍 MercadoPago Subscription API: Environment variables check:', {
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

      console.log('🔍 MercadoPago Subscription API: Subscription created successfully:', subscription);

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
        console.error('🔍 MercadoPago Subscription API: Error updating professional plan:', updateError);
        // No fallar la operación, solo loggear el error
      } else {
        console.log('✅ Professional plan updated successfully');
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
      console.error('🔍 MercadoPago Subscription API: Error creating subscription:', subscriptionError);
      console.error('🔍 MercadoPago Subscription API: Error details:', {
        message: subscriptionError instanceof Error ? subscriptionError.message : 'Unknown error',
        stack: subscriptionError instanceof Error ? subscriptionError.stack : 'No stack trace',
        error: subscriptionError,
        errorType: subscriptionError?.constructor?.name || 'Unknown type'
      });
      
      return NextResponse.json({ 
        error: 'Error creando suscripción de MercadoPago', 
        details: subscriptionError instanceof Error ? subscriptionError.message : 'Unknown error',
        errorType: subscriptionError?.constructor?.name || 'Unknown type'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🔍 MercadoPago Subscription API: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
