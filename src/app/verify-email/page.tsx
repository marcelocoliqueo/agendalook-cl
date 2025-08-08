'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function VerifyEmailPage() {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const check = useCallback(async () => {
    try {
      setChecking(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('No hay sesión activa. Inicia sesión para continuar.');
        return;
      }
      if (user.email_confirmed_at) {
        router.push('/welcome');
      } else {
        setMessage('Tu email aún no está verificado. Revisa tu bandeja de entrada.');
      }
    } finally {
      setChecking(false);
    }
  }, [router, supabase]);

  const resend = useCallback(async () => {
    try {
      setChecking(true);
      const resp = await fetch('/api/auth/resend-verification', { method: 'POST' });
      if (!resp.ok) {
        const { error } = await resp.json();
        setMessage(error || 'No se pudo reenviar el correo.');
        return;
      }
      setMessage('Correo de verificación reenviado. Revisa tu bandeja.');
    } finally {
      setChecking(false);
    }
  }, [supabase]);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifica tu correo</h1>
        <p className="text-gray-600 mb-6">Te enviamos un email con un enlace de verificación. Debes confirmarlo para continuar.</p>
        {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}
        <div className="flex gap-3 justify-center">
          <button onClick={check} disabled={checking} className="px-4 py-2 rounded-lg bg-primary-500 text-white disabled:opacity-50">Ya verifiqué</button>
          <button onClick={resend} disabled={checking} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50">Reenviar correo</button>
        </div>
        <div className="mt-6 text-sm">
          <Link href="/login" className="text-primary-600 hover:text-primary-700">Ir a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}


