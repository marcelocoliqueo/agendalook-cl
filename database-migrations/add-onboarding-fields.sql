-- ============================================================================
-- MIGRACIÓN: Agregar campos de onboarding extendido
-- ============================================================================
-- Fecha: 16 de Octubre de 2025
-- Propósito: Agregar campos necesarios para el nuevo flujo de onboarding
-- ============================================================================

-- 1. Agregar columnas de información del negocio
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS business_category TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS branch_count INTEGER DEFAULT 1;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS staff_count INTEGER DEFAULT 1;

-- 2. Agregar columnas de control de trial
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP;

-- 3. Agregar columnas de control de onboarding
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS tutorial_watched BOOLEAN DEFAULT FALSE;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS selected_plan TEXT;

-- 4. Crear índice único para business_slug (si no existe)
CREATE UNIQUE INDEX IF NOT EXISTS idx_professionals_slug_unique
ON professionals(business_slug);

-- 5. Crear índice para búsquedas por trial_end_date
CREATE INDEX IF NOT EXISTS idx_professionals_trial_end
ON professionals(trial_end_date)
WHERE trial_end_date IS NOT NULL;

-- 6. Crear índice para búsquedas por onboarding_completed
CREATE INDEX IF NOT EXISTS idx_professionals_onboarding
ON professionals(onboarding_completed)
WHERE onboarding_completed = FALSE;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Verificar que las columnas se agregaron correctamente
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'professionals'
  AND column_name IN (
    'logo_url', 'whatsapp', 'website', 'instagram',
    'business_category', 'branch_count', 'staff_count',
    'trial_start_date', 'trial_end_date',
    'onboarding_completed', 'tutorial_watched', 'selected_plan'
  )
ORDER BY column_name;

-- Verificar índices
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'professionals'
  AND indexname IN (
    'idx_professionals_slug_unique',
    'idx_professionals_trial_end',
    'idx_professionals_onboarding'
  );

-- ============================================================================
-- NOTAS
-- ============================================================================

/*
CAMPOS AGREGADOS:

Información del negocio:
- logo_url: URL del logo subido a Supabase Storage
- whatsapp: Número de WhatsApp (formato internacional)
- website: URL del sitio web
- instagram: URL o handle de Instagram
- business_category: Categoría/rubro del negocio
- branch_count: Número de sucursales (default 1)
- staff_count: Número de personal que necesita agenda (default 1)

Control de trial:
- trial_start_date: Fecha de inicio del trial
- trial_end_date: Fecha de fin del trial (30 días después)

Control de onboarding:
- onboarding_completed: Si completó el proceso de setup
- tutorial_watched: Si vio el video tutorial
- selected_plan: Plan seleccionado antes de pagar

ÍNDICES:
- idx_professionals_slug_unique: Garantiza unicidad de business_slug
- idx_professionals_trial_end: Optimiza búsquedas de trials expirados
- idx_professionals_onboarding: Optimiza búsquedas de onboarding incompleto
*/
