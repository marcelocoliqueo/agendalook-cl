import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionPreference, createMPCustomer, isMercadoPagoSandbox } from '@/lib/mercadopago';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 MercadoPago API: Request received');
    
    // Verificar que sea una llamada válida
    const authHeader = request.headers.get('authorization');
    console.log('🔍 MercadoPago API: Auth header:', authHeader ? 'Present' : 'Missing');
    
    // Para Vercel Cron, puedes usar un token secreto
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    console.log('🔍 MercadoPago API: Expected token:', expectedToken ? 'Configured' : 'Not configured');
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      console.log('🔍 MercadoPago API: Token mismatch');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener el cuerpo de la solicitud
    const body = await request.json();
    console.log('🔍 MercadoPago API: Request body:', body);

    // Verificar que el usuario esté autenticado
    const supabase = createServerSupabaseClient();
    console.log('🔍 MercadoPago API: Supabase client created');

    // Obtener la cookie de sesión
    const cookieStore = await cookies();
    const supabaseCookie = cookieStore.get('sb-access-token');
    console.log('🔍 MercadoPago API: Supabase cookie:', supabaseCookie ? 'Present' : 'Missing');

    // Verificar el usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('🔍 MercadoPago API: User verification result:', {
      user: user ? { id: user.id, email: user.email } : null,
      error: userError
    });

    if (userError || !user) {
      console.log('🔍 MercadoPago API: User not authenticated');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log('🔍 MercadoPago API: User authenticated successfully:', user.id);

    // Obtener datos del profesional
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profError || !professional) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      );
    }

    // Si ya tiene una suscripción activa, no permitir otra
    if (professional.mp_subscription_id) {
      return NextResponse.json(
        { error: 'Ya tienes una suscripción activa' },
        { status: 400 }
      );
    }

    // Verificar si tenemos credenciales de MercadoPago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      // Modo simulado
      const simulatedPreferenceId = `simulated_${plan}_${Date.now()}`;
      const simulatedInitPoint = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/test-mercadopago?preference_id=${simulatedPreferenceId}&plan=${plan}`;
      
      return NextResponse.json({ 
        preferenceId: simulatedPreferenceId,
        initPoint: simulatedInitPoint,
        mode: 'simulated',
        message: 'Modo simulado - Configura MERCADOPAGO_ACCESS_TOKEN para pagos reales'
      });
    }

    // Crear o obtener cliente de Mercado Pago
    let mpCustomerId = professional.mp_customer_id as string | undefined;

    if (!mpCustomerId) {
      const customer = await createMPCustomer({
        email: professional.email,
        name: professional.business_name,
        metadata: {
          professional_id: user.id,
          business_slug: professional.business_slug,
        },
      });

      mpCustomerId = customer.id;

      // Actualizar profesional con customer ID
      await supabase
        .from('professionals')
        .update({ mp_customer_id: mpCustomerId })
        .eq('id', professional.id);
    }

    // Crear preferencia de pago
    const preference = await createSubscriptionPreference({
      customerId: mpCustomerId,
      plan,
      successUrl,
      cancelUrl,
    });

    // Preferencia: usar sandbox_init_point si sandbox
    const initPoint = isMercadoPagoSandbox() && preference.sandbox_init_point
      ? preference.sandbox_init_point
      : preference.init_point;

    return NextResponse.json({ 
      preferenceId: preference.id,
      initPoint,
      mode: isMercadoPagoSandbox() ? 'sandbox' : 'live'
    });

  } catch (error: any) {
    const message = error?.message || 'Error desconocido';
    console.error('Error creating preference:', message, error);
    const mode = process.env.MERCADOPAGO_ACCESS_TOKEN ? 'real' : 'simulated';
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago', detail: message, mode },
      { status: 500 }
    );
  }
} 