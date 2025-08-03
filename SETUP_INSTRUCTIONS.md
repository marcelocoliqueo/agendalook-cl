# 🚀 Configuración Completa de Agendalook.cl

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota tu **URL** y **Anon Key**

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

### 3. Ejecutar el Esquema SQL

1. Ve al **SQL Editor** en tu dashboard de Supabase
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Ejecuta el script completo

### 4. Configurar Autenticación

1. Ve a **Authentication > Settings** en Supabase
2. En **Site URL**, agrega: `http://localhost:3000`
3. En **Redirect URLs**, agrega:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/login`
   - `http://localhost:3000/register`

### 5. Configurar Políticas de Seguridad

Las políticas RLS ya están incluidas en el esquema SQL, pero puedes verificarlas en:
- **Authentication > Policies**

## 🧪 Probar la Aplicación

### 1. Ejecutar en Desarrollo

```bash
npm run dev
```

### 2. Crear una Cuenta de Prueba

1. Ve a `http://localhost:3000/register`
2. Completa el formulario con:
   - Nombre: "Carla"
   - Negocio: "Nails by Carla"
   - Email: tu email
   - Contraseña: una contraseña segura

### 3. Verificar el Dashboard

1. Deberías ser redirigido automáticamente al dashboard
2. Verifica que tu página pública esté disponible en:
   `http://localhost:3000/nails-by-carla`

### 4. Agregar Servicios (Manual)

Por ahora, puedes agregar servicios directamente en Supabase:

1. Ve a **Table Editor > services**
2. Haz clic en **Insert Row**
3. Agrega un servicio de ejemplo:

```json
{
  "professional_id": "tu_professional_id",
  "name": "Manicure Gel",
  "description": "Manicure con esmalte gel de larga duración",
  "duration": 60,
  "price": 25000,
  "is_active": true
}
```

## 🔧 Funcionalidades Implementadas

### ✅ Completado
- [x] Autenticación con Supabase Auth
- [x] Registro de profesionales
- [x] Login/Logout funcional
- [x] Middleware de protección de rutas
- [x] Dashboard con datos del profesional
- [x] Página pública de reservas
- [x] Validación de disponibilidad
- [x] Creación de reservas
- [x] Hooks personalizados para datos

### 🚧 Próximos Pasos
- [ ] Formulario de creación de servicios
- [ ] Configuración de horarios de trabajo
- [ ] Notificaciones por email
- [ ] Gestión de reservas en dashboard

## 📁 Estructura de Archivos

```
src/
├── app/                    # Páginas de Next.js
├── components/            # Componentes reutilizables
├── hooks/                # Hooks personalizados
│   ├── useAuth.ts        # Autenticación
│   ├── useProfessional.ts # Datos del profesional
│   ├── useServices.ts    # Gestión de servicios
│   └── useBookings.ts    # Gestión de reservas
├── lib/                  # Utilidades
│   ├── supabase.ts       # Configuración de Supabase
│   └── utils.ts          # Utilidades generales
└── types/                # Tipos TypeScript
```

## 🎯 URLs de Prueba

- **Landing**: `http://localhost:3000/`
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Página Pública**: `http://localhost:3000/[business-slug]`

## 🔍 Troubleshooting

### Error de Conexión a Supabase
- Verifica que las variables de entorno estén correctas
- Asegúrate de que el proyecto esté activo en Supabase

### Error de Autenticación
- Verifica que las políticas RLS estén configuradas
- Revisa los logs en Supabase > Logs

### Error de Base de Datos
- Ejecuta nuevamente el esquema SQL
- Verifica que las tablas se hayan creado correctamente

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Supabase
2. Verifica la consola del navegador
3. Asegúrate de que todas las dependencias estén instaladas

---

**¡Tu MVP de Agendalook.cl está listo para usar!** 🎉 