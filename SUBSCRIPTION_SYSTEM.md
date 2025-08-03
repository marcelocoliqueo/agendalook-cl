# Sistema de Suscripciones Integrado - Agendalook.cl

## 📋 Resumen

Se ha implementado un sistema completo de gestión de suscripciones integrado con el dashboard de seguridad existente. El sistema incluye:

- **Estados de suscripción avanzados** (active, pending_payment, grace_period, suspended, cancelled, past_due)
- **Dashboard integrado** con 3 secciones: Seguridad, Suscripciones y Métricas Generales
- **Automatización completa** de la gestión de suscripciones
- **Notificaciones automáticas** por email
- **Métricas de negocio** en tiempo real

## 🗄️ Base de Datos

### Nuevos Campos en `professionals`

```sql
-- Estados de suscripción
subscription_status TEXT DEFAULT 'active' 
  CHECK (subscription_status IN ('active', 'pending_payment', 'grace_period', 'suspended', 'cancelled', 'past_due'))

-- Fechas de pago
last_payment_date TIMESTAMP WITH TIME ZONE
next_payment_date TIMESTAMP WITH TIME ZONE
grace_period_start TIMESTAMP WITH TIME ZONE
suspension_date TIMESTAMP WITH TIME ZONE
cancellation_date TIMESTAMP WITH TIME ZONE

-- Métricas
total_payments_received INTEGER DEFAULT 0
total_amount_paid INTEGER DEFAULT 0
subscription_start_date TIMESTAMP WITH TIME ZONE
days_since_last_payment INTEGER DEFAULT 0

-- Notificaciones
notification_preferences JSONB DEFAULT '{"payment_reminders": true, "grace_period_alerts": true, "suspension_notices": true}'::jsonb
last_notification_sent TIMESTAMP WITH TIME ZONE
```

### Nuevas Tablas

#### `payment_history`
```sql
CREATE TABLE payment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- en centavos
  currency TEXT DEFAULT 'CLP',
  status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'rejected', 'cancelled')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('pro', 'studio')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `notification_log`
```sql
CREATE TABLE notification_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('payment_reminder', 'grace_period_alert', 'suspension_notice', 'cancellation_notice')),
  email_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content TEXT,
  metadata JSONB
);
```

## 🔄 Flujo de Estados

```
[Registro] → [active] → [pending_payment] → [grace_period] → [suspended] → [cancelled]
     ↑                                                                    ↓
     └────────────────── [Reactivación] ←─────────────────────────────────┘
```

### Estados y Transiciones

1. **active**: Usuario con suscripción activa y pagos al día
2. **pending_payment**: Pago pendiente (3 días de tolerancia)
3. **grace_period**: Período de gracia (7 días)
4. **suspended**: Suscripción suspendida (14 días)
5. **cancelled**: Suscripción cancelada (30 días)
6. **past_due**: Pago vencido

## 🎛️ Dashboard Integrado

### Sección: 🔒 Seguridad
- Puntuación de seguridad (0-100)
- Eventos de seguridad (login, alertas, etc.)
- Vulnerabilidades de código y dependencias
- IPs sospechosas

### Sección: 💳 Suscripciones
- **Resumen**: Usuarios totales, ingresos mensuales, tasa de cancelación
- **Estados**: Distribución por estado de suscripción
- **Planes**: Distribución por tipo de plan
- **Atención**: Usuarios que necesitan intervención

### Sección: 📊 Métricas Generales
- **KPIs**: Ingresos totales, promedio por usuario, tasas de conversión y retención
- **Resumen del negocio**: Usuarios e ingresos desglosados

## 🤖 Automatización

### Script: `scripts/subscription-manager.js`

**Funcionalidades:**
- Procesa usuarios en diferentes estados automáticamente
- Envía notificaciones por email
- Genera reportes diarios
- Ejecuta cada 24 horas

**Comandos:**
```bash
# Ejecutar una vez
node scripts/subscription-manager.js

