// Importar MercadoPago usando require para evitar problemas con webpack
const { MercadoPagoConfig, PreApprovalPlan, PreApproval } = require('mercadopago');
const crypto = require('crypto');

// Variable global para la configuración
let mpConfig: any = null;

export function isMercadoPagoSandbox(): boolean {
  return (process.env.MERCADOPAGO_IS_SANDBOX || 'false').toLowerCase() === 'true';
}

// Función para configurar MercadoPago
function configureMercadoPago() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const clientId = process.env.MERCADOPAGO_CLIENT_ID;
  const clientSecret = process.env.MERCADOPAGO_CLIENT_SECRET;
  
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado');
  }

  if (!clientId) {
    throw new Error('MERCADOPAGO_CLIENT_ID no está configurado');
  }

  if (!clientSecret) {
    throw new Error('MERCADOPAGO_CLIENT_SECRET no está configurado');
  }

  // Verificar formato del access token
  if (!accessToken.startsWith('APP_USR-') && !accessToken.startsWith('TEST-')) {
    throw new Error('Access Token no tiene el formato correcto (debe empezar con APP_USR- o TEST-)');
  }

  try {
    console.log('🔧 Configurando MercadoPago...');
    console.log('Access Token:', accessToken.substring(0, 20) + '...');
    console.log('Client ID:', clientId);
    console.log('Client Secret:', clientSecret.substring(0, 8) + '...');
    
    // Configurar MercadoPago con las credenciales completas
    mpConfig = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        clientId: clientId,
        clientSecret: clientSecret,
        locale: 'es-CL',
        advancedFraudPrevention: true,
      }
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

// Función para crear un plan de suscripción
export async function createSubscriptionPlan(planData: {
  plan: string;
  planName: string;
  planPrice: number;
  currency: string;
}) {
  try {
    configureMercadoPago();
    
    const preapprovalPlan = new PreApprovalPlan(mpConfig);
    
    const planPayload = {
      reason: `Plan ${planData.planName} Agendalook`,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        repetitions: 12, // 12 meses de suscripción
        billing_day: 10, // Día 10 de cada mes
        billing_day_proportional: true, // Proporcional si el día no existe
        transaction_amount: planData.planPrice,
        currency_id: planData.currency,
      },
      payment_methods_allowed: {
        payment_types: [{}], // Todos los tipos de pago
        payment_methods: [{}] // Todos los métodos de pago
      },
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    };
    
    console.log('🔍 MercadoPago: Creating subscription plan:', JSON.stringify(planPayload, null, 2));
    
    const plan = await preapprovalPlan.create({ body: planPayload });
    console.log('✅ Plan de suscripción creado:', plan.id);
    
    return plan;
  } catch (error) {
    console.error('❌ Error creating subscription plan:', error);
    throw error;
  }
}

// Función para crear una suscripción usando el plan
export async function createSubscriptionWithPlan(subscriptionData: {
  planId: string;
  customerId: string;
  plan: string;
  planName: string;
  planPrice: number;
  payerEmail: string;
  cardTokenId: string;
}) {
  try {
    configureMercadoPago();
    
    const preapproval = new PreApproval(mpConfig);
    
    const subscriptionPayload = {
      preapproval_plan_id: subscriptionData.planId,
      reason: `Plan ${subscriptionData.planName} Agendalook`,
      external_reference: `subscription_${subscriptionData.plan}_${subscriptionData.customerId}`,
      payer_email: subscriptionData.payerEmail,
      card_token_id: subscriptionData.cardTokenId,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 año
        transaction_amount: subscriptionData.planPrice,
        currency_id: 'CLP',
      },
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      status: 'authorized'
    };
    
    console.log('🔍 MercadoPago: Creating subscription with plan:', JSON.stringify(subscriptionPayload, null, 2));
    
    const subscription = await preapproval.create({ body: subscriptionPayload });
    console.log('✅ Suscripción creada:', subscription.id);
    
    return subscription;
  } catch (error) {
    console.error('❌ Error creating subscription:', error);
    throw error;
  }
}

