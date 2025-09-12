import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }
    
    console.log(`🧹 Limpiando usuario: ${email}`);
    
    const supabase = await createServerSupabaseClient();
    
    // 1. Buscar el usuario en auth.users
    console.log('🔍 Buscando usuario en auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error listando usuarios auth:', authError);
      return NextResponse.json({ error: 'Error accediendo a usuarios' }, { status: 500 });
    }
    
    const authUser = authUsers.users.find(user => user.email === email);
    
    if (!authUser) {
      console.log('ℹ️ Usuario no encontrado en auth.users');
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }
    
    console.log(`✅ Usuario encontrado en auth: ${authUser.id}`);
    
    // 2. Eliminar de tabla professionals
    console.log('🗑️ Eliminando de tabla professionals...');
    const { error: profError } = await supabase
      .from('professionals')
      .delete()
      .eq('user_id', authUser.id);
    
    if (profError) {
      console.error('❌ Error eliminando professional:', profError);
    } else {
      console.log('✅ Professional eliminado');
    }
    
    // 3. Eliminar de tabla bookings (si existe)
    console.log('🗑️ Eliminando bookings relacionados...');
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('professional_id', authUser.id);
    
    if (bookingsError) {
      console.log('⚠️ No se pudieron eliminar bookings:', bookingsError.message);
    } else {
      console.log('✅ Bookings eliminados');
    }
    
    // 4. Eliminar de tabla services (si existe)
    console.log('🗑️ Eliminando services relacionados...');
    const { error: servicesError } = await supabase
      .from('services')
      .delete()
      .eq('professional_id', authUser.id);
    
    if (servicesError) {
      console.log('⚠️ No se pudieron eliminar services:', servicesError.message);
    } else {
      console.log('✅ Services eliminados');
    }
    
    // 5. Eliminar de tabla availability (si existe)
    console.log('🗑️ Eliminando availability relacionada...');
    const { error: availabilityError } = await supabase
      .from('availability')
      .delete()
      .eq('professional_id', authUser.id);
    
    if (availabilityError) {
      console.log('⚠️ No se pudieron eliminar availability:', availabilityError.message);
    } else {
      console.log('✅ Availability eliminada');
    }
    
    // 6. Eliminar usuario de auth.users
    console.log('🗑️ Eliminando usuario de auth.users...');
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(authUser.id);
    
    if (deleteAuthError) {
      console.error('❌ Error eliminando usuario auth:', deleteAuthError);
      return NextResponse.json({ error: 'Error eliminando usuario' }, { status: 500 });
    }
    
    console.log('✅ Usuario eliminado de auth.users');
    
    // 7. Verificar limpieza completa
    console.log('🔍 Verificando limpieza completa...');
    const { data: finalCheck, error: finalError } = await supabase.auth.admin.listUsers();
    
    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
    } else {
      const remainingUser = finalCheck.users.find(user => user.email === email);
      if (remainingUser) {
        console.log('⚠️ Usuario aún existe:', remainingUser.id);
        return NextResponse.json({ message: 'Usuario parcialmente eliminado' }, { status: 206 });
      } else {
        console.log('✅ Usuario completamente eliminado');
      }
    }
    
    console.log('🎉 Limpieza completada');
    return NextResponse.json({ 
      message: 'Usuario eliminado completamente',
      userId: authUser.id,
      email: email
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
