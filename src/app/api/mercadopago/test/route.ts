import { NextRequest, NextResponse } from 'next/server';
import { testMercadoPagoConnection } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    // Probar conexión con Mercado Pago (incluye modo simulado)
    const result = await testMercadoPagoConnection();
    
    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: result.message,
        mode: result.mode,
        preference: {
          id: result.preferenceId,
          test: true
        },
        products: {
          pro: {
            name: 'Plan Pro',
            price: 9900,
            currency: 'CLP'
          },
          studio: {
            name: 'Plan Studio',
            price: 19900,
            currency: 'CLP'
          }
        },
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'test',
        config: {
          accessTokenConfigured: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'No configurado'
        }
      });
    } else {
      return NextResponse.json({
        error: result.message,
        details: result.error,
        status: 'error',
        config: {
          accessTokenConfigured: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'No configurado'
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en test endpoint:', error);
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido',
      status: 'error'
    }, { status: 500 });
  }
} 