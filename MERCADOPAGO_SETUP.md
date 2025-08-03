# 🚀 Configuración de Mercado Pago para Agendalook.cl

## 📋 Pasos para Configurar Mercado Pago

### **1. Crear cuenta en Mercado Pago**
1. Ve a [mercadopago.cl](https://mercadopago.cl)
2. Crea una cuenta de desarrollador
3. Completa la verificación de identidad
4. Activa tu cuenta para recibir pagos

### **2. Obtener las credenciales de API**

#### **Dashboard de Mercado Pago:**
1. Ve a **Developers** → **Credentials**
2. Copia las siguientes credenciales:

```bash
# Access Token (para el backend)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...

# Public Key (para el frontend, si es necesario)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
```

### **3. Crear productos en Mercado Pago**

#### **Plan Pro ($9.990 CLP/mes):**
1. Ve a **Products** → **Create product**
2. **Nombre**: `Plan Pro`
3. **Precio**: `9990` CLP
4. **Categoría**: `Services`
5. **Copia el Product ID**: `MLB...`

#### **Plan Studio ($19.990 CLP/mes):**
1. Ve a **Products** → **Create product**
2. **Nombre**: `Plan Studio`
3. **Precio**: `19990` CLP
4. **Categoría**: `Services`
5. **Copia el Product ID**: `MLB...`

### **4. Configurar Webhook**

#### **En Mercado Pago Dashboard:**
1. Ve a **Developers** → **Webhooks**
2. Click **Add webhook**
3. URL: `https://tu-dominio.com/api/mercadopago/webhook`
4. Events a escuchar:
   - `payment`
   - `subscription_authorized_payment`
   - `subscription_cancelled`
5. Guarda la configuración

### **5. Actualizar variables de entorno**

#### **Agregar a `.env.local`:**
```bash
# Mercado Pago Configuration
MERCADOPAGO_ACCESS_TOKEN=APP_USR_tu_access_token_aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_tu_public_key_aqui

# Mercado Pago Product IDs
MP_PRO_PRICE_ID=MLB_tu_product_id_pro_aqui
MP_STUDIO_PRICE_ID=MLB_tu_product_id_studio_aqui
```

### **6. Actualizar base de datos**

#### **Ejecutar en Supabase SQL Editor:**
```sql
-- Agregar columnas de Mercado Pago
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professionals' AND column_name = 'mp_customer_id'
    ) THEN
        ALTER TABLE professionals ADD COLUMN mp_customer_id TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professionals' AND column_name = 'mp_subscription_id'
    ) THEN
        ALTER TABLE professionals ADD COLUMN mp_subscription_id TEXT;
    END IF;
END $$;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_professionals_mp_customer_id ON professionals(mp_customer_id);
CREATE INDEX IF NOT EXISTS idx_professionals_mp_subscription_id ON professionals(mp_subscription_id);
```

## 🧪 Testing

### **Modo de Prueba:**
- Usa las tarjetas de prueba de Mercado Pago
- **Visa**: `4509 9535 6623 3704`
- **Mastercard**: `5031 4332 1540 6351`
- **Fecha**: Cualquier fecha futura
- **CVC**: Cualquier 3 dígitos

### **Flujo de Prueba:**
1. Registra un profesional
2. Ve a `/dashboard/settings`
3. Click en "Suscribirse" en Plan Pro
4. Completa el pago con tarjeta de prueba
5. Verifica que el plan se actualice automáticamente

## 💰 Configuración de Pagos

### **Métodos de Pago Soportados:**
- ✅ **Tarjetas de crédito/débito**
- ✅ **Transferencias bancarias** (Chile)
- ✅ **MACH** (Chile)
- ✅ **Multicaja** (Chile)
- ✅ **WebPay** (Chile)
- ✅ **Cuenta RUT** (Chile)

### **Comisiones:**
- **Mercado Pago**: 2.9% + $300 CLP por transacción
- **Tu ganancia**: ~97% del precio de venta

## 🔧 Configuración de Producción

### **1. Cambiar a modo Live:**
```bash
# Cambiar de test a live credentials
MERCADOPAGO_ACCESS_TOKEN=APP_USR_live_token...
```

### **2. Configurar dominio:**
```bash
# En Mercado Pago Dashboard → Settings → Webhooks
# Agregar tu dominio: https://agendalook.cl
```

### **3. Configurar webhook de producción:**
```
URL: https://agendalook.cl/api/mercadopago/webhook
```

## 📊 Monitoreo

### **Dashboard de Mercado Pago:**
- **Pagos**: Ver todos los pagos recibidos
- **Suscripciones**: Gestionar suscripciones activas
- **Clientes**: Información de clientes
- **Reportes**: Análisis de ingresos

### **Webhooks:**
- **Logs**: Ver eventos procesados
- **Reintentos**: Configurar reintentos automáticos
- **Alertas**: Notificaciones de errores

## 🚨 Troubleshooting

### **Error: "Invalid access token"**
- Verificar `MERCADOPAGO_ACCESS_TOKEN`
- Asegurar que el token sea válido

### **Error: "Product not found"**
- Verificar `MP_PRO_PRICE_ID` y `MP_STUDIO_PRICE_ID`
- Asegurar que los productos estén creados en Mercado Pago

### **Error: "Customer not found"**
- Verificar que el cliente se cree correctamente
- Revisar logs de la API

## 🎯 Ventajas de Mercado Pago para Chile

### **✅ Ventajas:**
- ✅ **Soporte completo** para Chile
- ✅ **Múltiples métodos** de pago locales
- ✅ **API bien documentada** en español
- ✅ **Soporte técnico** local
- ✅ **Comisiones competitivas**
- ✅ **Integración fácil** con Next.js

### **✅ Métodos de pago locales:**
- ✅ **WebPay** (BancoEstado)
- ✅ **MACH** (Banco de Chile)
- ✅ **Multicaja** (Redbanc)
- ✅ **Cuenta RUT** (BancoEstado)
- ✅ **Transferencias** bancarias

## 🎯 Próximos Pasos

### **Funcionalidades Futuras:**
- ✅ **Facturación automática**
- ✅ **Cupones y descuentos**
- ✅ **Pagos anuales** (con descuento)
- ✅ **Facturas PDF**
- ✅ **Reportes de ingresos**
- ✅ **Integración con contabilidad**

---

**¡Con Mercado Pago tendrás un sistema completo de pagos funcionando en Chile!** 🎉 