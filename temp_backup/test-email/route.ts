import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la API key esté configurada
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY no está configurada' },
        { status: 500 }
      );
    }

    console.log('🔧 API Key encontrada:', apiKey.substring(0, 10) + '...');
    console.log('📧 Enviando email a:', email);
    console.log('📝 Tipo de email:', type);

    const resend = new Resend(apiKey);

    // Email simple de prueba
    const { data, error } = await resend.emails.send({
      from: 'Agendalook <onboarding@resend.dev>',
      to: [email],
      subject: '🧪 Test de Email Elegante - Agendalook',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email - Agendalook</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .tagline { font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; text-align: center; }
            .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
            .message { font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 30px; }
            .footer { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Agendalook</div>
              <div class="tagline">Tu cita, tu estilo</div>
            </div>
            
            <div class="content">
              <div class="title">🧪 ¡Email de Prueba!</div>
              <div class="message">
                Este es un email de prueba para verificar que Resend está funcionando correctamente con Agendalook.
                <br><br>
                <strong>Tipo de email:</strong> ${type}
                <br>
                <strong>Email de destino:</strong> ${email}
              </div>
            </div>
            
            <div class="footer">
              <p>✅ Email enviado exitosamente con Resend</p>
              <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        🧪 ¡Email de Prueba!
        
        Este es un email de prueba para verificar que Resend está funcionando correctamente con Agendalook.
        
        Tipo de email: ${type}
        Email de destino: ${email}
        
        ✅ Email enviado exitosamente con Resend
        
        © 2025 Agendalook.cl - Tu cita, tu estilo
      `
    });

    if (error) {
      console.error('❌ Error de Resend:', error);
      return NextResponse.json(
        { error: 'Error de Resend', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Email enviado exitosamente:', data);

    return NextResponse.json(
      { success: true, message: 'Email de prueba enviado exitosamente', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error general:', error);
    return NextResponse.json(
      { error: 'Error enviando email', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
} 