# 🔧 Configuración del Usuario Administrador

Este documento te guía para crear un usuario administrador que pueda acceder al dashboard de seguridad.

## 📋 Prerrequisitos

1. **Proyecto configurado** con Supabase
2. **Variables de entorno** configuradas en `.env`
3. **Base de datos** Supabase funcionando

## 🚀 Pasos para Crear el Usuario Administrador

### Paso 1: Actualizar el Esquema de la Base de Datos

1. **Ve a tu proyecto Supabase**
2. **Abre el SQL Editor**
3. **Ejecuta el siguiente script:**

```sql
-- Actualizar esquema para agregar campo role
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Crear políticas de seguridad para administradores
DROP POLICY IF EXISTS "Admins can view all data" ON professionals;
CREATE POLICY "Admins can view all data" ON professionals
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM professionals WHERE role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all data" ON professionals;
CREATE POLICY "Admins can update all data" ON professionals
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM professionals WHERE role = 'admin'
    )
  );

-- Política para acceso al dashboard de seguridad
DROP POLICY IF EXISTS "Admins can access security dashboard" ON professionals;
CREATE POLICY "Admins can access security dashboard" ON professionals
  FOR SELECT USING (
    role = 'admin' AND auth.uid() = user_id
  );
```

### Paso 2: Ejecutar el Script de Creación

1. **Asegúrate de tener las dependencias instaladas:**
   ```bash
   npm install
   ```

2. **Ejecuta el script de creación del administrador:**
   ```bash
   node scripts/create-admin.js
   ```

3. **Verifica que el script se ejecutó correctamente.** Deberías ver algo como:
   ```
   🔧 Creando usuario administrador...
   📧 Email: admin@agendalook.cl
   🔑 Contraseña: Admin123!
   
   1️⃣ Creando usuario en Supabase Auth...
   ✅ Usuario creado exitosamente en Auth
   2️⃣ Creando registro en la tabla professionals...
   ✅ Profesional creado exitosamente
   3️⃣ Verificando configuración...
   
   🎉 ¡Usuario administrador creado exitosamente!
   
   📋 Detalles del usuario:
      Email: admin@agendalook.cl
      Contraseña: Admin123!
      Rol: admin
      ID: [UUID del usuario]
   ```

### Paso 3: Acceder al Dashboard de Seguridad

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Ve al login:**
   ```
   http://localhost:3000/login
   ```

3. **Inicia sesión con las credenciales:**
   - **Email:** `admin@agendalook.cl`
   - **Contraseña:** `Admin123!`

4. **Accede al dashboard de seguridad:**
   ```
   http://localhost:3000/dashboard/security
   ```

## 🔐 Credenciales del Administrador

### Datos de Acceso
- **Email:** `admin@agendalook.cl`
- **Contraseña:** `Admin123!`
- **Rol:** `admin`

### Funcionalidades Disponibles
- ✅ **Dashboard de seguridad** completo
- ✅ **Estadísticas de eventos** en tiempo real
- ✅ **Alertas de seguridad** activas
- ✅ **Auditoría de código** automática
- ✅ **Monitoreo de dependencias**
- ✅ **IPs sospechosas** identificadas

## 🛡️ Seguridad

### Cambiar Contraseña
**IMPORTANTE:** Cambia la contraseña después del primer login:

1. **Ve a Configuración** en el dashboard
2. **Cambia la contraseña** por una más segura
3. **Usa una contraseña fuerte** (mínimo 8 caracteres, mayúsculas, minúsculas, números, símbolos)

### Configuración de Producción
Para producción, considera:

1. **Usar variables de entorno** para las credenciales
2. **Implementar 2FA** para el administrador
3. **Configurar alertas** por email/Slack
4. **Auditoría de accesos** regular

## 🔍 Verificar la Configuración

### Verificar en Supabase
1. **Ve a Authentication > Users** en Supabase
2. **Busca el usuario** `admin@agendalook.cl`
3. **Verifica que esté confirmado**

### Verificar en la Base de Datos
1. **Ve a Table Editor > professionals**
2. **Busca el registro** con email `admin@agendalook.cl`
3. **Verifica que role = 'admin'**

### Verificar el Dashboard
1. **Accede al dashboard de seguridad**
2. **Verifica que se muestren las estadísticas**
3. **Comprueba que no haya errores en la consola**

## 🚨 Solución de Problemas

### Error: "No tienes acceso al dashboard"
- **Verifica que el usuario tenga role = 'admin'**
- **Asegúrate de estar logueado**
- **Revisa las políticas de seguridad en Supabase**

### Error: "Error al cargar datos de seguridad"
- **Verifica la conexión a Supabase**
- **Revisa las variables de entorno**
- **Comprueba los logs del servidor**

### Error: "Usuario no encontrado"
- **Ejecuta nuevamente el script de creación**
- **Verifica que el email esté correcto**
- **Comprueba que el usuario esté confirmado en Supabase**

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** del script de creación
2. **Verifica la configuración** de Supabase
3. **Comprueba las variables** de entorno
4. **Revisa la documentación** de seguridad

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0 