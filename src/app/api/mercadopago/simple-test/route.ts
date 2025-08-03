import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar configuración básica
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    const config = {
      accessTokenConfigured: !!accessToken,
      appUrlConfigured: !!appUrl,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    if (!accessToken) {
      return NextResponse.json({
        status: 'warning',
        message: 'MercadoPago no está configurado',
        config,
        instructions: [
          '1. Configura MERCADOPAGO_ACCESS_TOKEN en tu .env',
          '2. Obtén tu access token desde el dashboard de MercadoPago',
          '3. Para pruebas, puedes usar el sandbox de MercadoPago'
        ]
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Configuración básica correcta',
      config,
      nextSteps: [
        '1. Configura los Product IDs si quieres usar productos específicos',
        '2. Configura el webhook URL en tu dashboard de MercadoPago',
        '3. Prueba la integración completa'
      ]
    });

  } catch (error) {
    console.error('Error en simple test:', error);
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido',
      status: 'error'
    }, { status: 500 });
  }
} 