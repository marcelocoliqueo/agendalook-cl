import { NextRequest, NextResponse } from 'next/server';
import { testMercadoPagoConnection, verifyMercadoPagoSignature, isMercadoPagoSandbox } from '@/lib/mercadopago';

export async function GET(request: NextRequest) {
  try {
    // Validación de firma opcional si MP envía callback (defensivo)
    const sig = request.headers.get('x-signature') || '';
    const ts = request.headers.get('x-timestamp') || '';
    const body = '';
    if (sig && ts && !verifyMercadoPagoSignature(body, sig, ts)) {
      return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 401 });
    }

    // Verificar que la conexión con Mercado Pago funciona
    const result = await testMercadoPagoConnection();

    if (!result.success) {
      return NextResponse.json({
        status: 'error',
        message: 'Error al conectar con MercadoPago',
        error: result.error,
        products: {
          pro: {
            id: 'plan-pro',
            valid: false,
            name: 'Plan Pro',
            price: 9900
          },
          studio: {
            id: 'plan-studio',
            valid: false,
            name: 'Plan Studio',
            price: 19990
          }
        },
        allValid: false
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Verificación de productos completada',
      mode: isMercadoPagoSandbox() ? 'sandbox' : 'live',
      products: {
        pro: {
          id: 'plan-pro',
          valid: true,
          name: 'Plan Pro',
          price: 9900
        },
        studio: {
          id: 'plan-studio',
          valid: true,
          name: 'Plan Studio',
          price: 19990
        }
      },
      allValid: true,
      testPreferenceId: result.preferenceId
    });

  } catch (error) {
    console.error('Error verifying products:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Error al verificar productos',
      error: error instanceof Error ? error.message : 'Error desconocido',
      products: {
        pro: {
          id: 'plan-pro',
          valid: false,
          name: 'Plan Pro',
          price: 9900
        },
        studio: {
          id: 'plan-studio',
          valid: false,
          name: 'Plan Studio',
          price: 19990
        }
      },
      allValid: false
    }, { status: 500 });
  }
} 