import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import mercadopago from 'mercadopago';
import { verifyMercadoPagoSignature, validateWebhookPayload, isMercadoPagoSandbox } from '@/lib/mercadopago';
import { webhookRateLimiter, getClientIP } from '@/lib/rate-limit';
import { securityLogger, getUserAgent } from '@/lib/security-logger';
import { getSubscriptionStatus, formatMoney } from '@/lib/plans';
import { sendPlanActivatedEmail } from '@/lib/upgrade-email-service';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    // Rate limiting para webhooks
    const rateLimitResult = await webhookRateLimiter.check(ip);
    if (!rateLimitResult.success) {
      securityLogger.logRateLimitExceeded(ip, '/api/mercadopago/webhook', userAgent);
      console.warn('Webhook rate limit exceeded:', ip);
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    console.log('Webhook recibido:', body);

    // Verificar que sea un webhook válido de MercadoPago
    if (!body.data || !body.type) {
      return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Verificar firma de MercadoPago
    const signature = request.headers.get('x-signature');
    const timestamp = request.headers.get('x-timestamp');
    
    if (!verifyMercadoPagoSignature(JSON.stringify(body), signature || '', timestamp || '')) {
      securityLogger.logSuspiciousActivity(ip, 'invalid_webhook_signature', { 
        signature: signature?.substring(0, 20) + '...',
        timestamp 
      }, userAgent);
      console.warn('Invalid MercadoPago signature:', ip);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Validar estructura del payload
    if (!validateWebhookPayload(body)) {
      securityLogger.logSuspiciousActivity(ip, 'invalid_webhook_payload', { 
        payloadType: typeof body,
        hasData: !!body.data,
        hasType: !!body.type
      }, userAgent);
      console.warn('Invalid webhook payload structure:', body);
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    // Verificar que es una notificación válida de Mercado Pago
    if (!body.data || !body.type) {
      return NextResponse.json(
        { error: 'Invalid notification' },
        { status: 400 }
      );
    }

    const { data, type } = body;

    // Log de seguridad
    securityLogger.logWebhookReceived(ip, type, data.id, userAgent);
    console.log(`Processing MercadoPago webhook: ${type}`, {
      ip,
      timestamp: new Date().toISOString(),
      dataId: data.id,
    });

    switch (type) {
      case 'payment':
        // Procesar pago exitoso
        if (data.status === 'approved') {
          // Idempotencia: evitar reprocesar el mismo payment_id
          const paymentId = data.id;
          const { data: existing } = await supabase
            .from('mp_webhooks')
            .select('id')
            .eq('payment_id', paymentId)
            .limit(1)
            .maybeSingle();

          if (existing) {
            return NextResponse.json({ received: true, idempotent: true });
          }

          // Buscar el profesional por external_reference
          const externalRef = data.external_reference;
          const planMatch = externalRef.match(/subscription_(pro|studio)_/);
          
          if (planMatch) {
            const plan = planMatch[1];
            const amount = data.transaction_amount || (plan === 'pro' ? 9990 : 19900);
            
            // Actualizar profesional con suscripción activa
            const { error: updateError } = await supabase
              .from('professionals')
              .update({
                plan,
                subscription_status: 'active',
                mp_subscription_id: data.id,
                last_payment_date: new Date().toISOString(),
                next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 días
                days_since_last_payment: 0,
                updated_at: new Date().toISOString(),
              })
              .eq('mp_customer_id', data.payer.id);

            if (updateError) {
              console.error('Error updating professional subscription:', updateError);
              return NextResponse.json(
                { error: 'Database update failed' },
                { status: 500 }
              );
            }

            // Registrar en historial de pagos
            await supabase
              .from('payment_history')
              .insert({
                professional_id: data.payer.id,
                payment_id: data.id,
                amount: amount,
                status: 'approved',
                plan_type: plan,
              });

            // Guardar idempotencia
            await supabase
              .from('mp_webhooks')
              .insert({ payment_id: paymentId, type: 'payment', processed_at: new Date().toISOString() });

            console.log(`Successfully updated professional subscription: ${data.payer.id} -> ${plan} (${formatMoney(amount)})`);

            // Si el pago fue aprobado, actualizar el plan del usuario
            if (data.status === 'approved') {
              try {
                // Obtener información del usuario
                const { data: user, error: userError } = await supabase
                  .from('professionals')
                  .select(`
                    id,
                    user_id,
                    plan
                  `)
                  .eq('user_id', data.external_reference)
                  .single();

                if (userError || !user) {
                  console.error('Error obteniendo usuario:', userError);
                  return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                // Actualizar el plan del profesional
                const { error: updateError } = await supabase
                  .from('professionals')
                  .update({ 
                    plan: 'pro', // O el plan correspondiente al precio
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', user.id);

                if (updateError) {
                  console.error('Error actualizando plan:', updateError);
                  return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
                }

                // Obtener email del usuario para enviar confirmación
                const { data: userProfile } = await supabase.auth.admin.getUserById(data.external_reference);
                const userEmail = userProfile?.user?.email;
                const userName = userProfile?.user?.user_metadata?.full_name || 'Usuario';

                if (userEmail) {
                  await sendPlanActivatedEmail({
                    userId: user.user_id,
                    userEmail,
                    userName,
                    planName: 'Pro',
                    planPrice: 9990,
                  });
                }

                console.log(`Plan actualizado exitosamente para usuario ${data.external_reference}`);
              } catch (error) {
                console.error('Error procesando activación de plan:', error);
              }
            }
          }
        } else if (data.status === 'pending') {
          // Pago pendiente - actualizar estado
          const { error: updateError } = await supabase
            .from('professionals')
            .update({
              subscription_status: 'pending_payment',
              updated_at: new Date().toISOString(),
            })
            .eq('mp_customer_id', data.payer.id);

          if (updateError) {
            console.error('Error updating pending payment status:', updateError);
          }
        } else if (data.status === 'rejected' || data.status === 'cancelled') {
          // Pago rechazado - mover a período de gracia
          const { error: updateError } = await supabase
            .from('professionals')
            .update({
              subscription_status: 'grace_period',
              grace_period_start: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('mp_customer_id', data.payer.id);

          if (updateError) {
            console.error('Error updating rejected payment status:', updateError);
          }
        }
        break;

      case 'subscription_authorized_payment':
        // Procesar suscripción autorizada
        if (data.status === 'authorized') {
          const paymentId = data.id;
          const { data: existing } = await supabase
            .from('mp_webhooks')
            .select('id')
            .eq('payment_id', paymentId)
            .limit(1)
            .maybeSingle();
          if (existing) {
            return NextResponse.json({ received: true, idempotent: true });
          }
          const externalRef = data.external_reference;
          const planMatch = externalRef.match(/subscription_(pro|studio)_/);
          
          if (planMatch) {
            const plan = planMatch[1];
            const amount = data.transaction_amount || (plan === 'pro' ? 9990 : 19900);
            
            const { error: updateError } = await supabase
              .from('professionals')
              .update({
                plan,
                subscription_status: 'active',
                mp_subscription_id: data.id,
                last_payment_date: new Date().toISOString(),
                next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                days_since_last_payment: 0,
                updated_at: new Date().toISOString(),
              })
              .eq('mp_customer_id', data.payer_id);

            if (updateError) {
              console.error('Error updating professional subscription:', updateError);
              return NextResponse.json(
                { error: 'Database update failed' },
                { status: 500 }
              );
            }

            // Registrar en historial de pagos
            await supabase
              .from('payment_history')
              .insert({
                professional_id: data.payer_id,
                payment_id: data.id,
                amount: amount,
                status: 'approved',
                plan_type: plan,
              });

            await supabase
              .from('mp_webhooks')
              .insert({ payment_id: paymentId, type: 'subscription_authorized_payment', processed_at: new Date().toISOString() });

            console.log(`Successfully authorized subscription: ${data.payer_id} -> ${plan} (${formatMoney(amount)})`);
          }
        }
        break;

      case 'subscription_cancelled':
        // Procesar cancelación de suscripción
        const { error: cancelError } = await supabase
          .from('professionals')
          .update({
            plan: 'free',
            subscription_status: 'cancelled',
            mp_subscription_id: null,
            cancellation_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('mp_subscription_id', data.id);

        if (cancelError) {
          console.error('Error cancelling subscription:', cancelError);
          return NextResponse.json(
            { error: 'Database update failed' },
            { status: 500 }
          );
        }

        console.log(`Successfully cancelled subscription: ${data.id}`);
        break;

      case 'subscription_suspended':
        // Procesar suspensión de suscripción
        const { error: suspendError } = await supabase
          .from('professionals')
          .update({
            subscription_status: 'suspended',
            suspension_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('mp_subscription_id', data.id);

        if (suspendError) {
          console.error('Error suspending subscription:', suspendError);
          return NextResponse.json(
            { error: 'Database update failed' },
            { status: 500 }
          );
        }

        console.log(`Successfully suspended subscription: ${data.id}`);
        break;

      default:
        console.log(`Unhandled Mercado Pago event type: ${type}`);
    }

    return NextResponse.json({ 
      received: true,
      rateLimitRemaining: rateLimitResult.remaining 
    });
  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 