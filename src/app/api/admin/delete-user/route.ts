import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase config faltante' }, { status: 500 });
    }

    const service = createServiceClient(supabaseUrl, serviceKey);

    console.log(`🔍 Searching for user: ${email}`);
    
    // Buscar usuario por email
    const { data: users, error: searchError } = await service.auth.admin.listUsers();
    
    if (searchError) {
      console.error('❌ Error searching users:', searchError);
      return NextResponse.json({ error: 'Error buscando usuario' }, { status: 500 });
    }
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`✅ User ${email} not found (already deleted or never existed)`);
      return NextResponse.json({ success: true, message: 'Usuario no encontrado' });
    }
    
    console.log(`👤 Found user: ${user.id} (${user.email})`);
    
    // Eliminar perfil profesional primero
    const { error: profError } = await service
      .from('professionals')
      .delete()
      .eq('user_id', user.id);
    
    if (profError) {
      console.error('⚠️ Error deleting professional profile:', profError.message);
    } else {
      console.log('✅ Professional profile deleted');
    }
    
    // Eliminar usuario
    const { error: deleteError } = await service.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error('❌ Error deleting user:', deleteError);
      return NextResponse.json({ error: 'Error eliminando usuario' }, { status: 500 });
    }
    
    console.log(`✅ User ${email} deleted successfully`);
    return NextResponse.json({ success: true, message: 'Usuario eliminado exitosamente' });

  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Error interno' 
    }, { status: 500 });
  }
}
