create table if not exists public.auth_verification_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  purpose text not null check (purpose in ('signup','email_change')),
  code_hash text not null,
  salt text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  max_attempts int not null default 5,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_auth_verification_email_purpose on public.auth_verification_codes(email, purpose);
create index if not exists idx_auth_verification_expires on public.auth_verification_codes(expires_at);


