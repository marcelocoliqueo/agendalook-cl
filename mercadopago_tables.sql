-- mercadopago_tables.sql
-- Tablas de soporte para idempotencia de webhooks y registro de historial de pagos (PostgreSQL/Supabase)

-- =============================================
-- Tabla: mp_webhooks
-- - Almacena eventos ya procesados para idempotencia
-- - Clave primaria: payment_id (un evento por pago)
-- - Uso recomendado de inserción: ON CONFLICT DO NOTHING
-- =============================================
create table if not exists public.mp_webhooks (
  payment_id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- (Opcional) Índice por tipo si se requiere auditoría por tipo de evento
-- create index if not exists idx_mp_webhooks_type on public.mp_webhooks(type);

-- Ejemplo de inserción idempotente:
-- insert into public.mp_webhooks(payment_id, type)
-- values ('PAYMENT_ID_AQUI', 'payment')
-- on conflict (payment_id) do nothing;


-- =============================================
-- Tabla: payment_history
-- - Registra eventos de pago aplicados al sistema
-- - Clave primaria surrogate (bigserial)
-- - No se fuerza unicidad sobre payment_id para permitir múltiples eventos de ciclo de vida
-- =============================================
create table if not exists public.payment_history (
  id bigserial primary key,
  professional_id text not null,
  payment_id text not null,
  amount integer not null,
  status text not null,
  plan_type text not null,
  created_at timestamptz not null default now()
);

-- Índices útiles
create index if not exists idx_payment_history_professional on public.payment_history(professional_id);
create index if not exists idx_payment_history_payment on public.payment_history(payment_id);
create index if not exists idx_payment_history_created_at on public.payment_history(created_at);

-- =============================================
-- Notas de uso (idempotencia en webhook)
-- =============================================
-- 1) Antes de procesar el evento del webhook insertar en mp_webhooks:
--    insert into public.mp_webhooks(payment_id, type)
--    values ($1, $2)
--    on conflict (payment_id) do nothing;
-- 2) Si la cantidad de filas afectadas es 0, significa que ya se procesó y se debe salir sin reprocesar.


