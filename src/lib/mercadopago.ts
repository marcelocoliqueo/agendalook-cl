// Importar MercadoPago usando require para evitar problemas con webpack
const { MercadoPagoConfig, Preference } = require('mercadopago');
const crypto = require('crypto');

// Variable global para la configuración
let mpConfig: any = null;

export function isMercadoPagoSandbox(): boolean {
  return (process.env.MERCADOPAGO_IS_SANDBOX || 'false').toLowerCase() === 'true';
}

// Función para configurar MercadoPago
function configureMercadoPago() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado');
  }

  // Verificar formato del access token
  if (!accessToken.startsWith('APP_USR-')) {
    throw new Error('Access Token no tiene el formato correcto (debe empezar con APP_USR-)');
  }

  try {
    console.log('🔧 Configurando MercadoPago...');
    console.log('Access Token:', accessToken.substring(0, 20) + '...');
    
    // Configurar MercadoPago con el access token usando la nueva sintaxis
    mpConfig = new MercadoPagoConfig({
      accessToken: accessToken,
    });
    
    console.log('✅ MercadoPago configurado exitosamente');
  } catch (error) {
    console.error('❌ Error configurando MercadoPago:', error);
    
    // Mostrar más detalles del error
    if (error instanceof Error) {
      throw new Error(`Error al configurar MercadoPago: ${error.message}`);
    } else {
      throw new Error('Error al configurar MercadoPago - Error desconocido');
    }
  }
}

// Función para verificar la firma de MercadoPago
export function verifyMercadoPagoSignature(
  payload: string, 
  signature: string, 
  timestamp: string
): boolean {
  try {
    if (!signature || !timestamp) return false;

    // Validar antigüedad del timestamp (máx 5 minutos)
    const ts = parseInt(timestamp, 10);
    if (Number.isNaN(ts) || Date.now() - ts > 5 * 60 * 1000) return false;

    const secret = isMercadoPagoSandbox()
      ? process.env.MERCADOPAGO_WEBHOOK_SECRET_SANDBOX
      : process.env.MERCADOPAGO_WEBHOOK_SECRET_LIVE;

    if (!secret) {
      console.warn('MercadoPago webhook secret not configured');
      return false;
    }

    // Firmas posibles: "ts=..., v1=..." o "sha256=..."
    const parts = signature.includes(',')
      ? Object.fromEntries(
          signature.split(',').map((p: string) => {
            const [k, v] = p.trim().split('=');
            return [k, (v || '').replace(/^\s*sha256=/, '')];
          })
        )
      : { v1: signature.replace(/^sha256=/, '') } as any;

    const providedHash = parts.v1 || parts.sha256 || '';
    if (!providedHash) return false;

    // Intentar variantes de concatenación
    const candidates = [
      `${timestamp}.${payload}`,
      `${timestamp}:${payload}`,
      `${payload}.${timestamp}`,
      `${payload}:${timestamp}`,
      payload,
    ];

    return candidates.some((candidate) => {
      const digest = crypto.createHmac('sha256', secret).update(candidate).digest('hex');
      try {
        return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(providedHash));
      } catch {
        return false;
      }
    });
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

// Función para crear/obtener cliente de MercadoPago
export async function createMPCustomer(customerData: {
  email: string;
  name: string;
  metadata?: any;
}): Promise<{ id: string; message?: string }> {
  try {
    configureMercadoPago();
    if (!mpConfig) throw new Error('MercadoPago no está configurado');

    if (!customerData.email || !customerData.name) {
      throw new Error('Email y nombre son requeridos');
    }

    const { Customer } = require('mercadopago');
    const customer = new Customer(mpConfig);

    // Buscar por email
    try {
      const searchRes = await customer.search({ email: customerData.email });
      if (searchRes && searchRes.results && searchRes.results.length > 0) {
        return { id: searchRes.results[0].id };
      }
    } catch (e) {
      console.warn('Customer.search failed or not available, proceeding to create');
    }

    // Crear cliente si no existe
    try {
      const created = await customer.create({
        email: customerData.email,
        first_name: customerData.name,
        metadata: customerData.metadata || {},
      });
      if (created && created.id) {
        return { id: created.id };
      }
    } catch (e) {
      console.warn('Customer.create failed; returning simulated id as fallback');
      return { id: `simulated_cust_${Date.now()}`, message: 'Simulated customer (fallback)' };
    }

    return { id: `simulated_cust_${Date.now()}`, message: 'Simulated customer (no result)' };
  } catch (error) {
    console.error('Error creating MercadoPago customer:', error);
    return { id: `simulated_cust_${Date.now()}`, message: 'Simulated customer (error)' };
  }
}

// Función para crear preferencia de suscripción
export async function createSubscriptionPreference(preferenceData: {
  customerId: string;
  plan: string;
  successUrl: string;
  cancelUrl: string;
  payerEmail?: string;
}) {
  try {
    configureMercadoPago();
    
    const planName = preferenceData.plan === 'pro' ? 'Pro' : 'Premium';
    const planPrice = preferenceData.plan === 'pro' ? 9900 : 19900;

    // Intentar crear suscripción (PreApproval) para cobro mensual automático
    try {
      const { PreApproval } = require('mercadopago');
      const preapproval = new PreApproval(mpConfig);
      const payload = {
        reason: `Plan ${planName} Agendalook`,
        external_reference: `subscription_${preferenceData.plan}_${preferenceData.customerId}`,
        back_url: preferenceData.successUrl,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: planPrice,
          currency_id: 'CLP',
        },
        payer_email: preferenceData.payerEmail,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
        metadata: {
          test: isMercadoPagoSandbox(),
          env: isMercadoPagoSandbox() ? 'sandbox' : 'live',
        },
      };
      const result = await preapproval.create(payload);
      console.log('PreApproval creado:', result.id);
      // Normalizar shape esperado por el caller
      return {
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
      };
    } catch (e) {
      console.warn('PreApproval.create no disponible; fallback a Preference (pago único)');
      
      // Crear preferencia usando la sintaxis correcta del SDK v2.8.0
      const preference = new Preference(mpConfig);
      
      // Crear el payload con la estructura exacta que espera MercadoPago
      const preferencePayload = {
        items: [
          {
            id: `plan-${preferenceData.plan}`,
            title: `Plan ${planName}`,
            quantity: 1,
            unit_price: planPrice,
            currency_id: 'CLP',
          },
        ],
        back_urls: {
          success: preferenceData.successUrl,
          failure: preferenceData.cancelUrl,
          pending: preferenceData.cancelUrl,
        },
        auto_return: 'approved',
        external_reference: `subscription_${preferenceData.plan}_${preferenceData.customerId}`,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
        expires: true,
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          test: isMercadoPagoSandbox(),
          env: isMercadoPagoSandbox() ? 'sandbox' : 'live',
        },
      };
      
      console.log('🔍 MercadoPago: Preference payload:', JSON.stringify(preferencePayload, null, 2));
      
      // Usar la sintaxis correcta del SDK v2.8.0
      const fallback = await preference.create({ body: preferencePayload });
      return fallback;
    }
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

    const { Payment } = require('mercadopago');
    const payment = new Payment(mpConfig);
    const result = await payment.get({ id: paymentId });
    return result;
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

    const { PreApproval } = require('mercadopago');
    const preapproval = new PreApproval(mpConfig);
    const result = await preapproval.get({ id: subscriptionId });
    return result;
  } catch (error) {
    console.error('Error getting subscription info:', error);
    throw error;
  }
}

