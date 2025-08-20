# 🌐 Configuración del Dominio de Producción - Vercel DNS

## 🎯 Objetivo
Configurar `agendalook.cl` en Resend para usar `noreply@agendalook.cl` en producción.

## 📋 Pasos para Configurar el Dominio

### 1. ✅ Dominio ya configurado en Resend
- El dominio `agendalook.cl` ya está agregado en Resend
- Estado: Verificado ✅
- Región: South America (Brazil)

### 2. 🔧 Configurar Registros DNS en Vercel

#### Acceder a Vercel Dashboard
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Busca tu proyecto o dominio `agendalook.cl`
4. Ve a la sección "Domains" o "DNS"
5. Haz clic en "Manage DNS"

#### Agregar Registros DNS

**Registro MX (para envío de emails):**
```
Nombre: send
Tipo: MX
Valor: feedback-smtp.sa-east-1.amazonses.com
TTL: 60
Prioridad: 10
```

**Registro SPF (autorización de envío):**
```
Nombre: send
Tipo: TXT
Valor: v=spf1 include:amazonses.com ~all
TTL: 60
```

**Registro DKIM (firma digital):**
```
Nombre: resend._domainkey
Tipo: TXT
Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
TTL: Auto
```

**Registro DMARC (política de autenticación):**
```
Nombre: _dmarc
Tipo: TXT
Valor: v=DMARC1; p=none;
TTL: Auto
```

### 3. ⏰ Tiempo de Propagación
- **Vercel DNS**: 5-15 minutos
- **Verificación global**: 1-2 horas

### 4. ✅ Verificar Configuración
Ejecuta el script de verificación:
```bash
node scripts/check-domain-config.js
```

## 🔧 Configuración del Código

### Variables de Entorno
```env
# Desarrollo
NODE_ENV=development
RESEND_API_KEY=re_Mkta7bk5_J3rDZPY9guBQ1aJXmYee9y8h

# Producción
NODE_ENV=production
RESEND_API_KEY=re_production_key
```

### Comportamiento del Código
- **Desarrollo**: Usa `onboarding@resend.dev`
- **Producción**: Usa `noreply@agendalook.cl`

## 📊 Beneficios de la Configuración

### Antes (Desarrollo)
- ✅ Funciona con emails de prueba
- ✅ Limitado a emails verificados
- ✅ Usa dominio de Resend

### Después (Producción)
- ✅ Envía a cualquier email
- ✅ Dominio personalizado
- ✅ Mejor entregabilidad
- ✅ Branding profesional

## 🧪 Páginas de Prueba

### Durante Configuración
1. **Test Email**: `http://localhost:3000/test-email`
2. **Preview**: `http://localhost:3000/email-preview`
3. **Test Registration**: `http://localhost:3000/test-registration`

### Después de Configuración
1. **Registro Real**: `http://localhost:3000/register`
2. **Dashboard**: `http://localhost:3000/dashboard`

## 📈 Métricas a Monitorear

### En Resend Dashboard
- **Tasa de entrega**: >95%
- **Tasa de apertura**: >20%
- **Tasa de bounce**: <2%
- **Tasa de spam**: <0.1%

### Configuraciones Recomendadas
- **Webhooks**: Para eventos de entrega
- **Supresión**: De emails bouncados
- **Monitoreo**: De métricas en tiempo real

## 🚨 Troubleshooting

### Problema: Dominio no verifica
**Solución:**
1. Verificar registros DNS
2. Esperar propagación (24-48h)
3. Revisar sintaxis de registros

### Problema: Emails no llegan
**Solución:**
1. Verificar configuración SPF/DKIM
2. Revisar logs de Resend
3. Monitorear métricas de entrega

### Problema: Emails van a spam
**Solución:**
1. Mejorar reputación del dominio
2. Revisar contenido por palabras spam
3. Configurar DMARC correctamente

## 📚 Recursos Adicionales

### Documentación
- [Resend Domain Setup](https://resend.com/docs/domains)
- [DNS Configuration Guide](https://resend.com/docs/dns)
- [Email Deliverability](https://resend.com/docs/deliverability)

### Herramientas
- [MXToolbox](https://mxtoolbox.com) - Verificar registros DNS
- [Mail Tester](https://mail-tester.com) - Test de entregabilidad
- [Sender Score](https://senderscore.org) - Reputación del dominio

---

**Nota**: La configuración del dominio es esencial para producción. Una vez configurado, todos los emails usarán el dominio personalizado y tendrán mejor entregabilidad. 