# Ejecutar en modo continuo
node scripts/subscription-manager.js --continuous
```

**Configuración:**
```javascript
const CONFIG = {
  GRACE_PERIOD_DAYS: 7,      // Días en período de gracia
  SUSPENSION_DAYS: 14,        // Días antes de suspender
  CANCELLATION_DAYS: 30,      // Días antes de cancelar
  CHECK_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
};
```

## 📧 Sistema de Notificaciones

### Tipos de Notificaciones

1. **payment_reminder**: Recordatorio de pago próximo
2. **grace_period_alert**: Alerta de período de gracia
3. **suspension_notice**: Notificación de suspensión
4. **cancellation_notice**: Notificación de cancelación

### Integración con Resend

```javascript
// Ejemplo de integración
async function sendNotification(professional, type, message) {
  // Integrar con Resend para envío de emails
  await resend.emails.send({
    from: 'noreply@agendalook.cl',
    to: professional.email,
    subject: `Agendalook - ${type}`,
    html: message
  });
}
```

## 🔧 Webhooks Mejorados

### MercadoPago Webhook (`/api/mercadopago/webhook`)

**Nuevas funcionalidades:**
- Manejo de estados detallados de suscripción
- Registro en `payment_history`
- Actualización automática de fechas
- Logging de seguridad mejorado

**Eventos procesados:**
- `payment`: Pagos aprobados, pendientes, rechazados
- `subscription_authorized_payment`: Suscripciones autorizadas
- `subscription_cancelled`: Cancelaciones
- `subscription_suspended`: Suspensiones

## 📊 Métricas y KPIs

### Métricas de Suscripción
- **Total de usuarios**: Todos los registrados
- **Suscripciones activas**: Usuarios con pagos al día
- **Tasa de cancelación**: Porcentaje de usuarios cancelados
- **Ingresos mensuales**: Ingresos recurrentes estimados

### Métricas de Negocio
- **Ingreso promedio por usuario**: ARPU
- **Tasa de conversión**: Usuarios que pagan vs total
- **Tasa de retención**: Usuarios que se mantienen
- **Crecimiento**: Nuevos usuarios por mes

## 🚀 Instalación y Configuración

### 1. Actualizar Base de Datos

```bash
# Ejecutar en Supabase SQL Editor
# Copiar y ejecutar el contenido de update-subscription-system.sql
```

### 2. Verificar Variables de Entorno

```env
# .env
NEXT_PUBLIC_SUPABASE_URL=tu_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
RESEND_API_KEY=tu_resend_api_key
MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_token
```

### 3. Crear Usuario Administrador

```bash
node scripts/create-admin.js
```

### 4. Configurar Automatización

```bash
# Para desarrollo (ejecutar manualmente)
node scripts/subscription-manager.js

# Para producción (modo continuo)
node scripts/subscription-manager.js --continuous

# O usar cron job
0 2 * * * /usr/bin/node /path/to/scripts/subscription-manager.js
```

## 🔍 Monitoreo y Alertas

### Logs
- `subscription-manager.log`: Logs del script de automatización
- `subscription-report.txt`: Reporte diario de suscripciones

### Alertas Automáticas
- Usuarios en período de gracia (7 días)
- Usuarios suspendidos (14 días)
- Usuarios cancelados (30 días)
- Pagos fallidos

## 📈 Beneficios del Sistema

### Para el Negocio
- **Control automático**: No requiere intervención manual
- **Reducción de pérdidas**: Suspensión automática de usuarios morosos
- **Métricas en tiempo real**: Dashboard integrado con KPIs
- **Escalabilidad**: Maneja miles de usuarios automáticamente

### Para los Usuarios
- **Transparencia**: Estados claros de suscripción
- **Notificaciones oportunas**: Alertas antes de suspensiones
- **Reactivación fácil**: Proceso simplificado de reactivación
- **Período de gracia**: 7 días de tolerancia

## 🔧 Mantenimiento

### Tareas Diarias
- Revisar dashboard de administración
- Verificar logs de automatización
- Revisar reportes de suscripciones

### Tareas Semanales
- Analizar métricas de retención
- Revisar usuarios que necesitan atención
- Optimizar configuración de automatización

### Tareas Mensuales
- Revisar tasa de cancelación
- Analizar ingresos y crecimiento
- Actualizar estrategias de retención

## 🛠️ Troubleshooting

### Problemas Comunes

1. **Webhooks no procesados**
   - Verificar firma de MercadoPago
   - Revisar logs de seguridad
   - Verificar rate limiting

2. **Notificaciones no enviadas**
   - Verificar configuración de Resend
   - Revisar logs de notificaciones
   - Verificar preferencias de usuario

3. **Estados incorrectos**
   - Ejecutar script de automatización manualmente
   - Verificar triggers de base de datos
   - Revisar logs de actualización

### Comandos de Diagnóstico

```bash
# Verificar estado de suscripciones
node scripts/subscription-manager.js

# Ver logs de automatización
tail -f subscription-manager.log

# Ver reporte actual
cat subscription-report.txt
```

## 📚 Referencias

- [Documentación de MercadoPago Webhooks](https://www.mercadopago.cl/developers/es/docs/checkout-api/additional-content/notifications)
- [Documentación de Resend](https://resend.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)

---

**Estado**: ✅ Implementado y Funcional  
**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024 