# 🚀 Instrucciones para Deploy en Vercel

## 📋 Pasos para Deploy

### 1. **Preparar el Repositorio**
```bash
# Asegúrate de que todos los cambios estén commitados
git add .
git commit -m "Preparar para deploy en Vercel"
git push origin main
```

### 2. **Conectar con Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Conecta tu repositorio de GitHub
5. Selecciona el repositorio `Agendalook.cl`

### 3. **Configurar Variables de Entorno**

En Vercel, ve a **Settings > Environment Variables** y agrega:

#### **Supabase Configuration**
```
NEXT_PUBLIC_SUPABASE_URL=https://zpmoqzsovmranghqizsb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbW9xenNvdm1yYW5naHFpenNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDUxNjksImV4cCI6MjA2OTY4MTE2OX0.ercd7efldcy23LO9zjDBbwcyMStSQpHtrOeI7bB7ihQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbW9xenNvdm1yYW5naHFpenNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDEwNTE2OSwiZXhwIjoyMDY5NjgxMTY5fQ.VXeQw4mVNcHXUZ28E1m0QqG7vwKZdW1crcHeASPwLRM
```

#### **App Configuration**
```
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

#### **Mercado Pago Configuration** (Opcional para producción)
```
MERCADOPAGO_ACCESS_TOKEN=APP_USR_tu_access_token_aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_tu_public_key_aqui
MP_PRO_PRICE_ID=MLB_tu_product_id_pro_aqui
MP_STUDIO_PRICE_ID=MLB_tu_product_id_studio_aqui
```

#### **Email Configuration** (Opcional)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
RESEND_API_KEY=tu-resend-api-key
```

### 4. **Configurar Dominio Personalizado** (Opcional)
1. En Vercel, ve a **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel

### 5. **Deploy Automático**
- Vercel detectará automáticamente que es un proyecto Next.js
- El deploy se ejecutará automáticamente cuando hagas push a `main`
- Puedes ver el progreso en tiempo real en el dashboard de Vercel

## 🔧 Configuración Post-Deploy

### 1. **Verificar el Deploy**
- Ve a tu URL de Vercel
- Verifica que la aplicación funcione correctamente
- Prueba el login con: `admin@agendalook.cl` / `Admin123!`

### 2. **Configurar Webhooks** (Si usas MercadoPago)
- Ve a tu dashboard de MercadoPago
- Configura el webhook URL: `https://tu-dominio.vercel.app/api/mercadopago/webhook`

### 3. **Configurar Email** (Si usas Resend)
- Ve a tu dashboard de Resend
- Verifica que el dominio esté configurado correctamente

## 🛠️ Troubleshooting

### **Error de Build**
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel

### **Error de Base de Datos**
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de que la base de datos esté accesible desde Vercel

### **Error de MercadoPago**
- Verifica que las credenciales de MercadoPago sean correctas
- Asegúrate de que los Product IDs existan en tu cuenta

## 📊 Monitoreo

### **Vercel Analytics**
- Ve a **Analytics** en tu dashboard de Vercel
- Monitorea el rendimiento y errores

### **Logs**
- Ve a **Functions** en tu dashboard de Vercel
- Revisa los logs de las API routes

## 🔒 Seguridad

### **Variables de Entorno**
- Nunca commits variables de entorno sensibles
- Usa siempre las variables de entorno de Vercel

### **HTTPS**
- Vercel proporciona HTTPS automáticamente
- No necesitas configuración adicional

## 🚀 Optimizaciones

### **Performance**
- Vercel optimiza automáticamente las imágenes
- El CDN global mejora los tiempos de carga
- Las funciones serverless se escalan automáticamente

### **SEO**
- Next.js proporciona SSR automático
- Los metadatos se generan dinámicamente
- El sitemap se genera automáticamente

---

## ✅ Checklist Pre-Deploy

- [ ] Build exitoso en local (`npm run build`)
- [ ] Todas las variables de entorno configuradas
- [ ] Base de datos actualizada con el script de suscripciones
- [ ] Usuario admin creado
- [ ] Dominio personalizado configurado (opcional)
- [ ] Webhooks configurados (si aplica)
- [ ] Email configurado (si aplica)

---

**¡Tu aplicación estará lista para producción! 🎉** 