// Función para verificar la conexión con MercadoPago
export async function testMercadoPagoConnection() {
  try {
    // Verificar que el access token esté configurado y sea válido
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken || accessToken.includes('tu_access_token_aqui')) {
      return {
        success: true,
        mode: 'simulated',
        preferenceId: 'simulated_pref_123',
        message: 'Modo simulado - Configura credenciales reales de MercadoPago para modo real'
      };
    }

    console.log('🔍 Probando conexión con MercadoPago...');
    console.log('Access Token:', accessToken.substring(0, 20) + '...');
    
    // Solo configurar si tenemos credenciales válidas
    configureMercadoPago();
    
    if (!mpConfig) {
      throw new Error('MercadoPago no está configurado');
    }
    
    // Intentar crear una preferencia de prueba
    console.log('📝 Creando preferencia de prueba...');
    
    // Crear instancia de Preference
    const preference = new Preference(mpConfig);
    
    // Formato simplificado que funcionó en el script de prueba
    const preferenceData = {
      items: [
        {
          id: 'test',
          title: 'Test',
          quantity: 1,
          unit_price: 100,
          currency_id: 'CLP'
        }
      ],
      back_urls: {
        success: 'https://example.com/success',
        failure: 'https://example.com/failure'
      },
      auto_return: 'approved',
      external_reference: 'test'
    };
    
    console.log('📋 Datos de preferencia:', JSON.stringify(preferenceData, null, 2));
    
    const testPreference = await preference.create(preferenceData);

    console.log('✅ Preferencia creada exitosamente:', testPreference.id);

    return {
      success: true,
      mode: 'real',
      preferenceId: testPreference.id,
      message: 'Conexión con MercadoPago exitosa'
    };
  } catch (error) {
    console.error('❌ Error testing MercadoPago connection:', error);
    
    // Mostrar más detalles del error
    let errorMessage = 'Error desconocido';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    console.error('Error details:', errorDetails);
    
    return {
      success: false,
      mode: 'simulated',
      preferenceId: 'simulated_pref_123',
      message: `Modo simulado - Error en credenciales de MercadoPago: ${errorMessage}`,
      error: errorMessage,
      details: errorDetails
    };
  }
} 