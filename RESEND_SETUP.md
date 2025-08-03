# 📧 Configuración de Resend para Emails

## 🚀 Pasos para Configurar Resend

### 1. Crear cuenta en Resend
1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Obtener API Key
1. En el dashboard de Resend, ve a "API Keys"
2. Crea una nueva API key
3. Copia la clave (empieza con `re_`)

### 3. Configurar Dominio (Opcional)
Para usar `noreply@agendalook.cl`:
1. Ve a "Domains" en Resend
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones

### 4. Configurar Variables de Entorno
Agrega estas variables a tu archivo `.env.local`:

```env
# Resend API Key
RESEND_API_KEY=re_tu_api_key_aqui

# URL de la aplicación (para links en emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Verificar Configuración
1. Reinicia el servidor de desarrollo
2. Crea una reserva de prueba
3. Verifica que los emails se envíen correctamente

## 📧 Tipos de Emails

### Email al Cliente
- **Asunto**: "✨ Tu cita está confirmada - Agendalook"
- **Contenido**: Confirmación con detalles de la cita
- **Enviado**: Cuando el cliente proporciona email

### Email al Profesional
- **Asunto**: "✨ Tienes una nueva cita agendada - Agendalook"
- **Contenido**: Notificación con detalles del cliente y servicio
- **Enviado**: Siempre que se crea una reserva

## 🎨 Características de los Emails

### Diseño
- **Plantillas HTML** responsivas
- **Estilo femenino** con gradientes lavanda/coral
- **Tipografías** Poppins y Playfair Display
- **Iconos y emojis** para mejor UX

### Contenido
- **Detalles completos** de la reserva
- **Información del negocio** (nombre, dirección)
- **Consejos útiles** para cliente y profesional
- **Links al dashboard** para el profesional

## 🔧 Configuración Técnica

### Variables Requeridas
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Funciones Disponibles
```typescript
// Enviar confirmación al cliente
sendClientConfirmationEmail(clientEmail, bookingData)

// Enviar notificación al profesional
sendProfessionalNotificationEmail(professionalEmail, bookingData)
```

## 🚨 Troubleshooting

### Error: "RESEND_API_KEY no está configurada"
- Verifica que la variable esté en `.env.local`
- Reinicia el servidor después de agregar la variable

### Error: "Invalid API key"
- Verifica que la API key sea correcta
- Asegúrate de que la cuenta esté verificada

### Emails no se envían
- Revisa la consola del servidor para errores
- Verifica que el dominio esté configurado (si usas dominio personalizado)

## 📊 Límites de Resend

### Plan Gratuito
- **3,000 emails/mes**
- **Dominio personalizado** incluido
- **Soporte por email**

### Planes Pagos
- **100,000 emails/mes**: $20/mes
- **1,000,000 emails/mes**: $80/mes

## 🔒 Seguridad

### Buenas Prácticas
- **Nunca** compartas tu API key
- **Usa variables de entorno** para las claves
- **Verifica** los dominios antes de usar en producción
- **Monitorea** el uso de emails

### Configuración de Producción
```env
RESEND_API_KEY=re_production_key
NEXT_PUBLIC_APP_URL=https://agendalook.cl
``` 