import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionPreference, createMPCustomer, isMercadoPagoSandbox } from '@/lib/mercadopago';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 MercadoPago API: Iniciando request...');
    
    const { plan, successUrl, cancelUrl } = await request.json();
    console.log('🔍 MercadoPago API: Plan recibido:', plan);

    // Verificar autenticación con cookies del request (server-side)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    console.log('🔍 MercadoPago API: Config Supabase:', { 
      url: supabaseUrl ? 'Configurado' : 'NO configurado',
      anonKey: anonKey ? 'Configurado' : 'NO configurado'
    });
    
    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name);
          console.log(`🔍 MercadoPago API: Cookie ${name}:`, cookie ? 'Presente' : 'Ausente');
          return cookie?.value;
        },
        set() {},
        remove() {},
      },
    });
    
    console.log('🔍 MercadoPago API: Intentando obtener usuario...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('🔍 MercadoPago API: Resultado auth:', { 
      user: user ? `ID: ${user.id}` : 'null',
      error: authError ? authError.message : 'null'
    });

    if (authError || !user) {
      console.log('❌ MercadoPago API: Autenticación falló:', { authError, user });
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    console.log('✅ MercadoPago API: Usuario autenticado:', user.id);

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