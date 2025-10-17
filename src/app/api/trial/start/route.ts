import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * API para iniciar trial de 30 días
 * POST /api/trial/start
 *
 * Body: { professionalId: string, plan: 'look' | 'pro' | 'studio' }
 */

const TRIAL_DAYS = 30;

export async function POST(request: NextRequest) {
  try {
    // Obtener usuario autenticado
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    const { professionalId, plan } = body;

    if (!professionalId) {
      return NextResponse.json(
        { error: 'professionalId es requerido' },
        { status: 400 }
      );
    }

    if (!plan || !['look', 'pro', 'studio'].includes(plan)) {
      return NextResponse.json(
        { error: 'Plan inválido. Debe ser: look, pro o studio' },
        { status: 400 }
      );
    }

    // Verificar que el professional pertenece al usuario
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id, user_id, trial_start_date')
      .eq('id', professionalId)
      .single();

    if (profError || !professional) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      );
    }

    if (professional.user_id !== user.id) {
      return NextResponse.json(
        { error: 'No autorizado para modificar este perfil' },
        { status: 403 }
      );
    }

    // Verificar si ya tiene trial activo
    if (professional.trial_start_date) {
      return NextResponse.json(
        {
          error: 'El trial ya fue iniciado anteriormente',
          trialStartDate: professional.trial_start_date
        },
        { status: 400 }
      );
    }

    // Calcular fechas de trial
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_DAYS);

    // Actualizar professional con datos de trial
    const { data: updatedProfessional, error: updateError } = await supabase
      .from('professionals')
      .update({
        trial_start_date: trialStartDate.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        subscription_status: 'trial',
        selected_plan: plan,
        plan: plan, // Asignar el plan seleccionado
        updated_at: new Date().toISOString()
      })
      .eq('id', professionalId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating professional with trial:', updateError);
      return NextResponse.json(
        { error: 'Error al iniciar trial' },
        { status: 500 }
      );
    }

    // Calcular días restantes
    const daysRemaining = Math.ceil(
      (trialEndDate.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      success: true,
      message: 'Trial iniciado exitosamente',
      trial: {
        startDate: trialStartDate.toISOString(),
        endDate: trialEndDate.toISOString(),
        daysRemaining,
        plan,
        status: 'trial'
      },
      professional: updatedProfessional
    });

  } catch (error) {
    console.error('Error in trial start API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para verificar estado del trial
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener professional del usuario
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('trial_start_date, trial_end_date, subscription_status, plan')
      .eq('user_id', user.id)
      .single();

    if (profError || !professional) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      );
    }

    // Si no tiene trial
    if (!professional.trial_start_date || !professional.trial_end_date) {
      return NextResponse.json({
        hasTrial: false,
        message: 'No hay trial activo'
      });
    }

    // Calcular estado del trial
    const now = new Date();
    const endDate = new Date(professional.trial_end_date);
    const startDate = new Date(professional.trial_start_date);

    const daysRemaining = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isExpired = now > endDate;
    const isActive = !isExpired && professional.subscription_status === 'trial';

    return NextResponse.json({
      hasTrial: true,
      trial: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        daysRemaining: isExpired ? 0 : daysRemaining,
        isActive,
        isExpired,
        status: professional.subscription_status,
        plan: professional.plan
      }
    });

  } catch (error) {
    console.error('Error in trial check API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
