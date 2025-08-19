'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseClient } from '@/contexts/SupabaseContext';

export default function VerifyEmailPage() {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useSupabaseClient();

  const processAuthCallback = useCallback(async () => {
    // Maneja dos formatos posibles del callback de Supabase:
    // 1) Fragment hash: #access_token=...&refresh_token=...&type=signup
    // 2) Query param:   ?code=...
    try {
      if (typeof window === 'undefined') return false;

      const hash = window.location.hash;
      if (hash && hash.startsWith('#')) {
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (!error) return true;
        }
      }

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) return true;
      }

      return false;
    } catch {
      return false;
    }
  }, [supabase]);

  const check = useCallback(async () => {
    try {
      setChecking(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        // Caso típico tras borrar usuarios: token inválido/usuario no existe
        if ((error as any)?.status === 403 || (error as any)?.message?.includes('user_not_found')) {
          await supabase.auth.signOut();
          router.push('/login?redirect=/verify-email');
          return;
        }
        setMessage('Error de sesión. Intenta iniciar sesión nuevamente.');
        return;
      }
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
    (async () => {
      const processed = await processAuthCallback();
      if (processed) {
        router.replace('/welcome');
        return;
      }
      await check();
    })();
    // Limpieza: detener polling/listeners al salir de la página
    return () => {
      setChecking(false);
    };
  }, [processAuthCallback, check, router]);

  const serverConfirmCheck = useCallback(async () => {
    try {
      setChecking(true);
      const resp = await fetch('/api/auth/check-verified');
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.verified) {
        router.push('/welcome');
      } else {
        setMessage('Tu email aún no está verificado. Revisa tu bandeja o espera unos segundos.');
      }
    } finally {
      setChecking(false);
    }
  }, [router]);

  // Auto-chequeo cada 5s y escucha cambios de auth (multi-pestaña)
  useEffect(() => {
    let delay = 2000;
    let timer: any;
    let isActive = true;

    const schedule = () => {
      if (!isActive) return;
      timer = setTimeout(async () => {
        await serverConfirmCheck();
        // backoff hasta 10s
        delay = Math.min(delay * 2, 10000);
        schedule();
      }, delay);
    };

    schedule();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      serverConfirmCheck();
    });

    return () => {
      isActive = false;
      if (timer) clearTimeout(timer);
      listener.subscription.unsubscribe();
    };
  }, [serverConfirmCheck, supabase.auth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-coral-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifica tu correo</h1>
        <p className="text-gray-600 mb-6">Te enviamos un email con un enlace de verificación. Debes confirmarlo para continuar.</p>
        {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}
        <div className="flex gap-3 justify-center">
          <button onClick={serverConfirmCheck} disabled={checking} className="px-4 py-2 rounded-lg bg-primary-500 text-white disabled:opacity-50">Ya verifiqué</button>
          <button onClick={resend} disabled={checking} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50">Reenviar correo</button>
        </div>
        <div className="mt-6 text-sm">
          <Link href="/login" className="text-primary-600 hover:text-primary-700">Ir a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}


