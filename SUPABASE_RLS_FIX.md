# 🔧 Fix RLS Policies - Supabase Dashboard

## Problema
- Error 500 al acceder a la tabla `professionals`
- "infinite recursion detected in policy for relation professionals"
- El usuario no puede acceder al dashboard

## Solución Manual en Supabase Dashboard

### Paso 1: Acceder al Dashboard de Supabase
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: `zpmoqzsovmranghqizsb`
3. Ve a **"Table Editor"** en el menú lateral

### Paso 2: Deshabilitar RLS
1. Busca la tabla **`professionals`**
2. Haz clic en la tabla
3. Ve a la pestaña **"RLS"** (Row Level Security)
4. **Desactiva** el toggle de "Enable RLS"
5. Haz clic en **"Save"**

### Paso 3: Verificar
1. Ve a: https://agendalook-cl-prod.vercel.app/login
2. Inicia sesión con:
   - Email: `admin@agendalook.cl`
   - Password: `Admin123!`
3. Navega a: `/dashboard/security`

## Alternativa: Crear Políticas Simples

Si prefieres mantener RLS habilitado, crea estas políticas:

### Política 1: SELECT para todos los usuarios autenticados
```sql
CREATE POLICY "Allow authenticated users to view professionals" ON professionals
FOR SELECT USING (auth.role() = 'authenticated');
```

### Política 2: INSERT para usuarios autenticados
```sql
CREATE POLICY "Allow authenticated users to insert professionals" ON professionals
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Política 3: UPDATE para usuarios autenticados
```sql
CREATE POLICY "Allow authenticated users to update professionals" ON professionals
FOR UPDATE USING (auth.role() = 'authenticated');
```

## Nota
Esta es una solución temporal. En producción, deberías configurar políticas más específicas basadas en `user_id`. 