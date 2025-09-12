import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const clientId = process.env.MERCADOPAGO_CLIENT_ID;
    const clientSecret = process.env.MERCADOPAGO_CLIENT_SECRET;
    const isSandbox = process.env.MERCADOPAGO_IS_SANDBOX;

    console.log('🔍 Verificando credenciales de MercadoPago:');
    console.log('Public Key:', publicKey ? `${publicKey.substring(0, 20)}...` : 'NO CONFIGURADO');
    console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NO CONFIGURADO');
    console.log('Client ID:', clientId || 'NO CONFIGURADO');
    console.log('Client Secret:', clientSecret ? `${clientSecret.substring(0, 10)}...` : 'NO CONFIGURADO');
    console.log('Is Sandbox:', isSandbox);

    // Probar conexión con MercadoPago
    if (publicKey) {
      const testResponse = await fetch('https://api.mercadopago.com/v1/payment_methods', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicKey}`,
          'Content-Type': 'application/json',
        },
      });

      const testResult = await testResponse.json();
      console.log('📋 Test de conexión:', testResponse.ok ? '✅ OK' : '❌ ERROR');
      
      if (!testResponse.ok) {
        console.error('❌ Error de conexión:', testResult);
      }
    }

    return NextResponse.json({
      publicKey: publicKey ? `${publicKey.substring(0, 20)}...` : null,
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      clientId: clientId || null,
      clientSecret: clientSecret ? `${clientSecret.substring(0, 10)}...` : null,
      isSandbox: isSandbox === 'true',
      connectionTest: publicKey ? 'Test realizado' : 'No se pudo probar'
    });

  } catch (error) {
    console.error('❌ Error verificando credenciales:', error);
    return NextResponse.json({ error: 'Error verificando credenciales' }, { status: 500 });
  }
}
