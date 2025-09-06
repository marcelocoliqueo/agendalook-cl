import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const tokenData = await request.json();
    
    console.log('🔍 Generando card token con datos:', {
      card_number: tokenData.card_number.replace(/\d(?=\d{4})/g, '*'),
      security_code: '***',
      expiration_month: tokenData.expiration_month,
      expiration_year: tokenData.expiration_year,
      cardholder_name: tokenData.cardholder.name,
      identification_type: tokenData.cardholder.identification.type,
      identification_number: tokenData.cardholder.identification.number.replace(/\d(?=\d{2})/g, '*')
    });

    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no está configurado' }, { status: 500 });
    }

    // Llamar a la API de MercadoPago desde el backend
    const response = await fetch('https://api.mercadopago.com/v1/card_tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de MercadoPago:', errorData);
      return NextResponse.json({ error: errorData.message || 'Error generando card token' }, { status: response.status });
    }

    const result = await response.json();
    
    if (!result.id) {
      return NextResponse.json({ error: 'No se pudo generar el card token' }, { status: 500 });
    }

    console.log('✅ Card token generado exitosamente:', result.id);
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error generando card token:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
