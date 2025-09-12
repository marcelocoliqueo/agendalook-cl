import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Limpiando sesión del usuario...');
    
    const supabase = await createServerClient();
    
    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Error cerrando sesión:', error);
    } else {
      console.log('✅ Sesión cerrada correctamente');
    }

    // Crear respuesta que limpia las cookies
    const response = NextResponse.json({ 
      success: true, 
      message: 'Sesión limpiada correctamente' 
    });

    // Limpiar cookies de Supabase
    response.cookies.set('sb-zpmoxzsvmranghizsb-auth-token', '', {
      expires: new Date(0),
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.agendalook.cl' : 'localhost',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    });

    response.cookies.set('sb-zpmoxzsvmranghizsb-auth-token.0', '', {
      expires: new Date(0),
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.agendalook.cl' : 'localhost',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    });

    response.cookies.set('sb-zpmoxzsvmranghizsb-auth-token.1', '', {
      expires: new Date(0),
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.agendalook.cl' : 'localhost',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    });

    console.log('✅ Cookies limpiadas');
    return response;

  } catch (error) {
    console.error('❌ Error limpiando sesión:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error limpiando sesión' 
    }, { status: 500 });
  }
}
