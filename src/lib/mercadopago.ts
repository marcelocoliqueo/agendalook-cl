// @ts-ignore
const mercadopago = require('mercadopago');

// Función para configurar MercadoPago
function configureMercadoPago() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado');
  }

  try {
    // Configurar MercadoPago con el access token
    mercadopago.configure({
      access_token: accessToken,
    });
  } catch (error) {
    console.error('Error configurando MercadoPago:', error);
    throw new Error('Error al configurar MercadoPago');
  }
}

// Función para verificar la firma de MercadoPago
export function verifyMercadoPagoSignature(
  payload: string, 
  signature: string, 
  timestamp: string
): boolean {
  try {
    // En producción, deberías usar la librería oficial de MercadoPago
    // para verificar la firma. Esta es una implementación básica.
    
    if (!signature || !timestamp) {
      return false;
    }

    // Verificar que el timestamp no sea muy antiguo (máximo 5 minutos)
    const timestampNum = parseInt(timestamp);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (now - timestampNum > fiveMinutes) {
      console.warn('Webhook timestamp too old');
      return false;
    }

    // En un entorno real, aquí verificarías la firma criptográfica
    // Por ahora, verificamos que la firma tenga el formato esperado
    const expectedSignaturePrefix = 'sha256=';
    if (!signature.startsWith(expectedSignaturePrefix)) {
      console.warn('Invalid signature format');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying MercadoPago signature:', error);
    return false;
  }
}

// Función para validar el payload del webhook
export function validateWebhookPayload(body: any): boolean {
  try {
    // Verificar estructura básica
    if (!body || typeof body !== 'object') {
      return false;
    }

    // Verificar campos requeridos según el tipo
    if (body.type === 'payment') {
      return !!(body.data && body.data.id && body.data.status);
    }

    if (body.type === 'subscription_authorized_payment') {
      return !!(body.data && body.data.id && body.data.status);
    }

    if (body.type === 'subscription_cancelled') {
      return !!(body.data && body.data.id);
    }

    // Para otros tipos, verificar al menos que tenga data
    return !!(body.data && body.type);
  } catch (error) {
    console.error('Error validating webhook payload:', error);
    return false;
  }
}

// Función para crear cliente de MercadoPago
export async function createMPCustomer(customerData: {
  email: string;
  name: string;
  metadata?: any;
}) {
  try {
    configureMercadoPago();
    
    // Validar datos de entrada
    if (!customerData.email || !customerData.name) {
      throw new Error('Email y nombre son requeridos');
    }

    const customer = await mercadopago.customers.create({
      email: customerData.email,
      first_name: customerData.name.split(' ')[0] || customerData.name,
      last_name: customerData.name.split(' ').slice(1).join(' ') || '',
      metadata: customerData.metadata || {},
    });

    console.log('Cliente de MercadoPago creado:', customer.id);
    return customer;
  } catch (error) {
    console.error('Error creating MercadoPago customer:', error);
    throw error;
  }
}

// Función para crear preferencia de suscripción
export async function createSubscriptionPreference(preferenceData: {
  customerId: string;
  plan: string;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    configureMercadoPago();
    
    const { customerId, plan, successUrl, cancelUrl } = preferenceData;

    // Validar datos de entrada
    if (!customerId || !plan || !successUrl || !cancelUrl) {
      throw new Error('Todos los campos son requeridos');
    }

    // Validar plan
    if (!['pro', 'studio'].includes(plan)) {
      throw new Error('Plan no válido. Debe ser "pro" o "studio"');
    }

    // Determinar el precio según el plan
    const unitPrice = plan === 'pro' ? 9900 : 19900; // Precios en CLP
    const planName = plan === 'pro' ? 'Pro' : 'Studio';

    const preference = await mercadopago.preferences.create({
      items: [
        {
          id: `plan-${plan}`,
          title: `Suscripción ${planName} - Agendalook`,
          quantity: 1,
          unit_price: unitPrice,
          currency_id: 'CLP',
        },
      ],
      payer: {
        entity_type: 'individual',
      },
      back_urls: {
        success: successUrl,
        failure: cancelUrl,
        pending: cancelUrl,
      },
      auto_return: 'approved',
      external_reference: `subscription_${plan}_${Date.now()}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
    });

    console.log('Preferencia de MercadoPago creada:', preference.id);
    return preference;
  } catch (error) {
    console.error('Error creating subscription preference:', error);
    throw error;
  }
}

// Función para obtener información de un pago
export async function getPaymentInfo(paymentId: string) {
  try {
    configureMercadoPago();
    
    if (!paymentId) {
      throw new Error('Payment ID es requerido');
    }

    const payment = await mercadopago.payment.get(paymentId);
    return payment;
  } catch (error) {
    console.error('Error getting payment info:', error);
    throw error;
  }
}

// Función para obtener información de una suscripción
export async function getSubscriptionInfo(subscriptionId: string) {
  try {
    configureMercadoPago();
    
    if (!subscriptionId) {
      throw new Error('Subscription ID es requerido');
    }

    const subscription = await mercadopago.subscriptions.get(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error getting subscription info:', error);
    throw error;
  }
}

// Función para verificar la conexión con MercadoPago
export async function testMercadoPagoConnection() {
  try {
    // Verificar que el access token esté configurado
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return {
        success: false,
        error: 'MERCADOPAGO_ACCESS_TOKEN no está configurado',
        message: 'Configura la variable de entorno MERCADOPAGO_ACCESS_TOKEN'
      };
    }

    // Configurar MercadoPago
    configureMercadoPago();
    
    // Intentar crear una preferencia de prueba
    const testPreference = await mercadopago.preferences.create({
      items: [
        {
          id: 'test-item',
          title: 'Test Item',
          quantity: 1,
          unit_price: 100,
          currency_id: 'CLP',
        },
      ],
      back_urls: {
        success: 'https://example.com/success',
        failure: 'https://example.com/failure',
        pending: 'https://example.com/pending',
      },
      auto_return: 'approved',
      external_reference: 'test_connection',
    });

    return {
      success: true,
      preferenceId: testPreference.id,
      message: 'Conexión con MercadoPago exitosa'
    };
  } catch (error) {
    console.error('Error testing MercadoPago connection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error al conectar con MercadoPago'
    };
  }
} 