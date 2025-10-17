# Comparación: Flujo Actual vs Flujo Deseado

## FLUJO ACTUAL (Lo que existe ahora)

```
1. REGISTRO
   /register
   - Email + Password (con validación segura)
   - O Google OAuth → /auth/callback

2. VERIFICACIÓN
   /verify-code
   - Código OTP 6 dígitos por email
   - Magic link automático después de verificar

3. BIENVENIDA
   /welcome
   - Crea perfil profesional automáticamente:
     * business_name: "Mi Negocio" (temporal)
     * business_slug: "mi-negocio" (temporal)
     * plan: "look" (por defecto)
   - Opciones:
     a) "Elegir Plan" → /onboarding
     b) "Ir al Dashboard" → /dashboard

4. ONBOARDING (4 pasos)
   /onboarding
   - Paso 1: Nombre personal
   - Paso 2: Nombre del negocio (actualiza business_name)
   - Paso 3: Teléfono + Dirección
   - Paso 4: Descripción del negocio
   - Redirige a → /select-plan

5. SELECCIÓN DE PLAN
   /select-plan
   - Muestra 3 planes: Look ($9.990), Pro ($16.990), Studio ($19.990)
   - Usuario selecciona
   - Redirige a → /payment?plan=X

6. PAGO (en desarrollo)
   /payment
   - Integración MercadoPago
   - Después de pagar → /dashboard

7. DASHBOARD
   /dashboard
   - Usuario puede acceder directamente sin completar onboarding
```

### Problemas del flujo actual:

❌ business_slug se crea en /welcome con "mi-negocio" genérico
❌ NO se verifica unicidad del business_slug
❌ Usuario puede saltar onboarding e ir directo a dashboard
❌ NO se captura: logo, rubro, sucursales, personal
❌ NO hay video Loom de tutorial
❌ Trial no se inicia formalmente (solo asignación de plan)
❌ Plan se asigna antes de seleccionarlo (default "look")

---

## FLUJO DESEADO (Tu especificación)

```
1. REGISTRO
   /register
   - Email + Password
   - O Google OAuth

2. VERIFICACIÓN (si es email/password)
   /verify-code
   - Código OTP

3. SELECCIÓN DE PLAN ⭐ NUEVO ORDEN
   /select-plan
   - Usuario DEBE elegir plan ANTES de continuar
   - Look ($9.990) / Pro ($16.990) / Studio ($19.990)
   - Guarda selección pero NO paga aún

4. CREACIÓN DE LINK DE AGENDA ⭐ CRÍTICO
   /setup/business-slug
   - Usuario ingresa su business_slug deseado
   - Sistema verifica UNICIDAD en tiempo real
   - Muestra preview: agendalook.cl/{slug}
   - NO puede repetirse con otro usuario

5. DATOS DEL NEGOCIO ⭐ MÁS INFORMACIÓN
   /setup/business-info
   - Logo del negocio (upload de archivo)
   - Nombre del negocio
   - Dirección física
   - WhatsApp (número de contacto)
   - Página web o Instagram
   - Rubro del negocio (dropdown/select)
   - ¿Cuántas sucursales tiene? (número)
   - ¿Cuánto personal necesita agenda? (número)

6. VIDEO TUTORIAL ⭐ NUEVO
   /setup/tutorial
   - Muestra video Loom según plan seleccionado
   - Video diferente para Look / Pro / Studio
   - Botón "Continuar" al terminar (o saltar)

7. INICIO DE TRIAL ⭐ EXPLÍCITO
   /setup/trial-start
   - Mensaje: "Tu trial de 30 días comienza ahora"
   - Muestra fecha de expiración
   - Crea registro de trial_start_date y trial_end_date
   - Botón: "Ir al Dashboard"

8. DASHBOARD
   /dashboard
   - Usuario usa todas las funcionalidades del plan seleccionado
   - Banner visible: "Trial: X días restantes"

9. EXPIRACIÓN DE TRIAL (Día 30)
   - Modal/Página: "Tu trial ha expirado"
   - Redirige a /payment?plan=X
   - Debe pagar para continuar usando
```

