create table if not exists public.email_verification_codes (
  id bigserial primary key,
  user_id uuid not null,
  code_hash text not null,
  code_salt text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_verification_codes_user on public.email_verification_codes(user_id);
create index if not exists idx_email_verification_codes_expires on public.email_verification_codes(expires_at);
create index if not exists idx_email_verification_codes_consumed on public.email_verification_codes(consumed_at);


