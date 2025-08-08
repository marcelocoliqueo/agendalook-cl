'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const code = digits.join('');

  const onChangeDigit = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
  };

  const requestCode = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const resp = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!resp.ok) {
        const { error } = await resp.json();
        setMessage(error || 'No se pudo enviar el código');
        return;
      }
      setMessage('Código enviado. Revisa tu correo.');
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
        body: JSON.stringify({ email, code })
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirma tu correo</h1>
        <p className="text-gray-600 mb-6">Ingresa tu email y el código de 6 dígitos que te enviamos.</p>

        <input
          className="w-full mb-4 px-4 py-3 border rounded-lg"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-between mb-4">
          {digits.map((d, i) => (
            <input
              key={i}
              className="w-12 h-12 text-center text-xl border rounded-lg"
              value={d}
              onChange={(e) => onChangeDigit(i, e.target.value)}
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>

        {message && <div className="text-sm text-gray-700 mb-3">{message}</div>}

        <div className="flex gap-3 justify-center">
          <button onClick={requestCode} disabled={loading || !email} className="px-4 py-2 rounded-lg bg-gray-100">Enviar código</button>
          <button onClick={verifyCode} disabled={loading || code.length !== 6 || !email} className="px-4 py-2 rounded-lg bg-primary-500 text-white">Confirmar</button>
        </div>
      </div>
    </div>
  );
}


