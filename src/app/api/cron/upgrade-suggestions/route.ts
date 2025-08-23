import { NextRequest, NextResponse } from 'next/server';
import { scheduleUpgradeSuggestions } from '@/lib/upgrade-email-service';

export async function POST(request: NextRequest) {
  try {
    // Verificar que sea una llamada válida (puedes agregar autenticación aquí)
    const authHeader = request.headers.get('authorization');
    
    // Para Vercel Cron, puedes usar un token secreto
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🕐 Ejecutando cron job de sugerencias de upgrade...');
    
    // Ejecutar el servicio de emails de upgrade
    await scheduleUpgradeSuggestions();
    
    console.log('✅ Cron job de upgrade completado exitosamente');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Upgrade suggestions processed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en cron job de upgrade:', error);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// También permitir GET para testing manual
export async function GET() {
  try {
    console.log('🧪 Testing cron job de upgrade...');
    
    await scheduleUpgradeSuggestions();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test completed successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en test de upgrade:', error);
    
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