---

## COMPARACIÓN DETALLADA

| Aspecto | Actual | Deseado | Cambio Necesario |
|---------|--------|---------|------------------|
| **Orden de selección de plan** | Después de onboarding | ANTES de onboarding | ✅ Reordenar flujo |
| **business_slug** | Se crea automático en /welcome | Usuario lo elige y se valida unicidad | ✅ Nueva página + validación |
| **Datos capturados** | Nombre, teléfono, dirección, descripción | + Logo, WhatsApp, web/IG, rubro, sucursales, personal | ✅ Expandir formulario |
| **Upload de archivos** | NO existe | Logo del negocio | ✅ Agregar upload |
| **Video tutorial** | NO existe | Video Loom según plan | ✅ Agregar página + lógica |
| **Inicio de trial** | Implícito (plan=look) | Explícito con fechas | ✅ Crear registro de trial |
| **Flujo obligatorio** | Saltar a /dashboard es posible | TODO es obligatorio | ✅ Middleware/validación |
| **Expiración trial** | Middleware existe pero no se usa | Activo en día 30 | ✅ Activar checkTrial |

---

## NUEVAS PÁGINAS A CREAR

### 1. /setup/business-slug (NUEVA)

**Propósito:** Crear link único de agenda

**UI:**
```
┌─────────────────────────────────────────────────┐
│  Crea el link de tu agenda                     │
│                                                 │
│  Tu agenda estará disponible en:               │
│  agendalook.cl/[_____________]                 │
│                    ↑                            │
│                  input aquí                     │
│                                                 │
│  ✓ Disponible                                  │
│  ✗ Ya existe, prueba otro                      │
│                                                 │
│  Sugerencias: maria-peluqueria, spa-relax      │
│                                                 │
│  [Continuar →]                                 │
└─────────────────────────────────────────────────┘
```

**Validación:**
- Tiempo real: mientras escribe, verifica en BD
- Regex: solo letras, números, guiones
- Mínimo 3 caracteres
- Query: `SELECT id FROM professionals WHERE business_slug = ?`

### 2. /setup/business-info (NUEVA o expandir /onboarding)

**Propósito:** Capturar información completa del negocio

**Campos nuevos a agregar:**
- ✅ Logo (upload de imagen)
- ✅ WhatsApp (formato internacional)
- ✅ Página web o Instagram (URL)
- ✅ Rubro del negocio (select):
  - Belleza y Estética
  - Salud y Bienestar
  - Fitness y Deporte
  - Consultoría
  - Otro
- ✅ Número de sucursales (1-50+)
- ✅ Personal que necesita agenda (1-100+)

### 3. /setup/tutorial (NUEVA)

**Propósito:** Mostrar video según plan

**Lógica:**
```typescript
const videoUrls = {
  look: 'https://www.loom.com/share/LOOK_VIDEO_ID',
  pro: 'https://www.loom.com/share/PRO_VIDEO_ID',
  studio: 'https://www.loom.com/share/STUDIO_VIDEO_ID',
};

<iframe src={videoUrls[selectedPlan]} />
```

**UI:**
- Embed de Loom responsive
- Título: "Cómo configurar Agendalook - Plan {planName}"
- Botones: "Ver después" | "Continuar"

### 4. /setup/trial-start (NUEVA)

**Propósito:** Confirmar inicio de trial

**Acción:**
```typescript
const trialStartDate = new Date();
const trialEndDate = new Date();
trialEndDate.setDate(trialEndDate.getDate() + 30);

await updateProfessional(professionalId, {
  trial_start_date: trialStartDate.toISOString(),
  trial_end_date: trialEndDate.toISOString(),
  subscription_status: 'trial',
});
```

---

## MODIFICACIONES A ARCHIVOS EXISTENTES

### 1. /register (SIN CAMBIOS)
- Ya funciona correctamente

