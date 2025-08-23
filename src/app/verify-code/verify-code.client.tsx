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
  const countdownStartedRef = useRef(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join('');
  const canResend = !loading && !!email && countdown === 0;

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
      if (data.loginUrl) {
        window.location.href = data.loginUrl;
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
    // Arrancar contador inicial (20s) tras el registro/envío automático
    if (!countdownStartedRef.current && chosen) {
      setCountdown(20);
      countdownStartedRef.current = true;
    }
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

  const handlePaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    try {
      const raw = e.clipboardData.getData('text');
      const pasted = (raw.match(/\d/g) || []).join('').slice(0, 6);
      if (!pasted) return;
      e.preventDefault();
      const next = [...digits];
      for (let i = 0; i < pasted.length && idx + i < 6; i++) {
        next[idx + i] = pasted[i];
      }
      setDigits(next);
      const focusIndex = Math.min(idx + pasted.length, 5);
      inputsRef.current[focusIndex]?.focus();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Confirma tu correo</h1>
        <p className="text-slate-600 mb-1">Ingresa el código de 6 dígitos que te enviamos.</p>
        {email ? (
          <p className="text-sm text-slate-500 mb-6">Enviado a <span className="font-medium text-slate-700">{email}</span></p>
        ) : (
          <p className="text-sm text-slate-500 mb-6">Redirigiendo al registro...</p>
        )}

        <div className="flex justify-between mb-6">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              className="w-12 h-12 text-center text-xl border-2 border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {message && (
          <div className="text-sm text-slate-700 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={verifyCode}
            disabled={loading || code.length !== 6 || !email}
            aria-disabled={loading || code.length !== 6 || !email}
            className={`px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${
              loading || code.length !== 6 || !email
                ? 'bg-slate-400 cursor-not-allowed opacity-70'
                : 'bg-sky-500 hover:bg-sky-600 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'
            }`}
          >
            {loading ? 'Verificando...' : 'Confirmar Código'}
          </button>
          
          <button
            onClick={requestCode}
            disabled={!canResend}
            aria-disabled={!canResend}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 ${
              canResend
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md border border-slate-200'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60 border border-slate-200'
            }`}
          >
            {countdown > 0 ? `Reenviar código (${countdown}s)` : 'Reenviar código'}
          </button>
        </div>
      </div>
    </div>
  );
}


