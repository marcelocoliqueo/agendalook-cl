# 🗄️ Configuración de Base de Datos - Agendalook.cl

## 📋 **Problema Actual**
Los errores que estás viendo:
```
Error: Error fetching services: {}
Error: Error fetching bookings: {}
```

Indican que las tablas de la base de datos no están configuradas correctamente o no existen.

## 🔧 **Solución: Configurar Base de Datos**

### **Paso 1: Acceder a Supabase Dashboard**
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **"SQL Editor"** en el menú lateral

### **Paso 2: Ejecutar Script de Configuración SEGURO**
1. Copia todo el contenido del archivo `scripts/setup-database-safe.sql`
2. Pégalo en el SQL Editor de Supabase
3. Haz clic en **"Run"**

**Nota**: Este script es seguro y verifica la existencia antes de crear elementos, evitando errores como "trigger already exists".

### **Paso 3: Verificar Configuración**
Después de ejecutar el script, deberías ver:
- ✅ Tabla `professionals` creada
- ✅ Tabla `services` creada  
- ✅ Tabla `bookings` creada
- ✅ Tabla `availability` creada
- ✅ Tabla `notifications` creada
- ✅ Índices creados
- ✅ Políticas RLS configuradas

**Para verificar el estado actual:**
1. Ejecuta el script `scripts/check-database.sql` en Supabase SQL Editor
2. Revisa los resultados para confirmar que todo está configurado correctamente

## 🎯 **Estructura de Tablas**

### **1. Tabla `professionals`**
```sql
professionals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  business_slug TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  description TEXT,
  address TEXT,
  plan TEXT DEFAULT 'look',
  -- ... otros campos
)
```

### **2. Tabla `services`**
```sql
services (
  id UUID PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- en minutos
  price INTEGER NOT NULL, -- en centavos
  is_active BOOLEAN DEFAULT true
)
```

### **3. Tabla `bookings`**
```sql
bookings (
  id UUID PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id),
  service_id UUID REFERENCES services(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT DEFAULT 'pending'
)
```

### **4. Tabla `availability`**
```sql
availability (
  id UUID PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id),
  day_of_week INTEGER NOT NULL, -- 0=Domingo, 1=Lunes, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true
)
```

## 🔐 **Políticas de Seguridad (RLS)**

El script configura automáticamente:
- **Acceso privado**: Los usuarios solo pueden ver/modificar sus propios datos
- **Acceso público**: Las páginas públicas pueden leer información básica
- **Seguridad**: Protección contra acceso no autorizado

## 🧪 **Probar la Configuración**

### **1. Crear un Usuario de Prueba**
```sql
-- En Supabase SQL Editor
INSERT INTO professionals (
  user_id,
  business_name,
  business_slug,
  email,
  plan
) VALUES (
  'tu-user-id-aqui',
  'Salón de Prueba',
  'salon-prueba',
  'test@example.com',
  'free'
);
```

### **2. Crear un Servicio de Prueba**
```sql
INSERT INTO services (
  professional_id,
  name,
  description,
  duration,
  price
) VALUES (
  'id-del-profesional',
  'Manicura Básica',
  'Manicura con esmalte regular',
  30,
  15000
);
```

### **3. Crear una Reserva de Prueba**
```sql
INSERT INTO bookings (
  professional_id,
  service_id,
  customer_name,
  customer_phone,
  booking_date,
  booking_time
) VALUES (
  'id-del-profesional',
  'id-del-servicio',
  'María González',
  '+56912345678',
  '2024-01-20',
  '10:00:00'
);
```

## 🚀 **Después de la Configuración**

Una vez configurada la base de datos:

1. **Reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Registra un nuevo usuario** en `/register`

3. **Verifica que el dashboard funcione** en `/dashboard`

4. **Prueba los filtros de período** y exportación PDF

## 🔍 **Verificar que Funciona**

### **Indicadores de Éxito:**
- ✅ No hay errores en la consola del navegador
- ✅ El dashboard carga correctamente
- ✅ Los filtros de período funcionan
- ✅ La exportación PDF funciona
- ✅ Las estadísticas se muestran correctamente

### **Si Aún Hay Problemas:**
1. **Verifica las políticas RLS** en Supabase Dashboard
2. **Revisa los logs** en la consola del navegador
3. **Confirma que el usuario está autenticado**
4. **Verifica que existe un perfil profesional**

## 📞 **Soporte**

Si sigues teniendo problemas:
1. Revisa los logs de error en la consola del navegador
2. Verifica la configuración de Supabase
3. Confirma que las variables de entorno están configuradas

¿Necesitas ayuda con algún paso específico? 