### 2. /verify-code (SIN CAMBIOS)
- Ya funciona correctamente

### 3. /welcome (MODIFICAR)

**Cambios:**
```typescript
// ANTES: Creaba profesional con business_slug automático
// DESPUÉS: Solo verificar sesión, redirigir a /select-plan

// Eliminar:
- Creación automática de profesional
- Generación de business_slug

// Agregar:
- Redirigir a /select-plan directamente
```

### 4. /select-plan (MODIFICAR)

**Cambios:**
```typescript
// ANTES: Redirigía a /payment
// DESPUÉS: Guarda plan seleccionado, redirige a /setup/business-slug

const handlePlanSelect = async (plan: PlanType) => {
  // Guardar en localStorage o state global
  sessionStorage.setItem('selectedPlan', plan);

  // Redirigir a creación de business slug
  router.push('/setup/business-slug');
};
```

### 5. /onboarding (EXPANDIR)

**Opción A:** Convertir en /setup/business-info con todos los campos nuevos

**Opción B:** Mantener y agregar nueva página después

Recomiendo **Opción A**: un solo formulario multi-step con:
- Paso 1: Logo + Nombre del negocio
- Paso 2: Contacto (WhatsApp, web/IG, dirección)
- Paso 3: Info del negocio (rubro, sucursales, personal)
- Paso 4: Descripción

### 6. /dashboard (MODIFICAR)

**Agregar:**
```typescript
// Verificar que completó setup
useEffect(() => {
  if (!professional.business_slug || !professional.trial_start_date) {
    router.push('/setup/business-slug');
    return;
  }
}, [professional]);

// Mostrar banner de trial
{professional.subscription_status === 'trial' && (
  <TrialBanner
    daysRemaining={calculateDaysRemaining(professional.trial_end_date)}
    onUpgrade={() => router.push('/payment')}
  />
)}
```

---

## NUEVOS COMPONENTES A CREAR

### 1. BusinessSlugInput (Componente)

```typescript
interface BusinessSlugInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: (isValid: boolean) => void;
}

// Features:
// - Debounced validation (500ms)
// - Real-time DB check
// - Visual feedback (✓ o ✗)
// - Suggestions generator
```

### 2. LogoUploader (Componente)

```typescript
interface LogoUploaderProps {
  onUpload: (file: File) => Promise<string>; // Returns URL
  currentLogo?: string;
}

// Features:
// - Drag & drop
// - Preview
// - Crop (opcional)
// - Max 5MB
// - Formatos: PNG, JPG, SVG
```

### 3. TrialBanner (Componente)

```typescript
interface TrialBannerProps {
  daysRemaining: number;
  onUpgrade: () => void;
}

// Visual:
// - Barra superior en dashboard
// - Countdown de días
// - Call to action
```

### 4. LoomVideoPlayer (Componente)

```typescript
interface LoomVideoPlayerProps {
  videoId: string;
  onComplete?: () => void;
}

// Features:
// - Embed responsive de Loom
// - Track si vió el video
```

---

## CAMBIOS EN BASE DE DATOS

### Tabla `professionals` - Nuevas columnas:

```sql
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS business_category TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS branch_count INTEGER DEFAULT 1;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS staff_count INTEGER DEFAULT 1;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS tutorial_watched BOOLEAN DEFAULT FALSE;
```

### Índices adicionales:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_professionals_slug
ON professionals(business_slug);

CREATE INDEX IF NOT EXISTS idx_professionals_trial_end
ON professionals(trial_end_date);
```

---

## NUEVAS APIS A CREAR

### 1. /api/slug/check (GET)

**Propósito:** Verificar disponibilidad de business_slug

```typescript
// Input: ?slug=maria-spa
// Output: { available: true|false, suggestions: [...] }

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');

  const { data } = await supabase
    .from('professionals')
    .select('id')
    .eq('business_slug', slug)
    .maybeSingle();

  return NextResponse.json({
    available: !data,
    suggestions: data ? generateSuggestions(slug) : []
  });
}
```

### 2. /api/upload/logo (POST)

**Propósito:** Subir logo del negocio

```typescript
// Input: FormData con archivo
// Output: { url: 'https://...' }

