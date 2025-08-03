# 🚀 Configuración para Producción - Agendalook.cl

## 📋 Checklist de Preparación

### ✅ **1. Configuración de MercadoPago para Producción**

#### **Paso 1: Crear cuenta en MercadoPago**
1. Ve a [MercadoPago Developers](https://mercadopago.cl/developers)
2. Crea una cuenta de desarrollador para Chile
3. Completa la verificación de identidad

#### **Paso 2: Obtener credenciales de producción**
1. En el dashboard de MercadoPago, ve a **Developers → Credentials**
2. Cambia de **Sandbox** a **Production**
3. Copia las credenciales:
   - **Access Token**: `APP_USR-...` (producción)
   - **Public Key**: `APP_USR-...` (producción)

#### **Paso 3: Configurar webhook para producción**
1. Ve a **Developers → Webhooks**
2. Agrega la URL: `https://tu-dominio.vercel.app/api/mercadopago/webhook`
3. Selecciona los eventos:
   - `payment`
   - `subscription_authorized_payment`
   - `subscription_cancelled`

### ✅ **2. Configuración de Vercel**

#### **Paso 1: Conectar repositorio**
1. Ve a [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura el proyecto

#### **Paso 2: Variables de entorno en Vercel**
Configura estas variables en **Settings → Environment Variables**:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zpmoqzsovmranghqizsb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbW9xenNvdm1yYW5naHFpenNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDUxNjksImV4cCI6MjA2OTY4MTE2OX0.ercd7efldcy23LO9zjDBbwcyMStSQpHtrOeI7bB7ihQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbW9xenNvdm1yYW5naHFpenNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDEwNTE2OSwiZXhwIjoyMDY5NjgxMTY5fQ.VXeQw4mVNcHXUZ28E1m0QqG7vwKZdW1crcHeASPwLRM

# MercadoPago Configuration (PRODUCCIÓN)
MERCADOPAGO_ACCESS_TOKEN=APP_USR_tu_access_token_produccion_aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_tu_public_key_produccion_aqui

# App Configuration
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app

# Resend API Key para envío de emails
RESEND_API_KEY=tu-resend-api-key-aqui

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

### ✅ **3. Configuración de Dominio Personalizado**

#### **Paso 1: Comprar dominio**
1. Compra un dominio (ej: `agendalook.cl`)
2. Configura los DNS records

#### **Paso 2: Configurar en Vercel**
1. Ve a **Settings → Domains**
2. Agrega tu dominio personalizado
3. Configura los DNS records según las instrucciones de Vercel

### ✅ **4. Configuración de Base de Datos**

#### **Paso 1: Verificar Supabase**
1. La base de datos ya está configurada
2. Verifica que las tablas estén creadas
3. Ejecuta el script de suscripciones si no lo has hecho

#### **Paso 2: Ejecutar migraciones**
```sql
-- Ejecutar en Supabase SQL Editor
-- Script de actualización de suscripciones
-- (Ya ejecutado anteriormente)
```

### ✅ **5. Configuración de Email**

#### **Paso 1: Configurar Resend**
1. Ve a [Resend](https://resend.com)
2. Crea una cuenta
3. Obtén tu API key
4. Configura el dominio de email

#### **Paso 2: Configurar en Vercel**
1. Agrega `RESEND_API_KEY` en las variables de entorno
2. Verifica que los emails funcionen

### ✅ **6. Configuración de Seguridad**

#### **Paso 1: Verificar headers de seguridad**
- Los headers ya están configurados en `vercel.json`
- CSP, X-Frame-Options, etc.

#### **Paso 2: Configurar rate limiting**
- Ya implementado en las APIs
- Verificar que funcione en producción

### ✅ **7. Testing de Producción**

#### **Paso 1: Probar funcionalidades básicas**
1. Registro de usuarios
2. Login/logout
3. Dashboard básico
4. Configuración de servicios

#### **Paso 2: Probar MercadoPago**
1. Crear preferencias de pago
2. Procesar pagos de prueba
3. Verificar webhooks
4. Probar suscripciones

#### **Paso 3: Probar emails**
1. Verificar envío de emails
2. Probar notificaciones
3. Verificar templates

## 🚀 **Comandos para Deploy**

### **1. Preparar para deploy**
```bash
# Verificar que todo compile
npm run build

# Verificar linting
npm run lint

# Verificar tipos
npm run type-check
```

### **2. Deploy a Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deploy
vercel --prod
```

### **3. Configurar variables de entorno**
```bash
# En el dashboard de Vercel
# Settings → Environment Variables
# Agregar todas las variables listadas arriba
```

## 🔧 **Verificación Post-Deploy**

### **1. Verificar endpoints**
```bash
# Test básico
curl https://tu-dominio.vercel.app/api/mercadopago/simple-test

# Test de MercadoPago
curl https://tu-dominio.vercel.app/api/mercadopago/test
```

### **2. Verificar páginas**
- ✅ Homepage: `https://tu-dominio.vercel.app`
- ✅ Registro: `https://tu-dominio.vercel.app/register`
- ✅ Login: `https://tu-dominio.vercel.app/login`
- ✅ Dashboard: `https://tu-dominio.vercel.app/dashboard`
- ✅ Configuración MP: `https://tu-dominio.vercel.app/mercadopago-setup`

### **3. Verificar funcionalidades**
- ✅ Registro de usuarios
- ✅ Login/logout
- ✅ Dashboard de seguridad
- ✅ Gestión de suscripciones
- ✅ Integración con MercadoPago
- ✅ Envío de emails

## 📊 **Monitoreo de Producción**

### **1. Métricas a monitorear**
- Uptime del sitio
- Tiempo de respuesta de APIs
- Errores en logs
- Pagos procesados
- Usuarios registrados

### **2. Herramientas de monitoreo**
- Vercel Analytics
- Supabase Dashboard
- MercadoPago Dashboard
- Resend Dashboard

## 🆘 **Soporte y Troubleshooting**

### **Problemas comunes**
1. **Error 500**: Verificar variables de entorno
2. **MercadoPago no funciona**: Verificar credenciales de producción
3. **Emails no llegan**: Verificar configuración de Resend
4. **Base de datos**: Verificar conexión a Supabase

### **Contactos de soporte**
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **MercadoPago**: [mercadopago.cl/developers](https://mercadopago.cl/developers)
- **Resend**: [resend.com/support](https://resend.com/support)

## 🎉 **¡Listo para Producción!**

Una vez completados todos los pasos, tu aplicación estará completamente funcional en producción con:

- ✅ **Pagos reales** con MercadoPago
- ✅ **Gestión de suscripciones** automática
- ✅ **Emails automáticos** con Resend
- ✅ **Base de datos** en Supabase
- ✅ **Deploy automático** con Vercel
- ✅ **Dominio personalizado** configurado
- ✅ **Seguridad** implementada
- ✅ **Monitoreo** configurado

**¿Necesitas ayuda con algún paso específico?** 