import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const tokenData = await request.json();
    
    // Validar datos requeridos
    if (!tokenData.card_number || !tokenData.security_code || !tokenData.expiration_month || !tokenData.expiration_year) {
      return NextResponse.json({ error: 'Datos de tarjeta incompletos' }, { status: 400 });
    }

    if (!tokenData.cardholder?.name || !tokenData.cardholder?.identification?.type || !tokenData.cardholder?.identification?.number) {
      return NextResponse.json({ error: 'Datos del titular incompletos' }, { status: 400 });
    }

    // Limpiar y validar número de tarjeta
    const cleanCardNumber = tokenData.card_number.replace(/\s/g, '').replace(/\D/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      return NextResponse.json({ error: 'Número de tarjeta inválido' }, { status: 400 });
    }

    // Validar mes y año
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(tokenData.expiration_year);
    const expMonth = parseInt(tokenData.expiration_month);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return NextResponse.json({ error: 'Tarjeta expirada' }, { status: 400 });
    }

    if (expMonth < 1 || expMonth > 12) {
      return NextResponse.json({ error: 'Mes de expiración inválido' }, { status: 400 });
    }

    // Preparar datos para MercadoPago
    const mpTokenData = {
      card_number: cleanCardNumber,
      security_code: tokenData.security_code,
      expiration_month: expMonth,
      expiration_year: expYear,
      cardholder: {
        name: tokenData.cardholder.name.trim(),
        identification: {
          type: tokenData.cardholder.identification.type,
          number: tokenData.cardholder.identification.number.replace(/\D/g, '')
        }
      }
    };
    
    console.log('🔍 Generando card token con datos validados:', {
      card_number: mpTokenData.card_number.replace(/\d(?=\d{4})/g, '*'),
      security_code: '***',
      expiration_month: mpTokenData.expiration_month,
      expiration_year: mpTokenData.expiration_year,
      cardholder_name: mpTokenData.cardholder.name,
      identification_type: mpTokenData.cardholder.identification.type,
      identification_number: mpTokenData.cardholder.identification.number.replace(/\d(?=\d{2})/g, '*')
    });

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'MERCADOPAGO_ACCESS_TOKEN no está configurado' }, { status: 500 });
    }

    // Llamar a la API de MercadoPago desde el backend
    const response = await fetch('https://api.mercadopago.com/v1/card_tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Agendalook/1.0'
      },
      body: JSON.stringify(mpTokenData)
    });

    const responseText = await response.text();
    console.log('📋 Respuesta de MercadoPago:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText, status: response.status };
      }
      console.error('❌ Error de MercadoPago:', errorData);
      return NextResponse.json({ 
        error: errorData.message || 'Error generando card token',
        details: errorData 
      }, { status: response.status });
    }

    const result = JSON.parse(responseText);
    
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
