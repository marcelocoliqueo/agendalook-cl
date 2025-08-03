import { sendEmailWithResend, isResendConfigured } from './resend';

interface EmailNotificationParams {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmailNotification({ to, subject, body }: EmailNotificationParams) {
  return sendEmailWithResend({
    to,
    subject,
    html: body,
  });
}

// Plantilla base HTML
const createBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agendalook</title>
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            font-family: 'Playfair Display', serif;
        }
        .content {
            padding: 40px 30px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 500;
            margin: 20px 0;
        }
        .highlight {
            background-color: #f0f9ff;
            border-left: 4px solid #8b5cf6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 500;
            color: #6b7280;
        }
        .value {
            font-weight: 600;
            color: #111827;
        }
        .emoji {
            font-size: 24px;
            margin-right: 8px;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 12px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Agendalook</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu cita, tu estilo</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© 2025 Agendalook.cl - Tu cita, tu estilo</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
`;

// Plantilla para confirmación al cliente
export function createClientConfirmationEmail(bookingData: {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  businessName: string;
  businessAddress?: string;
}) {
  const formattedDate = new Date(bookingData.date).toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(bookingData.price / 100);

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
            <span style="font-size: 40px;">✓</span>
        </div>
        <h2 style="color: #111827; margin: 0 0 10px 0; font-family: 'Playfair Display', serif;">¡Tu cita está confirmada!</h2>
        <p style="color: #6b7280; margin: 0;">Hola ${bookingData.clientName}, tu reserva ha sido confirmada exitosamente.</p>
    </div>

    <div class="highlight">
        <h3 style="margin: 0 0 15px 0; color: #111827; font-family: 'Playfair Display', serif;">
            <span class="emoji">💅</span>Detalles de tu cita
        </h3>
        <div class="details">
            <div class="detail-row">
                <span class="label">Servicio:</span>
                <span class="value">${bookingData.serviceName}</span>
            </div>
            <div class="detail-row">
                <span class="label">Fecha:</span>
                <span class="value">${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span class="label">Hora:</span>
                <span class="value">${bookingData.time}</span>
            </div>
            <div class="detail-row">
                <span class="label">Precio:</span>
                <span class="value">${formattedPrice}</span>
            </div>
            <div class="detail-row">
                <span class="label">Profesional:</span>
                <span class="value">${bookingData.businessName}</span>
            </div>
            ${bookingData.businessAddress ? `
            <div class="detail-row">
                <span class="label">Dirección:</span>
                <span class="value">${bookingData.businessAddress}</span>
            </div>
            ` : ''}
        </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; margin-bottom: 20px;">
            <span class="emoji">💡</span>Consejos para tu cita:
        </p>
        <ul style="text-align: left; color: #6b7280; padding-left: 20px;">
            <li>Llega 10 minutos antes de tu hora agendada</li>
            <li>Trae contado para el pago del servicio</li>
            <li>Si necesitas cancelar, hazlo con al menos 24 horas de anticipación</li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">
            Si tienes alguna pregunta, no dudes en contactar directamente a ${bookingData.businessName}.
        </p>
    </div>
  `;

  return createBaseTemplate(content);
}

// Plantilla para notificación al profesional
export function createProfessionalNotificationEmail(bookingData: {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  clientPhone: string;
  duration: number;
}) {
  const formattedDate = new Date(bookingData.date).toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(bookingData.price / 100);

  const durationText = bookingData.duration >= 60 
    ? `${Math.floor(bookingData.duration / 60)}h ${bookingData.duration % 60}min`
    : `${bookingData.duration}min`;

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
            <span style="font-size: 40px;">✨</span>
        </div>
        <h2 style="color: #111827; margin: 0 0 10px 0; font-family: 'Playfair Display', serif;">¡Nueva reserva recibida!</h2>
        <p style="color: #6b7280; margin: 0;">Tienes una nueva cita agendada en tu agenda.</p>
    </div>

    <div class="highlight">
        <h3 style="margin: 0 0 15px 0; color: #111827; font-family: 'Playfair Display', serif;">
            <span class="emoji">📅</span>Detalles de la reserva
        </h3>
        <div class="details">
            <div class="detail-row">
                <span class="label">Cliente:</span>
                <span class="value">${bookingData.clientName}</span>
            </div>
            <div class="detail-row">
                <span class="label">Teléfono:</span>
                <span class="value">${bookingData.clientPhone}</span>
            </div>
            <div class="detail-row">
                <span class="label">Servicio:</span>
                <span class="value">${bookingData.serviceName}</span>
            </div>
            <div class="detail-row">
                <span class="label">Duración:</span>
                <span class="value">${durationText}</span>
            </div>
            <div class="detail-row">
                <span class="label">Fecha:</span>
                <span class="value">${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span class="label">Hora:</span>
                <span class="value">${bookingData.time}</span>
            </div>
            <div class="detail-row">
                <span class="label">Precio:</span>
                <span class="value">${formattedPrice}</span>
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; margin-bottom: 20px;">
            <span class="emoji">💡</span>Acciones recomendadas:
        </p>
        <ul style="text-align: left; color: #6b7280; padding-left: 20px;">
            <li>Confirma la reserva desde tu dashboard</li>
            <li>Prepara todo lo necesario para el servicio</li>
            <li>Contacta al cliente si necesitas más información</li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings" class="button">
            Ver en Dashboard
        </a>
    </div>
  `;

  return createBaseTemplate(content);
}

// Función para enviar confirmación al cliente
export async function sendClientConfirmationEmail(
  clientEmail: string,
  bookingData: {
    clientName: string;
    serviceName: string;
    date: string;
    time: string;
    price: number;
    businessName: string;
    businessAddress?: string;
  }
) {
  const subject = '✨ Tu cita está confirmada - Agendalook';
  const body = createClientConfirmationEmail(bookingData);

  return sendEmailNotification({
    to: clientEmail,
    subject,
    body,
  });
}

// Función para enviar notificación al profesional
export async function sendProfessionalNotificationEmail(
  professionalEmail: string,
  bookingData: {
    clientName: string;
    serviceName: string;
    date: string;
    time: string;
    price: number;
    clientPhone: string;
    duration: number;
  }
) {
  const subject = '✨ Tienes una nueva cita agendada - Agendalook';
  const body = createProfessionalNotificationEmail(bookingData);

  return sendEmailNotification({
    to: professionalEmail,
    subject,
    body,
  });
} 