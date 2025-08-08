import crypto from 'crypto';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { applyRateLimit, authRateLimiter } from './rate-limit';

export function generateCode(): string {
  // 6 dígitos evitando ambigüedades (solo números)
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashCode(code: string, salt: string): string {
  return crypto.createHash('sha256').update(code + salt).digest('hex');
}

export async function issueCode(params: { request: Request; email: string; purpose: 'signup' | 'email_change'; ttlMinutes: number; }): Promise<{ expiresAt: string; code: string; }> {
  const { request, email, purpose, ttlMinutes } = params;

  // Rate-limit: 1/min + máx 5/día (usamos authRateLimiter por IP + email)
  const key = `${email}:issueCode`;
  const rl = await applyRateLimit(request, authRateLimiter, key);
  if (!rl.success) {
    throw new Error('Rate limit excedido. Intenta más tarde.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const service = createServiceClient(supabaseUrl, serviceKey);

  const code = generateCode();
  const salt = crypto.randomBytes(8).toString('hex');
  const code_hash = hashCode(code, salt);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

  // Borrar códigos anteriores no consumidos
  await service
    .from('auth_verification_codes')
    .delete()
    .eq('email', email)
    .eq('purpose', purpose)
    .is('consumed_at', null);

  const { error: insertError } = await service
    .from('auth_verification_codes')
    .insert({ email, purpose, code_hash, salt, expires_at: expiresAt });
  if (insertError) throw new Error(insertError.message);

  return { expiresAt, code };
}

export async function verifyCode(params: { email: string; code: string; purpose: 'signup' | 'email_change'; }): Promise<'ok' | 'invalid' | 'expired' | 'max_attempts'> {
  const { email, code, purpose } = params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const service = createServiceClient(supabaseUrl, serviceKey);

  const { data: rows, error } = await service
    .from('auth_verification_codes')
    .select('id, code_hash, salt, expires_at, attempts, max_attempts')
    .eq('email', email)
    .eq('purpose', purpose)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);

  const row = rows?.[0];
  if (!row) return 'invalid';
  if (new Date(row.expires_at).getTime() < Date.now()) return 'expired';
  if (row.attempts >= row.max_attempts) return 'max_attempts';

  const computed = hashCode(code, row.salt);
  if (computed !== row.code_hash) {
    await service
      .from('auth_verification_codes')
      .update({ attempts: row.attempts + 1 })
      .eq('id', row.id);
    return row.attempts + 1 >= row.max_attempts ? 'max_attempts' : 'invalid';
  }

  await service
    .from('auth_verification_codes')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', row.id);

  return 'ok';
}


