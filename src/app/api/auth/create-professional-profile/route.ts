import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

function slugify(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const { userId, businessName, business_slug, email, phone, description, address, plan } = await request.json();

    if (!userId || !businessName || !email) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase config faltante' }, { status: 500 });
    }

    const service = createServiceClient(supabaseUrl, serviceKey);

    // Verificar si ya existe un perfil profesional para este usuario
    const { data: existingProf } = await service
      .from('professionals')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingProf) {
      console.log('Professional profile already exists for user:', userId);
      return NextResponse.json({ success: true, message: 'Perfil ya existe' });
    }

    // Crear perfil profesional
    const finalBusinessSlug = business_slug || slugify(businessName);
    
    const { error: profError } = await service.from('professionals').insert([
      {
        user_id: userId,
        business_name: businessName,
        business_slug: finalBusinessSlug,
        email,
        phone: phone || '',
        description: description || '',
        address: address || '',
        plan: plan || 'look',
        role: 'user',
        subscription_status: 'none',
      },
    ]);

    if (profError) {
      console.error('Error creating professional profile:', profError);
      return NextResponse.json({ 
        error: `No se pudo crear el perfil profesional: ${profError.message}` 
      }, { status: 500 });
    }

    console.log('✅ Professional profile created successfully for user:', userId);
    return NextResponse.json({ 
      success: true, 
      message: 'Perfil profesional creado exitosamente' 
    });

  } catch (error: any) {
    console.error('Error in create-professional-profile:', error);
    return NextResponse.json({ 
      error: error?.message || 'Error interno' 
    }, { status: 500 });
  }
}
