import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createSubscriptionPreference, createMPCustomer, isMercadoPagoSandbox } from '@/lib/mercadopago';

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
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );
    
    console.log('🔍 MercadoPago API: Supabase client created');

    // Obtener la cookie de sesión
    const supabaseCookie = cookieStore.get('sb-access-token');
    console.log('🔍 MercadoPago API: Supabase cookie:', supabaseCookie ? 'Present' : 'Missing');
    
    // Listar todas las cookies disponibles
    const allCookies = cookieStore.getAll();
    console.log('🔍 MercadoPago API: All cookies:', allCookies.map(c => ({ name: c.name, value: c.value ? 'Present' : 'Missing' })));
    
    // Buscar cookies específicas de Supabase
    const supabaseCookies = allCookies.filter(c => c.name.startsWith('sb-'));
    console.log('🔍 MercadoPago API: Supabase cookies found:', supabaseCookies.map(c => c.name));

    // Verificar el usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('🔍 MercadoPago API: User verification result:', {
      user: user ? { id: user.id, email: user.email } : null,
      error: userError
    });

    if (userError || !user) {
      console.log('🔍 MercadoPago API: User not authenticated');
      
      // Intentar verificación alternativa usando el userId del body
      if (body.userId) {
        console.log('🔍 MercadoPago API: Trying alternative verification with userId:', body.userId);
        
        // Verificar que el usuario existe en la base de datos
        const { data: professional, error: profError } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', body.userId)
          .single();
          
        if (profError || !professional) {
          console.log('🔍 MercadoPago API: Professional not found in alternative verification');
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
        
        console.log('🔍 MercadoPago API: Alternative verification successful, using userId from body');
        // Continuar con el userId del body como verificación alternativa
      } else {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
    } else {
      console.log('🔍 MercadoPago API: User authenticated successfully:', user.id);
    }

    // Obtener datos del profesional
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user?.id || body.userId)
      .single();

    if (professionalError || !professional) {
      console.log('🔍 MercadoPago API: Professional not found:', professionalError);
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
    }

    console.log('🔍 MercadoPago API: Professional found:', professional.id);

    // Extraer datos del body
    const { plan, userEmail, userId } = body;

    if (!plan || !userEmail || !userId) {
      console.log('🔍 MercadoPago API: Missing required fields:', { plan, userEmail, userId });
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Verificar que el usuario del body coincida con el autenticado o el verificado alternativamente
    const verifiedUserId = user?.id || body.userId;
    if (userId !== verifiedUserId) {
      console.log('🔍 MercadoPago API: User ID mismatch:', { bodyUserId: userId, verifiedUserId });
      return NextResponse.json({ error: 'ID de usuario no coincide' }, { status: 400 });
    }

    console.log('🔍 MercadoPago API: Creating MercadoPago preference for plan:', plan);

    try {
      // Crear preferencia en MercadoPago
      const preference = await createSubscriptionPreference({
        customerId: professional.id,
        plan,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://agendalook.cl'}/dashboard`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://agendalook.cl'}/plans`,
        payerEmail: userEmail
      });

      console.log('🔍 MercadoPago API: Preference created successfully:', preference);

      if (!preference) {
        console.log('🔍 MercadoPago API: Failed to create preference - preference is null/undefined');
        return NextResponse.json({ error: 'Error creando preferencia' }, { status: 500 });
      }

      console.log('🔍 MercadoPago API: Preference created successfully:', preference.id);

      return NextResponse.json({
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point
      });

    } catch (preferenceError) {
      console.error('🔍 MercadoPago API: Error creating preference:', preferenceError);
      console.error('🔍 MercadoPago API: Error details:', {
        message: preferenceError instanceof Error ? preferenceError.message : 'Unknown error',
        stack: preferenceError instanceof Error ? preferenceError.stack : 'No stack trace',
        error: preferenceError
      });
      
      return NextResponse.json({ 
        error: 'Error creando preferencia de MercadoPago',
        details: preferenceError instanceof Error ? preferenceError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🔍 MercadoPago API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 