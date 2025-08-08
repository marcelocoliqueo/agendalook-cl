'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyCodeClient() {
  const search = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join('');

  const requestCode = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const resp = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'signup' })
      });
      if (!resp.ok) {
        const { error } = await resp.json();
        setMessage(error || 'No se pudo enviar el código');
        return;
      }
      setMessage('Código enviado. Revisa tu correo.');
      setCountdown(20);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const resp = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, purpose: 'signup' })
      });
      const data = await resp.json();
      if (!resp.ok) {
        setMessage(data.error || 'Código inválido');
        return;
      }
      router.push('/welcome');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryEmail = search?.get('email') || '';
    const stored = typeof window !== 'undefined' ? localStorage.getItem('pendingEmail') : '';
    const chosen = queryEmail || stored || user?.email || '';
    if (!chosen && !authLoading) {
      router.replace('/register');
      return;
    }
    if (chosen) setEmail(chosen);
  }, [search, user?.email, authLoading, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleDigitChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && inputsRef.current[idx + 1]) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && inputsRef.current[idx - 1]) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirma tu correo</h1>
        <p className="text-gray-600 mb-1">Ingresa el código de 6 dígitos que te enviamos.</p>
        {email ? (
          <p className="text-sm text-gray-500 mb-6">Enviado a <span className="font-medium">{email}</span></p>
        ) : (
          <p className="text-sm text-gray-500 mb-6">Redirigiendo al registro...</p>
        )}

        <div className="flex justify-between mb-4">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              className="w-12 h-12 text-center text-xl border rounded-lg"
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>

        {message && <div className="text-sm text-gray-700 mb-3">{message}</div>}

        <div className="flex gap-3 justify-center">
          <button onClick={requestCode} disabled={loading || !email || countdown > 0} className="px-4 py-2 rounded-lg bg-gray-100">
            {countdown > 0 ? `Reenviar código (${countdown}s)` : 'Reenviar código'}
          </button>
          <button onClick={verifyCode} disabled={loading || code.length !== 6 || !email} className="px-4 py-2 rounded-lg bg-primary-500 text-white">Confirmar</button>
        </div>
      </div>
    </div>
  );
}


