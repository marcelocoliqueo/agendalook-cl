# 🏗️ Arquitectura de Supabase en Agendalook.cl

## 🎯 **Objetivo**

Este documento explica la nueva arquitectura implementada para resolver el problema de múltiples instancias de GoTrueClient que causaba la advertencia:

```
Multiple GoTrueClient instances detected in the same browser context. 
It is not an error, but this should be avoided as it may produce undefined behavior 
when used concurrently under the same storage key.
```

## 🔍 **Problema Identificado**

### **Antes (Problemático):**
- Cada hook llamaba a `createClient()` en cada renderizado
- No había un provider global que compartiera una única instancia
- El patrón de singleton no se respetaba correctamente en React
- Múltiples instancias de GoTrueClient se creaban en el navegador

### **Archivos afectados:**
- `src/hooks/useAuth.ts` - línea 10
- `src/hooks/useNotifications.ts` - línea 44
- `src/hooks/useProfessional.ts` - línea 13
- `src/hooks/useServices.ts` - línea 10
- `src/hooks/useBookings.ts` - línea 10
- `src/hooks/useAvailability.ts` - línea 9
- `src/app/welcome/page.tsx` - línea 18
- `src/app/verify-email/page.tsx` - línea 11

## ✅ **Solución Implementada**

### **1. Contexto Global de Supabase (`SupabaseContext`)**
```typescript
// src/contexts/SupabaseContext.tsx
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createBrowserClient());
  // ... lógica de autenticación centralizada
}
```

**Características:**
- ✅ **Singleton real**: Solo una instancia de GoTrueClient por sesión
- ✅ **Estado compartido**: User, session y loading compartidos globalmente
- ✅ **Hooks especializados**: `useSupabaseClient()`, `useSupabaseAuth()`

### **2. Configuración Centralizada (`supabase-config.ts`)**
```typescript
// src/lib/supabase-config.ts
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;
```

**Beneficios:**
- 🔧 **Mantenimiento**: Una sola fuente de verdad para la configuración
- 🚨 **Validación**: Verificación centralizada de variables de entorno
- 🔄 **Consistencia**: Misma configuración en toda la aplicación

### **3. Separación Clara de Responsabilidades**

#### **Cliente del Navegador:**
```typescript
// Usar en componentes y hooks del navegador
const supabase = useSupabaseClient();
```

#### **Cliente del Servidor:**
```typescript
// Usar en API routes y middleware
const supabase = createServerSupabaseClient();
```

#### **Cliente del Servidor con Cookies:**
```typescript
// Usar en Server Components
const supabase = await createServerSupabaseClient();
```

## 🏛️ **Nueva Arquitectura**

```
┌─────────────────────────────────────────────────────────────┐
│                    SupabaseProvider                        │
│  (Layout Principal - src/app/layout.tsx)                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  SupabaseContext                           │
│  • Cliente singleton de Supabase                          │
│  • Estado de autenticación global                         │
│  • Hooks especializados                                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hooks Refactorizados                    │
│  • useAuth() → useSupabaseAuth()                          │
│  • useNotifications() → useSupabaseClient()               │
│  • useProfessional() → useSupabaseClient()                │
│  • useServices() → useSupabaseClient()                    │
│  • useBookings() → useSupabaseClient()                    │
│  • useAvailability() → useSupabaseClient()                │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 **Implementación**

### **1. Layout Principal**
```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
```

### **2. Hooks Refactorizados**
```typescript
// Antes (problemático)
export function useAuth() {
  const supabase = createClient(); // ❌ Nueva instancia cada vez
  // ...
}

// Después (correcto)
export function useAuth() {
  const supabase = useSupabaseClient(); // ✅ Instancia compartida
  const { user, session, loading } = useSupabaseAuth();
  // ...
}
```

### **3. APIs del Servidor**
```typescript
// Antes (incorrecto)
export async function POST(request: NextRequest) {
  const supabase = createClient(); // ❌ Cliente del navegador en el servidor
  // ...
}

// Después (correcto)
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient(); // ✅ Cliente del servidor
  // ...
}
```

## 🚀 **Beneficios de la Nueva Arquitectura**

### **✅ Resuelve el Problema Principal:**
- **Una sola instancia** de GoTrueClient por sesión
- **Sin advertencias** en la consola
- **Comportamiento predecible** de la autenticación

### **✅ Mejoras Adicionales:**
- **Performance**: Menos recreación de clientes
- **Mantenibilidad**: Código más limpio y organizado
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Debugging**: Estado de autenticación centralizado

### **✅ Separación de Responsabilidades:**
- **Navegador**: Autenticación y estado del usuario
- **Servidor**: Operaciones de base de datos
- **Middleware**: Verificación de sesiones

## 📋 **Checklist de Implementación**

- [x] Crear `SupabaseContext` con provider global
- [x] Refactorizar todos los hooks para usar el contexto
- [x] Actualizar componentes para usar `useSupabaseClient()`
- [x] Separar clientes del navegador vs servidor
- [x] Centralizar configuración en `supabase-config.ts`
- [x] Actualizar layout principal con `SupabaseProvider`
- [x] Refactorizar APIs para usar clientes del servidor
- [x] Documentar nueva arquitectura

## 🧪 **Testing**

### **Verificar que no hay advertencias:**
1. Abrir la consola del navegador
2. Navegar por diferentes páginas
3. Verificar que NO aparece el mensaje de múltiples instancias

### **Verificar funcionalidad:**
1. Login/logout funciona correctamente
2. Estado de autenticación se mantiene entre páginas
3. Hooks funcionan sin errores
4. APIs del servidor funcionan correctamente

## 🔮 **Próximos Pasos**

1. **Monitorear** la consola para confirmar que no hay más advertencias
2. **Optimizar** el rendimiento si es necesario
3. **Agregar** más funcionalidades al contexto si se requieren
4. **Documentar** cualquier cambio adicional en la arquitectura

## 📚 **Referencias**

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [Next.js App Router](https://nextjs.org/docs/app)
