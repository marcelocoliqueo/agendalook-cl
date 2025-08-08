import { NextRequest, NextResponse } from 'next/server';
import { ResendService } from '@/lib/resend-service';

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationUrl, businessName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Enviar email de bienvenida
    await ResendService.sendWelcomeEmail(email, confirmationUrl, businessName);

    return NextResponse.json({
      success: true,
      message: 'Email de bienvenida enviado exitosamente'
    });

  } catch (error) {
    console.error('Error enviando email de bienvenida:', error);
    return NextResponse.json(
      { error: 'Error enviando email de bienvenida' },
      { status: 500 }
    );
  }
} 