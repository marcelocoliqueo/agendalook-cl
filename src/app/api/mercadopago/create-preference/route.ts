import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionPreference, createMPCustomer } from '@/lib/mercadopago';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { plan, successUrl, cancelUrl } = await request.json();

    // Verificar autenticación
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener datos del profesional
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', user.id)
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

    // Crear o obtener cliente de Mercado Pago
    let mpCustomerId = professional.mp_customer_id;

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
        .eq('id', user.id);
    }

    // Crear preferencia de pago
    const preference = await createSubscriptionPreference({
      customerId: mpCustomerId,
      plan,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ 
      preferenceId: preference.id,
      initPoint: preference.init_point 
    });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 