// Función principal para crear preferencia de suscripción
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
    const planPrice = preferenceData.plan === 'pro' ? 9990 : 19990;

    console.log('🔍 MercadoPago: Creating subscription preference for plan:', preferenceData.plan);

    // Paso 1: Crear el plan de suscripción
    const plan = await createSubscriptionPlan({
      plan: preferenceData.plan,
      planName,
      planPrice,
      currency: 'CLP'
    });

    // Paso 2: Crear la suscripción (requiere card_token_id)
    // Por ahora, retornamos el plan para que el frontend pueda continuar
    // El card_token_id se obtendrá del frontend después de la validación de tarjeta
    
    return {
      id: plan.id,
      plan_id: plan.id,
      init_point: plan.back_url,
      sandbox_init_point: plan.back_url,
      type: 'subscription_plan'
    };
    
  } catch (error) {
    console.error('Error creating subscription preference:', error);
    throw error;
  }
}

// Función para crear suscripción completa con card_token
export async function createCompleteSubscription(subscriptionData: {
  planId: string;
  customerId: string;
  plan: string;
  planName: string;
  planPrice: number;
  payerEmail: string;
  cardTokenId: string;
}) {
  try {
    configureMercadoPago();
    
    console.log('🔍 MercadoPago: Creating complete subscription with card token');

    // Crear la suscripción usando el plan y el card_token
    const subscription = await createSubscriptionWithPlan({
      planId: subscriptionData.planId,
      customerId: subscriptionData.customerId,
      plan: subscriptionData.plan,
      planName: subscriptionData.planName,
      planPrice: subscriptionData.planPrice,
      payerEmail: subscriptionData.payerEmail,
      cardTokenId: subscriptionData.cardTokenId
    });

    return {
      id: subscription.id,
      status: subscription.status,
      type: 'subscription',
      message: 'Suscripción creada exitosamente'
    };
    
  } catch (error) {
    console.error('Error creating complete subscription:', error);
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

    const preapproval = new PreApproval(mpConfig);
    const result = await preapproval.get({ id: subscriptionId });
    return result;
  } catch (error) {
    console.error('Error getting subscription info:', error);
    throw error;
  }
}

// Función para obtener información de un plan
export async function getPlanInfo(planId: string) {
  try {
    configureMercadoPago();
    
    if (!planId) {
      throw new Error('Plan ID es requerido');
    }

    const preapprovalPlan = new PreApprovalPlan(mpConfig);
    const result = await preapprovalPlan.get({ id: planId });
    return result;
  } catch (error) {
    console.error('Error getting plan info:', error);
    throw error;
  }
}

// Función para crear un cliente en MercadoPago
export async function createMPCustomer(customerData: {
  email: string;
  name: string;
  surname: string;
}) {
  try {
    configureMercadoPago();
    
    const { Customer } = require('mercadopago');
    const customer = new Customer(mpConfig);
    
    const customerPayload = {
      email: customerData.email,
      first_name: customerData.name,
      last_name: customerData.surname,
    };
    
    const result = await customer.create({ body: customerPayload });
    console.log('✅ Cliente MercadoPago creado:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Error creating MercadoPago customer:', error);
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
    
    // Intentar crear un plan de suscripción de prueba
    console.log('📝 Creando plan de suscripción de prueba...');
    
    const preapprovalPlan = new PreApprovalPlan(mpConfig);
    
    const testPlanData = {
      reason: 'Test Plan Agendalook',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        repetitions: 12,
        billing_day: 10,
        billing_day_proportional: true,
        transaction_amount: 1000,
        currency_id: 'CLP',
      },
      back_url: 'https://example.com/success',
      payment_methods_allowed: {
        payment_types: [{}],
        payment_methods: [{}]
      }
    };
    
    console.log('📋 Datos del plan de prueba:', JSON.stringify(testPlanData, null, 2));
    
    const testPlan = await preapprovalPlan.create({ body: testPlanData });

    console.log('✅ Plan de suscripción de prueba creado exitosamente:', testPlan.id);

    return {
      success: true,
      mode: 'real',
      preferenceId: testPlan.id,
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