// Usar Supabase Storage:
const { data, error } = await supabase.storage
  .from('business-logos')
  .upload(`${userId}/${file.name}`, file);
```

### 3. /api/trial/start (POST)

**Propósito:** Iniciar trial formalmente

```typescript
// Input: { professionalId, plan }
// Output: { trialEndDate }

const trialEndDate = new Date();
trialEndDate.setDate(trialEndDate.getDate() + 30);

await supabase
  .from('professionals')
  .update({
    trial_start_date: new Date().toISOString(),
    trial_end_date: trialEndDate.toISOString(),
    subscription_status: 'trial',
    plan: plan,
  })
  .eq('id', professionalId);
```

---

## MIDDLEWARE NECESARIO

### setupCompletionMiddleware.ts

```typescript
// Verifica que el usuario completó el setup antes de acceder a /dashboard

export async function checkSetupCompletion(userId: string) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('business_slug, trial_start_date, onboarding_completed')
    .eq('user_id', userId)
    .single();

  if (!professional?.business_slug) {
    return { completed: false, redirect: '/setup/business-slug' };
  }

  if (!professional?.onboarding_completed) {
    return { completed: false, redirect: '/setup/business-info' };
  }

  if (!professional?.trial_start_date) {
    return { completed: false, redirect: '/setup/trial-start' };
  }

  return { completed: true };
}
```

---

## PLAN DE IMPLEMENTACIÓN

### Fase 1: Preparación (1-2 días)
1. ✅ Crear nuevas columnas en BD
2. ✅ Crear APIs de slug/check y upload/logo
3. ✅ Crear componentes base (BusinessSlugInput, LogoUploader)

### Fase 2: Páginas de Setup (2-3 días)
1. ✅ Crear /setup/business-slug
2. ✅ Modificar /select-plan (guardar selección)
3. ✅ Expandir /onboarding → /setup/business-info
4. ✅ Crear /setup/tutorial
5. ✅ Crear /setup/trial-start

### Fase 3: Modificar Flujo Existente (1-2 días)
1. ✅ Modificar /welcome (eliminar creación automática)
2. ✅ Modificar /register (mantener igual)
3. ✅ Agregar middleware de setup completion
4. ✅ Actualizar /dashboard (banner de trial)

### Fase 4: Testing (1 día)
1. ✅ Probar flujo completo email/password
2. ✅ Probar flujo completo Google OAuth
3. ✅ Verificar unicidad de business_slug
4. ✅ Verificar expiración de trial

---

## RESUMEN DE CAMBIOS

**Archivos a CREAR:**
- `src/app/setup/business-slug/page.tsx`
- `src/app/setup/business-info/page.tsx`
- `src/app/setup/tutorial/page.tsx`
- `src/app/setup/trial-start/page.tsx`
- `src/components/setup/BusinessSlugInput.tsx`
- `src/components/setup/LogoUploader.tsx`
- `src/components/ui/TrialBanner.tsx`
- `src/components/ui/LoomVideoPlayer.tsx`
- `src/app/api/slug/check/route.ts`
- `src/app/api/upload/logo/route.ts`
- `src/app/api/trial/start/route.ts`
- `src/middleware/setupCompletion.ts`

**Archivos a MODIFICAR:**
- `src/app/welcome/page.tsx` - Eliminar creación automática
- `src/app/select-plan/page.tsx` - Guardar selección, redirigir a setup
- `src/app/onboarding/page.tsx` - Expandir campos O deprecar
- `src/app/dashboard/page.tsx` - Agregar validación de setup + banner trial
- `src/middleware/checkTrial.ts` - Activar para trial expirado

**BD:**
- 10 nuevas columnas en `professionals`
- 2 nuevos índices

**APIs:**
- 3 nuevos endpoints

---

**¿Quieres que comience la implementación? ¿Por qué fase empezamos?**
